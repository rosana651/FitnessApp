import numpy as np

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
        landmark.z * width  # z масштабируем относительно ширины (стандартная практика)
    )