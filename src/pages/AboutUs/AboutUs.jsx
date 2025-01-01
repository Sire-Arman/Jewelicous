import React from "react";
import HeroSection from "../../components/AboutUsPageComponents/HeroSection";
import WhyWeAreBest from "../../components/AboutUsPageComponents/WhyWeAreBest";
import customer from "../../assets/Images/user-icon.webp";
import Features from "../../components/AboutUsPageComponents/Features";
import border from "../../assets/Images/border.png";
import styles from "../../components/AboutUsPageComponents/style.module.css";
import OurVision from "../../components/AboutUsPageComponents/OurVision";
import CoreValues from "../../components/AboutUsPageComponents/CoreValues";
import MeetOurFamily from "../../components/AboutUsPageComponents/MeetOurFamily";

import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import img1 from "../../assets/Images/img1.jpeg";
import img2 from "../../assets/Images/img2.jpeg";
import img3 from "../../assets/Images/img3.jpeg";
import img4 from "../../assets/Images/img4.jpeg";
import img5 from "../../assets/Images/img5.jpeg";
import img6 from "../../assets/Images/img6.jpeg";
import img7 from "../../assets/Images/img7.jpeg";
import img8 from "../../assets/Images/img8.jpeg";
import img9 from "../../assets/Images/img9.jpeg";
import img10 from "../../assets/Images/img10.jpeg";
import img11 from "../../assets/Images/img11.jpeg";
import img12 from "../../assets/Images/img12.jpeg";
import img13 from "../../assets/Images/img13.jpeg";
import img14 from "../../assets/Images/img14.jpeg";
import img15 from "../../assets/Images/img15.jpeg";
import img16 from "../../assets/Images/img16.jpeg";
import img17 from "../../assets/Images/img17.jpeg";
import img18 from "../../assets/Images/img18.jpeg";
import img19 from "../../assets/Images/img19.jpeg";
import img20 from "../../assets/Images/img20.jpg"

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "./style.css";

const reviews = [
  {
    name: "Roma",
    img: img8,
    content:
      "I absolutely love my new ring! The craftsmanship is impeccable and it's become my everyday go-to accessory. It's both elegant and comfortable to wear.",
  },
  {
    name: "Pooja Khanna",
    img: img5,
    content:
      "I was searching for a pair of earrings that would add a touch of glamor to my outfit and these were perfect! They're so versatile and can be dressed up or down.",
  },
  {
    name: "Kanika",
    img: img2,
    content:
      "My mangalsutra is more than just jewelry; it's a symbol of my marriage. I love the intricate design and the quality of the gold. It's a piece I cherish.",
  },
  {
    name: "Pooja",
    img: img7,
    content:
      "I've been wearing these bangles almost every day. They're so comfortable and add a bohemian vibe to my outfits. I've received so many compliments on them!",
  },
  {
    name: "Sakshi",
    img: img3,
    content:
      "I've always wanted a nose pin and finally took the plunge. I'm so happy with my choice! It's delicate and adds a unique touch to my face.",
  },
  {
    name: "Ankita",
    img: img10,
    content:
      "This pendant is the perfect statement piece. It's so eye-catching and goes with everything. I've gotten so many compliments on it.",
  },
  {
    name: "Nidhi Bahri",
    img: img13,
    content:
      "I was looking for a necklace that I could wear every day and this one is perfect. It's simple yet elegant and I love the way it complements my outfits.",
  },
  {
    name: "Dharambir Jaiswal",
    img: img6,
    content:
      "I've been wearing my ring and bracelet combo almost every day. They're both stylish and comfortable. They've become a staple in my wardrobe.",
  },
  {
    name: "Mamta Grover",
    img: img1,
    content:
      "This set is perfect for any occasion. The pendant earrings and ring complement each other beautifully and make me feel confident and beautiful.",
  },
  {
    name: "Madhu",
    img: img4,
    content:
      "This jewelry set stole my heart. Every piece is so stunning that I'm having a hard time choosing. Especially the pendant it touches my heart.",
  },
  {
    name: "Laxmi",
    img: img9,
    content:
      "I was looking for a pair of delicate studs that I could wear every day, and these are perfect! They are light, comfortable, and subtly elegant.",
  },
  {
    name: "Ashoka",
    img: img14,
    content:
      "I purchased a bracelet for my wife, and she absolutely loves it. The design is modern yet traditional, and the craftsmanship is truly impressive.",
  },
  {
    name: "Gauri",
    img: img17,
    content:
      "These earrings are absolutely stunning. I love how they catch the light and add a touch of sparkle to any outfit. They're my new favorite accessory!",
  },
  {
    name: "Riya Talreja",
    img: img16,
    content:
      "I bought a beautiful anklet from here, and it's the perfect blend of elegance and simplicity. I get so many compliments every time I wear it.",
  },
  {
    name: "Dixita Rathod",
    img: img15,
    content:
      "This necklace has become a daily staple for me. It’s understated, classy, and adds the perfect touch to both my work and casual outfits.",
  },
  {
    name: "Sunita Vijan",
    img: img18,
    content:
      "The bangle set I bought is simply gorgeous. The intricate design and high quality make it one of the best pieces in my collection.",
  },
  {
    name: "Samaria",
    img: img19,
    content:
      "I love my new ring. It’s simple, elegant, and exactly what I was looking for. The design is timeless and I can see myself wearing it for years.",
  },
  {
    name: "Seema",
    img: img12,
    content:
      "The earrings I bought are absolutely perfect for formal events. They’re bold yet refined, and the craftsmanship is top-notch.",
  },
  {
    name: "Manisha",
    img: img11,
    content:
      "I purchased a nose pin, and it's even more beautiful in person. The design is unique and adds the perfect touch to my look.",
  },
  {
    name: "Kirti Rai",
    img: img20,
    content:
      "I purchased a chain recently, and it's exactly what I was looking for. The design is sleek and masculine, perfect for everyday wear. I’ve received several compliments on it already."
  }
  
];


function AboutUs() {
  return (
    <div>
      <HeroSection />
      <OurVision />
      <CoreValues />
      <MeetOurFamily />
      <ReviewsBox />
    </div>
  );
}

function ReviewsBox() {
  return (
    <div className="pt-8 mt-5 bg-[#F6F6F6] mb-5 pb-8">
      <h1
        className="sm:text-[35px] text-[24px] font-bold text-center  "
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        Customer Stories
      </h1>
      <img
        src={border}
        alt="img"
        id={styles.border}
        style={{ margin: "auto" }}
        loading="lazy"
      />
      <Swiper
        effect={"coverflow"}
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
        slidesPerView={"auto"}
        loop={true}
        grabCursor
        style={{
          "--swiper-navigation-color": "white",
          "--swiper-navigation-size": "40px",
          "--swiper-pagination-color": "white",
          "--swiper-pagination-bullet-size": "11px",
        }}
        autoplay={{
          delay: 2500,
        }}
        initialSlide={1}
        centeredSlides={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 15,
          depth: 100,
          modifier: 1.2,
          slideShadows: false,
        }}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index} className="reviewslide">
            <div className="customer-story-box d-flex align-items-center  gap-3">
              <div
                className="customer-img"
                style={{ width: "500px", height: "200px" }}
              >
                <img
                  style={{ width: "100%", height: "100%", borderRadius: "5px" }}
                  src={review.img || customer}
                  className="reviewslide_image"
                />
              </div>
              <div>
                <h3 style={{ fontWeight: "bold" }}>{review.name}</h3>
                <p style={{ paddingTop: "20px" }}>{review.content}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default AboutUs;
