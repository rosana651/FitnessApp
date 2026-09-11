
class PlankTracker:
    def __init__(self):
        self.hips_too_high_ms = 0
        self.hips_sagging_ms = 0
        self.good_form_ms = 0
        self.prev_timestamp = None
    
    def update(self, timestamp, angle):
        if self.prev_timestamp is None:
            self.prev_timestamp = timestamp
            return
        
        if angle > 175:
            self.hips_too_high_ms += timestamp - self.prev_timestamp
        elif angle < 160:
            self.hips_sagging_ms += timestamp - self.prev_timestamp
        else:
            self.good_form_ms += timestamp - self.prev_timestamp
        
        self.prev_timestamp = timestamp
    
    def get_report(self):
        total_ms = self.good_form_ms + self.hips_sagging_ms + self.hips_too_high_ms
        return {
            "total_seconds": total_ms / 1000,
            "good_form_seconds": self.good_form_ms / 1000,
            "hips_sagging_seconds": self.hips_sagging_ms / 1000,
            "hips_too_high_seconds": self.hips_too_high_ms / 1000,
        }