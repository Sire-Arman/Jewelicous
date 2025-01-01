import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import "./style.css";

const PriceRange = ({ onPriceRangeChange, onApplyClick, noOfTimesFormSubmitted }) => {
  const [sliderValue, setSliderValue] = useState([15000, 1000000]);
  const [inputMinPrice, setInputMinPrice] = useState(15000); // Store the input value for min
  const [inputMaxPrice, setInputMaxPrice] = useState(1000000); // Store the input value for max

  // Convert slider value (0-100) to the actual price range (15,000 to 10,00,000)
  const sliderValueToPrice = (sliderValue) => {
    if (sliderValue <= 50) {
      return 15000 + (485000 * sliderValue) / 50; // Rs 15,000 to Rs 5,00,000 (0-50% of slider)
    } else {
      return 500000 + (500000 * (sliderValue - 50)) / 50; // Rs 5,00,000 to Rs 10,00,000 (50-100% of slider)
    }
  };

  // Convert actual price range to slider value (for setting the slider thumb position)
  const priceToSliderValue = (price) => {
    if (price <= 500000) {
      return ((price - 15000) * 50) / 485000; // Rs 15,000 to Rs 5,00,000 corresponds to slider range 0-50
    } else {
      return 50 + ((price - 500000) * 50) / 500000; // Rs 5,00,000 to Rs 10,00,000 corresponds to slider range 50-100
    }
  };

  // Ensure step value is always 1000
  const ensureStepValue = (price) => {
    return Math.round(price / 1000) * 1000;
  };

  // Handle slider change, converting slider values back to actual prices
  const handlePriceChange = (event, newValue) => {
    if (
      Array.isArray(newValue) &&
      newValue.every((v) => typeof v === "number")
    ) {
      const priceRange = newValue.map((v) =>
        ensureStepValue(sliderValueToPrice(v))
      ); // Convert and ensure step
      setSliderValue(priceRange); // Update the slider state
      setInputMinPrice(priceRange[0]); // Sync with input min price field
      setInputMaxPrice(priceRange[1]); // Sync with input max price field
    }
  };

  // Handle user input change for minimum price
  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    const numericValue = Number(value);
    setInputMinPrice(value); // Update the input field immediately

    if (numericValue >= 15000 && numericValue <= inputMaxPrice) {
      setSliderValue([numericValue, sliderValue[1]]); // Update slider value if valid
    }
  };

  // Handle user input change for maximum price
  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    const numericValue = Number(value);
    setInputMaxPrice(value); // Update the input field immediately

    if (numericValue <= 1000000 && numericValue >= inputMinPrice) {
      setSliderValue([sliderValue[0], numericValue]); // Update slider value if valid
    }
  };

  // Update the slider when the user manually changes the input values
  useEffect(() => {
    if (inputMinPrice && inputMaxPrice && inputMinPrice < inputMaxPrice) {
      setSliderValue([inputMinPrice, inputMaxPrice]);
    }
  }, [inputMinPrice, inputMaxPrice]);

  useEffect(()=>{
    if(localStorage.getItem("selectedCustomizedPriceRange"))
    handleApplyClick();
    localStorage.removeItem("selectedCustomizedPriceRange")
  },[])

  useEffect(()=>{
    if (noOfTimesFormSubmitted != 0) {
      setSliderValue([15000,1000000]);
      setInputMinPrice(15000);
      setInputMaxPrice(1000000);
    }
  },[noOfTimesFormSubmitted])

  const handleApplyClick = () => {
    // Pass the actual price range to parent
    onApplyClick();
    console.log(sliderValue);
    onPriceRangeChange(sliderValue); 
  };

  return (
    <div className="mt-2">
      <div className="price-range-container d-flex flex-column align-items-center justify-content-center p-3">
        {/* Price range labels */}
        <div
          className="price-values d-flex justify-content-between gap-4 text-center"
          style={{ width: "80%", color: "#5D0B86" }}
        >
          <div className="d-flex flex-column align-items-center justify-content-center font-bold">
            <span>Above</span>
            <span>Rs 15,000</span>
          </div>
          <div className="d-flex flex-column align-items-center justify-content-center  font-bold">
            <span>Above</span>
            <span>Rs 5,00,000</span>
          </div>
          <div className="d-flex flex-column align-items-center justify-content-center  font-bold">
            <span>Under</span>
            <span>Rs 10,00,000</span>
          </div>
        </div>

        {/* Slider component */}
        <Slider
          aria-label="Price Range"
          value={sliderValue.map(priceToSliderValue)} // Convert actual prices to slider values
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(val) => `Rs ${sliderValueToPrice(val)}`} // Format the value labels to show prices
          getAriaValueText={(val) => `Rs ${sliderValueToPrice(val)}`} // Tooltip shows correct price
          color="secondary"
          className="slider-price"
          style={{ width: "80%", height: "10px" }}
          min={0} // Slider min is now 0
          max={100} // Slider max is now 100
          step={1} // Small step to allow finer control
        />
        {/* <div className="d-flex flex-col sm:flex-row justify-content-center gap-3">
          <div className="d-flex flex-column align-items-center">
            <label>Min Price</label>
            <input
              style={{ border: "2px solid silver", padding: "5px 10px" }}
              placeholder="Minimum Price"
              type="text"
              value={inputMinPrice}
              onChange={handleMinPriceChange}
            />
          </div>
          <div className="d-flex flex-column align-items-center">
            <label>Max Price</label>
            <input
              style={{ border: "2px solid silver", padding: "5px 10px" }}
              placeholder="Maximum Price"
              type="text"
              value={inputMaxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div> */}
      </div>

      <div className="d-flex justify-content-center mt-3">
        <button
          className="apply-btn"
          disabled={!sliderValue ? true : false}
          onClick={handleApplyClick}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default PriceRange;
