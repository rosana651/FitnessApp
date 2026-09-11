import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision


# Настройка модели
base_options = python.BaseOptions(model_asset_path='/backend/app/models_mp/pose_landmarker_full.task')
options = vision.PoseLandmarkerOptions(
    base_options=base_options,
    running_mode=vision.RunningMode.VIDEO,
    num_poses=1
)

pose_landmarker = vision.PoseLandmarker.create_from_options(options)

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

MIN_VISIBILITY = 0.6