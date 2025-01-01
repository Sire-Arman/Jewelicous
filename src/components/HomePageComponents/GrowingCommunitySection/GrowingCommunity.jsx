import React from "react";
import "./style.css";
import giiLogo from "../../../assets/Images/GII_LOGO.jpg";
import igiLogo from "../../../assets/Images/igi.png";
import sglLogo from "../../../assets/Images/sgl.png";
import bisLogo from "../../../assets/Images/bis.png";

const GrowingCommunity = () => {
  return (
    <div className="growing-community-section">
      <h3>100% Certified by International Standards</h3>
      <div className="growing-community-items d-flex justify-content-center align-items-start mt-4">
        <div className="growing-community-items flex flex-wrap justify-center gap-8">
          <div className="flex flex-col justify-center items-center">
            <img
              src={giiLogo}
              alt="GII Certification"
              style={{ width: "180px" }}
              className="w-24 h-24 object-contain"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <img
              src={igiLogo}
              alt="IGI Certification"
              className="w-24 h-24 object-contain"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <img
              src={sglLogo}
              alt="SGL Certification"
              className="w-24 h-24 object-contain"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <img
              src={bisLogo}
              alt="BIS Certification"
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowingCommunity;
