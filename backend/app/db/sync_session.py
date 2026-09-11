from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.configs.config import settings
from app.db.base import Base

from app.models.user import User
from app.models.workout_session import WorkoutSession

sync_url = settings.DATABASE_URL.replace("asyncmy", "pymysql")

sync_engine = create_engine(sync_url)

SyncSessionLocal = sessionmaker(bind=sync_engine)

