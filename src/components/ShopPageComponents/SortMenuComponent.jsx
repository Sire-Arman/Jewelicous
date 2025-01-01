import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import { CgSearch } from "react-icons/cg";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Slider from "react-slider";
import { BsSliders } from "react-icons/bs";
import ResponsiveFilterSection from "./ResponsiveFilterSection";
import axios from "axios";
import cogoToast from "cogo-toast";
import { BASE_URL } from "../../../constant";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

const SortMenuComponent = ({
  setCurrentProducts,
  searchTerm,
  onSearch,
  values,
  setValues,
  sortByAlphabatically,
  setSortByAlphabatically,
  stockStatus,
  setStockStatus,
  currentSubcategory,
  setCurrentSubcategory,
  currentCategory,
  setCurrentPage,
  setCurrentCategory,
  scheme,
  setScheme,
  openingCategory,
  setOpeningCategory,
  sizes,
  selectedSize,
  setSelectedSize,
  setOrder,
  order,
}) => {
  const navigate = useNavigate();
  const offcanvasRef = useRef(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(values[0]);
  const [minPrice, setMinPrice] = useState(values[1]);

  const [dropdownStates, setDropdownStates] = useState({});
  const [categories, setCategories] = useState([]);
  const [showAll, setshowAll] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [highestPrice, setHighestPrice] = useState();

  const handleResetClick = async () => {
    setStockStatus("");
    setOrder(false);
    setMinPrice(0);
    setMaxPrice(highestPrice);
    setValues([0, highestPrice]);
    setSortByAlphabatically(false);
    // window.location.reload();
  };

  console.log("max price", highestPrice);
  useEffect(() => {
    fetchHighestPrice();
  }, []);

  const fetchHighestPrice = async () => {
    try {
      const res = axios
        .get(`${BASE_URL}/products/allProductList`)
        .then((response) => {
          const products = response.data;
          const prices = products.map((product) => product.productPrice);
          const maximumPrice = Math.max(...prices);
          setMaxPrice(maximumPrice);
          setHighestPrice(maximumPrice);
        })
        .catch((error) => {
          console.error("Error fetching product list:", error);
        });
    } catch (error) {}
  };

  const handleDropdownToggle = (categoryName) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [categoryName]: !prevState[categoryName],
    }));
  };

  const handleSubcategoryClick = (subCategoryId) => {
    setOpeningCategory("");
    setCurrentPage(0);
    setCurrentSubcategory(subCategoryId);
  };
  const handleCategoryClick = (categoryId) => {
    setCurrentPage(0);
    setOpeningCategory("");
    setCurrentCategory(categoryId);
    setCurrentSubcategory(null);
    window.scroll(0, 0);
  };

  const handleStockStatusChange = (status) => {
    setStockStatus(status);
    setCurrentPage(0);
  };

  const toggleSortDropdown = () => {
    setIsSortOpen(!isSortOpen);
  };

  const handleSearchChange = (event) => {
    setOpeningCategory("");
    onSearch(event.target.value);
    navigate("/shop");
  };

  const handleSchemeChange = (selectedscheme) => {
    if (scheme == selectedscheme) {
      setScheme("");
    } else {
      setScheme(selectedscheme);
    }
  };

  const handleShape = (selectedshape) => {
    if (selectedshape == shape) {
      setShape("");
    } else {
      setShape(selectedshape);
    }
  };

  // Fetch categories from the API
  useEffect(() => {
    fetch(`${BASE_URL}/category/all-unhide`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  }, [values]);

  useEffect(() => {
    if (offcanvasRef.current) {
      const offcanvas = window.bootstrap.Offcanvas.getInstance(
        offcanvasRef.current
      );
      if (offcanvas) offcanvas.hide();
    }
  }, [
    selectedSize,
    stockStatus,
    values,
    sortByAlphabatically,
    scheme,
    selectedSize,
    currentSubcategory,
    currentCategory,
  ]);

  useEffect(() => {
    if (offcanvasRef.current) {
      const offcanvas = new window.bootstrap.Offcanvas(offcanvasRef.current);
      offcanvas.hide();
    }
  }, [offcanvasRef]);

  return (
    <div>
      <div className="search ">
        {/* <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="search-bar-icon">
            <CgSearch size={25} />
          </div>
        </div> */}
        <Dropdown>
          <Dropdown.Toggle
            variant=""
            style={{ fontWeight: "bold", fontSize: "20px" }}
            id="dropdown-basic"
          >
            Filter by
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <div className="dropdown-item">
              <input
                type="checkbox"
                style={{ height: "15px", width: "15px" }}
                checked={stockStatus === "inStock"}
                onChange={() => handleStockStatusChange("inStock")}
              />{" "}
              In Stock
            </div>
            <div className="dropdown-item">
              {" "}
              <input
                style={{ height: "15px", width: "15px" }}
                type="checkbox"
                checked={stockStatus === "outOfStock"}
                onChange={() => {
                  handleStockStatusChange("outOfStock");
                }}
              />{" "}
              Out of Stock
            </div>
            <div className="dropdown-item">
              <input
                type="checkbox"
                style={{ height: "15px", width: "15px" }}
                checked={order}
                onChange={() => {
                  // setScheme("price");
                  setOrder(true);
                  setCurrentPage(0);
                }}
              />{" "}
              Low to High
            </div>
            <div className="dropdown-item">
              <input
                type="checkbox"
                style={{ height: "15px", width: "15px" }}
                checked={!order}
                onChange={() => {
                  setCurrentPage(0);
                  // setScheme("price");
                  setOrder(false);
                }}
              />{" "}
              High to Low
            </div>

            <div className="dropdown-item">
              <div className="minprice-container py-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="minprice-text">Min Price:-</span>
                <button
                  className="minprice-button"
                  onClick={() => {
                    setCurrentPage(0);
                    // Allow digits and at most one dot
                    const sanitizedRange = String(minPrice).replace(
                      /[^0-9.]/g,
                      ""
                    );
                    const dotCount = (sanitizedRange.match(/\./g) || []).length;
                    // Check for more than one dot or invalid numeric format
                    if (
                      dotCount > 1 ||
                      sanitizedRange != minPrice ||
                      sanitizedRange === "" ||
                      isNaN(sanitizedRange) ||
                      sanitizedRange.split(".").some((part) => isNaN(part))
                    ) {
                      cogoToast.error(
                        `${minPrice} is not valid price range. Please enter a valid price range (e.g., 123.45)`
                      );
                      setMinPrice(values[0]);
                      return;
                    }

                    setValues((prevValues) => {
                      // Create a new array based on previous values
                      const newValues = [...prevValues];
                      newValues[0] = minPrice;
                      return newValues;
                    });
                    setScheme("price");
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
            <div className="dropdown-item">
              {" "}
              <div className="maxprice-container mt-2 py-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
                <span className="maxprice-text">Max Price:-</span>
                <button
                  className="maxprice-button"
                  onClick={() => {
                    setCurrentPage(0);
                    // Allow digits and at most one dot
                    const sanitizedRange = String(maxPrice).replace(
                      /[^0-9.]/g,
                      ""
                    );
                    const dotCount = (sanitizedRange.match(/\./g) || []).length;
                    // Check for more than one dot or invalid numeric format
                    if (
                      dotCount > 1 ||
                      sanitizedRange != maxPrice ||
                      sanitizedRange === "" ||
                      isNaN(sanitizedRange) ||
                      sanitizedRange.split(".").some((part) => isNaN(part))
                    ) {
                      cogoToast.error(
                        `${maxPrice} is not valid price range. Please enter a valid price range (e.g., 123.45)`
                      );
                      setMaxPrice(values[1]);
                      return;
                    }

                    setValues((prevValues) => {
                      // Create a new array based on previous values
                      const newValues = [...prevValues];
                      newValues[1] = maxPrice;
                      return newValues;
                    });
                    setScheme("price");
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
            <div className="dropdown-item">
              <div className="d-flex align-items-center gap-3 mt-3">
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
                  className={`${
                    sortByAlphabatically ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => setSortByAlphabatically(!sortByAlphabatically)}
                >
                  Alphabetically
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-center px-2 py-2">
              <button
                onClick={handleResetClick}
                className="w-[100%] bg-[red] text-[#fff] rounded py-1"
              >
                Reset
              </button>
            </div>
          </Dropdown.Menu>
        </Dropdown>
        <div
          className="resp-filters"
          data-bs-toggle="offcanvas"
          href="#offcanvasExample"
          role="button"
          aria-controls="offcanvasExample"
        >
          <BsSliders size={25} />
        </div>
        {/* <ResponsiveFilterSection /> */}

        <div>
          {" "}
          <div
            class="offcanvas offcanvas-start"
            tabindex="-1"
            id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel"
            ref={offcanvasRef}
          >
            <div
              class="offcanvas-header"
              style={{ borderBottom: "2px solid silver" }}
            >
              <h1
                style={{
                  fontWeight: "bold",
                  fontSize: "25px",
                  color: "#5d0b86",
                }}
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
              <h4 style={{ fontWeight: "bold", fontSize: "20px" }}>
                Filter By
              </h4>
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
                  </h6>
                  <h6 style={{ fontSize: "16px", fontWeight: "bold" }}>
                    <input
                      style={{ height: "15px", width: "15px" }}
                      type="checkbox"
                      checked={stockStatus === "outOfStock"}
                      onChange={() => handleStockStatusChange("outOfStock")}
                    />{" "}
                    Out of Stock
                  </h6>
                </div>

                <div className="price-slider-container">
                  {/*<div className="minprice-container">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span className="minprice-text">Min Price:-</span>
                    <button
                      className="minprice-button"
                      onClick={() => {
                        // Allow digits and at most one dot
                        const sanitizedRange = String(minPrice).replace(
                          /[^0-9.]/g,
                          ""
                        );
                        const dotCount = (sanitizedRange.match(/\./g) || [])
                          .length;
                        // Check for more than one dot or invalid numeric format
                        if (
                          dotCount > 1 ||
                          sanitizedRange != minPrice ||
                          sanitizedRange === "" ||
                          isNaN(sanitizedRange) ||
                          sanitizedRange.split(".").some((part) => isNaN(part))
                        ) {
                          cogoToast.error(
                            `${minPrice} is not valid price range. Please enter a valid price range (e.g., 123.45)`
                          );
                          setMinPrice(values[0]);
                          return;
                        }

                        setValues((prevValues) => {
                          // Create a new array based on previous values
                          const newValues = [...prevValues];
                          newValues[0] = minPrice;
                          return newValues;
                        });
                      }}
                    >
                      Apply
                    </button>
                  </div>*/}
                  {/*<div className="maxprice-container">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                    <span className="maxprice-text">Max Price:-</span>
                    <button
                      className="maxprice-button"
                      onClick={() => {
                        // Allow digits and at most one dot
                        const sanitizedRange = String(maxPrice).replace(
                          /[^0-9.]/g,
                          ""
                        );
                        const dotCount = (sanitizedRange.match(/\./g) || [])
                          .length;
                        // Check for more than one dot or invalid numeric format
                        if (
                          dotCount > 1 ||
                          sanitizedRange != maxPrice ||
                          sanitizedRange === "" ||
                          isNaN(sanitizedRange) ||
                          sanitizedRange.split(".").some((part) => isNaN(part))
                        ) {
                          cogoToast.error(
                            `${maxPrice} is not valid price range. Please enter a valid price range (e.g., 123.45)`
                          );
                          setMaxPrice(values[1]);
                          return;
                        }

                        setValues((prevValues) => {
                          // Create a new array based on previous values
                          const newValues = [...prevValues];
                          newValues[1] = maxPrice;
                          return newValues;
                        });
                      }}
                    >
                      Apply
                    </button>
                  </div>*/}
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
                    className={`${
                      sortByAlphabatically ? "bg-primary text-white" : ""
                    }`}
                    onClick={() =>
                      setSortByAlphabatically(!sortByAlphabatically)
                    }
                  >
                    Alphabetically
                  </button>
                </div>
              </div>
              <div className="dropdown-container">
                <h4 className="text-[20px] font-bold">Shop By Categories</h4>
                {categories.map((category, index) => (
                  <div
                    key={category.categoryId}
                    className={`${
                      index > 2 ? (showAllCategories ? "" : "hidden") : ""
                    }`}
                  >
                    <div className="dropdown">
                      <span
                        onClick={() => {
                          navigate(`/shop?category=${category.categoryId}`);
                          handleDropdownToggle(category.categoryName);
                          handleCategoryClick(category.categoryId);
                        }}
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
                          dropdownStates[category.categoryName]
                            ? "drop-show"
                            : ""
                        }
                      >
                        {category.subcategoryList.map((subcategory) => (
                          <Link
                            to={`/shop?category=${category.categoryName}`}
                            style={{
                              textDecoration: "none",
                              color: "black",
                            }}
                          >
                            <li
                              key={subcategory.subCategoryId}
                              onClick={() =>
                                handleSubcategoryClick(
                                  subcategory.subCategoryId
                                )
                              }
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
                  className="mt-2 ml-2 text-blue-600"
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
                      onClick={() => handleSchemeChange("offered")}
                    />{" "}
                    <p style={{ fontSize: "20px" }}>Offered Products</p>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={scheme == "lightning"}
                      onClick={() => handleSchemeChange("lightning")}
                    />{" "}
                    <p style={{ fontSize: "20px" }}>Lightning Deals</p>
                  </div>
                </div>
              </div>
              {/*<div className="dropdown-container">
                <h4 className="text-[20px] font-bold mb-3">Shop By Size</h4>
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
                        {size.sizenumber}
                        {"-"}
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
              </div>
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortMenuComponent;
