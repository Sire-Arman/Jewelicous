import React, { useEffect, useState } from "react";
import "./style.css";
import { BASE_URL } from "../../../constant";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Weight = ({ onWeightSelect, onApplyClick, noOfTimesFormSubmitted }) => {
  const [weight, setWeight] = useState([]);
  const [selectedGoldWeight, setSelectedGoldWeight] = useState(null);
  const [inputGoldWeight, setInputGoldWeight] = useState(
    localStorage.getItem("selectedCustomizedGoldWeight") || ""
  );
  const [selectedDiamondWeight, setSelectedDiamondWeight] = useState(null);
  const [inputDiamondWeight, setInputDiamondWeight] = useState(
    localStorage.getItem("selectedCustomizedDiamondWeight") || ""
  );

  const handleGoldOptionClick = (weight) => {
    setSelectedGoldWeight(weight);
    setInputGoldWeight(weight.weight);
  };

  const handleDiamondOptionClick = (weight) => {
    setSelectedDiamondWeight(weight);
    setInputDiamondWeight(weight.weight);
  };

  useEffect(() => {
    const fetchWeight = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/product-variants/weights`
        );
        setWeight(response.data);

        if (inputGoldWeight != "") {
          const temp = response.data.find((item) => {
            return item.weight == inputGoldWeight;
          });
          if (temp) {
            setSelectedGoldWeight(temp);
          }
        }

        if (inputDiamondWeight != "") {
          const temp = response.data.find((item) => {
            return item.weight == inputDiamondWeight;
          });
          if (temp) {
            setSelectedDiamondWeight(temp);
          }
        }
        localStorage.removeItem("selectedCustomizedGoldWeight");
        localStorage.removeItem("selectedCustomizedDiamondWeight");

        if (inputGoldWeight != "" && inputDiamondWeight != "") {
          handleApplyClick();
        }
      } catch (error) {
        console.error("Error fetching weights:", error);
      }
    };

    fetchWeight();
  }, []);

  useEffect(() => {
    if (noOfTimesFormSubmitted != 0) {
      setSelectedGoldWeight(null);
      setInputGoldWeight("");
      setSelectedDiamondWeight(null);
      setInputDiamondWeight("");
    }
  }, [noOfTimesFormSubmitted]);

  const handleApplyClick = () => {
    // Allow digits and at most one dot
    const sanitizedInputDiamondWeight = String(inputDiamondWeight).replace(
      /[^0-9.]/g,
      ""
    );
    const dotCountInputDiamondWeight = (
      sanitizedInputDiamondWeight.match(/\./g) || []
    ).length;
    const sanitizedInputGoldWeight = String(inputGoldWeight).replace(
      /[^0-9.]/g,
      ""
    );
    const dotCountInputGoldWeight = (
      sanitizedInputGoldWeight.match(/\./g) || []
    ).length;

    if (
      dotCountInputDiamondWeight > 1 ||
      dotCountInputGoldWeight > 1 ||
      sanitizedInputDiamondWeight === "" ||
      sanitizedInputGoldWeight === ""
    ) {
      toast.error("Please enter valid Weights");
      return;
    }

    const goldWeightToSend = { weight: inputGoldWeight };
    const diamondWeightToSend = { weight: inputDiamondWeight };
    onApplyClick();

    onWeightSelect({
      goldWeight: goldWeightToSend,
      diamondWeight: diamondWeightToSend,
    }); // Send both weights
  };

  return (
    <React.Fragment>
      <div className="carat-container">
        <h1 className="text-center font-bold text-[18px]">Gold Weight</h1>
        <div className="carat carat-scroll-container pr-4 pl-2">
          {weight.length > 0
            ? weight.map((w) => (
                <div
                  key={w.id}
                  className={`cursor-pointer bg-white shadow-[0_0_3px] ml-2 font-bold text-[20px] p-3 rounded-lg w-[auto] ${
                    selectedGoldWeight === w ? "selected-option" : ""
                  }`}
                  onClick={() => handleGoldOptionClick(w)}
                >
                  <span className="rounded" style={{ padding: "10px 20px" }}>
                    {w.weight} g
                  </span>
                </div>
              ))
            : ""}
        </div>
      </div>

      <div className="carat-container mt-4">
        <h1 className="text-center font-bold text-[18px]">Diamond Weight</h1>
        <div className="carat carat-scroll-container pr-4 pl-2">
          {weight.length > 0
            ? weight.map((w) => (
                <div
                  key={w.id}
                  className={`cursor-pointer bg-white shadow-[0_0_3px] ml-2 font-bold text-[20px] p-3 rounded-lg w-[auto] ${
                    selectedDiamondWeight === w ? "selected-option" : ""
                  }`}
                  onClick={() => handleDiamondOptionClick(w)}
                >
                  <span className="rounded" style={{ padding: "10px 20px" }}>
                    {w.weight} ct
                  </span>
                </div>
              ))
            : ""}
        </div>

        <div className="d-flex flex-col sm:flex-row justify-content-center gap-3">
          <div className="d-flex flex-column align-items-center mt-4">
            <label>Gold Weight (grams)</label>
            <input
              style={{
                border: "2px solid silver",
                padding: "5px 10px",
                marginTop: "5px",
              }}
              placeholder="Enter Gold Weight"
              type="text"
              value={inputGoldWeight}
              onChange={(e) => {
                setInputGoldWeight(e.target.value);
                const newfield = weight.find((item) => {
                  return item.weight == e.target.value;
                });
                newfield
                  ? setSelectedGoldWeight(newfield)
                  : setSelectedGoldWeight(null);
              }}
            />
          </div>

          <div className="d-flex flex-column align-items-center mt-4">
            <label>Diamond Weight (ct)</label>
            <input
              style={{
                border: "2px solid silver",
                padding: "5px 10px",
                marginTop: "5px",
              }}
              placeholder="Enter Diamond Weight"
              type="text"
              value={inputDiamondWeight}
              onChange={(e) => {
                setInputDiamondWeight(e.target.value);
                const newfield = weight.find((item) => {
                  return item.weight == e.target.value;
                });
                newfield
                  ? setSelectedDiamondWeight(newfield)
                  : setSelectedDiamondWeight(null);
              }}
            />
          </div>
        </div>

        <div className="d-flex justify-content-center mt-3">
          <button
            className="apply-btn"
            disabled={!inputGoldWeight || !inputDiamondWeight}
            onClick={handleApplyClick}
          >
            Apply
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Weight;
