import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

const tips = [
  {
    id: 1,
    title: "Control your movement",
    message:
      "Perform exercises slowly and control every phase of the movement. This helps you maintain proper technique.",
  },
  {
    id: 2,
    title: "Keep your back straight",
    message:
      "During squats and push-ups, try to maintain a natural back position and avoid excessive arching.",
  },
  {
    id: 3,
    title: "Don't forget to warm up",
    message:
      "Spend a few minutes warming up before your workout. This helps prepare your muscles and joints for exercise.",
  },
  {
    id: 4,
    title: "Use a full range of motion",
    message:
      "Try to perform each exercise with a proper range of motion that matches your fitness level and physical condition.",
  },
  {
    id: 5,
    title: "Don't rush",
    message:
      "The number of repetitions should not be more important than quality. It is better to do fewer repetitions with proper technique.",
  },
  {
    id: 6,
    title: "Watch your knees",
    message:
      "During squats, control the position of your knees and try to prevent them from collapsing inward.",
  },
  {
    id: 7,
    title: "Keep your body stable",
    message:
      "When performing a plank, try to keep your body in a straight line and avoid raising your hips too high.",
  },
  {
    id: 8,
    title: "Control your breathing",
    message:
      "Don't hold your breath during exercise. Try to maintain a calm and steady breathing rhythm.",
  },
  {
    id: 9,
    title: "Record videos from the side",
    message:
      "For better technique analysis, try recording your exercise from a suitable angle where your entire body is clearly visible.",
  },
  {
    id: 10,
    title: "Listen to your body",
    message:
      "If you experience sharp pain or significant discomfort during an exercise, stop and don't try to push through the pain.",
  },
];


export default function TipsSlider() {
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        spaceBetween={20}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="auth-tips"
      >
        {tips.map((tip) => (
          <SwiperSlide key={tip.id}>
            <div className="min-h-40 rounded-2xl border border-white/15 bg-white/2 p-6">
              
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/15 text-sm font-semibold text-purple-300">
                  {tip.id}
                </div>

                <p className="text-sm font-medium text-white">
                  {tip.title}
                </p>
              </div>

              <p className="text-[16px] leading-7 text-slate-300">
                {tip.message}
              </p>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}