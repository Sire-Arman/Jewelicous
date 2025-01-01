import React, { useEffect, useState } from "react";
import "./style.css";
import { BASE_URL } from "../../../constant";
import axios from "axios";

const Carat = ({ onCaratSelect, onApplyClick, noOfTimesFormSubmitted }) => {
  const [carats, setCarats] = useState([]);
  const [goldCarats, setGoldCarats] = useState([]);
  const [selectedCarats, setSelectedCarats] = useState(
    localStorage.getItem("selectedCustomizedDiamondPurity") || null
  );
  const [selectedGoldCarat, setSelectedGoldCarat] = useState(
    localStorage.getItem("selectedCustomizedGoldPurity") || null
  );

  const handleOptionClick = (carat) => {
    setSelectedCarats(carat);
  };

  const handleGoldOptionClick = (carat) => {
    setSelectedGoldCarat(carat);
  };

  useEffect(() => {
    let temp1, temp2;
    const fetchCarats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/purity/get-all`);
        const diamondCarats = response.data.filter(
          (c) => c.type === "Diamonds"
        );

        setCarats(diamondCarats);

        temp1 = diamondCarats.find((item) => {
          return item.name == selectedCarats;
        });
        setSelectedCarats(temp1);
        if (temp1 && temp2) {
          handleApplyClick(temp1, temp2);
        }
        localStorage.removeItem("selectedCustomizedDiamondPurity");
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchGoldCarats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/purity/get-all`);
        const goldCaratsResponse = response.data.filter(
          (c) => c.type === "Gold"
        );

        setGoldCarats(goldCaratsResponse);

        temp2 = goldCaratsResponse.find((item) => {
          return item.name == selectedGoldCarat;
        });
        setSelectedGoldCarat(temp2);
        localStorage.removeItem("selectedCustomizedGoldPurity");
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchGoldCarats();
    fetchCarats();
  }, []);

  useEffect(() => {
    if (noOfTimesFormSubmitted != 0) {
      setSelectedCarats(null);
      setSelectedGoldCarat(null);
    }
  }, [noOfTimesFormSubmitted]);

  // const handleApplyClick = () => {
  //   if (selectedCarats && selectedGoldCarat) {
  //     onCaratSelect(selectedCarats, selectedGoldCarat); // Ensure both selections are passed
  //     onApplyClick(); // Call the apply click function
  //   }
  // };

  const handleApplyClick = (...args) => {
    onApplyClick();
    if (args[0]?.id) {
      onCaratSelect(args[0], args[1]);
    } else {
      onCaratSelect(selectedCarats, selectedGoldCarat);
    }
  };

  return (
    <React.Fragment>
      <div className="carat-container m-1 p-1 mt-0">
        <h1 className="text-[20px] font-bold text-center">Diamond Purities</h1>
        <div className="carat carat-scroll-container pr-4 pl-2">
          {carats.length > 0
            ? carats.map((c) => (
                <div
                  key={c.id}
                  className={` cursor-pointer bg-white shadow-[0_0_3px] ml-2 font-bold text-[18px] p-2 rounded-lg  ${
                    selectedCarats == c ? "selected-option" : ""
                  }`}
                  onClick={() => handleOptionClick(c)}
                >
                  <span
                    className="bg-[#fff] rounded d-flex flex-column "
                    style={{ padding: "10px 10px" }}
                  >
                    <span>{c.name}</span>

                    <span>{c.type}</span>
                  </span>
                </div>
              ))
            : ""}
        </div>
      </div>
      <div className="carat-container ">
        <h1 className="text-[20px] mt-4  font-bold text-center">
          Gold Purities
        </h1>
        <div className="carat carat-scroll-container pl-2">
          {goldCarats.length > 0
            ? goldCarats.map((c) => (
                <div
                  key={c.id}
                  className={` cursor-pointer bg-white shadow-[0_0_3px] ml-2 font-bold text-[18px] p-2 rounded-lg  ${
                    selectedGoldCarat == c ? "selected-option" : ""
                  }`}
                  onClick={() => handleGoldOptionClick(c)}
                >
                  <span
                    className="bg-[#fff] rounded d-flex flex-column "
                    style={{ padding: "10px 10px" }}
                  >
                    <span>{c.name}</span>

                    <span>{c.type}</span>
                  </span>
                </div>
              ))
            : ""}
        </div>
        <div className="d-flex justify-content-center mt-3">
          <button
            disabled={!selectedCarats || !selectedGoldCarat}
            className="apply-btn"
            onClick={handleApplyClick}
          >
            Apply
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Carat;
