import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../constant";
import axios from "axios";
import styles from "./style.module.css";
import ring from "../../assets/Images/CustHead1.jpg";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

// Styled components for the menu items
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

function SearchBar({
  openingCategory,
  setOpeningCategory,
  searchTerm,
  setSearchTerm,
}) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/category/all-unhide`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching Categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearchProduct = async () => {
    try {
      const userId = localStorage.getItem("userId");
      // const response = await axios.get(
      //   `${BASE_URL}/products/filter?userId=${userId}&searchName=${searchTerm}`
      // );

      navigate(`/shop?userId=${userId}&searchName=${searchTerm}`);
      if (offcanvasRef.current) {
        const offcanvas = window.bootstrap.Offcanvas.getInstance(
          offcanvasRef.current
        );
        if (offcanvas) offcanvas.hide();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {location.pathname === "/" && (
        <div className={styles.search_bar}>
          {/* Search Icon and Input */}
          <div className={styles.search_container}>
            <input
              type="text"
              placeholder="Search"
              className={styles.search_input}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setSearchTerm(e.target.value);
                  setOpeningCategory("");
                  handleSearchProduct();
                }
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setSearchTerm(e.target.value);
                setOpeningCategory("");
                handleSearchProduct();
              }}
            >
              <FaSearch size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Menu Container for Categories */}
      {location.pathname === "/" && (
        <MenuContainer>
          {categories.map((category, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                setOpeningCategory(category.categoryId);
                navigate(`/shop?category=${category.categoryId}`);
              }}
            >
              <MenuImageContainer>
                <MenuImage
                  src={category.categoryImage}
                  alt={category.categoryName}
                  className="w-full h-full object-cover"
                />
              </MenuImageContainer>
              <MenuText> {category.categoryName}</MenuText>
            </MenuItem>
          ))}
        </MenuContainer>
      )}
    </div>
  );
}

export default SearchBar;
