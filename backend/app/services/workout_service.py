import uuid, os, shutil, asyncio
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.workout_session import WorkoutSession
from app.video_proccesing import get_squat_video_report, get_plank_video_report

class WorkoutService:
    @staticmethod
    async def save_video(file: UploadFile) -> str:
        os.makedirs("uploads", exist_ok=True)
        ext = os.path.splitext(file.filename)[1]  # берем только расширение
        filename = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join("uploads", filename)
        
        with open(file_path, "wb") as buffer:     # записываем файл
            shutil.copyfileobj(file.file, buffer)
        
        return file_path
    
    @staticmethod
    async def create_workout_session(db: AsyncSession, user_id: uuid.UUID, exercise_type: str, video_path: str) -> WorkoutSession:
        workout_session = WorkoutSession(user_id=user_id, exercise_type=exercise_type, video_path=video_path)
        db.add(workout_session)
        await db.commit()
        await db.refresh(workout_session)
        return workout_session
    
    # @staticmethod
    # async def process_video(db: AsyncSession, workout_id: uuid.UUID, video_path: str, exercise_type: str) -> WorkoutSession:
    #     try:
    #         if exercise_type == "squat":
    #             result = await asyncio.to_thread(get_squat_video_report, video_path)
    #         elif exercise_type == "plank":
    #             result = await asyncio.to_thread(get_plank_video_report, video_path)
    #         else:
    #             raise ValueError(f"Unknown exercise type: {exercise_type}")
            
    #         workout_session = await db.get(WorkoutSession, workout_id)
    #         if workout_session:  
    #             workout_session.status = "done"
    #             workout_session.result = result
    #             await db.commit()
    #             await db.refresh(workout_session)
    #             return workout_session
    #         else:
    #             raise ValueError(f"Session {workout_id} not found in the database")
            
    #     except Exception as e:
    #         print(f"Video processing error: {e}")
    #         workout_session = await db.get(WorkoutSession, workout_id)
    #         if workout_session:
    #             workout_session.status = "failed"
    #             await db.commit()
    #             await db.refresh(workout_session)     
    #         raise 
    
    @staticmethod
    async def get_workout_session(db: AsyncSession, workout_id: uuid.UUID) -> WorkoutSession:
        return await db.get(WorkoutSession, workout_id)
    
    @staticmethod
    async def get_user_workout_sessions(db: AsyncSession, user_id: uuid.UUID) -> list[WorkoutSession]:
        result = await db.execute(
           select(WorkoutSession)
            .where(WorkoutSession.user_id == user_id)
            .order_by(WorkoutSession.created_at.desc())
        )
        return result.scalars().all()
    
    @staticmethod
    async def delete_workout_session(db: AsyncSession, workout_id: uuid.UUID) -> None:
        workout_session = await db.get(WorkoutSession, workout_id)
        if workout_session:
            await db.delete(workout_session)
            await db.commit()
    