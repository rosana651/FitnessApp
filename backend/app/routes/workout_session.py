import uuid

import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.tasks.video_tasks import process_video_task

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.workout_session import WorkoutSessionResponse
from app.services.workout_service import WorkoutService

router = APIRouter(prefix="/workouts", tags=["workouts"])

@router.post("/squat")
async def upload_squat(
    file: UploadFile,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> WorkoutSessionResponse:
    video_path = await WorkoutService.save_video(file)
    workout_session = await WorkoutService.create_workout_session(
        db, current_user.id, "squat", video_path
    )
    process_video_task.delay(str(workout_session.id), video_path, "squat")
    return workout_session


@router.post("/plank")
async def upload_plank(
    file: UploadFile,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> WorkoutSessionResponse:
    video_path = await WorkoutService.save_video(file)
    workout_session = await WorkoutService.create_workout_session(
        db, current_user.id, "plank", video_path
    )
    process_video_task.delay(str(workout_session.id), video_path, "plank")
    return workout_session

@router.post("/wide_pushup")
async def upload_wide_pushup(
    file: UploadFile,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> WorkoutSessionResponse:
    video_path = await WorkoutService.save_video(file)
    workout_session = await WorkoutService.create_workout_session(
        db, current_user.id, "wide_pushup", video_path
    )
    process_video_task.delay(str(workout_session.id), video_path, "wide_pushup")
    return workout_session

@router.post("/close_grip_pushup")
async def upload_close_grip_pushup(
    file: UploadFile,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> WorkoutSessionResponse:
    video_path = await WorkoutService.save_video(file)
    workout_session = await WorkoutService.create_workout_session(
        db, current_user.id, "close_grip_pushup", video_path
    )
    process_video_task.delay(str(workout_session.id), video_path, "close_grip_pushup")
    return workout_session

@router.get("/history")  
async def get_history(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> list[WorkoutSessionResponse]:
    return await WorkoutService.get_user_workout_sessions(db, current_user.id)

@router.get("/{id}")  
async def get_session(id: uuid.UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> WorkoutSessionResponse:
    workout = await WorkoutService.get_workout_session(db, id)
    if workout is None:
        raise HTTPException(status_code=404, detail="Сессия не найдена")
    if workout.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет доступа")
    return workout

@router.delete("/{id}")
async def delete_session(id: uuid.UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> dict:
    workout = await WorkoutService.get_workout_session(db, id)
    if workout is None:
        raise HTTPException(status_code=404, detail="Сессия не найдена")
    if workout.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет доступа")
    await WorkoutService.delete_workout_session(db, id)
    return {"detail": "Удалено"}

@router.get("/{id}/video")
async def get_workout_video(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    workout = await WorkoutService.get_workout_session(db, id)
    if workout is None:
        raise HTTPException(status_code=404, detail="Сессия не найдена")
    if workout.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет доступа")
    
    video_path = workout.result.get("processed_video_path")
    if not video_path or not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Видео не найдено")
    
    return FileResponse(video_path, media_type="video/mp4")