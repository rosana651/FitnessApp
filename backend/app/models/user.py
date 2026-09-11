import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING
 
from sqlalchemy import DateTime,String,Uuid
from sqlalchemy.orm import Mapped,mapped_column,relationship
 
from app.db.base import Base
#from app.models.workout_session import WorkoutSession

#if TYPE_CHECKING:
    #from app.models.workout_session import WorkoutSession

class User(Base):
    __tablename__ = "users"
    
    id:Mapped[uuid.UUID] = mapped_column(Uuid,primary_key=True,default=uuid.uuid4)
    username:Mapped[str] = mapped_column(String(255),unique=True,index=True,nullable=False)
    email:Mapped[str] = mapped_column(String(255),unique=True,index=True,nullable=False)
    password_hash:Mapped[str] = mapped_column(String(255),nullable=False)
    #Лямбда будет 
    #вызываться при каждом создании нового объекта User, а не в момент определения класса
    created_at:Mapped[datetime] = mapped_column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc),nullable=False)
    
   