import React, { useState, useEffect } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Slider from "react-slider";
import "./styles.css";
import { BASE_URL } from "../../../constant";
import { Link, useNavigate } from "react-router-dom";

const FilterSection = ({
  openingCategory,
  setOpeningCategory,
  setCurrentSubcategory,
  setCurrentCategory,
  scheme,
  setScheme,
  setCurrentPage,
  sizes,
  selectedSize,
  setSelectedSize,
}) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({});
  const [stockStatus, setStockStatus] = useState("");
  const [categories, setCategories] = useState([]);
  const [showAll, setshowAll] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const navigate = useNavigate();

  // Fetch categories from the API
  useEffect(() => {
    fetch(`${BASE_URL}/category/all-unhide`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleDropdownToggle = (categoryName) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [categoryName]: !prevState[categoryName],
    }));
    window.scroll(0, 0);
  };

  const handleSubcategoryClick = (subCategoryId) => {
    window.location.reload();
    setOpeningCategory("");
    setCurrentPage(0);
    setCurrentSubcategory(subCategoryId);
    window.scroll(0, 0);
  };

  const handleCategoryClick = (categoryId) => {
    window.location.reload();
    setCurrentPage(0);
    setOpeningCategory("");
    setCurrentCategory(categoryId);
    setCurrentSubcategory(null);
    fetchAllProducts();
    window.scroll(0, 0);
  };

  const handleSchemeChange = (selectedscheme) => {
    if (scheme == selectedscheme) {
      setScheme("");
      window.scroll(0, 0);
    } else {
      setScheme(selectedscheme);
      window.scroll(0, 0);
    }
  };

  return (
    <div id="sidebar" className={showSidebar ? "show" : ""}>
      <div className="dropdown-container">
        <button
          onClick={() => {
            navigate("/shop");
            window.location.reload();
          }}
          className="text-2xl font-bold bg-white px-3 py-2 rounded shadow-xl mb-4"
        >
          All Products
        </button>
        <h4>Shop By Categories</h4>
        {categories.map((category, index) => (
          <div
            key={category.categoryId}
            className={`${
              index > 5 ? (showAllCategories ? "" : "hidden") : ""
            }`}
          >
            <div className="dropdown">
              <span
                onClick={() => {
                  navigate(`/shop?category=${category.categoryId}`);
                  handleDropdownToggle(category.categoryName);
                  handleCategoryClick(category.categoryId);
                }}
                className="font-bold" // Make the category name bold
              >
                {category.categoryName}
                {dropdownStates[category.categoryName] ? (
                  <IoIosArrowUp />
                ) : (
                  <IoIosArrowDown />
                )}
              </span>
              <ul
                className={
                  dropdownStates[category.categoryName] ? "drop-show" : ""
                }
              >
                {category.subcategoryList.map((subcategory) => (
                  <Link
                    to={`/shop?category=${category.categoryId}`}
                    style={{ textDecoration: "none", color: "black" }}
                    key={subcategory.subCategoryId}
                  >
                    <li
                      onClick={() =>
                        handleSubcategoryClick(subcategory.subCategoryId)
                      }
                      className="text-gray-700 hover:text-blue-500" // Optional styling for subcategories
                    >
                      {subcategory.subCategoryName}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <button
          className="mt-3 text-blue-600"
          style={{ textDecoration: "underline", color: "green" }}
          onClick={() => setShowAllCategories(!showAllCategories)}
        >
          {showAllCategories ? "Show Less" : "Show More"}
        </button>

        <div className="mt-3">
          <div className="d-flex align-items-center gap-2 mb-3">
            <input
              type="checkbox"
              className="filter-checkbox"
              checked={scheme == "offered"}
              // onClick={()=>setScheme("offered")}
              onClick={() => handleSchemeChange("offered")}
            />{" "}
            <p style={{ fontSize: "20px" }}>Offered Products</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <input
              type="checkbox"
              className="filter-checkbox"
              checked={scheme == "lightning"}
              // onClick={()=>setScheme("lightning")}
              onClick={() => handleSchemeChange("lightning")}
            />{" "}
            <p style={{ fontSize: "20px" }}>Lightning Deals</p>
          </div>
        </div>
      </div>

      {/* <div className="dropdown-container">
        <h4 className="text-[18px] font-bold mb-2">Shop By Size</h4>
        <div className="pl-1">
          <div className="flex gap-3">
            <input
              type="checkbox"
              style={{ width: "20px" }}
              checked={selectedSize == "all"}
              onChange={() => setSelectedSize("all")}
            />
            <span className="text-[20px] mb-1">All sizes</span>
          </div>
          {sizes.map((size, index) => (
            <div
              className={`flex gap-3 mb-1 ${
                index > 5 ? (showAll ? "" : "hidden") : ""
              }`}
            >
              <input
                type="checkbox"
                style={{ width: "20px" }}
                checked={selectedSize == size.sizenumber}
                onChange={() => setSelectedSize(size.sizenumber)}
              />
              <span className="text-[20px]">
                {size.sizenumber}{"-"}
                {`${
                  size.sizenumber != 0 ? `(${size.sizemm}mm)` : "(fs)"
                }`}
              </span>
            </div>
          ))}
          <div className="flex justify-center">
            <button
              className="text-white bg-purple px-3 flex-grow mt-2 py-2 rounded-full"
              onClick={() => setshowAll(!showAll)}
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default FilterSection;
