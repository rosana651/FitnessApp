from pydantic_settings import BaseSettings,SettingsConfigDict
 
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    DB_ROOT_PASSWORD: str
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str = "db"
    DB_PORT: int = 3306
    REDIS_URL: str
    
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    
    @property # Обновляет значение DATABASE_URL при каждом обращении к нему, чтобы использовать актуальные значения из переменных окружения
    def DATABASE_URL(self) -> str:
        return f"mysql+asyncmy://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

settings = Settings()