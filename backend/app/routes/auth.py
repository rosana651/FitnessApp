from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
 
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserPublic
from app.services.auth_service import AuthService
 
router = APIRouter(prefix="/auth", tags=["auth"])
 
 
@router.post("/register", response_model=TokenResponse)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    user = await AuthService.register(db, body.username, body.email, body.password)
    token = AuthService.issue_token(user)
    return TokenResponse(access_token=token)
 
 
@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    user = await AuthService.authenticate(db, body.email, body.password)
    token = AuthService.issue_token(user)
    return TokenResponse(access_token=token)
 
 
@router.get("/me", response_model=UserPublic)
async def me(current_user: User = Depends(get_current_user)) -> UserPublic:
    return UserPublic.model_validate(current_user)