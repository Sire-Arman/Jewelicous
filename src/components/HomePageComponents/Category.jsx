import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../constant";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { Link } from "react-router-dom";
import styles from "../../pages/Home/Home.module.css";

function Category({ openingCategory, setOpeningCategory }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/category/all-unhide`);
        setCategories(response.data);
      } catch (error) {
        navigate("/error");
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Manually start Swiper autoplay after categories are loaded
    if (
      categories.length > 0 &&
      document.querySelector(".swiper-container-initialized")
    ) {
      document
        .querySelector(".swiper-container-initialized")
        .swiper.autoplay.start();
    }
  }, [categories]);

  return (
    <div className="bg-[silver] mt-4 p-4">
      <h2 className="text-center text-3xl font-bold italic mb-3 ">Category</h2>
      {categories.length > 0 ? (
        <Swiper
          effect={"coverflow"}
          spaceBetween={20}
          slidesPerView={"auto"}
          centeredSlides={true}
          initialSlide={3}
          loop={false}
          modules={[Autoplay, Pagination, Navigation]}
          grabCursor
          coverflowEffect={{
            rotate: 0,
            stretch: 15,
            depth: 100,
            modifier: 1.2,
            slideShadows: false,
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          breakpoints={{
            420: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
        >
          {categories.map((category, index) => (
            <SwiperSlide
              key={index}
              className="cat-container flex flex-col items-center  mb-5"
            >
              <div className="category-box relative w-full min-w-[230px] h-[200px] overflow-hidden rounded-lg">
                <Link
                  to={`/shop?category=${category.categoryId}`}
                  onClick={() => setOpeningCategory(category.categoryId)}
                >
                  <img
                    src={category.categoryImage}
                    alt={category.categoryName}
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
              {/* Category name below the image, with larger font for the active category */}
              <p
                className={`text-center mt-2 ${
                  index === activeIndex
                    ? "text-xl font-bold text-black"
                    : "text-sm font-semibold text-gray-800"
                }`}
              >
                {category.categoryName}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>Loading categories...</p>
      )}
    </div>
  );
}

export default Category;
