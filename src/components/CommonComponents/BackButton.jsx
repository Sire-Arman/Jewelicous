import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = (event) => {
    event.stopPropagation();
    event.preventDefault();
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.history.back() || navigate(-1);
    }, 0);
  };

  return (
    <button
      style={{
        boxShadow: "rgba(99, 99, 99, 0.4) 0px 2px 8px 0px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "2px 20px",
        borderRadius: "5px",
        marginBottom: "20px",
      }}
      onClick={goBack}
    >
      <FaArrowLeftLong size={25} />
    </button>
  );
};

export default BackButton;
