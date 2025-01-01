import React, { useEffect, useState } from "react";
import "./style.css";
import { BASE_URL } from "../../../constant";
import axios from "axios";

const Size = ({ onSizeSelect, onApplyClick, noOfTimesFormSubmitted }) => {
  const [size, setSize] = useState([]);
  const [selectedSize, setSelectedSize] = useState(
    localStorage.getItem("selectedCustomizedSize") || null
  );
  const [inputSize, setInputSize] = useState("");

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/product-variants/sizes`);
        setSize(response.data);
        const temp = response.data.find((item) => {
          return item.sizenumber == selectedSize;
        });
        if (temp) {
          setSelectedSize(temp);
          setInputSize(`${temp.sizenumber} (${temp.sizemm} mm)`); // Format the input value
          handleApplyClick(temp);
        }
        localStorage.removeItem("selectedCustomizedSize");
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchSizes();
  }, []);

  useEffect(() => {
    if (noOfTimesFormSubmitted !== 0) {
      setSelectedSize(null);
      setInputSize(""); // Clear inputSize when form is submitted
    }
  }, [noOfTimesFormSubmitted]);

  const handleOptionClick = (size) => {
    setSelectedSize(size);
    setInputSize(`${size.sizenumber} - ${size.sizemm}`); // Format the input value
  };

  const handleApplyClick = () => {
    const customSize = inputSize.trim(); // Get the trimmed input value
    if (customSize) {
      // Send the custom size if it exists
      onSizeSelect({ sizenumber: customSize });
    } else if (selectedSize) {
      // Otherwise, send the selected size
      onSizeSelect(selectedSize);
    }
    onApplyClick(); // Call the apply click handler
  };

  // Handle input change to allow user-defined size
  const handleInputChange = (e) => {
    setInputSize(e.target.value);
  };

  return (
    <div className="size-container">
      <div className="size d-flex gap-4 text-center w-[100%] pb-[15px] m-[1px] pt-6 pl-2 overflow-x-auto pr-4">
        {size.length > 0
          ? size.map((s) => (
              <div
                key={s.id}
                className={`relative cursor-pointer ml-2 mb-2 bg-white shadow-[0_0_3px] font-bold text-[22px] p-4 flex-shrink-0 rounded-lg w-[150px] ${
                  selectedSize === s ? "selected-option" : ""
                }`}
                onClick={() => handleOptionClick(s)}
              >
                <p
                  className="absolute left-[37%] top-[-1rem] text-blue-400 rounded-full w-[35px] h-[35px] flex justify-center items-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
                >
                  {s.sizenumber}
                </p>
                <span className="d-flex flex-column rounded">
                  <p>{s.sizemm} mm</p>
                </span>
              </div>
            ))
          : ""}
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center mt-3">
        <label className="text-[20px]">Size</label>
        <input
          style={{
            border: "2px solid silver",
            padding: "5px 10px",
            marginTop: "5px",
          }}
          placeholder="Enter Size number"
          type="text"
          value={inputSize}
          onChange={handleInputChange} // Handle changes in the input
        />
      </div>
      <div className="d-flex justify-content-center mt-3">
        <button
          disabled={!selectedSize && !inputSize} // Disable button if no size is selected or input
          className="apply-btn"
          onClick={handleApplyClick}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Size;
