import React, { useEffect, useState } from "react";
import { PiTruck } from "react-icons/pi";
import pincodes from "../../utils/pincodes.json";
import { BASE_URL } from "../../../constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  FaCheck,
  FaCircleCheck,
  FaTicket,
  FaTriangleExclamation,
} from "react-icons/fa6";

const VerifyPincode = () => {
  const [pincode, setPincode] = useState("");
  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [customPincodes, setCustomPincodes] = useState([]);
  const [deliveryRange, setDeliveryRange] = useState("");

  const fetchPincodeData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/pincode/get-all`);
      const items = response?.data;
      setCustomPincodes(items);
    } catch (error) {
      console.log(error);
    }
  };

  // calculate delivery range (10-14 days from current date)
  const calculateDeliveryRange = () => {
    const options = { weekday: "long", day: "numeric", month: "short" };

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 10); // 10 days from current date
    const formattedStartDate = startDate.toLocaleDateString("en-US", options);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14); // 14 days from current date
    const formattedEndDate = endDate.toLocaleDateString("en-US", options);

    return { startDate: formattedStartDate, endDate: formattedEndDate };
  };

  useEffect(() => {
    fetchPincodeData();
    setPincode("");
    setIsPincodeValid(false);
    setPincodeChecked(false);
    setDeliveryRange(calculateDeliveryRange());
  }, []);

  const handleCheckPincode = () => {
    setPincodeChecked(true);

    const isPincodeInLocalList = pincodes.some(
      (entry) => entry.CPINCODE === pincode
    );
    const isPincodeInCustomList = customPincodes.some(
      (entry) => entry.pincode === pincode
    );

    if (isPincodeInLocalList || isPincodeInCustomList) {
      setIsPincodeValid(true);
      toast.success("Pincode is valid.");
    } else {
      setIsPincodeValid(false);
      toast.error("We cannot deliver to this pincode.");
    }
  };

  // Handle pincode input change
  const handlePincodeChange = (e) => {
    setPincode(e.target.value);
    setPincodeChecked(false); // Reset the checked status when typing
  };

  return (
    <div className="pincode-box-container">
      <div className="pincode-box">
        {/* <h2>Check Delivery Date</h2>
        <div className="form">
          <input
            type="number"
            name="text"
            autoComplete="off"
            value={pincode}
            onChange={handlePincodeChange}
            required
          />
          <label htmlFor="text" className="label-name">
            <span className="content-name">Enter Delivery Pincode</span>
          </label>
          <button
            onClick={handleCheckPincode}
            disabled={!pincode}
            className="check-btn"
          >
            Check
          </button>
        </div>*/}

        {/* Show error message if the pincode is invalid */}

        {pincodeChecked && (
          <React.Fragment>
            {isPincodeValid ? (
              <div className="success-message d-flex align-items-center gap-2 mt-2 text-[green]">
                <span>
                  <FaCircleCheck />
                </span>
                <span> This pincode is valid - {pincode}</span>
              </div>
            ) : (
              <div className="error-message d-flex align-items-center gap-2 mt-2 text-[red]">
                <span>
                  <FaTriangleExclamation />
                </span>
                <span> We cannot deliver at pincode - {pincode}</span>
              </div>
            )}
          </React.Fragment>
        )}

        <div className="default-message d-flex align-items-center justify-content-center gap-2 mt-2">
          <span>
            <PiTruck size={28} />
          </span>
          <span>
            {" "}
            Estimated Delivery By <strong>
              {deliveryRange.startDate}
            </strong> to <strong>{deliveryRange.endDate}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default VerifyPincode;
