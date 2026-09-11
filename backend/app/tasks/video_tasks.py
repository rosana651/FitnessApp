import uuid
from app.tasks.celery_app import celery_app
from app.db.sync_session import SyncSessionLocal
from app.models.workout_session import WorkoutSession
from app.video_proccesing import get_squat_video_report, get_plank_video_report, get_wide_pushup_video_report
from app.models.user import User
from app.models.workout_session import WorkoutSession

@celery_app.task
def process_video_task(workout_id: str, video_path: str, exercise_type: str):
    db = SyncSessionLocal()
    try:
        if exercise_type == "squat":
            result = get_squat_video_report(video_path)
        elif exercise_type == "plank":
            result = get_plank_video_report(video_path)
        elif exercise_type == "wide_pushup":
            result = get_wide_pushup_video_report(video_path)    
        else:
             raise ValueError(f"Unknown exercise type: {exercise_type}")

        workout = db.get(WorkoutSession, uuid.UUID(workout_id))
        if workout is None:
           raise ValueError(f"Session {workout_id} not found ")
        workout.status = "done"
        workout.result = result
        db.commit()

    except Exception as e:
        print(f"Video processing error: {e}")
        workout = db.get(WorkoutSession, uuid.UUID(workout_id))
        if workout:
            workout.status = "failed"
            db.commit()

    finally:
        db.close()