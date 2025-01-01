import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../constant";
import axios from "axios";
import { FaStar } from "react-icons/fa";

import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Link, useNavigate } from "react-router-dom";

function TopSellers({ title, productCategory }) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [purities, setPurities] = useState([]);
  const [adminGoldDiscount, setAdminGoldDiscount] = useState(0);
  const [adminDiamondDiscount, setAdminDiamondDiscount] = useState(0);
  const [adminMakingChargeDiscount, setAdminMakingChargeDiscount] = useState(0);
  const [adminSolitaireDiscount, setAdminSolitaireDiscount] = useState(0);
  const [adminStoneDiscount, setAdminStoneDiscount] = useState(0);
  const [adminMakingCharges, setAdminMakingCharges] = useState(0);
  const [ratingsData, setRatingsData] = useState({});

  const fetchAdminDiscounts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/discounts/get-discounts`);
      const data = response.data;

      if (data.goldDiscount) {
        setAdminGoldDiscount(data.goldDiscount);
      }
      if (data.diamondDiscount) {
        setAdminDiamondDiscount(data.diamondDiscount);
      }
      if (data.makingChargesDiscount) {
        setAdminMakingChargeDiscount(data.makingChargesDiscount);
      }
      if (data.solitaireDiscount) {
        setAdminSolitaireDiscount(data.solitaireDiscount);
      }
      if (data.stoneDiscount) {
        setAdminStoneDiscount(data.stoneDiscount);
      }
      if (data.makingCharges) {
        setAdminMakingCharges(data.makingCharges);
      }
    } catch (error) {
      console.error("Error found in fetching admin discounts", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products/top-seller`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (title == "Top Sellers") {
      fetchProducts();
    }
    fetchAdminDiscounts();
  }, []);

  useEffect(() => {
    const fetchCategoryWiseProducts = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `${BASE_URL}/products/filter?userId=${userId}&category=${productCategory}&pageSize=20`
        );
        setProducts(response.data.content);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (title == "Related Products") fetchCategoryWiseProducts();
  }, [productCategory]);

  useEffect(() => {
    const fetchPurities = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/purity/get-all`);
        const data =
          response.data && Array.isArray(response.data) ? response.data : [];
        setPurities(data);
      } catch (error) {
        console.error("Error fetching purities:", error);
      }
    };
    fetchPurities();
  }, []);

  useEffect(() => {
    products.forEach((product) => fetchReviews(product.productId));
  }, [products]);

  const fetchReviews = async (productId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-ratings/product/${productId}`
      );
      const reviews = response.data;

      const totalRatings = reviews.reduce(
        (acc, review) => acc + Number(review.ratings),
        0
      );
      const countRatings = reviews.length;

      // Update the ratingsData state
      setRatingsData((prevData) => ({
        ...prevData,
        [productId]: {
          sum: totalRatings,
          count: countRatings,
          average: countRatings ? (totalRatings / countRatings).toFixed(1) : 0,
        },
      }));
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const swiperInstance = document.querySelector(".swiper-container").swiper;
      if (swiperInstance) swiperInstance.autoplay.start();
    }, 200);
  }, []);

  const goldPurity = purities.find((purity) => purity.name === "14K") || {};
  const diamondPurity =
    purities.find((purity) => purity.name === "IJ VS SI") || {};
  const rubyPurity = purities.find((purity) => purity.name === "1 carat") || {};
  const solitairePurity =
    purities.find((purity) => purity.name === "1 ct") || {};

  return (
    <div className="bg-[#F6F6F6]">
      <h2 className="text-center text-[40px] font-bold italic mb-2 pt-4">
        {title}
      </h2>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        className="swiper-container mt-4 pt-2 h-[500px] "
        initialSlide={3}
        slidesPerView={1}
        centeredSlides={true}
        grabCursor
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => {
          swiper.autoplay.start();
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        breakpoints={{
          300: {
            slidesPerView: 2,
            spaceBetween: 60,
            centeredSlides: "false",
          },
          400: {
            slidesPerView: 3,
            spaceBetween: 60,
          },
          640: {
            slidesPerView: 4,
            spaceBetween: 60,
          },
          768: {
            slidesPerView: 5,
            spaceBetween: 60,
          },

          1024: {
            slidesPerView: 6,
            spaceBetween: 70,
          },
        }}
      >
        {products?.map((product, index) => {
          const ratingsInfo = ratingsData[product.productId] || {
            sum: 0,
            count: 0,
            average: 0,
          };
          const goldPricePerGram = product.goldWeight ? goldPurity?.price : 0;
          const diamondPrice = product.stoneWeight ? diamondPurity?.price : 0;

          const rubyPrice = product.rubyWeight ? rubyPurity.price : 0;
          const solitairePrice = product.solitaireWeight
            ? solitairePurity.price
            : 0;

          const additionaldiscount = product?.discount || 0;
          const gstPercentage = product?.gst || 3;
          const goldWeight = product?.goldWeight || 0;
          const stoneWeight = product?.stoneWeight || 0;
          const makingCharges = adminMakingCharges * goldWeight;

          const goldDiscount = adminGoldDiscount || 0;
          const diamondDiscount = adminDiamondDiscount || 10;
          const makingChargesDiscount = adminMakingChargeDiscount || 25;
          const solitaireDiscount = adminSolitaireDiscount;
          const stoneDiscount = adminStoneDiscount;

          const goldValue = goldPricePerGram * goldWeight;
          const stoneValue = diamondPrice ? diamondPrice * stoneWeight : 0;
          const rubyValue = rubyPrice * product.rubyWeight;
          const solitaireValue = solitairePrice * product.solitaireWeight;

          const discountedGoldValue = (goldDiscount / 100) * goldValue;
          const discountedDiamondValue = (diamondDiscount / 100) * stoneValue;
          const discountedMakingCharges =
            (makingChargesDiscount / 100) * makingCharges;
          const discountedSolitaireValue =
            (solitaireDiscount / 100) * solitaireValue;
          const discountedStoneValue = (stoneDiscount / 100) * rubyValue;

          const finalGoldValue = goldValue - discountedGoldValue;
          const finalDiamondValue = stoneValue - discountedDiamondValue;
          const finalMakingCharges = makingCharges - discountedMakingCharges;
          const finalSolitaireValue = solitaireValue - discountedSolitaireValue;
          const finalStoneValue = rubyValue - discountedStoneValue;

          const basePrice =
            goldValue + stoneValue + rubyValue + solitaireValue + makingCharges;
          const discountedBasePrice =
            finalGoldValue +
            finalDiamondValue +
            finalMakingCharges +
            finalStoneValue +
            finalSolitaireValue;

          const discountAmount =
            (additionaldiscount / 100) * discountedBasePrice;

          const finalDiscountedPrice = discountedBasePrice - discountAmount;

          const gstAmount = (gstPercentage / 100) * finalDiscountedPrice;

          const calculatedMrp = basePrice + (gstPercentage / 100) * basePrice;

          const calculatedPrice = finalDiscountedPrice + gstAmount;

          // console.log("kjhgvffrg", adminMakingCharges);

          return (
            <SwiperSlide
              key={index}
              style={{
                transform: index === activeIndex ? "scale(1.5)" : "scale(0.9)",
                paddingTop: index === activeIndex ? "20px" : "",
                transformOrigin: "center",
                transition: "transform 0.5s ease ",
                cursor: "pointer",
              }}
              className={`h-[480px] w-[300px] ${
                index === activeIndex ? "top-seller-slider" : ""
              }`}
              onClick={() => {
                navigate(`/productdetails/${product.productId}`);
              }}
            >
              <img
                src={product.productPhotos[0]?.photoName}
                className={`mt-16 rounded-[10px] mx-auto ${
                  index === activeIndex
                    ? "h-[180px] w-[280px]"
                    : "h-[180px] w-[280px]"
                }`}
              />
              {index === activeIndex && (
                <div className="flex flex-col gap-2">
                  <p className="text-center font-semibold mb-3 mt-2 line-clamp-1 text-[13px]">
                    {product.productName}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col ml-2">
                      <span className="font-light text-[9px] line-through leading-[9px]">
                        Rs {calculatedMrp.toFixed(2)}
                      </span>
                      <span className="text-[12px] leading-[12px]">
                        Rs {calculatedPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <FaStar color="#FDB022" />
                      <span className="text-[10px]">{ratingsInfo.sum}</span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/productdetails/${product.productId}`)
                    }
                    className="shinningbutton bg-[#5D0B86] text-white text-[10px] font-semibold rounded-[6px] px-2 py-[6px]"
                  >
                    <Link to={""}>SHOP NOW</Link>
                  </button>
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default TopSellers;
