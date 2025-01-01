import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../constant";
import axios from "axios";
import styled from "styled-components";

// Import Swiper styles
import "swiper/css";

const MenuContainer = styled.div`
  display: flex;
  overflow-x: auto; /* Enable horizontal scrolling */
  padding: 10px;
  white-space: nowrap;

  ::-webkit-scrollbar {
    display: none; /* Hide scrollbar for cleaner look */
  }
`;

const MenuItem = styled.div`
  text-align: center;
  margin: 0 8px;
  cursor: pointer;
`;

const MenuImageContainer = styled.div`
  width: 80px; /* Match with MenuImage dimensions */
  height: 80px; /* Match with MenuImage dimensions */
  border-radius: 10px; /* Rounded corners */
  overflow: hidden; /* Hide overflow for consistent rounding */
`;

const MenuImage = styled.img`
  width: 100%; /* Ensure image fills container */
  height: 100%; /* Ensure image fills container */
  object-fit: cover; /* Cover ensures aspect ratio */
`;

const MenuText = styled.p`
  font-size: 12px;
  margin-top: 5px;
  color: white;
`;

function ResponsiveCategories({
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
    <div className="bg-[#F6F6F6] mb-3">
      <h2 className="text-center text-[white] text-[25px] font-bold mb-2 pt-4 ">
        Categories
      </h2>
      <MenuContainer>
        {categories.map((category, index) => (
          <MenuItem
            key={index}
            className={`flex flex-col items-center bg-[black] p-2 rounded-md cursor-pointer transition-transform transform hover:scale-105 hover:bg-[grey] w-full mb-4 ${
              selectedCategory === category ? "ring-4 ring-[grey] " : ""
            }`}
            onClick={() => {
              handleOptionClick(category);
              handleApplyClick(category);
            }}
            style={{ minHeight: "60px" }}
          >
            <MenuImageContainer>
              <MenuImage
                src={category.categoryImage}
                alt={category.categoryName}
                className="w-full h-full object-cover"
              />
            </MenuImageContainer>
            {/* Text Section */}
            <MenuText> {category.categoryName}</MenuText>
          </MenuItem>
        ))}
      </MenuContainer>
    </div>
  );
}

export default ResponsiveCategories;
