# 🔐 Guide de gestion des clés API

Ce guide explique comment générer, gérer et sécuriser les clés API pour Lexia.

---

## Table des matières

- [Architecture](#architecture)
- [Génération de clés](#génération-de-clés)
  - [Mode développement](#mode-développement)
  - [Mode production](#mode-production)
- [Options disponibles](#options-disponibles)
- [Gestion des clés](#gestion-des-clés)
- [Bonnes pratiques](#bonnes-pratiques)

---

## Architecture

### Structure d'une clé API

```
lx_K7xM2pN9qR4sT8uV3wY6zA1bC5dE0fG2hI7jL
│  └─────────────────────────────────────────── Corps (43 caractères base64 URL-safe)
└──────────────────────────────────────────────  Préfixe (configurable, défaut: lx_)
```

### Flux d'authentification

```
┌─────────────────────────────────────────────────────────┐
│  Header: Authorization: Bearer lx_xxxxx                 │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  1. Extraire la clé du header                           │
│  2. Calculer hash = SHA256(salt + clé_sans_préfixe)     │
│  3. Chercher hash dans table api_keys                   │
│  4. Vérifier is_revoked = false                         │
│  5. Appliquer rate limiting                             │
│  6. Autoriser la requête ✅                             │
└─────────────────────────────────────────────────────────┘
```

### Stockage sécurisé

La clé en clair n'est **jamais stockée**. Seul le hash SHA-256 est enregistré en base de données.

---

## Génération de clés

### Mode développement

#### Docker (recommandé)

```bash
# Démarrer l'environnement de dev
docker compose -f docker/docker-compose.dev.yml up -d

# Générer une clé simple
docker compose -f docker/docker-compose.dev.yml exec api \
    python scripts/create_api_key.py --name "Dev Key"

# Générer une clé avec options
docker compose -f docker/docker-compose.dev.yml exec api \
    python scripts/create_api_key.py \
    --name "Test App" \
    --user-id "dev-user" \
    --rate-limit 100 \
    --permissions "stt,llm,jobs"
```

#### Local (sans Docker)

```bash
# Définir les variables d'environnement
export DATABASE_URL="postgresql+asyncpg://lexia:password@localhost:5432/lexia"
export API_KEY_SALT="votre-salt-secret"
export API_SECRET_KEY="votre-cle-secrete"

# Générer une clé
python scripts/create_api_key.py --name "Local Dev Key"
```

---

### Mode production

#### Avec insertion automatique en base

```bash
# Se connecter au serveur
ssh user@your-production-server

# Générer et insérer la clé
docker compose exec api python scripts/create_api_key.py \
    --name "Client ABC Corp" \
    --user-id "client-abc-123" \
    --rate-limit 200
```

#### Sans insertion (plus sécurisé)

Génère la clé et affiche la commande SQL à exécuter manuellement :

```bash
# Générer la clé sans insertion
docker compose exec api python scripts/create_api_key.py \
    --name "Client XYZ" \
    --rate-limit 100 \
    --no-db
```

Résultat :
```
======================================================================
  🔑 NOUVELLE CLÉ API GÉNÉRÉE
======================================================================

  Clé API:      lx_K7xM2pN9qR4sT8uV3wY6zA1bC5dE0fG2hI7jL
  ...

Hash SHA-256: 92c437a75cf5749b43113a179eb376593b64c25c2e1e2f00246156878b35ceb7

📋 Commande SQL pour insertion manuelle:
----------------------------------------------------------------------

INSERT INTO api_keys (
    id, key_hash, name, user_id, 
    permissions, rate_limit, is_revoked, 
    created_at, updated_at
) VALUES (
    gen_random_uuid(), 
    '92c437a75cf5749b43113a179eb376593b64c25c2e1e2f00246156878b35ceb7', 
    'Client XYZ', 
    'user-1',
    '["*"]', 
    100, 
    false, 
    now(), 
    now()
);
```

Puis exécuter manuellement :

```bash
docker compose exec postgres psql -U lexia -d lexia -c "INSERT INTO api_keys ..."
```

---

## Options disponibles

| Option | Description | Valeur par défaut |
|--------|-------------|-------------------|
| `--name` | Nom descriptif de la clé | `"API Key"` |
| `--user-id` | ID utilisateur associé | `"user-1"` |
| `--rate-limit` | Limite requêtes/minute | `60` |
| `--permissions` | Permissions (`*` ou `llm,stt,jobs`) | `"*"` |
| `--no-db` | Ne pas insérer en BDD | `false` |

### Exemples de configurations

```bash
# Clé essai gratuit (limitée)
docker compose exec api python scripts/create_api_key.py \
    --name "Trial - Company X" \
    --rate-limit 10 \
    --permissions "stt"

# Clé client standard
docker compose exec api python scripts/create_api_key.py \
    --name "Client Standard" \
    --rate-limit 60 \
    --permissions "*"

# Clé client premium
docker compose exec api python scripts/create_api_key.py \
    --name "Client Premium" \
    --rate-limit 500 \
    --permissions "*"

# Clé interne (monitoring, tests)
docker compose exec api python scripts/create_api_key.py \
    --name "Internal Monitoring" \
    --user-id "internal-system" \
    --rate-limit 1000
```

---

## Gestion des clés

### Lister les clés actives

```bash
docker compose exec postgres psql -U lexia -d lexia -c \
    "SELECT id, name, user_id, rate_limit, created_at, last_used_at 
     FROM api_keys 
     WHERE is_revoked = false 
     ORDER BY created_at DESC;"
```

### Révoquer une clé

```bash
# Trouver l'ID de la clé
docker compose exec postgres psql -U lexia -d lexia -c \
    "SELECT id, name FROM api_keys WHERE name LIKE '%Client ABC%';"

# Révoquer
docker compose exec postgres psql -U lexia -d lexia -c \
    "UPDATE api_keys SET is_revoked = true, updated_at = now() 
     WHERE id = 'uuid-de-la-cle';"
```

### Modifier le rate limit

```bash
docker compose exec postgres psql -U lexia -d lexia -c \
    "UPDATE api_keys SET rate_limit = 200, updated_at = now() 
     WHERE id = 'uuid-de-la-cle';"
```

### Trouver les clés inutilisées

```bash
# Clés non utilisées depuis 30 jours
docker compose exec postgres psql -U lexia -d lexia -c \
    "SELECT name, user_id, last_used_at 
     FROM api_keys 
     WHERE is_revoked = false 
     AND (last_used_at IS NULL OR last_used_at < now() - interval '30 days');"
```

### Supprimer définitivement une clé

> ⚠️ **Attention** : Préférez la révocation pour garder l'historique.

```bash
docker compose exec postgres psql -U lexia -d lexia -c \
    "DELETE FROM api_keys WHERE id = 'uuid-de-la-cle';"
```

---

## Bonnes pratiques

### ✅ À faire

| Pratique | Raison |
|----------|--------|
| Générer les clés côté serveur uniquement | Évite l'exposition du salt |
| Utiliser un salt unique et secret (64+ chars) | Protège contre les rainbow tables |
| Transmettre les clés via canal sécurisé | Dashboard client, email chiffré |
| Révoquer immédiatement les clés compromises | Limite les dégâts |
| Monitorer les clés non utilisées | Nettoie les clés orphelines |
| Limiter les permissions au minimum nécessaire | Principe du moindre privilège |
| Définir des rate limits adaptés | Protège contre les abus |

### ❌ À ne pas faire

| Anti-pattern | Risque |
|--------------|--------|
| Exposer un endpoint de création de clés | Création de clés non autorisées |
| Utiliser le salt par défaut en production | Clés compromises si salt connu |
| Envoyer les clés par email non chiffré | Interception possible |
| Supprimer les clés au lieu de révoquer | Perte d'historique d'audit |
| Donner `["*"]` à toutes les clés | Pas de granularité de contrôle |

---

## Variables d'environnement

```bash
# .env de production - OBLIGATOIRES
API_KEY_SALT=<valeur-aleatoire-64-caracteres>    # openssl rand -hex 32
API_SECRET_KEY=<autre-valeur-aleatoire>          # openssl rand -hex 32

# Générer des valeurs sécurisées
openssl rand -hex 32  # Pour API_KEY_SALT
openssl rand -hex 32  # Pour API_SECRET_KEY
```

> ⚠️ **Ces valeurs doivent être uniques par environnement et jamais versionnées dans Git.**

---

## Récapitulatif des commandes

| Action | Commande |
|--------|----------|
| **Générer (dev Docker)** | `docker compose -f docker/docker-compose.dev.yml exec api python scripts/create_api_key.py --name "Key"` |
| **Générer (prod)** | `docker compose exec api python scripts/create_api_key.py --name "Key"` |
| **Générer sans BDD** | `docker compose exec api python scripts/create_api_key.py --name "Key" --no-db` |
| **Lister les clés** | `docker compose exec postgres psql -U lexia -d lexia -c "SELECT * FROM api_keys;"` |
| **Révoquer** | `docker compose exec postgres psql -U lexia -d lexia -c "UPDATE api_keys SET is_revoked=true WHERE id='xxx';"` |
