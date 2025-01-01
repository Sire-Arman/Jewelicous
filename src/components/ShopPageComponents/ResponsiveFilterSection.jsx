import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Slider from "react-slider";

const categories = [
  {
    categoryId: 1,
    categoryName: "Men",
    subcategoryList: [
      { subCategoryId: 1, subCategoryName: "SubCat1" },
      { subCategoryId: 2, subCategoryName: "SubCat2" },
    ],
  },
  {
    categoryId: 2,
    categoryName: "Women",
    subcategoryList: [
      { subCategoryId: 3, subCategoryName: "SubCat1" },
      { subCategoryId: 4, subCategoryName: "SubCat2" },
    ],
  },
  {
    categoryId: 3,
    categoryName: "Kids",
    subcategoryList: [
      { subCategoryId: 5, subCategoryName: "SubCat1" },
      { subCategoryId: 6, subCategoryName: "SubCat2" },
    ],
  },
];

const categories2 = [
  {
    categoryId: 1,
    categoryName: "T Shape",
    subcategoryList: [
      { subCategoryId: 1, subCategoryName: "SubCat1" },
      { subCategoryId: 2, subCategoryName: "SubCat2" },
    ],
  },
  {
    categoryId: 2,
    categoryName: "HP Shape",
    subcategoryList: [
      { subCategoryId: 3, subCategoryName: "SubCat1" },
      { subCategoryId: 4, subCategoryName: "SubCat2" },
    ],
  },
  {
    categoryId: 3,
    categoryName: "C Shape",
    subcategoryList: [
      { subCategoryId: 5, subCategoryName: "SubCat1" },
      { subCategoryId: 6, subCategoryName: "SubCat2" },
    ],
  },
];
const ResponsiveFilterSection = () => {
  const [stockStatus, setStockStatus] = useState("");

  const [values, setValues] = useState([0, 100]); // Example price range
  const minPrice = 0;
  const inStockCount = 120;
  const outOfStockCount = 74;

  const [dropdownStates, setDropdownStates] = useState({});

  const handleDropdownToggle = (categoryName) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [categoryName]: !prevState[categoryName],
    }));
  };

  const handleStockStatusChange = (status) => {
    setStockStatus(status);
  };

  return (
    <div>
      {" "}
      <div
        class="offcanvas offcanvas-start"
        tabindex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div
          class="offcanvas-header"
          style={{ borderBottom: "2px solid silver" }}
        >
          <h1
            style={{ fontWeight: "bold", fontSize: "25px", color: "#5d0b86" }}
            class="offcanvas-title"
            id="offcanvasExampleLabel"
          >
            Filter Products
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body p-4">
          <h4 style={{ fontWeight: "bold", fontSize: "20px" }}>Filter By</h4>
          <div className="mb-4">
            <div className="checkbox-container mt-1">
              <h6 style={{ fontSize: "16px", fontWeight: "bold" }}>
                <input
                  type="checkbox"
                  style={{ height: "15px", width: "15px" }}
                  checked={stockStatus === "inStock"}
                  onChange={() => handleStockStatusChange("inStock")}
                />{" "}
                In Stock
                <span> ({inStockCount})</span>
              </h6>
              <h6 style={{ fontSize: "16px", fontWeight: "bold" }}>
                <input
                  style={{ height: "15px", width: "15px" }}
                  type="checkbox"
                  checked={stockStatus === "outOfStock"}
                  onChange={() => handleStockStatusChange("outOfStock")}
                />{" "}
                Out of Stock
                <span> ({outOfStockCount})</span>
              </h6>
            </div>
            <div className="price-slider-container">
              <Slider
                className={"price-slider"}
                value={values}
                min={minPrice}
                max={100}
                onChange={setValues}
              />
              <div className={"range-values"}>
                <span>Rs.{values[0]}</span>
                <span>Rs. {values[1]}</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 justify-content-start mt-3">
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Sort by
              </p>
              <button
                type="button"
                style={{
                  border: "1px solid black",
                  fontSize: "14px",
                  padding: " 2px 5px",
                  borderRadius: "50px",
                }}
              >
                Alphabetically
              </button>
            </div>
          </div>
          <div className="dropdown-container">
            <h4 style={{ fontWeight: "bold", fontSize: "20px" }}>
              Shop By Categories
            </h4>
            {categories.map((category) => (
              <div key={category.categoryId}>
                <div className="dropdown">
                  <span
                    onClick={() => handleDropdownToggle(category.categoryName)}
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
                      <li key={subcategory.subCategoryId}>
                        {subcategory.subCategoryName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            <div className="mt-3">
              <div className="d-flex align-items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  className="filter-checkbox"
                  checked={stockStatus === "inStock"}
                  onChange={() => handleStockStatusChange("inStock")}
                />{" "}
                <p style={{ fontSize: "20px" }}>Offered Products</p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  className="filter-checkbox"
                  checked={stockStatus === "outOfStock"}
                  onChange={() => handleStockStatusChange("outOfStock")}
                />{" "}
                <p style={{ fontSize: "20px" }}>Lightning Deals </p>
              </div>
            </div>
          </div>
          <div className="dropdown-container">
            <h4 style={{ fontWeight: "bold", fontSize: "20px" }}>
              Shop By Shape
            </h4>
            {categories2.map((category) => (
              <div key={category.categoryId}>
                <div className="dropdown">
                  <span
                    onClick={() => handleDropdownToggle(category.categoryName)}
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
                      <li key={subcategory.subCategoryId}>
                        {subcategory.subCategoryName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveFilterSection;
