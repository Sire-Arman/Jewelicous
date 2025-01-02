import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../constant";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart, FaRegHeart, FaRegStar, FaStar } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { useCartContext } from "../../Context/CartContext";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import styles from "./Dealoftheday.module.css";

function Dealoftheday({
  title,
  cartItems,
  setCartItems,
  wishlistItems,
  setWishlistItems,
}) {
  const navigate = useNavigate("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [purities, setPurities] = useState([]);
  const { cartCount, fetchCartCount } = useCartContext();
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
        setAdminGoldDiscount(data.goldDiscount || 0);
      }
      if (data.diamondDiscount) {
        setAdminDiamondDiscount(data.diamondDiscount || 0);
      }
      if (data.makingChargesDiscount) {
        setAdminMakingChargeDiscount(data.makingChargesDiscount || 0);
      }
      if (data.solitaireDiscount) {
        setAdminSolitaireDiscount(data.solitaireDiscount || 0);
      }
      if (data.stoneDiscount) {
        setAdminStoneDiscount(data.stoneDiscount) || 0;
      }
      if (data.makingCharges) {
        setAdminMakingCharges(data.makingCharges || 0);
      }
    } catch (error) {
      console.error("Error found in fetching admin discounts", error);
    }
  };

  const handleAddToWishlist = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const wishlistResponse = await fetch(
          `${BASE_URL}/wishlist/add/${userId}`,
          {
            method: "POST",
            headers: {
              contentType: "application/json",
            },
            body: productId,
          }
        );
        setWishlistItems((prevWishlist) => [...prevWishlist, { productId }]);
        toast.success("Product added to wishlist");
        fetchWishlistItems();
      } catch (error) {
        console.error("Error adding product to wishlist:", error);
        toast.error("Something went wrong! Try again later");
      }
    } else {
      navigate("/sign-in");
    }
  };

  const removeWishlistItem = async (productId) => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.delete(
        `${BASE_URL}/wishlist/delete/${userId}/${productId}`
      );
      setWishlistItems((prevWishlist) =>
        prevWishlist.filter((item) => item.productId !== productId)
      );
      toast.error("Product removed from wishlist");
      fetchWishlistItems();
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      toast.error("Something went wrong! Try again later");
    }
  };

  const fetchWishlistItems = async () => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      try {
        const response = await axios.get(`${BASE_URL}/wishlist/get/${userId}`);

        setWishlistItems(response.data || []);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setWishlistItems([]);
        } else {
          console.error("Error fetching wishlist items:", error);
          setWishlistItems([]);
        }
      }
    } else {
      setWishlistItems([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCartItems();
    fetchWishlistItems();
    fetchCartCount();
    fetchAdminDiscounts();
  }, []);

  const fetchProducts = async () => {
    let section;
    if (title == "Deals Of the day") {
      section = "deal-of-day-products";
    } else if (title == "New Designs") {
      section = "just-arrived-products";
    }

    try {
      const response = await axios.get(`${BASE_URL}/products/${section}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const fetchCartItems = async () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const response = await axios.post(
          `${BASE_URL}/usercart/in-cart?userId=${userId}&pageSize=100`
        );
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    }
  };

  const handleAddToCart = async (productId) => {
    navigate(`/productdetails/${productId}`);
  };

  useEffect(() => {
    products.forEach((product) => fetchReviews(product.productId));
  }, [products]);

  const fetchReviews = async (productId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-ratings/product/${productId}`
      );

      const reviews =
        response.data && Array.isArray(response.data) ? response.data : [];

      if (reviews.length === 0) {
        setRatingsData((prevData) => ({
          ...prevData,
          [productId]: {
            sum: 0,
            count: 0,
            average: 0,
          },
        }));
        return;
      }

      const totalRatings = reviews.reduce(
        (acc, review) => acc + Number(review.ratings),
        0
      );
      const countRatings = reviews.length;

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

      setRatingsData((prevData) => ({
        ...prevData,
        [productId]: {
          sum: 0,
          count: 0,
          average: 0,
        },
      }));
    }
  };

  useEffect(() => {
    const fetchPurities = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/purity/get-all`);
        setPurities(response.data || []);
      } catch (error) {
        console.error("Error fetching purities:", error);
      }
    };
    fetchPurities();
  }, []);

  const goldPurity = purities.find((purity) => purity.name === "14K") || {};
  const diamondPurity =
    purities.find((purity) => purity.name === "IJ VS SI") || {};
  const rubyPurity = purities.find((purity) => purity.name === "1 carat") || {};
  const solitairePurity =
    purities.find((purity) => purity.name === "1 ct") || {};

  return (
    <div className={styles.swipercontainer}>
      <h2 className="text-center text-[32px] font-bold italic mb-4 mt-3">
        {title}
      </h2>
      <Swiper
        className={styles.swiper}
        effect={"coverflow"}
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
        slidesPerView={"auto"}
        grabCursor
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        style={{
          "--swiper-navigation-color": "white",
          "--swiper-navigation-size": "40px",
          "--swiper-pagination-color": "white",
          "--swiper-pagination-bullet-size": "11px",
        }}
        initialSlide={2}
        centeredSlides={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 15,
          depth: 100,
          modifier: 1.2,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
      >
        {products.map((product, index) => {
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

          return (
            <SwiperSlide
              className={styles.swiperslide}
              key={index}
              onClick={() => navigate(`/productdetails/${product.productId}`)}
            >
              <img
                src={product.productPhotos[0]?.photoName}
                style={{ width: "100%" }}
                className={`${styles.imagehoverscale} rounded-[20px] `}
              />
              <p
                className="font-semibold mt-1 ml-1 text-[25px] line-clamp-1"
                onClick={() => navigate(`/productdetails/${product.productId}`)}
                style={{ cursor: "pointer" }}
              >
                {product.productName}
              </p>
              <div className="flex flex-col gap-2 mt-3">
                <span className="font-light text-[20px] line-through">
                  Rs {calculatedMrp.toFixed(2)}
                </span>
                <span className="text-[23px] ">
                  Rs {calculatedPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-1 items-center sm:mt-14 mt-6">
                {[...Array(5)].map((star, i) =>
                  i < ratingsInfo.average ? (
                    <FaStar key={i} color="#FDB022" size={23} />
                  ) : (
                    <FaRegStar key={i} color="#FDB022" size={23} />
                  )
                )}
                <span className="text-[#4E4E4E] text-[20px]">
                  ({ratingsInfo.sum})
                </span>
              </div>

              <div className="flex gap-1 mt-2">
                <button
                  onClick={() =>
                    navigate(`/productdetails/${product.productId}`)
                  }
                  className="shinningbutton mt-1 text-[20px] py-[18px] rounded-[11px] flex-grow"
                  style={{
                    backgroundColor: "var(--addToCartBgColor)",
                    color: "var(--addToCartTextColor)",
                  }}
                >
                  Shop Now
                </button>
                {wishlistItems.some(
                  (item) => item.productId === product.productId
                ) ? (
                  <button
                    className="add-to-wishlist "
                    style={{
                      backgroundColor: "var(--wishlistButtonBgColor)",
                      paddingInline: "45px",
                      borderRadius: "11px",
                      marginTop: "4px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeWishlistItem(product.productId);
                    }}
                  >
                    <FaHeart size={30} style={{ color: "red" }} />
                  </button>
                ) : (
                  <button
                    className="add-to-wishlist"
                    style={{
                      backgroundColor: "var(--wishlistButtonBgColor)",
                      paddingInline: "45px",
                      borderRadius: "11px",
                      marginTop: "4px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWishlist(product.productId);
                    }}
                  >
                    <FaRegHeart size={30} />
                  </button>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default Dealoftheday;
