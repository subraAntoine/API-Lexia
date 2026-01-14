#!/usr/bin/env python3
"""
Script pour créer une nouvelle clé API.

Usage:
    # Mode dev (local)
    python scripts/create_api_key.py --name "Dev Key"
    
    # Mode dev (Docker)
    docker compose -f docker/docker-compose.dev.yml exec api python scripts/create_api_key.py --name "Dev Key"
    
    # Mode prod (Docker) - génère hash + SQL
    docker compose -f docker/docker-compose.yml exec api python scripts/create_api_key.py --name "Prod Key" --no-db
    
    # Avec options avancées
    python scripts/create_api_key.py --name "Admin Key" --user-id "admin-1" --rate-limit 1000 --permissions "llm,stt"
"""

import argparse
import asyncio
import os
import sys

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.auth import APIKeyManager
from src.core.config import Settings


def get_settings_for_script() -> Settings:
    """Load settings with validation for key generation."""
    try:
        settings = Settings()
    except Exception as e:
        print(f"\n❌ Erreur de configuration: {e}")
        print("\nVariables d'environnement requises:")
        print("  - API_KEY_SALT: Salt pour le hachage des clés")
        print("  - API_SECRET_KEY: Clé secrète de l'API")
        print("  - DATABASE_URL: URL de connexion PostgreSQL")
        print("\nExemple:")
        print('  export API_KEY_SALT="votre-salt-secret-32-caracteres"')
        print('  export API_SECRET_KEY="votre-cle-secrete"')
        print('  export DATABASE_URL="postgresql+asyncpg://user:pass@localhost:5432/lexia"')
        sys.exit(1)
    
    # Warn if using default/insecure salt
    if settings.api_key_salt in ["your-salt-16-chars", "dev-salt-change-in-production", "your-api-key-salt-change-in-production"]:
        print("\n⚠️  ATTENTION: Vous utilisez un salt par défaut !")
        print("   En production, définissez API_KEY_SALT avec une valeur unique et secrète.")
        print()
    
    return settings


def generate_api_key(settings: Settings) -> tuple[str, str]:
    """Generate a new API key using APIKeyManager for consistency."""
    manager = APIKeyManager(settings)
    api_key = manager.generate_api_key()
    key_hash = manager.hash_api_key(api_key)
    return api_key, key_hash


async def insert_key_to_db(
    key_hash: str, 
    name: str, 
    user_id: str,
    rate_limit: int,
    permissions: list[str]
) -> str:
    """Insert the API key hash into the database."""
    import json
    from sqlalchemy import text
    from src.db.session import get_session_maker, init_db

    await init_db()

    session_maker = get_session_maker()
    permissions_json = json.dumps(permissions)

    async with session_maker() as session:
        result = await session.execute(
            text("""
                INSERT INTO api_keys (id, key_hash, name, user_id, permissions, rate_limit, is_revoked, created_at, updated_at)
                VALUES (gen_random_uuid(), :key_hash, :name, :user_id, :permissions, :rate_limit, false, now(), now())
                RETURNING id
            """),
            {
                "key_hash": key_hash, 
                "name": name, 
                "user_id": user_id,
                "permissions": permissions_json,
                "rate_limit": rate_limit
            }
        )
        key_id = result.scalar()
        await session.commit()
        return str(key_id)


def main():
    parser = argparse.ArgumentParser(
        description="Créer une nouvelle clé API pour Lexia",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples:
  # Clé simple
  python scripts/create_api_key.py --name "Mon App"
  
  # Clé avec limite personnalisée
  python scripts/create_api_key.py --name "App Haute Performance" --rate-limit 500
  
  # Clé avec permissions restreintes
  python scripts/create_api_key.py --name "STT Only" --permissions "stt,jobs"
  
  # Générer sans insertion BDD (pour production)
  python scripts/create_api_key.py --name "Prod Key" --no-db
        """
    )
    parser.add_argument("--name", default="API Key", help="Nom descriptif de la clé")
    parser.add_argument("--user-id", default="user-1", help="ID utilisateur associé")
    parser.add_argument("--rate-limit", type=int, default=60, help="Limite requêtes/minute (défaut: 60)")
    parser.add_argument("--permissions", default="*", help="Permissions (ex: '*' ou 'llm,stt,jobs')")
    parser.add_argument("--no-db", action="store_true", help="Générer la clé sans insertion en BDD")
    args = parser.parse_args()

    # Parse permissions
    if args.permissions == "*":
        permissions = ["*"]
    else:
        permissions = [p.strip() for p in args.permissions.split(",")]

    # Load settings and generate key
    settings = get_settings_for_script()
    api_key, key_hash = generate_api_key(settings)

    print()
    print("=" * 70)
    print("  🔑 NOUVELLE CLÉ API GÉNÉRÉE")
    print("=" * 70)
    print()
    print(f"  Clé API:      {api_key}")
    print(f"  Préfixe:      {settings.api_key_prefix}")
    print(f"  Rate limit:   {args.rate_limit} req/min")
    print(f"  Permissions:  {permissions}")
    print()
    print("  ⚠️  SAUVEGARDEZ CETTE CLÉ MAINTENANT !")
    print("  Elle ne sera plus jamais affichée.")
    print()
    print("=" * 70)

    if args.no_db:
        print()
        print(f"Hash SHA-256: {key_hash}")
        print()
        print("📋 Commande SQL pour insertion manuelle:")
        print("-" * 70)
        
        import json
        permissions_escaped = json.dumps(permissions).replace('"', '\\"')
        
        print(f"""
-- Exécuter dans psql ou via docker exec
INSERT INTO api_keys (
    id, key_hash, name, user_id, 
    permissions, rate_limit, is_revoked, 
    created_at, updated_at
) VALUES (
    gen_random_uuid(), 
    '{key_hash}', 
    '{args.name}', 
    '{args.user_id}',
    '{json.dumps(permissions)}', 
    {args.rate_limit}, 
    false, 
    now(), 
    now()
);
""")
        print("-" * 70)
        print()
        print("💡 Pour exécuter dans Docker:")
        print(f'   docker compose exec postgres psql -U lexia -d lexia -c "INSERT INTO api_keys ..."')
        print()
    else:
        # Insert into database
        try:
            key_id = asyncio.run(insert_key_to_db(
                key_hash, args.name, args.user_id, args.rate_limit, permissions
            ))
            print()
            print(f"  ✅ Clé insérée dans la base de données")
            print(f"  ID: {key_id}")
            print()
        except Exception as e:
            print()
            print(f"  ❌ Erreur lors de l'insertion: {e}")
            print()
            print(f"  Hash (pour insertion manuelle): {key_hash}")
            print()
            print("  💡 Conseil: Utilisez --no-db pour générer la commande SQL")
            print()


if __name__ == "__main__":
    main()
