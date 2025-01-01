import React from "react";
import styles from "./style.module.css";
import border from "../../assets/Images/border.png";
import classNames from "classnames";

const MeetOurFamily = () => {
  return (
    <div
      className={classNames(
        styles.vision_section,
        styles.meetourfamily_section
      )}
      style={{ background: "#ededed" }}
    >
      <div className={styles.vision_img}>
        <img
          src={
            "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/family.jpg"
          }
          style={{ borderRadius: "20px" }}
        />
      </div>
      <div className={styles.vision_content}>
        <h1 className="sm:text-[35px] text-[24px] font-[700] text-center ">
          Meet Our Family
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
              "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/family.jpg"
            }
            style={{ borderRadius: "20px" }}
          />
        </div>
        <p>
          At {/*Neel Jewels*/}, we pride ourselves on being more than just a
          jewelry brand – we are a family dedicated to crafting timeless pieces
          and unforgettable experiences. Each member of our team, from skilled
          artisans to passionate designers, plays a vital role in bringing our
          vision to life. Our collective expertise and commitment to excellence
          drive us to exceed expectations and deliver jewelry that tells a
          unique story.
        </p>
      </div>
    </div>
  );
};

export default MeetOurFamily;
