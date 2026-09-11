import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Any
 
from sqlalchemy import DateTime,String,Uuid,Text,ForeignKey, JSON
from sqlalchemy.orm import Mapped,mapped_column,relationship
 
from app.db.base import Base

#if TYPE_CHECKING:
    #from app.models.user import User
    
class WorkoutSession(Base):
    __tablename__ = "workout_sessions"
    
    id:Mapped[uuid.UUID] = mapped_column(Uuid,primary_key=True,default=uuid.uuid4)  
    exercise_type:Mapped[str] = mapped_column(String(255),nullable=False)
    status:Mapped[str] = mapped_column(String(50),nullable=False,default="processing")
    video_path:Mapped[str] = mapped_column(Text,nullable=False)
    result:Mapped[dict[str, Any]] = mapped_column(JSON,nullable=True)
    created_at:Mapped[datetime] = mapped_column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc),nullable=False)
    user_id:Mapped[uuid.UUID] = mapped_column(Uuid,ForeignKey("users.id"),nullable=False)
    
    #user:Mapped["User"] = relationship("User",back_populates="workout_sessions")