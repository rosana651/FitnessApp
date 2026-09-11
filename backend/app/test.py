
import cv2
import mediapipe as mp

import trackers.SquatTracker as sp

from mediapipe import solutions
from mediapipe.framework.formats import landmark_pb2

from pose_utils import calculate_angle, normalize_landmark

from mediapipe.tasks import python
from mediapipe.tasks.python import vision


# ================================================================
# НАСТРОЙКИ MEDIAPIPE
# ================================================================

# Путь к модели
MODEL_PATH = "backend/app/models_mp/pose_landmarker_full.task"


# ВАЖНО:
# В старом config_mp.py было именно 0.6
MIN_VISIBILITY = 0.6


# ================================================================
# СОЗДАНИЕ POSE LANDMARKER
# ================================================================

base_options = python.BaseOptions(
    model_asset_path=MODEL_PATH
)

options = vision.PoseLandmarkerOptions(
    base_options=base_options,
    running_mode=vision.RunningMode.VIDEO,
    num_poses=1
)

pose_landmarker = vision.PoseLandmarker.create_from_options(
    options
)


# ================================================================
# НАСТРОЙКА ОТРИСОВКИ
# ================================================================

mp_drawing = solutions.drawing_utils
mp_pose = solutions.pose


# ================================================================
# АНАЛИЗ ВИДЕО
# ================================================================

