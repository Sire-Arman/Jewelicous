import React from "react";
import "./payment.css";
import { useNavigate } from "react-router-dom";

const PaymentSuccessfull = () => {
  const navigate = useNavigate();
  return (
    <div className="payment-status-page">
      <div>
        <div className="payment-status-container">
          <h2>Thank You!</h2>
          <img src="PaymentSuccessfull.png" />
          <p>Your payment is successful Thank you for placing this order..</p>
          <button type="submit" onClick={() => navigate("/shop")}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessfull;
