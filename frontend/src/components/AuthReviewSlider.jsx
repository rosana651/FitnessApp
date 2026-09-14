import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'


const testimonials = [ 
    { 
        id: 1, 
        message: "The app works quickly and is easy to use. You can upload a video and get the analysis without complicated steps.", 
        author: "Alex Morgan", 
    }, 
    { 
        id: 2,
         message: "It helps me evaluate my exercise technique and notice mistakes that I might not pay attention to during a workout.", 
        author: "Daniel Carter", 
    }, 
    { 
        id: 3, 
        message: 
        "The analysis is useful for getting a general idea of how well an exercise is performed, although it does not replace a professional trainer.",
         author: "Michael Turner", 
    }, 
    { 
        id: 4, 
        message: "The app is convenient for quickly checking a workout video and getting feedback on the exercise technique.", 
        author: "Ethan Brooks", 
    }, 
    { 
        id: 5, 
        message: "It is a useful tool for self-assessment. It can help identify possible technique issues, but a trainer is still important for more detailed guidance.", 
        author: "Ryan Mitchell", 
    }, 
];

const AuthReviewSlider = () => {
  return (
    <div className="mt-10 max-w-md">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={20}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="auth-testimonials"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 ">

              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/15 text-sm font-semibold text-purple-300">
                  {testimonial.author.charAt(0)}
                </div>

                <p className="text-sm font-medium text-white">
                  {testimonial.author}
                </p>
              </div>

              <p className="text-[16px] leading-7 text-slate-300">
                "{testimonial.message}"
              </p>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default AuthReviewSlider
