"""
Lexia API - Main FastAPI Application.

Production-ready API for LLM inference, Speech-to-Text, and Speaker Diarization.
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from src.core.config import Settings, get_settings
from src.core.exceptions import LexiaAPIError
from src.core.logging import configure_logging, get_logger
from src.db.session import close_db, init_db, get_session_maker
from src.models.common import ErrorDetail, ErrorResponse, HealthResponse, OpenAIErrorResponse


class DatabaseMiddleware(BaseHTTPMiddleware):
    """Middleware to inject database session into request state."""

    async def dispatch(self, request: Request, call_next):
        """Inject database session into request.state.db."""
        session_maker = get_session_maker()
        async with session_maker() as session:
            request.state.db = session
            try:
                response = await call_next(request)
                await session.commit()
                return response
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()

# Import routers
from src.api.routers import api_keys, diarization, jobs, llm, stt


logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    settings = get_settings()

    # Startup
    logger.info("starting_application", env=settings.app_env)
    configure_logging(settings)

    # Initialize database
    try:
        await init_db()
        logger.info("database_connected")
    except Exception as e:
        logger.error("database_connection_failed", error=str(e))

    yield

    # Shutdown
    logger.info("shutting_down_application")
    await close_db()


def create_app(settings: Settings | None = None) -> FastAPI:
    """
    Create and configure the FastAPI application.

    Args:
        settings: Application settings. Uses default if None.

    Returns:
        Configured FastAPI application.
    """
    if settings is None:
        settings = get_settings()

    app = FastAPI(
        title="Lexia API",
        description="""
# Lexia API

Production-ready API for AI-powered audio processing and language models.

## Features

### LLM (Large Language Model)
- Chat completion with streaming support
- Tool/function calling
- Multiple model support

### Speech-to-Text
- Async transcription with job polling
- Sync transcription for short files
- Word-level timestamps
- Multi-language support (French, English, etc.)

### Speaker Diarization
- Automatic speaker detection
- Configurable speaker count
- Overlap detection
- RTTM output format

## Authentication

All endpoints require API key authentication.

```
Authorization: Bearer lx_your_api_key
```

## Rate Limits

Rate limits are applied per API key. Check response headers:
- `X-RateLimit-Limit`: Requests allowed per minute
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

---

