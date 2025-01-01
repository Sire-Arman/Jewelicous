import React from "react";
import styles from "./style.module.css";

import border from "../../assets/Images/border.png";

function HeroSection() {
  return (
    <div id={styles.about_hero_section}>
      <img
        src={
          "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/about-us.png"
        }
        alt="Background"
        className={styles.img}
      />
      <p id={styles.About_Us}>ABOUT US!!</p>
      <img
        src={
          "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/about-us.png"
        }
        className={styles.img2}
      />
      <div className={styles.img_container}>
        <div className={styles.about_intro}>
          <div className={styles.heading}>
            <h1 className="sm:text-[35px] text-[24px] font-[700] text-center">
              About{/*Neel Jewels*/}
            </h1>
            <img src={border} alt="img" id="border" loading="lazy" />
          </div>
          <p className={styles.about_text}>
            At{/*Neel Jewels*/}, we blend tradition with contemporary flair to
            create pieces that are not just accessories but expressions of your
            unique story. Each piece of jewelry is meticulously handcrafted by
            skilled artisans, ensuring unparalleled quality and elegance.
            Whether you're looking for a classic design or a modern statement,
            our collection offers something special for every occasion.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
