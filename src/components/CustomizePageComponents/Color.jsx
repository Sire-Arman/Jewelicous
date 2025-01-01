import React, { useEffect, useState } from "react";
import "./style.css";
import { BASE_URL } from "../../../constant";
import axios from "axios";

const Color = ({ onColorSelect, onApplyClick, noOfTimesFormSubmitted }) => {
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(
    localStorage.getItem("selectedCustomizedColor") || null
  );

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/product-variants/colors`);
        setColors(response.data);
        const temp = response.data.find((item) => {
          return item.colorname == selectedColor;
        });
        setSelectedColor(temp);
        if (temp) {
          handleApplyClick(temp);
        }
        localStorage.removeItem("selectedCustomizedColor");
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchColors();
  }, []);

  useEffect(() => {
    if (noOfTimesFormSubmitted != 0) {
      setSelectedColor(null);
    }
  }, [noOfTimesFormSubmitted]);

  const handleOptionClick = (color) => {
    setSelectedColor(color);
  };
  // const handleApplyClick = () => {
  //   if (selectedColor) {
  //     onApplyClick(); // Call the apply click handler
  //   }
  //   onColorSelect(selectedColor);
  // };

  const handleApplyClick = (...args) => {
    onApplyClick(); // Call the apply click handler
    if (args[0]?.id) {
      onColorSelect(args[0]);
    } else {
      onColorSelect(selectedColor);
    }
  };

  const getColorImage = (colorName) => {
    switch (colorName.toLowerCase()) {
      case "rose gold":
        return "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/rosegold.png";
      case "yellow":
        return "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/gold.png";
      case "white":
        return "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/white.png";
      default:
        return null;
    }
  };

  return (
    <div className="mt-1">
      <div className="colors-scroll-container pr-4">
        {colors.length > 0
          ? colors.map((c) => (
              <div
                key={c.id}
                className={`cursor-pointer text-black font-semibold rounded-full h-[70px] w-[70px] shrink-0 d-flex flex-column align-items-center justify-content-center border-2 ${
                  selectedColor === c ? "selected-option" : ""
                }`}
                style={{
                  backgroundColor:
                    c.colorname.toLowerCase() !== "rose gold" &&
                    c.colorname.toLowerCase() !== "yellow" &&
                    c.colorname.toLowerCase() !== "white"
                      ? c.colorname.toLowerCase()
                      : "",
                }}
                onClick={() => handleOptionClick(c)}
              >
                {" "}
                {getColorImage(c.colorname) ? (
                  <img
                    src={getColorImage(c.colorname)}
                    alt={c.colorname}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : null}
              </div>
            ))
          : ""}
      </div>
      <div className="d-flex justify-content-center mt-3">
        <button
          className="apply-btn"
          disabled={!selectedColor ? true : false}
          onClick={handleApplyClick}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Color;
