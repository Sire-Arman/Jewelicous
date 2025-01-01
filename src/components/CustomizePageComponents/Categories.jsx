import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../constant";
import axios from "axios";

// Import Swiper styles
import "swiper/css";

function Categories({
  onSelectCategory,
  onApplyClick,
  noOfTimesFormSubmitted,
}) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("selectedCustomizedCategory") || null
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/category/all-unhide`);
        const categoriesData = response.data;
        setCategories(categoriesData);
        const temp = categoriesData.find((item) => {
          return item.categoryId == selectedCategory;
        });
        setSelectedCategory(temp);
        if (temp) {
          handleApplyClick(temp);
        }
        localStorage.removeItem("selectedCustomizedCategory");
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (noOfTimesFormSubmitted != 0) {
      setSelectedCategory(null);
    }
  }, [noOfTimesFormSubmitted]);

  const handleOptionClick = (category) => {
    setSelectedCategory(category);
  };

  const handleApplyClick = (...args) => {
    onApplyClick(); // Call the apply click handler
    if (args[0]?.categoryId) {
      onSelectCategory(args[0]);
    } else {
      onSelectCategory(selectedCategory);
    }
  };

  return (
    <div className="bg-[#F6F6F6] mt-2  rounded-xl bg-sky-100">
      <h2 className="text-center text-[30px] font-bold mb-2 pt-4 ">
        Categories
      </h2>
      <div className="grid grid-cols-1 gap-1 px-3">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`flex items-center bg-sky-100 p-2 rounded-lg cursor-pointer transition-transform transform hover:scale-105 hover:bg-sky-200 w-full mb-4 ${
              selectedCategory === category ? "ring-4 ring-[#5a2d82]" : ""
            }`}
            onClick={() => {
              handleOptionClick(category);
              handleApplyClick(category);
            }}
            style={{ minHeight: "60px" }} // Ensure a minimum height for each card
          >
            {/* Image Section */}
            <img
              className="w-16 h-16 rounded-full object-cover mr-6"
              src={category.categoryImage}
              alt={category.categoryName}
            />

            {/* Text Section */}
            <p className="text-lg font-semibold text-gray-800">
              {category.categoryName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
