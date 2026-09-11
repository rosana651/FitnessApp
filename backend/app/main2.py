import cv2
import mediapipe as mp
import trackers.SquatTracker as sp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from mediapipe.framework.formats import landmark_pb2

# Настройка модели (можно использовать 'pose_landmarker_full.task')
base_options = python.BaseOptions(model_asset_path='backend/app/models_mp/pose_landmarker_full.task')

options = vision.PoseLandmarkerOptions(
    base_options=base_options,
    running_mode=vision.RunningMode.VIDEO,
    num_poses=1
)

# Создание объекта детектора
pose_landmarker = vision.PoseLandmarker.create_from_options(options)

# Настройка инструментов для отрисовки
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Запуск камеры
cap = cv2.VideoCapture(0)
timestamp = 0

MIN_VISIBILITY = 0.6
verdict = None

tracker = sp.SquatTracker()

def calculate_angle(a, b, c):
    import numpy as np
    a = np.array(a)  # Бедро
    b = np.array(b)  # Колено
    c = np.array(c)  # Лодыжка
    
              # Угол наклона первого вектора         # Угол наклона второго вектора
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])  # Разница между ними и есть угол между векторами
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

while True:
    success, frame = cap.read()
    if not success:
        break

    # Подготовка кадра
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)


    # Детекция позы
    results = pose_landmarker.detect_for_video(mp_image, timestamp)
    timestamp += 1

    # Отрисовка скелета
    if results.pose_landmarks:
        for pose in results.pose_landmarks:
            pose_landmarks_proto = landmark_pb2.NormalizedLandmarkList()
            for landmark in pose:
                pose_landmarks_proto.landmark.add(
                    x=landmark.x,
                    y=landmark.y,
                    z=landmark.z,
                    visibility=landmark.visibility
                )
                
            left_hip = pose[23]
            left_knee = pose[25]
            left_ankle = pose[27]

            right_hip = pose[24]
            right_knee = pose[26]
            right_ankle = pose[28]

            left_visibility = min(left_hip.visibility, left_knee.visibility, left_ankle.visibility)
            right_visibility = min(right_hip.visibility, right_knee.visibility, right_ankle.visibility)

            if left_visibility >= right_visibility:
                hip, knee, ankle = left_hip, left_knee, left_ankle
                best_visibility = left_visibility
            else:
                hip, knee, ankle = right_hip, right_knee, right_ankle
                best_visibility = right_visibility

            a = (hip.x, hip.y)
            b = (knee.x, knee.y)
            c = (ankle.x, ankle.y)

            verdict = None  

            if best_visibility < MIN_VISIBILITY:
                pass
            else:
                angle = calculate_angle(a, b, c)
                verdict = tracker.update(angle)
                
            if verdict:
                print(f"Повторение #{tracker.rep_count}: {verdict}")

            cv2.putText(frame, f'Reps: {tracker.rep_count}', (50, 50), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)
            if tracker.last_verdict:
                cv2.putText(frame, f'Last: {tracker.last_verdict}', (50, 90), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)

            mp_drawing.draw_landmarks(
                frame,
                pose_landmarks_proto,
                mp_pose.POSE_CONNECTIONS,
                mp_drawing.DrawingSpec(thickness=2, circle_radius=3),
                mp_drawing.DrawingSpec(thickness=2)
            )
            
            
    # Отображение
    cv2.imshow('Pose Landmarker', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()