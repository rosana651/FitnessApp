import uuid
from typing import Any, Literal, Optional
from datetime import datetime
 
from pydantic import BaseModel, ConfigDict

class WorkoutSessionCreate(BaseModel):
    exercise_type: Literal["squat", "plank"]

class WorkoutSessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True) # если передаем объект SQLAlchemy, то Pydantic будет использовать атрибуты объекта для создания модели
    
    id:uuid.UUID
    exercise_type: Literal["squat", "plank"]
    status:str
    result: Optional[dict[str, Any]] = None
    created_at: datetime