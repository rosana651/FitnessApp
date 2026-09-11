from collections.abc import AsyncGenerator
 
from sqlalchemy.ext.asyncio import AsyncSession,create_async_engine,async_sessionmaker
from sqlalchemy import event
 
from app.configs.config import settings
 
engine = create_async_engine(settings.DATABASE_URL,echo=False)
AsyncSessionLocal = async_sessionmaker(engine,class_=AsyncSession, expire_on_commit=False)
          
async def get_db() -> AsyncGenerator[AsyncSession,None]:
    async with AsyncSessionLocal() as session:
        yield session