import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../constant";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

function SaleBanner({ openingCategory, setOpeningCategory }) {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/homepage/images/get-sale-banner`
        );
        setImage(response.data);
        setText(response.data.buttonText);
        setUrl(response.data.buttonUrl);
        setBannerUrl(response.data.bannerUrl);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchImage();
  }, []);
  return (
    <div
      className={styles.banner_container}
      style={{
        height: "600px",
        width: "100%",
        cursor: "pointer",
      }}
      // onClick={() => {
      //   setOpeningCategory("");
      //   if (bannerUrl) {
      //     window.location.href = bannerUrl;
      //   } else {
      //     navigate("/shop");
      //   }
      // }}
    >
      <img src={image.imageUrl} className={styles.banner_img} />
      <div className={styles.banner_content}>
        <button
          type="button"
          style={{
            background: "#5D0B86",
            color: "#fff",
            padding: "10px",
            width: "150px",
            borderRadius: "8px",
          }}
          className="shinningbutton"
          onClick={() => {
            setOpeningCategory("");
            if (url) {
              window.location.href = url;
            } else {
              navigate("/shop");
            }
          }}
        >
          {text}
        </button>
      </div>
    </div>
  );
}

export default SaleBanner;
