import React, { useState } from "react";
import logo1 from "../../assets/Images/bis.png";
import logo2 from "../../assets/Images/GII_LOGO.jpg";
import logo3 from "../../assets/Images/sgl.png";
import logo4 from "../../assets/Images/igi.png";

const HallMarks = () => {
  const [hoveredLogo, setHoveredLogo] = useState("BIS");

  const logoInfo = {
    BIS: "The Bureau of Indian Standards (BIS) ensures the quality, safety, and reliability of products in India. BIS Hallmarking verifies the purity of gold, ensuring customers get what they pay for.",
    GII: "The Gemmological Institute of India (GII) is dedicated to education, research, and grading services in the fields of gemology and diamond certification, providing reliable reports to customers.",
    SGL: "SGL (Solitaire Gemological Laboratories) is a trusted authority in gemstone and diamond grading, providing accurate assessments and ensuring consumer confidence in their jewelry purchases.",
    IGI: "The International Gemological Institute (IGI) is one of the world’s leading authorities in diamond, gemstone, and jewelry certification. Established in 1975, IGI provides reliable and accurate grading reports, ensuring transparency and trust in the global gemstone market.",
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center mb-4">
      <h1 className="text-center font-bold text-[22px]">
        100% Certified by International Standards
      </h1>
      <div className="hallmark-container d-flex align-items-center justify-content-center p-3 gap-3 my-2 w-[800px]">
        <div
          className="hallmark-logo position-relative"
          onMouseEnter={() => setHoveredLogo("BIS")}
          onMouseLeave={() => setHoveredLogo("")}
        >
          <img src={logo1} alt="BIS" />
        </div>
        <div
          className="hallmark-logo position-relative"
          onMouseEnter={() => setHoveredLogo("GII")}
          onMouseLeave={() => setHoveredLogo("")}
        >
          <img src={logo2} alt="GII" />
        </div>
        <div
          className="hallmark-logo position-relative"
          onMouseEnter={() => setHoveredLogo("SGL")}
          onMouseLeave={() => setHoveredLogo("")}
        >
          <img src={logo3} alt="SGL" />
        </div>
        <div
          className="hallmark-logo position-relative"
          onMouseEnter={() => setHoveredLogo("IGI")}
          onMouseLeave={() => setHoveredLogo("")}
        >
          <img src={logo4} alt="IGI" />
        </div>
      </div>
      <div className="hallmark-text text-center bg-[white] p-3">
        {hoveredLogo ? logoInfo[hoveredLogo] : logoInfo["BIS"]}
      </div>
    </div>
  );
};

export default HallMarks;
