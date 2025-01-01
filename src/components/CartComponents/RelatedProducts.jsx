import React, { useRef, useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { BASE_URL } from "../../../constant";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
const size = 20;
function RelatedProducts() {
  const navigate = useNavigate();
  const relatedProductsRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [purities, setPurities] = useState([]);
  const [ratingsData, setRatingsData] = useState({});
  const [adminGoldDiscount, setAdminGoldDiscount] = useState(0);
  const [adminDiamondDiscount, setAdminDiamondDiscount] = useState(0);
  const [adminMakingChargeDiscount, setAdminMakingChargeDiscount] = useState(0);
  const [adminSolitaireDiscount, setAdminSolitaireDiscount] = useState(0);
  const [adminStoneDiscount, setAdminStoneDiscount] = useState(0);
  const [adminMakingCharges, setAdminMakingCharges] = useState(0);

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
      // navigate("/error")
      console.error("Error found in fetching admin discounts", error);
    }
  };

  useEffect(() => {
    fetchAdminDiscounts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/products/get-limited-products?size=${size}`
        );

        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

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

  const goldPurity = purities.find((purity) => purity.name === "14K") || {};
  const diamondPurity =
    purities.find((purity) => purity.name === "IJ VS SI") || {};
  const rubyPurity = purities.find((purity) => purity.name === "1 carat") || {};
  const solitairePurity =
    purities.find((purity) => purity.name === "1 ct") || {};

  return (
    <div className="bg-[#f9f3f1] mb-12" ref={relatedProductsRef}>
      <h2 className="text-center text-[40px] font-bold italic mb-2 mt-5">
        Related Products
      </h2>
      <Swiper
        modules={[Autoplay]}
        initialSlide={3}
        slidesPerView={1}
        className="h-[500px] mt-3"
        centeredSlides={true}
        grabCursor
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        autoplay={{
          delay: 800,
          disableOnInteraction: false,
        }}
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
            spaceBetween: 50,
          },
        }}
      >
        {products?.slice(0, 20).map((product, index) => {
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
          const goldWeight = product?.goldWeight || 0;
          const stoneWeight = product?.stoneWeight || 0;
          const makingCharges = adminMakingCharges * goldWeight || 0;
          const additionaldiscount = product?.discount || 0;
          const gstPercentage = product?.gst || 3;

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
          const discountedStoneDiscount = (stoneDiscount / 100) * rubyValue;

          const finalGoldValue = goldValue - discountedGoldValue;
          const finalDiamondValue = stoneValue - discountedDiamondValue;
          const finalMakingCharges = makingCharges - discountedMakingCharges;
          const finalSolitaireValue = solitaireValue - discountedSolitaireValue;
          const finalRubyValue = rubyValue - discountedStoneDiscount;

          const basePrice =
            goldValue + stoneValue + rubyValue + solitaireValue + makingCharges;
          const discountedBasePrice =
            finalGoldValue +
            finalDiamondValue +
            finalMakingCharges +
            finalRubyValue +
            finalSolitaireValue;

          const discountAmount =
            (additionaldiscount / 100) * discountedBasePrice;

          const finalDiscountedPrice = discountedBasePrice - discountAmount;

          const gstAmount = (gstPercentage / 100) * finalDiscountedPrice;

          const calculatedMrp = basePrice + (gstPercentage / 100) * basePrice;

          const calculatedPrice = finalDiscountedPrice + gstAmount;

          return (
            <SwiperSlide
              key={index}
              onClick={() => navigate(`/productdetails/${product.productId}`)}
              style={{
                transform: index === activeIndex ? "scale(1.5)" : "scale(0.9)",
                paddingTop: index === activeIndex ? "20px" : "",
                transformOrigin: "center",
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              className={`h-[480px] w-[300px] ${
                index === activeIndex ? "top-seller-slider" : ""
              }`}
            >
              <img
                src={product.productPhotos[0]?.photoName}
                className={`mt-16 rounded-[10px] mx-auto ${
                  index === activeIndex
                    ? "h-[180px] w-[280px] "
                    : "h-[150px] w-[220px] "
                }`}
              />
              {/* <p className="text-center mb-6 font-semibold ">{category.name}</p> */}
              {index === activeIndex && (
                <div className="flex flex-col gap-2">
                  <p className="text-center font-semibold mb-3 line-clamp-1 text-[13px]">
                    {product.productName}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col ml-2">
                      <span className="font-light text-[9px] line-through mr-2 leading-[9px]">
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
                  <button className="bg-[#5D0B86] text-white text-[10px] font-semibold rounded-[6px] px-2 py-[6px]">
                    SHOP NOW
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

export default RelatedProducts;
