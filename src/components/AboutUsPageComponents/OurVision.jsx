import React from "react";
import styles from "./style.module.css";
import border from "../../assets/Images/border.png";

const OurVision = () => {
  return (
    <div className={styles.vision_section} id={styles.vision}>
      <div className={styles.vision_img}>
        <img
          src={
            "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/vision.jpg"
          }
          style={{ borderRadius: "20px" }}
          alt="Vision"
        />
      </div>
      <div className={styles.vision_content}>
        <h1 className="sm:text-[35px] text-[24px] font-[700] text-center ">
          Our Vision
        </h1>
        <img
          src={border}
          alt="img"
          id={styles.border}
          loading="lazy"
          style={{ margin: "auto" }}
        />
        <div className={styles.responsive_vision_img}>
          <img
            src={
              "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/vision.jpg"
            }
            style={{ borderRadius: "20px" }}
            alt="Vision"
          />
        </div>
        <p>
          At {/*Neel Jewels*/}, our vision is to redefine elegance by creating
          jewelry that seamlessly blends classic sophistication with modern
          innovation. We aspire to be a beacon of excellence in the jewelry
          industry, crafting pieces that inspire confidence and celebrate
          individuality.
        </p>
      </div>
    </div>
  );
};

export default OurVision;