**Version:** 1.0.0 | **Contact:** contact@lexia.fr
        """,
        version="1.0.0",
        docs_url="/docs" if settings.app_debug else None,
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
        swagger_ui_init_oauth={},
        openapi_tags=[
            {"name": "API Keys", "description": "API key management"},
            {"name": "LLM", "description": "Large Language Model endpoints"},
            {"name": "Speech-to-Text", "description": "Audio transcription endpoints"},
            {"name": "Diarization", "description": "Speaker diarization endpoints"},
            {"name": "Jobs", "description": "Async job management"},
            {"name": "Health", "description": "Health check endpoints"},
        ],
    )
    
    # Add OpenAPI security scheme for Bearer token authentication
    from fastapi.openapi.utils import get_openapi
    
    def custom_openapi():
        if app.openapi_schema:
            return app.openapi_schema
        openapi_schema = get_openapi(
            title=app.title,
            version=app.version,
            description=app.description,
            routes=app.routes,
            tags=app.openapi_tags,
        )
        openapi_schema["components"]["securitySchemes"] = {
            "BearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "API Key",
                "description": "Enter your API key (e.g., lx_abc123...)",
            }
        }
        
        # Add OpenAI-compatible error schemas
        openapi_schema["components"]["schemas"]["OpenAIErrorDetail"] = {
            "type": "object",
            "title": "OpenAI Error Detail",
            "description": "Error detail following OpenAI's error format.",
            "required": ["message", "type"],
            "properties": {
                "message": {
                    "type": "string",
                    "description": "A human-readable error message.",
                    "example": "Invalid value for 'model': expected string."
                },
                "type": {
                    "type": "string",
                    "description": "The type of error.",
                    "enum": ["invalid_request_error", "authentication_error", "rate_limit_error", "server_error", "api_error"],
                    "example": "invalid_request_error"
                },
                "param": {
                    "type": "string",
                    "nullable": True,
                    "description": "The parameter that caused the error.",
                    "example": "model"
                },
                "code": {
                    "type": "string",
                    "nullable": True,
                    "description": "A short error code.",
                    "example": "invalid_api_key"
                }
            }
        }
        openapi_schema["components"]["schemas"]["OpenAIErrorResponse"] = {
            "type": "object",
            "title": "OpenAI Error Response",
            "description": "Standard error response following OpenAI's API format.",
            "required": ["error"],
            "properties": {
                "error": {
                    "$ref": "#/components/schemas/OpenAIErrorDetail"
                }
            },
            "example": {
                "error": {
                    "message": "Invalid value for 'model': expected string.",
                    "type": "invalid_request_error",
                    "param": "model",
                    "code": None
                }
            }
        }
        
        # Add common error responses to all paths
        error_responses = {
            "401": {
                "description": "Authentication Error - Invalid or missing API key",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/OpenAIErrorResponse"},
                        "example": {
                            "error": {
                                "message": "Invalid API key provided.",
                                "type": "authentication_error",
                                "param": None,
                                "code": "invalid_api_key"
                            }
                        }
                    }
                }
            },
            "422": {
                "description": "Validation Error - Invalid request parameters",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/OpenAIErrorResponse"},
                        "example": {
                            "error": {
                                "message": "Invalid value for 'temperature': expected float between 0 and 2.",
                                "type": "invalid_request_error",
                                "param": "temperature",
                                "code": None
                            }
                        }
                    }
                }
            },
            "429": {
                "description": "Rate Limit Error - Too many requests",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/OpenAIErrorResponse"},
                        "example": {
                            "error": {
                                "message": "Rate limit exceeded. Please retry after 60 seconds.",
                                "type": "rate_limit_error",
                                "param": None,
                                "code": "rate_limit_exceeded"
                            }
                        }
                    }
                }
            },
            "500": {
                "description": "Server Error - Internal server error",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/OpenAIErrorResponse"},
                        "example": {
                            "error": {
                                "message": "An internal server error occurred.",
                                "type": "server_error",
                                "param": None,
                                "code": None
                            }
                        }
                    }
                }
            }
        }
        
        # Apply error responses to all endpoints
        for path in openapi_schema.get("paths", {}).values():
            for operation in path.values():
                if isinstance(operation, dict) and "responses" in operation:
                    for code, response in error_responses.items():
                        if code not in operation["responses"]:
                            operation["responses"][code] = response
        
        # Apply security globally to all endpoints
        openapi_schema["security"] = [{"BearerAuth": []}]
        app.openapi_schema = openapi_schema
        return app.openapi_schema
    
    app.openapi = custom_openapi

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )

    # Database middleware - injects db session into request.state.db
    app.add_middleware(DatabaseMiddleware)

    # Exception handlers
    @app.exception_handler(LexiaAPIError)
    async def lexia_error_handler(
        request: Request, exc: LexiaAPIError
    ) -> JSONResponse:
        """Handle Lexia API errors with OpenAI-compatible format."""
        error_type_mapping = {
            "AUTHENTICATION_ERROR": "invalid_api_key",
            "INVALID_API_KEY": "invalid_api_key",
            "AUTHORIZATION_ERROR": "insufficient_permissions",
            "NOT_FOUND": "invalid_request_error",
            "MODEL_NOT_FOUND": "model_not_found",
            "VALIDATION_ERROR": "invalid_request_error",
            "RATE_LIMIT_EXCEEDED": "rate_limit_exceeded",
            "SERVICE_UNAVAILABLE": "server_error",
            "LLM_SERVICE_ERROR": "server_error",
            "STT_SERVICE_ERROR": "server_error",
        }
        
        error_type = error_type_mapping.get(exc.error_code, "api_error")
        
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "message": exc.message,
                    "type": error_type,
                    "param": exc.details.get("param") if exc.details else None,
                    "code": exc.error_code.lower() if exc.error_code else None,
                }
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        """Handle validation errors with OpenAI-compatible format."""
        errors = exc.errors()
        if errors:
            first_error = errors[0]
            loc = first_error.get("loc", [])
            # Filter out 'body' from location to get cleaner param names
            filtered_loc = [str(l) for l in loc if l != "body"]
            param = ".".join(filtered_loc) if filtered_loc else None
            
            # Format message like OpenAI
            error_msg = first_error.get("msg", "validation error")
            error_type = first_error.get("type", "")
            
            if param:
                if "missing" in error_type:
                    message = f"Missing required parameter: '{param}'."
                elif "type" in error_type:
                    expected_type = error_type.split(".")[-1] if "." in error_type else "valid value"
                    message = f"Invalid value for '{param}': {error_msg}."
                else:
                    message = f"Invalid value for '{param}': {error_msg}."
            else:
                message = f"Request validation failed: {error_msg}."
        else:
            param = None
            message = "Request validation failed."

        logger.warning(
            "validation_error",
            path=request.url.path,
            param=param,
            message=message,
        )

        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": {
                    "message": message,
                    "type": "invalid_request_error",
                    "param": param,
                    "code": None,
                }
            },
        )

    @app.exception_handler(Exception)
    async def general_error_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        """Handle unexpected errors with OpenAI-compatible format."""
        logger.exception(
            "unhandled_error",
            path=request.url.path,
            method=request.method,
            error_type=type(exc).__name__,
            error_message=str(exc),
        )

        # In debug mode, include more details
        if settings.app_debug:
            message = f"An internal server error occurred: {type(exc).__name__}"
        else:
            message = "An internal server error occurred."

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": {
                    "message": message,
                    "type": "server_error",
                    "param": None,
                    "code": None,
                }
            },
        )

    # Include routers
    app.include_router(api_keys.router)
    app.include_router(llm.router)
    app.include_router(stt.router)
    app.include_router(diarization.router)
    app.include_router(jobs.router)

    # Health endpoints
    @app.get(
        "/health",
        response_model=HealthResponse,
        tags=["Health"],
        summary="Health check",
        description="Check API health and dependent services status.",
    )
    async def health_check() -> HealthResponse:
        """Check API health."""
        services: dict[str, str] = {}

        # Check LLM service
        try:
            from src.services.llm.factory import get_llm_backend
            llm_backend = get_llm_backend(settings)
            if await llm_backend.health_check():
                services["llm"] = "healthy"
            else:
                services["llm"] = "unhealthy"
        except Exception:
            services["llm"] = "unavailable"

        # Check STT service
        try:
            from src.services.stt.factory import get_stt_backend
            stt_backend = get_stt_backend(settings)
            if await stt_backend.health_check():
                services["stt"] = "healthy"
            else:
                services["stt"] = "unhealthy"
        except Exception:
            services["stt"] = "unavailable"

        # Overall status
        all_healthy = all(s == "healthy" for s in services.values())

        return HealthResponse(
            status="healthy" if all_healthy else "degraded",
            version=settings.app_version,
            services=services,
        )

    @app.get(
        "/",
        include_in_schema=False,
    )
    async def root() -> dict[str, Any]:
        """Root endpoint."""
        return {
            "name": "Lexia API",
            "version": settings.app_version,
            "docs": "/redoc",
            "openapi": "/openapi.json",
        }

    return app


# Create default application instance
app = create_app()


def main() -> None:
    """Run the application with uvicorn."""
    import uvicorn

    settings = get_settings()
    uvicorn.run(
        "src.api.main:app",
        host=settings.app_host,
        port=settings.app_port,
        workers=settings.app_workers,
        reload=settings.is_development,
    )


if __name__ == "__main__":
    main()
