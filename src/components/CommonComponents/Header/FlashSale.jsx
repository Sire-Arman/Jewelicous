import React from "react";
import styles from "./Header.module.css";

const MarqueeBanner = ({ flashMessage }) => {
  // Create an array of 20 items to ensure smooth looping
  const repeatedMessages = Array(20).fill(flashMessage || "");

  return (
    <div className={styles.banner}>
      <div className={styles.marquee}>
        {repeatedMessages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
};

export default MarqueeBanner;
