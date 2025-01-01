import React, { useState, useEffect } from "react";
import { FaSpinner, FaSyncAlt, FaHome } from "react-icons/fa";
import img from "../../assets/Images/glasses1.png";
import "./style.css";

const Button = ({ className, onClick, children, icon: Icon, disabled }) => (
  <button
    className={`px-6 py-3 rounded-full font-semibold flex items-center justify-center transition-all duration-300 ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {Icon && <Icon className="mr-2 text-xl" />}
    {children}
  </button>
);

export default function ErrorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (isLoading) {
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsLoading(false);
            window.history.back();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLoading]);

  const handleRefresh = () => {
    setIsLoading(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black text-white p-4">
      <div className="text-center space-y-8 max-w-2xl w-full bg-purple-900 bg-opacity-90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-purple-700">
        <div className="flex justify-center mb-8">
          <div className="w-64 h-64 rounded-full overflow-hidden">
            <img
              src={img}
              alt="Elegant Diamond Ring"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="error-heading text-5xl font-bold mb-4 animate-fade-in-up text-gray-600">
          Oops! Our Server is Taking a Break
        </h1>
        <p className="error-text text-2xl animate-fade-in-up animation-delay-200 text-gray-600">
          We're polishing our diamonds to ensure they sparkle just for you!
        </p>
        <div className="error-btn flex justify-center space-x-6 mt-12">
          <Button
            className={`bg-yellow-400 text-purple-900 hover:bg-yellow-500 ${
              isLoading ? "cursor-not-allowed" : "hover:scale-105"
            }`}
            onClick={handleRefresh}
            icon={isLoading ? FaSpinner : FaSyncAlt}
            disabled={isLoading}
          >
            {isLoading ? `Refreshing (${countdown})` : "Refresh Page"}
          </Button>
          <Button
            className="bg-purple text-purple-900 hover:bg-purple hover:scale-105"
            onClick={() => (window.location.href = "/")}
            icon={FaHome}
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
