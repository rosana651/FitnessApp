import uuid
from datetime import datetime
 
from pydantic import BaseModel,EmailStr, ConfigDict
 
class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True) # если передаем объект SQLAlchemy, то Pydantic будет использовать атрибуты объекта для создания модели
    
    id:uuid.UUID
    username:str
    email:EmailStr
    created_at: datetime