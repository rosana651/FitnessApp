import os
import numpy as np
import cv2
from mediapipe.framework.formats import landmark_pb2
import mediapipe as mp
from app.configs.config_mp import mp_drawing, mp_pose
import subprocess

def create_video_writer(video_path, cap):
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    # временный файл с mp4v кодеком
    temp_path = video_path.replace("uploads/", "uploads/temp_")
    # финальный файл с H.264 для браузера
    output_path = video_path.replace("uploads/", "uploads/processed_")
    
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(temp_path, fourcc, fps, (width, height))
    return out, temp_path, output_path


def convert_to_h264(temp_path, output_path):
    subprocess.run([
        "ffmpeg",
        "-y",
        "-i", temp_path,
        "-c:v", "libx264",
        "-preset", "fast",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-movflags", "+faststart",
        output_path
    ], check=True)

    os.remove(temp_path)

def draw_pose_landmarks(frame, pose): 
    pose_landmarks_proto = landmark_pb2.NormalizedLandmarkList()
    for landmark in pose:
        pose_landmarks_proto.landmark.add(
            x=landmark.x,
            y=landmark.y,
            z=landmark.z,
            visibility=landmark.visibility
        )
    
    mp_drawing.draw_landmarks(
        frame,
        pose_landmarks_proto,
        mp_pose.POSE_CONNECTIONS,
        mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=2, circle_radius=3),
        mp_drawing.DrawingSpec(color=(128, 0, 255), thickness=2)
    )

def calculate_angle(a, b, c):  
    a = np.array(a)  
    b = np.array(b)  
    c = np.array(c)  
    
              # Угол наклона первого вектора         # Угол наклона второго вектора
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])  # Разница между ними и есть угол между векторами
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

def calculate_angle_3d(a, b, c):
    ba = np.array([ # первый вектор(плечо:локоть)
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2]
    ])

    bc = np.array([ #  второй вектор(локоть:запястье)
        c[0] - b[0],
        c[1] - b[1],
        c[2] - b[2]
    ])

    #Формула для нахождения угла между 3х мерным вектором
    cosine_angle = np.dot(ba, bc) / (
        np.linalg.norm(ba) * np.linalg.norm(bc)
    )

    angle = np.degrees(np.arccos(np.clip(cosine_angle, -1.0, 1.0)))

    return angle

def normalize_landmark(landmark,width,height):
    return (landmark.x * width, landmark.y * height)

def normalize_landmark_3d(landmark, width, height):
    return (
        landmark.x * width,
        landmark.y * height,
        landmark.z * width  # z масштабируем относительно ширины 
    )
    
def draw_overlay(frame, width, exercise_type, tracker, angle=None):
    if exercise_type in ("squat", "pushup", "wide_pushup"):
        cv2.putText(frame, f"Повторений: {tracker.rep_count}", (width - 250, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv2.putText(frame, f"Оценка: {tracker.last_verdict or '-'}", (width - 250, 80),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (128, 0, 255), 2)
        cv2.putText(frame, f"Фаза: {tracker.state}", (width - 250, 120),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 2)

    elif exercise_type == "plank" and angle is not None:
        if angle > 175:
            status, color = "Таз слишком высоко", (0, 165, 255)
        elif angle < 160:
            status, color = "Таз провисает", (0, 0, 255)
        else:
            status, color = "Хорошая техника", (0, 255, 0)

        cv2.putText(frame, status, (width - 300, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
        cv2.putText(frame, f"Угол: {angle:.1f}", (width - 300, 80),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)