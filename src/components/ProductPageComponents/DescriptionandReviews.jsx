import React, { useEffect, useState } from "react";
import "./style.css";
import customer from "../../assets/Images/customer.png";
import { BASE_URL } from "../../../constant";
import axios from "axios";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa6";

const DescriptionandReviews = () => {
  const [showDescription, setShowDescription] = useState(true);
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState(null);

  const handleDescriptionClick = () => {
    setShowDescription(true);
  };

  const handleReviewsClick = () => {
    setShowDescription(false);
  };
  const fetchProductDetails = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `${BASE_URL}/products/productId?userId=${userId}&id=${productId}`
      );
      const productData = response.data;

      // Provide default values if the data is not available
      setProductDetails({
        ...productData,
      });
    } catch (error) {
      // navigate("/error")
      console.error("Error fetching product details:", error);
      setProductDetails(null); // Ensure productDetails is set to null on error
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <div>
      <div className="description-reviews-container">
        <div className="buttons">
          <button
            onClick={handleDescriptionClick}
            className={`description-btn ${showDescription ? "active" : ""}`}
          >
            Description
          </button>
          <button
            onClick={handleReviewsClick}
            className={`reviews-btn ${!showDescription ? "active" : ""}`}
          >
            Reviews
          </button>
        </div>
      </div>
      {showDescription ? (
        <DescriptionBox productDetails={productDetails} />
      ) : (
        <ReviewsBox />
      )}
    </div>
  );
};

function DescriptionBox({ productDetails }) {
  if (!productDetails) {
    return (
      <div className="description-box">
        <div className="">
          <p className="text-center">No description available</p>
        </div>
      </div>
    );
  }

  const descriptionList = productDetails?.prdDDesc?.split("\n");
  return (
    productDetails && (
      <div className="description-box">
        <p>{productDetails.prdDesc}</p>

        <div className="desc-list">
          <p>About Items</p>

          <ul>
            {descriptionList?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
            <li>Product Quantity: {productDetails.productQuantity}</li>
          </ul>
        </div>
      </div>
    )
  );
}

function ReviewsBox() {
  const [reviews, setReviews] = useState([]);
  const { productId } = useParams();

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-ratings/product/${productId}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  if (!reviews || reviews.length === 0) {
    return <div className="noreviews">No Reviews Available</div>;
  }

  return (
    <Swiper
      effect={"coverflow"}
      modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
      slidesPerView={"auto"}
      loop={reviews.length > 1}
      grabCursor
      style={{
        "--swiper-navigation-color": "white",
        "--swiper-navigation-size": "40px",
        "--swiper-pagination-color": "white",
        "--swiper-pagination-bullet-size": "11px",
      }}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      initialSlide={0}
      centeredSlides={true}
      coverflowEffect={{
        rotate: 0,
        stretch: 15,
        depth: 100,
        modifier: 1.2,
        slideShadows: false,
      }}
    >
      {reviews.map((review) => (
        <SwiperSlide
          key={review.id}
          style={{ background: "#fff" }}
          className="reviewslide"
        >
          <div className="d-flex align-items-center gap-3">
            <h3 style={{ fontWeight: "bold" }}>{review.userName}</h3>
          </div>
          <p style={{ paddingTop: "20px" }}>{review.message}</p>
          <div className="d-flex gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                color={i < review.ratings ? "#ffc35b" : "#e4e5e9"}
              />
            ))}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default DescriptionandReviews;
