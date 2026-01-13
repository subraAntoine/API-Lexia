"""
API Keys management endpoints.

Provides endpoints to create, list, and revoke API keys.
"""

import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Query, Request
from pydantic import BaseModel, Field

from src.core.auth import APIKeyManager, get_api_key_manager
from src.core.config import Settings, get_settings
from src.core.exceptions import NotFoundError, AuthenticationError
from src.db.repositories.api_key import APIKeyRepository


router = APIRouter(prefix="/api-keys", tags=["API Keys"])


# --- Request/Response Models ---


class CreateAPIKeyRequest(BaseModel):
    """Request to create a new API key."""
    
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Name for the API key",
        examples=["Mon Application", "Production Key"]
    )
    user_id: str = Field(
        default="user-1",
        description="User ID to associate with the key"
    )
    organization_id: str | None = Field(
        default=None,
        description="Optional organization ID"
    )
    permissions: list[str] = Field(
        default=["*"],
        description="List of permissions (use ['*'] for all)"
    )
    rate_limit: int = Field(
        default=60,
        ge=1,
        le=10000,
        description="Rate limit (requests per minute)"
    )


class CreateAPIKeyResponse(BaseModel):
    """Response after creating an API key."""
    
    id: str = Field(..., description="API key ID in database")
    api_key: str = Field(
        ..., 
        description="The API key (save this, it won't be shown again!)"
    )
    name: str = Field(..., description="Name of the API key")
    user_id: str = Field(..., description="Associated user ID")
    message: str = Field(
        default="⚠️ Sauvegardez cette clé maintenant ! Elle ne sera plus affichée.",
        description="Warning message"
    )


class APIKeyInfo(BaseModel):
    """Information about an API key (without the actual key)."""
    
    id: str
    name: str
    user_id: str
    organization_id: str | None
    permissions: list[str]
    rate_limit: int
    is_revoked: bool
    created_at: datetime
    last_used_at: datetime | None
    expires_at: datetime | None


class APIKeyListResponse(BaseModel):
    """Response for listing API keys."""
    
    keys: list[APIKeyInfo]
    total: int


class RevokeAPIKeyResponse(BaseModel):
    """Response after revoking an API key."""
    
    id: str
    revoked: bool
    message: str


class DeleteAPIKeyResponse(BaseModel):
    """Response after deleting an API key."""
    
    id: str
    deleted: bool
    message: str


# --- Endpoints ---


@router.post(
    "",
    response_model=CreateAPIKeyResponse,
    summary="Create a new API key",
    description="""
Create a new API key for authentication.

**⚠️ Important**: The API key will only be shown once in the response. 
Make sure to save it immediately!

This endpoint does NOT require authentication (for bootstrapping).
In production, you may want to protect this with a master key or admin auth.
""",
)
async def create_api_key(
    request: Request,
    body: CreateAPIKeyRequest,
    settings: Annotated[Settings, Depends(get_settings)],
) -> CreateAPIKeyResponse:
    """Create a new API key."""
    
    # Get database session from request
    db = getattr(request.state, "db", None)
    if db is None:
        raise AuthenticationError(message="Database connection not available")
    
    # Generate new API key
    manager = APIKeyManager(settings)
    api_key = manager.generate_api_key()
    key_hash = manager.hash_api_key(api_key)
    
    # Save to database
    repo = APIKeyRepository(db)
    api_key_record = await repo.create(
        key_hash=key_hash,
        name=body.name,
        user_id=body.user_id,
        organization_id=body.organization_id,
        permissions=body.permissions,
        rate_limit=body.rate_limit,
    )
    
    await db.commit()
    
    return CreateAPIKeyResponse(
        id=str(api_key_record.id),
        api_key=api_key,
        name=api_key_record.name,
        user_id=api_key_record.user_id,
    )


@router.get(
    "",
    response_model=APIKeyListResponse,
    summary="List API keys",
    description="List all API keys for a user (does not show the actual keys).",
)
async def list_api_keys(
    request: Request,
    user_id: str = Query(default="user-1", description="User ID to list keys for"),
    include_revoked: bool = Query(default=False, description="Include revoked keys"),
) -> APIKeyListResponse:
    """List all API keys for a user."""
    
    db = getattr(request.state, "db", None)
    if db is None:
        raise AuthenticationError(message="Database connection not available")
    
    repo = APIKeyRepository(db)
    keys = await repo.get_by_user(user_id, include_revoked=include_revoked)
    
    return APIKeyListResponse(
        keys=[
            APIKeyInfo(
                id=str(key.id),
                name=key.name,
                user_id=key.user_id,
                organization_id=key.organization_id,
                permissions=key.permissions or [],
                rate_limit=key.rate_limit or 60,
                is_revoked=key.is_revoked,
                created_at=key.created_at,
                last_used_at=key.last_used_at,
                expires_at=key.expires_at,
            )
            for key in keys
        ],
        total=len(keys),
    )


@router.post(
    "/{key_id}/revoke",
    response_model=RevokeAPIKeyResponse,
    summary="Revoke an API key",
    description="Revoke an API key. The key will no longer work for authentication.",
)
async def revoke_api_key(
    request: Request,
    key_id: uuid.UUID,
) -> RevokeAPIKeyResponse:
    """Revoke an API key."""
    
    db = getattr(request.state, "db", None)
    if db is None:
        raise AuthenticationError(message="Database connection not available")
    
    repo = APIKeyRepository(db)
    
    # Check if key exists
    key = await repo.get_by_id(key_id)
    if key is None:
        raise NotFoundError(resource="APIKey", resource_id=str(key_id))
    
    revoked = await repo.revoke(key_id)
    await db.commit()
    
    return RevokeAPIKeyResponse(
        id=str(key_id),
        revoked=revoked,
        message="Clé API révoquée avec succès" if revoked else "La clé était déjà révoquée",
    )


@router.delete(
    "/{key_id}",
    response_model=DeleteAPIKeyResponse,
    summary="Delete an API key",
    description="Permanently delete an API key from the database.",
)
async def delete_api_key(
    request: Request,
    key_id: uuid.UUID,
) -> DeleteAPIKeyResponse:
    """Delete an API key."""
    
    db = getattr(request.state, "db", None)
    if db is None:
        raise AuthenticationError(message="Database connection not available")
    
    repo = APIKeyRepository(db)
    deleted = await repo.delete(key_id)
    await db.commit()
    
    if not deleted:
        raise NotFoundError(resource="APIKey", resource_id=str(key_id))
    
    return DeleteAPIKeyResponse(
        id=str(key_id),
        deleted=True,
        message="Clé API supprimée définitivement",
    )
