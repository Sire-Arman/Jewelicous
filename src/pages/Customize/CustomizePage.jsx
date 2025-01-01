import React, { useEffect, useState } from "react";
import Categories from "../../components/CustomizePageComponents/Categories";
import SubCategories from "../../components/CustomizePageComponents/SubCategories";
import PriceRange from "../../components/CustomizePageComponents/PriceRange";
import Color from "../../components/CustomizePageComponents/Color";
import Carat from "../../components/CustomizePageComponents/Carat";
import Size from "../../components/CustomizePageComponents/Size";
import BookCallComponent from "../../components/CommonComponents/BookACallComponent/BookCallComponent";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Weight from "../../components/CustomizePageComponents/Weights";
import { BASE_URL } from "../../../constant";
import axios from "axios";
import cogoToast from "cogo-toast";
import Swal from "sweetalert2";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { ExpandMoreOutlined } from "@mui/icons-material";
import "./style.css";
import ResponsiveCategories from "../../components/CustomizePageComponents/ResponsiveCategories";
import { useNavigate } from "react-router-dom";

// Define the initial state for customizeProduct
const initialProductState = {
  userName: "",
  userEmail: "",
  userPhone: "",
  status: "",
  createdTime: "",
  price: "",
  category: "",
  subCategory: "",
  colors: "",
  weights: "",
  diamondWeight: "",
  sizes: "",
  purity: "",
  diamondPurity: "",
  productName: "",
};

