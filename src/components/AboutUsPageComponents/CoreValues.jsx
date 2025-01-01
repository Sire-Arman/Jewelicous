import React from "react";
import styles from "./style.module.css";
import border from "../../assets/Images/border.png";

const CoreValues = () => {
  return (
    <div className={styles.vision_section} style={{ background: "#ededed" }}>
      <div className={styles.vision_content}>
        <h1 className="sm:text-[35px] text-[24px] font-bold text-center ">
          Core Values
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
              "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/values.jpg"
            }
            style={{ borderRadius: "20px" }}
            alt="Core Values"
          />
        </div>
        <p>
          At {/*Neel Jewels*/}, our core values drive everything we do.
          Integrity is at the heart of our operations, ensuring transparency and
          trust with every client. Craftsmanship reflects our dedication to
          creating exquisite, high-quality jewelry that stands the test of time.
          Lastly, we are committed to sustainability, striving to make a
          positive impact on the environment and community through responsible
          practices.
        </p>
      </div>
      <div className={styles.vision_img}>
        <img
          src={
            "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/values.jpg"
          }
          style={{ borderRadius: "20px" }}
          alt="Core Values"
        />
      </div>
    </div>
  );
};

export default CoreValues;
