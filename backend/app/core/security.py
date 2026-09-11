from datetime import datetime,timedelta, timezone
 
import bcrypt
from jose import jwt,JWTError
 
from app.configs.config import settings 
def hash_password(password:str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"),bcrypt.gensalt()).decode("utf-8")
 
def verify_password(password:str,hashed_password:str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"),hashed_password.encode("utf-8"))
 
def create_access_token(subject:str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub":subject,"exp": expire}
    token = jwt.encode(payload,settings.SECRET_KEY,algorithm=settings.ALGORITHM)
    return token
 
def decode_token(token:str) -> dict:
    try:
        payload = jwt.decode(token,settings.SECRET_KEY,algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None