const CustomizePage = () => {
  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [priceRange, setPriceRange] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedCarat, setSelectedCarat] = useState(null);
  const [selectedGoldPurity, setSelectedGoldPurity] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [show, setShow] = useState(false);
  const [customizeProduct, setCustomizeProduct] = useState(initialProductState);

  //The noOfTimesFormSubmitted state is only created to reset the selectedvalue of each field of child components when user submitted the form.
  const [noOfTimesFormSubmitted, setNoOfTimesFormSubmitted] = useState(0);

  // Accordion states
  const [isSubCategoriesOpen, setIsSubCategoriesOpen] = useState(false);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isCaratOpen, setIsCaratOpen] = useState(false);
  const [isWeightOpen, setIsWeightOpen] = useState(false);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClose = () => {
    setShow(false);
    // navigate("/");
  };
  const handleShow = () => setShow(true);

  // console.log("selectedWeight", selectedWeight);

  // Check localStorage on component mount for productName presence
  useEffect(() => {
    const storedProductName = localStorage.getItem("productName");
    if (storedProductName) {
      setProductName(storedProductName);
    }
    localStorage.removeItem("productName");
  }, []);
  useEffect(() => {
    // If there's no subcategory list, apply the action
    if (selectedCategory && selectedCategory?.subcategoryList?.length === 0) {
      handleApplyClick("priceRange");
    }
    if (selectedCategory && selectedCategory?.subcategoryList?.length === 0) {
      handleApplyClick("priceRange");
    }
  }, [selectedCategory]);

  const handleApplyClick = (accordionType) => {
    // Close all other accordions and open the selected one
    setIsSubCategoriesOpen(accordionType === "subcategories");
    setIsPriceRangeOpen(accordionType === "priceRange");
    setIsColorOpen(accordionType === "color");
    setIsCaratOpen(accordionType === "carat");
    setIsWeightOpen(accordionType === "weight");
    setIsSizeOpen(accordionType === "size");
  };

  //As of now we are not using this handleFieldSelection function but we can replace the handleCategorySelect,handleSubCategorySelect,handlePriceRangeChange,handleColorSelect,handleCaratSelect,handleWeightSelect,handleSizeSelect functions in the future.And for that we have to pass correct props to All fields and then while calling this function we need to pass correct arguments to it.
  const handleFieldSelection = (
    selectedItem,
    setSelectedItemDropdown,
    dropdownName
  ) => {
    let customizeproductKeyName;
    let customizeproductKeyCorrespondingValue;

    if (dropdownName == "Category") {
      customizeproductKeyName = "category";
      customizeproductKeyCorrespondingValue = selectedItem.categoryId;
    } else if (dropdownName == "SubCategory") {
      customizeproductKeyName = "subCategory";
      customizeproductKeyCorrespondingValue = selectedItem.subCategoryId;
    } else if (dropdownName == "Price Range") {
      customizeproductKeyName = "price";
      customizeproductKeyCorrespondingValue = `${selectedItem[1]}`;
    } else if (dropdownName == "Color") {
      customizeproductKeyName = "colors";
      customizeproductKeyCorrespondingValue = selectedItem.id;
    } else if (dropdownName == "Carat") {
      customizeproductKeyName = "purity";
      customizeproductKeyCorrespondingValue = selectedItem.id;
    } else if (dropdownName == "Weight") {
      customizeproductKeyName = "weights";
      customizeproductKeyCorrespondingValue = selectedItem.id;
    } else if (dropdownName == "Size") {
      customizeproductKeyName = "sizes";
      customizeproductKeyCorrespondingValue = selectedItem.id.toString();
    }

    setSelectedItemDropdown(selectedItem);
    setCustomizeProduct((prevData) => ({
      ...prevData,
      [customizeproductKeyName]: customizeproductKeyCorrespondingValue,
    }));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCustomizeProduct((prevData) => ({
      ...prevData,
      category: category.categoryId,
    }));
  };

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setCustomizeProduct((prevData) => ({
      ...prevData,
      subCategory: subCategory.subCategoryId,
    }));
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
    // console.log(range);
    setCustomizeProduct((prevData) => ({
      ...prevData,
      price: `${range[1]}`,
      minPrice:`${range[0]}`,
      maxPrice:`${range[1]}`
    }));
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // console.log(selectedColor);
    setCustomizeProduct((prevData) => ({
      ...prevData,
      colors: color.id,
    }));
  };

  const handleCaratSelect = (diamondPurity, goldPurity) => {
    setSelectedCarat(diamondPurity);
    setSelectedGoldPurity(goldPurity);

    setCustomizeProduct((prevData) => ({
      ...prevData,
      purity: goldPurity.id,
      diamondPurity: diamondPurity.id,
    }));
  };

  const handleWeightSelect = (weight) => {
    setSelectedWeight(weight);
    setCustomizeProduct((prevData) => ({
      ...prevData,
      weights: weight.goldWeight.weight, // Sending goldWeight
      diamondWeight: weight.diamondWeight.weight, // Sending diamondWeight
    }));
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    // console.log("selectedSize", selectedSize);
    setCustomizeProduct((prevData) => ({
      ...prevData,
      sizes: size.sizenumber,
    }));
    // console.log("sdcsdsw", size.sizenumber);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomizeProduct((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameRegex = /^[A-Za-z\s]+$/;
    const sanitizedUsername = customizeProduct.userName.trim(); // Trimmed to remove extra spaces

    const sanitizedPhonenumber = customizeProduct.userPhone.replace(/\D/g, ""); // Removes non-digits

    if (!usernameRegex.test(sanitizedUsername)) {
      cogoToast.error(
        "Please enter a valid Username without special characters or numbers."
      );
      return;
    }

    if (sanitizedPhonenumber.length !== 10) {
      cogoToast.error("Please enter a valid 10-digit Mobile number.");
      return;
    }

    const productNameToSend = productName;

    try {
      console.log(customizeProduct);
      const response = await axios.post(
        `${BASE_URL}/customize/product-requests/create`,
        {
          ...customizeProduct,
          weights: selectedWeight.goldWeight.weight,
          diamondWeight: selectedWeight.diamondWeight.weight,
          productName: productNameToSend,
        }
      );

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Thank You!",
          text: "Your customization request has been submitted successfully! We'll review your preferences and get back to you shortly.",
          confirmButtonText: "Okay",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
            window.location.reload();
          }
        });

        // cogoToast.success(
        //   "Your customization request has been submitted successfully!t"
        // );

        // Reset all fields after successful submission
        setCustomizeProduct(initialProductState);
        setSelectedCategory(null);
        setSelectedSubCategory(null);
        setPriceRange(null);
        setSelectedColor(null);
        setSelectedCarat(null);
        setSelectedGoldPurity(null);
        setSelectedWeight(null);
        setSelectedSize(null);
        setIsSubCategoriesOpen(false);
        setIsPriceRangeOpen(false);
        setIsColorOpen(false);
        setIsCaratOpen(false);
        setIsWeightOpen(false);
        setIsSizeOpen(false);
        setNoOfTimesFormSubmitted(noOfTimesFormSubmitted + 1);
        handleClose();
      } else {
        // If the response status is not 200 or 201, show an error message
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error:", error);
      // cogoToast.error("Something went wrong with your submission.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with your submission. Please check your details and try again. If the issue persists, contact our support team.",
        confirmButtonText: "Okay",
      });
    }
  };

  // Toggle for accordion sections
  const toggleAccordion = (
    itsAboveAccordionState,
    isCurrentAccordionOpenState,
    setIsCurrentAccordionOpenStateSetterFunction,
    currentAccordionName
  ) => {
    if (itsAboveAccordionState) {
      setIsCurrentAccordionOpenStateSetterFunction(
        !isCurrentAccordionOpenState
      );
    } else if (
      currentAccordionName == "Price Range" &&
      !itsAboveAccordionState &&
      priceRange
    ) {
      setIsCurrentAccordionOpenStateSetterFunction(
        !isCurrentAccordionOpenState
      );
    } else {
      cogoToast.error(
        `Please select the other above fields before selecting ${currentAccordionName}.`
      );
    }
  };

  return (
    <div className="customize-container bg-[#F6F6F6] flex flex-col lg:flex-row p-4">
      {/* Left Section - Categories */}
      {!isMobile ? (
        <div className="lg:w-1/4 w-full p-4 ">
          <h2 className="text-center text-[42px] font-bold italic mb-4 text-shadow-lg">
            Customize
          </h2>
          <div className="bg- overflow-auto" style={{ maxHeight: "60vh" }}>
            <Categories
              onSelectCategory={handleCategorySelect}
              onApplyClick={() => handleApplyClick("subcategories")}
              noOfTimesFormSubmitted={noOfTimesFormSubmitted}
            />
          </div>
        </div>
      ) : (
        <React.Fragment>
          {" "}
          <h2 className="bg-[black] text-[#fff] text-center text-[38px] font-bold italic pt-2  text-shadow-lg">
            Customize
          </h2>
          <ResponsiveCategories
            onSelectCategory={handleCategorySelect}
            onApplyClick={() => handleApplyClick("subcategories")}
            noOfTimesFormSubmitted={noOfTimesFormSubmitted}
          />
        </React.Fragment>
      )}

      <div className="lg:w-3/4 w-full p-4 bg-white rounded-lg shadow-lg">
        <div className="allAccordionContainer">
          {/* Subcategory Accordion */}
          {selectedCategory?.subcategoryList?.length > 0 && (
            <Accordion
              expanded={isSubCategoriesOpen}
              onChange={() =>
                toggleAccordion(
                  selectedCategory,
                  isSubCategoriesOpen,
                  setIsSubCategoriesOpen,
                  "SubCategory"
                )
              }
              style={{
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                borderRadius: "5px",
                border: "none",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreOutlined />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className="w-full flex justify-between items-center pr-2">
                  <span className="text-2xl text-violet-800">SubCategory</span>
                  <span className="">
                    {selectedSubCategory?.subCategoryName
                      ? `(${selectedSubCategory.subCategoryName})`
                      : ""}
                  </span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <SubCategories
                  selectedCategory={selectedCategory}
                  onSelectSubCategory={handleSubCategorySelect}
                  onApplyClick={() => handleApplyClick("priceRange")}
                  noOfTimesFormSubmitted={noOfTimesFormSubmitted}
                />
              </AccordionDetails>
            </Accordion>
          )}
          {/* Price Range Accordion */}
          <Accordion
            expanded={isPriceRangeOpen}
            onChange={() =>
              toggleAccordion(
                selectedSubCategory,
                isPriceRangeOpen,
                setIsPriceRangeOpen,
                "Price Range"
              )
            }
            style={{
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              borderRadius: "5px",
              border: "none",
            }}
            slotProps={{ heading: { component: "h4" } }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreOutlined />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <div className="w-full flex justify-between items-center pr-2">
                <span className="text-2xl text-violet-800">Price Range</span>
                <span className="">
                  {priceRange
                    ? `(Rs.${priceRange?.[0]} - Rs.${priceRange?.[1]})`
                    : ""}
                </span>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <PriceRange
                onPriceRangeChange={handlePriceRangeChange}
                onApplyClick={() => handleApplyClick("color")}
                noOfTimesFormSubmitted={noOfTimesFormSubmitted}
              />
            </AccordionDetails>
          </Accordion>
          {/* Color Accordion */}
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2">
              <Accordion
                expanded={isColorOpen}
                onChange={() =>
                  toggleAccordion(
                    priceRange,
                    isColorOpen,
                    setIsColorOpen,
                    "Color"
                  )
                }
                style={{
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  borderRadius: "5px",
                  border: "none",
                }}
                slotProps={{ heading: { component: "h4" } }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreOutlined />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <div className="w-full flex justify-between items-center pr-2">
                    <span className="text-2xl text-violet-800">Color</span>
                    <span className="">
                      {" "}
                      {selectedColor?.colorname
                        ? `(${selectedColor.colorname})`
                        : ""}
                    </span>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <Color
                    onColorSelect={handleColorSelect}
                    onApplyClick={() => handleApplyClick("carat")}
                    noOfTimesFormSubmitted={noOfTimesFormSubmitted}
                  />
                </AccordionDetails>
              </Accordion>
            </div>
            <div className="lg:w-1/2">
              {/* Carat Accordion */}
              <Accordion
                expanded={isCaratOpen}
                onChange={() =>
                  toggleAccordion(
                    selectedColor,
                    isCaratOpen,
                    setIsCaratOpen,
                    "Carat"
                  )
                }
                style={{
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  // margin: " 50px 80px",
                  border: "none",
                  // padding: "8px",
                  borderRadius: "5px",
                }}
                slotProps={{ heading: { component: "h4" } }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreOutlined />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <div className="w-full flex justify-between items-center pr-2">
                    <span className="text-2xl text-violet-800">Purity</span>
                    <span className="">
                      {" "}
                      {selectedCarat?.name
                        ? `(${selectedCarat.name} - ${selectedCarat.type}`
                        : ""}
                      {selectedGoldPurity?.name
                        ? `/${selectedGoldPurity.name} - ${selectedGoldPurity.type})`
                        : ""}
                    </span>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <Carat
                    onCaratSelect={handleCaratSelect}
                    onApplyClick={() => handleApplyClick("weight")}
                    noOfTimesFormSubmitted={noOfTimesFormSubmitted}
                  />
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
          {/* Weight Accordion */}
          <Accordion
            expanded={isWeightOpen}
            onChange={() =>
              toggleAccordion(
                selectedCarat,
                isWeightOpen,
                setIsWeightOpen,
                "Weight"
              )
            }
            style={{
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              // margin: " 50px 80px",
              border: "none",
              // padding: "8px",
              borderRadius: "5px",
            }}
            slotProps={{ heading: { component: "h4" } }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreOutlined />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <div className="w-full flex justify-between items-center pr-2">
                <span className="text-2xl text-violet-800">Weight</span>
                <span className="">
                  {" "}
                  {selectedWeight?.diamondWeight.weight
                    ? `(${selectedWeight.diamondWeight.weight}ct/${selectedWeight.goldWeight.weight}g)`
                    : ""}
                </span>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <Weight
                onWeightSelect={handleWeightSelect}
                onApplyClick={() => handleApplyClick("size")}
                noOfTimesFormSubmitted={noOfTimesFormSubmitted}
              />
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="submit-customize-btn flex flex-col items-center justify-center pb-4">
          <button
            type="button"
            className="bg-[#5d0b86] text-white rounded-lg px-8 py-3 text-xl"
            onClick={handleShow}
          >
            Submit
          </button>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className="font-bold">Enter your details</Modal.Title>
          </Modal.Header>
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="userName"
                  value={customizeProduct.userName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  name="userEmail"
                  value={customizeProduct.userEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mobile Number</label>
                <input
                  type="number"
                  className="form-control"
                  name="userPhone"
                  value={customizeProduct.userPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" type="submit">
                Submit
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default CustomizePage;
