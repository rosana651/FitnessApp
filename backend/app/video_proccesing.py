import cv2
import mediapipe as mp
import app.trackers.SquatTracker as sp
import app.trackers.PlankTracker as pt
import backend.app.trackers.WidePushUpTracker as wu
from mediapipe.framework.formats import landmark_pb2
from app.pose_utils import calculate_angle, normalize_landmark, calculate_angle_3d, normalize_landmark_3d
from app.configs.config_mp import pose_landmarker, mp_drawing, mp_pose, MIN_VISIBILITY

def get_squat_video_report(video_path):
    squat_tracker = sp.SquatTracker()
    cap = cv2.VideoCapture(video_path)
    timestamp = 0
    while cap.isOpened:
        success, frame = cap.read()
        if not success:
            break
        
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

        timestamp = int(cap.get(cv2.CAP_PROP_POS_MSEC))
        results = pose_landmarker.detect_for_video(mp_image, timestamp)
        if results.pose_landmarks:
            for pose in results.pose_landmarks:                   
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

                height, width = frame.shape[:2]

                a = normalize_landmark(hip, width, height)
                b = normalize_landmark(knee, width, height)
                c = normalize_landmark(ankle, width, height)

                if best_visibility < MIN_VISIBILITY:
                    pass
                else:
                    angle = calculate_angle(a, b, c)
                    squat_tracker.update(angle)
    cap.release()
    
    report = squat_tracker.get_report()
    return report

def get_plank_video_report(video_path):
    plank_tracker = pt.PlankTracker()
    cap = cv2.VideoCapture(video_path)
    timestamp = 0    
    while cap.isOpened:
        success, frame = cap.read()
        if not success:
            break
        
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

        timestamp = int(cap.get(cv2.CAP_PROP_POS_MSEC))
        results = pose_landmarker.detect_for_video(mp_image, timestamp)

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
                    
                left_shoulder = pose[11]
                left_hip = pose[23]
                left_ankle = pose[27]

                right_shoulder = pose[12]
                right_hip = pose[24]
                right_ankle = pose[28]

                left_visibility = min(left_hip.visibility, left_shoulder.visibility, left_ankle.visibility)
                right_visibility = min(right_hip.visibility, right_shoulder.visibility, right_ankle.visibility)

                if left_visibility >= right_visibility:
                    shoulder, hip, ankle = left_shoulder, left_hip, left_ankle
                    best_visibility = left_visibility
                else:
                    shoulder, hip, ankle = right_shoulder, right_hip, right_ankle
                    best_visibility = right_visibility

                height, width = frame.shape[:2]

                a = normalize_landmark(shoulder, width, height)
                b = normalize_landmark(hip, width, height)
                c = normalize_landmark(ankle, width, height)

                if best_visibility < MIN_VISIBILITY:
                    pass
                else:
                    angle = calculate_angle(a, b, c)
                    plank_tracker.update(timestamp, angle)
                    
    cap.release()
    
    result = plank_tracker.get_report()
    return result

def get_wide_pushup_video_report(video_path):
    tracker = wu.WidePushUpTracker()
    cap = cv2.VideoCapture(video_path)

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        timestamp = int(cap.get(cv2.CAP_PROP_POS_MSEC))
        results = pose_landmarker.detect_for_video(mp_image, timestamp)

        if results.pose_landmarks:
            for pose in results.pose_landmarks:
                left_shoulder = pose[11]
                left_elbow = pose[13]
                left_wrist = pose[15]

                right_shoulder = pose[12]
                right_elbow = pose[14]
                right_wrist = pose[16]

                left_visibility = min(
                    left_shoulder.visibility,
                    left_elbow.visibility,
                    left_wrist.visibility
                )
                right_visibility = min(
                    right_shoulder.visibility,
                    right_elbow.visibility,
                    right_wrist.visibility
                )

                if left_visibility >= right_visibility:
                    shoulder, elbow, wrist = left_shoulder, left_elbow, left_wrist
                    best_visibility = left_visibility
                else:
                    shoulder, elbow, wrist = right_shoulder, right_elbow, right_wrist
                    best_visibility = right_visibility

                height, width = frame.shape[:2]

                # используем 3D координаты
                a = normalize_landmark_3d(shoulder, width, height)
                b = normalize_landmark_3d(elbow, width, height)
                c = normalize_landmark_3d(wrist, width, height)

                if best_visibility >= MIN_VISIBILITY:
                    angle = calculate_angle_3d(a, b, c)
                    tracker.update(angle)

    cap.release()
    return tracker.get_report()