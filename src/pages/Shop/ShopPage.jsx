import React, { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { CiCircleRemove } from "react-icons/ci";
import { CgSearch } from "react-icons/cg";
import "./ShopPage.css";
import { FaRegHeart } from "react-icons/fa";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { IoStar } from "react-icons/io5";
import { FaHeart } from "react-icons/fa6";
import FilterSection from "../../components/ShopPageComponents/FilterSection.jsx";
import SortMenuComponent from "../../components/ShopPageComponents/SortMenuComponent.jsx";
import ProductsContainer from "../../components/ShopPageComponents/ProductsContainer.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../constant";
import BackButton from "../../components/CommonComponents/BackButton.jsx";
import Breadcrumb from "../../components/BreadCrumbs.jsx";

const ShopPage = ({
  openingCategory,
  setOpeningCategory,

  searchTerm,
  setSearchTerm,
}) => {
  // const [searchTerm, setSearchTerm] = useState("");
  const [navigatedCategory, setNavigatedCategory] = useState("");
  // const [openingCategory, setOpeningCategory] = useState("");
  const [currentProducts, setCurrentProducts] = useState([]);
  const [values, setValues] = useState([0, 100000000000]);
  const [sortByAlphabatically, setSortByAlphabatically] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [stockStatus, setStockStatus] = useState("");
  const [scheme, setScheme] = useState("");
  const [shape, setShape] = useState("");
  const [selectedSize, setSelectedSize] = useState("all");
  const [sizes, setSizes] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("category") || "";
  const navigate = useNavigate();
  const [order, setOrder] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get("search") || "";
    const navigatedCategoryTemp = queryParams.get("category") || "";
    const navigatedCategoryId = queryParams.get("categoryId") || "";
    // console.log(navigatedCategoryTemp);
    setSearchTerm(navigatedCategoryTemp);
    if (navigatedCategoryTemp || initialQuery) {
      // setOpeningCategory(navigatedCategoryId)
      setNavigatedCategory(navigatedCategoryTemp || initialQuery);
    } else {
      setNavigatedCategory("");
      setCurrentSubcategory("");
    }
  }, [location.search, openingCategory]);

  // console.log(searchTerm);

  const handleCategorySelection = (categoryName) => {
    if (categoryName == "Rings") {
      setNavigatedCategory(categoryName.slice(0, categoryName.length - 1));
    } else {
      setNavigatedCategory(categoryName);
    }
  };

  useEffect(() => {
    if (!openingCategory && searchTerm != "") setNavigatedCategory("");
    // window.scrollTo(0,0);
  }, [searchTerm]);

  useEffect(() => {
    if (navigatedCategory != "") {
      setSearchTerm("");
    }
  }, [navigatedCategory]);

  // useEffect(() => {
  //   navigate("/shop");
  // }, [navigate]);

  const fetchMaxPrice = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/allProductList`);
      const products = response.data;
      const maxPrice = Math.max(
        ...products.map((product) => product.productPrice)
      );
      setValues([0, maxPrice]); // Set the price range dynamically
    } catch (error) {
      navigate("/error");
      console.error("Error fetching max price:", error);
    }
  };

  const fetchsizes = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-variants/sizes
            `
      );

      setSizes(response.data);
    } catch (error) {
      navigate("/error");
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchsizes();
    fetchMaxPrice();
    // window.scrollTo(0, 0);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  console.log(
    currentProducts.find((prod) => +prod.categoryId == +navigatedCategory)
  );

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/category/all-unhide`);
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [navigatedCategory]);

  const categoryName = categories?.find(
    (cat) => Number(cat.categoryId) == Number(navigatedCategory)
  );

  return (
    <div style={{ background: "#f8f8f8" }}>
      <div className="shop-container">
        <FilterSection
          openingCategory={openingCategory}
          setCurrentPage={setCurrentPage}
          setOpeningCategory={setOpeningCategory}
          setCurrentSubcategory={setCurrentSubcategory}
          setCurrentCategory={setCurrentCategory}
          scheme={scheme}
          setScheme={setScheme}
          shape={shape}
          setShape={setShape}
          sizes={sizes}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          onCategorySelect={handleCategorySelection}
        />
        <div className="shop-products-container">
          {/*<Breadcrumbs />*/}
          <h1
            style={{
              fontWeight: "bold",
              fontSize: "25px",
              margin: "10px",
              textTransform: "capitalize",
            }}
          >
            {navigatedCategory || initialQuery
              ? (categories &&
                  categories?.find(
                    (cat) => Number(cat.categoryId) == Number(navigatedCategory)
                  )?.categoryName) ||
                (initialQuery == "Ring"
                  ? "Rings"
                  : categories &&
                    categories?.find(
                      (cat) => Number(cat.categoryId) == Number(initialQuery)
                    )?.categoryName)
              : "All Products"}
          </h1>
          <SortMenuComponent
            searchTerm={searchTerm}
            setCurrentPage={setCurrentPage}
            onSearch={handleSearch}
            setCurrentProducts={setCurrentProducts}
            values={values}
            setValues={setValues}
            sortByAlphabatically={sortByAlphabatically}
            setSortByAlphabatically={setSortByAlphabatically}
            stockStatus={stockStatus}
            setStockStatus={setStockStatus}
            openingCategory={openingCategory}
            setOpeningCategory={setOpeningCategory}
            currentSubcategory={currentSubcategory}
            setCurrentSubcategory={setCurrentSubcategory}
            currentCategory={currentCategory}
            setCurrentCategory={setCurrentCategory}
            scheme={scheme}
            setScheme={setScheme}
            shape={shape}
            setShape={setShape}
            sizes={sizes}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            setOrder={setOrder}
            order={order}
            onCategorySelect={handleCategorySelection}
          />
          <ProductsContainer
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            searchTerm={searchTerm}
            setScheme={setScheme}
            currentProducts={currentProducts}
            setCurrentProducts={setCurrentProducts}
            values={values}
            sortByAlphabatically={sortByAlphabatically}
            currentSubcategory={currentSubcategory}
            currentCategory={currentCategory}
            stockStatus={stockStatus}
            scheme={scheme}
            openingCategory={openingCategory}
            shape={shape}
            selectedSize={selectedSize}
            order={order}
            setStockStatus={setStockStatus}
            setCurrentCategory={setCurrentCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