def get_squat_video_report(video_path, show_video=True):

    squat_tracker = sp.SquatTracker()

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise ValueError(
            f"Не удалось открыть видео: {video_path}"
        )

    # ------------------------------------------------------------
    # Получаем FPS
    # ------------------------------------------------------------

    fps = cap.get(cv2.CAP_PROP_FPS)

    if fps <= 0:
        fps = 30.0

    frame_index = 0

    try:

        while True:

            success, frame = cap.read()

            if not success:
                break


            # ====================================================
            # TIMESTAMP
            # ====================================================

            timestamp = int(
                frame_index * 1000 / fps
            )

            frame_index += 1


            # ====================================================
            # ПОДГОТОВКА КАДРА
            # ====================================================

            frame = cv2.flip(frame, 1)

            rgb_frame = cv2.cvtColor(
                frame,
                cv2.COLOR_BGR2RGB
            )


            mp_image = mp.Image(
                image_format=mp.ImageFormat.SRGB,
                data=rgb_frame
            )


            # ====================================================
            # MEDIAPIPE
            # ====================================================

            results = pose_landmarker.detect_for_video(
                mp_image,
                timestamp
            )


            # ====================================================
            # ЕСЛИ ПОЗА НАЙДЕНА
            # ====================================================

            if results.pose_landmarks:

                for pose in results.pose_landmarks:

                    # ------------------------------------------------
                    # LANDMARK PROTO
                    # ------------------------------------------------

                    pose_landmarks_proto = (
                        landmark_pb2.NormalizedLandmarkList()
                    )

                    for landmark in pose:

                        pose_landmarks_proto.landmark.add(
                            x=landmark.x,
                            y=landmark.y,
                            z=landmark.z,
                            visibility=landmark.visibility
                        )


                    # =================================================
                    # ЛЕВАЯ НОГА
                    # =================================================

                    left_hip = pose[23]
                    left_knee = pose[25]
                    left_ankle = pose[27]


                    # =================================================
                    # ПРАВАЯ НОГА
                    # =================================================

                    right_hip = pose[24]
                    right_knee = pose[26]
                    right_ankle = pose[28]


                    # =================================================
                    # VISIBILITY
                    # =================================================

                    left_visibility = min(
                        left_hip.visibility,
                        left_knee.visibility,
                        left_ankle.visibility
                    )

                    right_visibility = min(
                        right_hip.visibility,
                        right_knee.visibility,
                        right_ankle.visibility
                    )


                    # =================================================
                    # ВЫБИРАЕМ ЛУЧШУЮ НОГУ
                    # =================================================

                    if left_visibility >= right_visibility:

                        hip = left_hip
                        knee = left_knee
                        ankle = left_ankle

                        best_visibility = left_visibility

                        selected_leg = "left"

                    else:

                        hip = right_hip
                        knee = right_knee
                        ankle = right_ankle

                        best_visibility = right_visibility

                        selected_leg = "right"


                    # =================================================
                    # ПРОВЕРКА VISIBILITY
                    # =================================================

                    if best_visibility < MIN_VISIBILITY:
                        continue


                    # =================================================
                    # КООРДИНАТЫ
                    # =================================================

                    height, width = frame.shape[:2]

                    a = normalize_landmark(
                        hip,
                        width,
                        height
                    )

                    b = normalize_landmark(
                        knee,
                        width,
                        height
                    )

                    c = normalize_landmark(
                        ankle,
                        width,
                        height
                    )


                    # =================================================
                    # УГОЛ КОЛЕНА
                    # =================================================

                    angle = calculate_angle(
                        a,
                        b,
                        c
                    )


                    # =================================================
                    # DEBUG
                    # =================================================

                    # Раскомментируй, если хочешь увидеть,
                    # почему tracker считает повторения неправильно.

                    # print(
                    #     f"frame={frame_index} "
                    #     f"angle={angle:.1f} "
                    #     f"leg={selected_leg} "
                    #     f"state={squat_tracker.state} "
                    #     f"min={squat_tracker.min_angle_this_rep:.1f} "
                    #     f"max={squat_tracker.max_angle_this_rep:.1f}"
                    # )


                    # =================================================
                    # TRACKER
                    # =================================================

                    verdict = squat_tracker.update(angle)


                    # ------------------------------------------------
                    # Если завершилось повторение
                    # ------------------------------------------------

                    if verdict is not None:

                        print(
                            f"REP #{squat_tracker.rep_count}: "
                            f"{verdict}, "
                            f"min angle = "
                            f"{squat_tracker.min_angle_this_rep:.1f}"
                        )


                    # =================================================
                    # ОТРИСОВКА
                    # =================================================

                    if show_video:

                        mp_drawing.draw_landmarks(
                            frame,
                            pose_landmarks_proto,
                            mp_pose.POSE_CONNECTIONS,

                            mp_drawing.DrawingSpec(
                                thickness=2,
                                circle_radius=3
                            ),

                            mp_drawing.DrawingSpec(
                                thickness=2
                            )
                        )


                        # ------------------------------------------------
                        # Показываем угол
                        # ------------------------------------------------

                        cv2.putText(
                            frame,
                            f"Angle: {angle:.1f}",
                            (30, 40),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1,
                            (0, 255, 0),
                            2
                        )


                        # ------------------------------------------------
                        # Показываем состояние
                        # ------------------------------------------------

                        cv2.putText(
                            frame,
                            f"State: {squat_tracker.state}",
                            (30, 80),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1,
                            (0, 255, 255),
                            2
                        )


                        # ------------------------------------------------
                        # Показываем количество повторений
                        # ------------------------------------------------

                        cv2.putText(
                            frame,
                            f"Reps: {squat_tracker.rep_count}",
                            (30, 120),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1,
                            (255, 0, 0),
                            2
                        )


            # ====================================================
            # ПОКАЗЫВАЕМ КАДР
            # ====================================================

            if show_video:

                cv2.imshow(
                    "Squat Analysis",
                    frame
                )

                if cv2.waitKey(1) & 0xFF == ord("q"):
                    break


    finally:

        cap.release()

        if show_video:
            cv2.destroyAllWindows()


    # ============================================================
    # ОТЧЁТ
    # ============================================================

    return squat_tracker.get_report()


# ================================================================
# ЗАПУСК
# ================================================================

if __name__ == "__main__":

    video_path = "C:/Users/avate/Desktop/plank.mp4"

    report = get_squat_video_report(
        video_path,
        show_video=True
    )

    print()
    print("================================")
    print("       ОТЧЁТ ПО ПРИСЕДАНИЯМ")
    print("================================")

    print(
        f"Всего повторений: "
        f"{report.get('total_reps', 0)}"
    )

    print()

    print("Оценка повторений:")

    for verdict_type, count in report.get(
        "verdict_counts",
        {}
    ).items():

        print(
            f"  {verdict_type}: {count}"
        )

    print()

    if report.get("avg_angle") is not None:

        print(
            f"Средний угол: "
            f"{report['avg_angle']:.1f}°"
        )

    if report.get("min_angle") is not None:

        print(
            f"Минимальный угол: "
            f"{report['min_angle']:.1f}°"
        )

    if report.get("max_angle") is not None:

        print(
            f"Максимальный угол: "
            f"{report['max_angle']:.1f}°"
        )

    print("================================")
