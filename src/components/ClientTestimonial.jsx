import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Testimonial Data
const testimonials = [
  {
    img: "src/assets/image/c3.jpg",
    title: "Limitless Learning",
    text: "Consectetur adipisicing Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    name: "Jack Willson",
  },
  {
    img: "src/assets/image/c1.jpg",
    title: "World's Best Courses",
    text: "Consectetur adipisicing Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    name: "Nike Samson",
  },
  {
    img: "src/assets/image/c2.jpg",
    title: "Popular Courses",
    text: "Consectetur adipisicing Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    name: "Milky Deo",
  },
];

 function ClientTestimonial() {
  return (
    <section id="client" className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          What Our Students Say
        </h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="w-full max-w-3xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img
                  src={testimonial.img}
                  alt="testimonial"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h6 className="text-xl font-semibold text-gray-800">
                  {testimonial.title}
                </h6>
                <p className="text-gray-600 mt-2">{testimonial.text}</p>
                <h4 className="text-lg font-medium text-gray-900 mt-4">
                  {testimonial.name}
                </h4>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
export default ClientTestimonial
