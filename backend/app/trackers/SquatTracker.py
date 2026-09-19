from collections import Counter

class SquatTracker:
    def __init__(self):
        self.state = "standing"          # текущая фаза
        self.min_angle_this_rep = 180    # минимальный угол за текущее повторение
        self.max_angle_this_rep = 0      # максимальный угол за текущее повторение
        self.rep_count = 0
        self.last_verdict = None
        self.rep_history = []  # список вердиктов по каждому повторению
        self.angle_history_per_rep = []  # список минимальных углов по каждому повторению
               
    def make_verdict(self, min_angle):
        if min_angle > 90:
            verdict = "Недостаточная глубина"
        elif 65 <= min_angle <= 90:
            verdict = "Глубина в норме"
        elif min_angle < 65:
            verdict = "Слишком глубокое"
        else:
            verdict = "unknown"
            
        self.rep_history.append(verdict)
        self.angle_history_per_rep.append(min_angle)
        
        return verdict
               
    def get_report(self):
        counts = Counter(self.rep_history) # конвертируем список вердиктов в объект Counter с подсчетом каждого типа
        return {
            "total_reps": self.rep_count,
            "verdict_counts": dict(counts), # конвертируем обратно в словарь для удобства отправки на фронтенд
            "avg_angle": sum(self.angle_history_per_rep) / len(self.angle_history_per_rep) if self.angle_history_per_rep else 0,
            "min_angle": min(self.angle_history_per_rep) if self.angle_history_per_rep else None,
            "max_angle": max(self.angle_history_per_rep) if self.angle_history_per_rep else None,
        }
        
    def update(self, angle):
        verdict = None 
        if self.state == "standing":
            if angle < 160:                     # начал приседать
                self.state = "descending"
                self.min_angle_this_rep = angle
                self.max_angle_this_rep = angle

        elif self.state == "descending":
            self.min_angle_this_rep = min(self.min_angle_this_rep, angle)
            self.max_angle_this_rep = max(self.max_angle_this_rep, angle)
            
            if angle > self.min_angle_this_rep + 5:  # угол начал расти = развернулся вверх
                self.state = "ascending"
       
        elif self.state == "ascending":
            self.max_angle_this_rep = max(self.max_angle_this_rep, angle)
            if angle >= 160:
                self.rep_count += 1
                
                verdict = self.make_verdict(self.min_angle_this_rep)
                self.last_verdict = verdict
                self.state = "standing"
        return verdict