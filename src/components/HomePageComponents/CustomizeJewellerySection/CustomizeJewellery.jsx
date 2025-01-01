import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../constant";
import { useNavigate } from "react-router-dom";
import "./style.css";

const CustomizeJewellery = () => {
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/homepage/images/get-customise`
        );
        setImage(response.data);
        setText(response.data.buttonText);
        setUrl(response.data?.buttonUrl);
        setBannerUrl(response.data.bannerUrl);
      } catch (error) {
        navigate("/error");
        console.error("Error fetching products:", error);
      }
    };

    fetchImage();
  }, []);
  return (
    <div
      className="customize-jewellery-section cursor-pointer"
      // onClick={() => {
      //   if (bannerUrl) {
      //     window.location.href = bannerUrl;
      //   } else {
      //     navigate("/customize");
      //   }
      // }}
    >
      <img src={image.imageUrl} />
      <button
        className="shinningbutton"
        onClick={() => {
          if (url) {
            window.location.href = url;
          } else {
            navigate("/customize");
          }
        }}
      >
        {text}
      </button>
    </div>
  );
};

export default CustomizeJewellery;
