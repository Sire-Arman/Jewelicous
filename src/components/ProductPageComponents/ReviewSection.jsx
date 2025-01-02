import React, { useState } from "react";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { Link, useParams } from "react-router-dom";

import { BASE_URL } from "../../../constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FaRegStar, FaStar } from "react-icons/fa6";

const ReviewSection = () => {
  const { productId } = useParams();
  const [rating, setRating] = useState(0);
  const stars = Array.from({ length: 5 });

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userName = formData.get("userName");
    const email = formData.get("email");
    const productRating = formData.get("productRating");
    const message = formData.get("message");

    const sanitizedUsername = userName.replace(/\s+/g, "");
    const sanitizedMessage = message.replace(/\s+/g, "");

    if (sanitizedUsername === "") {
      toast.error("Please enter a valid username");
      return;
    } else if (sanitizedMessage === "") {
      toast.error("Please enter a valid message");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/product-ratings`, {
        productId: productId,
        userName: userName,
        email: email,
        message: message,
        ratings: productRating,
      });

      toast.success(
        "Thank you for your rating! We appreciate your feedback."
      );
      event.target.reset();
      setRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review. Please try again later.");
    }
  };

  const handleRatingChange = (event) => {
    const value = parseInt(event.target.value);

    // Validate rating
    if (value < 0 || value > 5) {
      toast.error("Please enter a valid rating between 0 and 5");
    } else {
      setRating(value);
    }
  };

  return (
    <React.Fragment>
      <div
        className="review-section d-flex justify-content-center align-items-center gap-5 mt-4 mb-5 p-3"
        style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
      >
        <div className="review-section-img bg-[silver] h-[300px] w-[450px] rounded-xl">
          <img
            src={
              "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/review.jpg"
            }
            className="rounded"
          />
        </div>
        <div className="d-flex flex-col justify-content-center align-items-center gap-2">
          <h1 className="text-[25px] font-bold text-center">Product Review</h1>
          <div className="d-flex" style={{ color: "#fdb022" }}>
            {[...Array(5)].map((_, index) => {
              if (index < rating) {
                return <FaStar key={index} size={22} />;
              } else {
                return <FaRegStar key={index} size={22} />;
              }
            })}
          </div>
          <p className="text-[20px] text-center">Your Rating</p>
          <form
            className="review-form"
            style={{
              width: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            onSubmit={handleSubmitReview}
          >
            <input
              type="text"
              style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
              name="userName"
              placeholder="Name"
              required
            />
            <input
              type="email"
              style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
              name="email"
              placeholder="Email"
              required
            />
            <input
              type="number"
              name="productRating"
              placeholder="Rate our product (0-5)"
              onChange={handleRatingChange}
              min="0"
              max="5"
              style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
              required
            />

            <textarea
              className="message-input rounded h-[120px] w-[400px] p-3"
              placeholder="Message"
              name="message"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                marginBottom: "10px",
              }}
            />
            <button
              type="submit"
              value={"Submit"}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                background: "#5D0B86",
                color: "#fff",
                padding: "8px 20px",
                borderRadius: "5px",
                width: "80%",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div
        className="why-us-section d-flex justify-content-between gap-5 mb-5"
        style={{ background: "#fff", margin: "0px 30px" }}
      >
        <div className="why-us-content d-flex flex-col justify-content-start align-items-start p-5 gap-2">
          <h1 className="text-[50px] font-bold">WHY US</h1>
          <p className="w-[600px] " style={{ color: "grey" }}>
            At{/*Neel Jewels*/}, we combine exceptional craftsmanship with
            premium materials to offer timeless elegance and style. Our skilled
            artisans meticulously craft each piece using ethically sourced
            gemstones and high-grade metals, ensuring both beauty and
            durability. With a commitment to innovative design and personalized
            service, we strive to make every piece a cherished treasure,
            reflecting your unique taste while supporting sustainable practices.
            Choose us for jewelry that stands the test of time and makes every
            moment special.
          </p>
          <p style={{ textDecoration: "underline" }}>
            <Link to={"/aboutus"}>Read More</Link>
          </p>
        </div>
        <div className="why-us-section-img bg-[silver] ">
          <img
            src={
              "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/jewels-new.jpg"
            }
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReviewSection;
