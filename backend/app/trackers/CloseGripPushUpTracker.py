from collections import Counter

class PushUpTracker:
    def __init__(self):
        self.state = "up"               
        self.min_angle_this_rep = 180    
        self.max_angle_this_rep = 0     
        self.rep_count = 0
        self.last_verdict = None
        self.rep_history = []
        self.angle_history_per_rep = []

    def update(self, angle):
        verdict = None

        if self.state == "up":
            if angle < 160:
                self.state = "descending"
                self.min_angle_this_rep = angle
                self.max_angle_this_rep = angle

        elif self.state == "descending":
            self.min_angle_this_rep = min(self.min_angle_this_rep, angle)
            self.max_angle_this_rep = max(self.max_angle_this_rep, angle)
            if angle > self.min_angle_this_rep + 5:
                self.state = "ascending"

        elif self.state == "ascending":
            self.max_angle_this_rep = max(self.max_angle_this_rep, angle)
            if angle < self.max_angle_this_rep - 5:
                self.rep_count += 1
                verdict = self.make_verdict(self.min_angle_this_rep)
                self.last_verdict = verdict
                self.state = "up"

        return verdict

    def make_verdict(self, min_angle):
        if min_angle > 90:
            verdict = "too_shallow"
        elif 70 <= min_angle <= 90:
            verdict = "good_depth"
        else:
            verdict = "too_deep"

        self.rep_history.append(verdict)
        self.angle_history_per_rep.append(min_angle)
        return verdict

    def get_report(self):
        counts = Counter(self.rep_history)
        return {
            "total_reps": self.rep_count,
            "verdict_counts": dict(counts),
            "avg_angle": sum(self.angle_history_per_rep) / len(self.angle_history_per_rep) if self.angle_history_per_rep else 0,
            "min_angle": min(self.angle_history_per_rep) if self.angle_history_per_rep else None,
            "max_angle": max(self.angle_history_per_rep) if self.angle_history_per_rep else None,
        }