from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.configs.config import settings

from app.db.base import Base
from app.db.session import engine
from app.models.user import User
from app.models.workout_session import WorkoutSession

from app.routes import auth, workout_session

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(title="Fitness App", version="0.1.0", lifespan=lifespan)


_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(workout_session.router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}