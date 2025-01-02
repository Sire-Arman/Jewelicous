import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../../../constant";
import "./style.css";
import { useNavigate } from "react-router-dom";

const DiscountBanner = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [data, setData] = useState("");
  const [text, settext] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/homepage/images/get-special`
        );

        setImage(response.data.imageUrl);
        setData(response.data);
        settext(response.data.buttonText);
      } catch (error) {
        navigate("/error");
        console.error("Error fetching products:", error);
      }
    };

    fetchImage();
  }, []);

  const copyCouponCode = async () => {
    const couponCode = text;

    try {
      // Try using the modern clipboard API
      await navigator.clipboard.writeText(couponCode);
      toast.success("Coupon code copied!");
    } catch (err) {
      // Fallback method for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = couponCode;
      textArea.style.position = "fixed"; // Prevent scrolling to bottom
      textArea.style.opacity = "0"; // Hide the textarea
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        toast.success("Coupon code copied!");
      } catch (err) {
        toast.error("Failed to copy coupon code.");
      }
      document.body.removeChild(textArea);
    }
  };

  return data.isHidden ? (
    ""
  ) : (
    <div
      className="discount-banner-container cursor-pointer mt-2"
      // onClick={() => {
      //   if (data.bannerUrl) {
      //     window.location.href = data.bannerUrl;
      //   } else {
      //     navigate("/shop");
      //   }
      // }}
    >
      <img src={image} alt="" />

      <button className="shinningbutton" onClick={copyCouponCode}>
        {text}
      </button>
    </div>
  );
};

export default DiscountBanner;
