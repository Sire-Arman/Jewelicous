import React from "react";
import { useNavigate } from "react-router-dom";
import "./payment.css";

const PaymentUnsuccessful = () => {
  const navigate = useNavigate();
  return (
    <div className="payment-status-page">
      <div className="payment-status-container">
        <h2>Payment Failed!</h2>
        <img src="PaymentUnSuccessfull.png" />
        <p style={{ padding: "0", paddingBottom: "10px", margin: "0" }}>
          Your payment is unsuccessful...
        </p>
        <p style={{ padding: "0", paddingBottom: "10px", margin: "0" }}>
          The payment was unsuccessful due to an abnormality. Please try again
          or use another payment method..
        </p>
        <button type="submit" onClick={() => navigate("/checkout")}>
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentUnsuccessful;
