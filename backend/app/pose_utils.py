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

def normalize_landmark(landmark,width,height):
    return (landmark.x * width, landmark.y * height)