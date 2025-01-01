import React, { useEffect, useRef, useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaSearchPlus,
  FaSearchMinus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { BASE_URL } from "../../../constant";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import cogoToast from "cogo-toast";
import Pricebreakup from "../ProductPageComponents/Pricebreakup";
import CustomizeSelect from "./CustomizeSelect";
import { MenuItem, Select } from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import VerifyPincode from "./VerifyPincode";
import BackButton from "../CommonComponents/BackButton";
import Breadcrumb from "../BreadCrumbs";

function TopSection({ productCategory, setProductCategory }) {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [purityDetails, setPurityDetails] = useState(null);
  const priceBreakupRef = useRef(null);
  const [mrp, setMrp] = useState(null);
  const [price, setPrice] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedDiamondPurity, setSelectedDiamondPurity] = useState("");
  const [selectedGoldPurity, setSelectedGoldPurity] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [white, setWhite] = useState("");
  const [gold, setGold] = useState("");
  const [yellow, setYellow] = useState("");
  const [availableColors, setAvailableColors] = useState([]);
  const [purities, setPurities] = useState([]);
  const [currentProductDetailsArray, setCurrentProductDetailsArray] = useState(
    []
  );
  const [grandTotal, setGrandTotal] = useState(null);
  const [originalPriceWithoutDiscount, setOriginalPriceWithoutDiscount] =
    useState(null);

  const [ratingsData, setRatingsData] = useState({});

  useEffect(() => {
    fetchReviews(productId);
  }, [productId]);

  const fetchReviews = async (productId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-ratings/product/${productId}`
      );

      const reviews =
        response.data && Array.isArray(response.data) ? response.data : [];

      if (reviews.length === 0) {
        setRatingsData((prevData) => ({
          ...prevData,
          [productId]: {
            sum: 0,
            count: 0,
            average: 0,
          },
        }));
        return;
      }

      const totalRatings = reviews.reduce(
        (acc, review) => acc + Number(review.ratings),
        0
      );
      const countRatings = reviews.length;

      setRatingsData((prevData) => ({
        ...prevData,
        [productId]: {
          sum: totalRatings,
          count: countRatings,
          average: countRatings ? (totalRatings / countRatings).toFixed(1) : 0,
        },
      }));
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);

      setRatingsData((prevData) => ({
        ...prevData,
        [productId]: {
          sum: 0,
          count: 0,
          average: 0,
        },
      }));
    }
  };

  useEffect(() => {
    const defaultOption = "Select your Option";
    if (selectedColor?.toLowerCase() == "yellow" && yellow != null) {
      setSelectedPhoto(yellow);
    } else if (selectedColor?.toLowerCase() == "white" && white != null) {
      setSelectedPhoto(white);
    } else if (selectedColor !== defaultOption && gold != null) {
      setSelectedPhoto(gold);
    }
  }, [selectedColor, yellow, white, gold]);

  const fetchPurityDetails = async (purityId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/purity/${purityId}`);
      setPurityDetails(response.data);
    } catch (error) {
      console.error("Error fetching purity details:", error);
    }
  };

  const fetchAllPurities = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/purity/get-all`);
      const data = response.data;

      // Filter the data for Diamonds
      const diamondPurities = data.filter((item) => item.type === "Diamonds");

      const purityIds = diamondPurities.map((item) => item.id);

      setPurities(purityIds);
    } catch (error) {
      console.error("Error fetching all purities:", error);
      return [];
    }
  };

  const fetchCartItems = async () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const response = await axios.post(
          `${BASE_URL}/usercart/in-cart?userId=${userId}&pageSize=100`
        );
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchAllPurities();
  }, []);

  const fetchProductsByName = async () => {
    try {
      const response = await axios.get(
        BASE_URL +
          `/products/get-product-by-name?productName=${productDetails?.productName
            .split(" ")
            .join("")}`
      );

      if (response.status === 200) {
        setCurrentProductDetailsArray(response.data || []);
      } else {
        message.error("Something Went wrong!");
      }
    } catch (error) {
      // navigate("/error")
      console.error(error);
    }
  };

  const fetchProductDetails = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `${BASE_URL}/products/productId?userId=${userId}&id=${productId}`
      );
      const productData = response.data;

      // Update product details with the names
      setProductDetails(productData);
      setProductCategory(productData.categoryId);
      // Get first gold purity if available
      const firstGoldPurity = productData.goldPurities?.split(",")[0] || null;
      // Get first diamond purity if available and no gold purity exists
      const firstDiamondPurity =
        productData.diamondPurities?.split(",")[0] || null;

      if (firstGoldPurity) {
        fetchPurityDetails(firstGoldPurity);
      } else if (firstDiamondPurity) {
        fetchPurityDetails(firstDiamondPurity);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    if (
      productDetails &&
      productDetails.productPhotos &&
      productDetails.productPhotos.length > 0
    ) {
      const photos = productDetails.productPhotos[0];
      const getPhotoNameByIndex = (index) => {
        if (index === 1) return photos.photoName;
        if (index >= 2 && index <= 10)
          return photos[`photoName${index}`] || null;
        return null;
      };
      setSelectedPhoto(productDetails.productPhotos[0].photoName);
      setWhite(getPhotoNameByIndex(photos.white));
      setGold(getPhotoNameByIndex(photos.gold));
      setYellow(getPhotoNameByIndex(photos.yellow));
    }
    fetchProductsByName();
  }, [productDetails]);

  const getGalleryPhotos = (photos) => {
    const galleryPhotos = [];
    if (photos) {
      photos.forEach((photo) => {
        if (photo.photoName) galleryPhotos.push(photo.photoName);
        if (photo.photoName2) galleryPhotos.push(photo.photoName2);
        if (photo.photoName3) galleryPhotos.push(photo.photoName3);
        if (photo.photoName4) galleryPhotos.push(photo.photoName4);
        if (photo.photoName5) galleryPhotos.push(photo.photoName5);
        if (photo.photoName6) galleryPhotos.push(photo.photoName6);
        if (photo.photoName7) galleryPhotos.push(photo.photoName7);
        if (photo.photoName8) galleryPhotos.push(photo.photoName8);
        if (photo.photoName9) galleryPhotos.push(photo.photoName9);
        if (photo.photoName10) galleryPhotos.push(photo.photoName10);
      });
    }
    return galleryPhotos;
  };

  const galleryPhotos = getGalleryPhotos(productDetails?.productPhotos);

  const handleAddToCart = async (productId) => {
    const userId = localStorage.getItem("userId");

    const defaultOption = "Select your Option";

    if (!selectedColor || selectedColor === defaultOption) {
      cogoToast.error("Please select a color before adding to cart.");
      return;
    }

    if (
      selectedSize === defaultOption ||
      selectedGoldPurity === defaultOption ||
      selectedDiamondPurity === defaultOption ||
      selectedColor === defaultOption
    ) {
      const missingOptions = [];
      if (selectedColor === defaultOption) missingOptions.push("color");

      if (selectedSize === defaultOption) missingOptions.push("size");
      if (selectedGoldPurity === defaultOption)
        missingOptions.push("gold purity");
      if (selectedDiamondPurity === defaultOption)
        missingOptions.push("diamond purity");

      const message = `Please select ${missingOptions.join(
        ", "
      )} before adding to cart.`;
      cogoToast.error(message);
      return;
    }

    if (userId) {
      try {
        await axios.post(
          `${BASE_URL}/usercart/add-product?userId=${userId}&productId=${productId}&orderQuantity=1&size=${selectedSize}&gold=${selectedGoldPurity}&diamond=${selectedDiamondPurity}&color=${selectedColor}`
        );
        cogoToast.success("Product added to cart");
        fetchCartItems();
      } catch (error) {
        console.error("Error adding product to cart:", error);
        cogoToast.error("Something went wrong! Try again later");
      }
    } else {
      navigate("/sign-in");
    }
  };

  const handleAddToCartAndNavigate = async (productId) => {
    await handleAddToCart(productId);
    const userId = localStorage.getItem("userId");
    if (userId) {
      if (selectedColor) {
        navigate("/cart");
      }
    } else {
      navigate("/sign-in");
    }
  };

  useEffect(() => {
    if (productDetails?.productName) {
      fetchAvailableColors(productDetails.productName);
    }
  }, [productDetails]);

  const fetchAvailableColors = async (productName) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/products/get-available-colors?productName=${productName}`
      );
      if (response.status === 200) {
        // console.log(response.data);
        setAvailableColors(response.data);
        if (response.data.length == 1) {
          setSelectedColor(response.data[0].colorname);
        }
      } else {
        message.error("Colors can't be fetched");
      }
    } catch (error) {
      message.error("Something went wrong!");
    }
  };

  const colorChangeHandler = async () => {
    try {
      const currenctColorId = availableColors.find(
        (colorObj) => colorObj.colorname === selectedColor
      )?.id;

      const productWithSelectedColor = currentProductDetailsArray.find(
        (product) => +product.colors === currenctColorId
      );
      // console.log(currenctColorId);

      // setProductDetails(productWithSelectedColor);

      navigate(`/productdetails/${productWithSelectedColor.productId}`);
    } catch (error) {
      console.log();
    }
  };

  useEffect(() => {
    if (selectedColor !== "") {
      colorChangeHandler();
    }
  }, [selectedColor]);

  const scrollToPriceBreakup = () => {
    if (priceBreakupRef.current) {
      priceBreakupRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  let temp;
  if (selectedSize == "Select your Option") {
    temp = null;
  } else {
    const newsize = selectedSize.split(" - ");
    temp = newsize[0];
    // console.log(newsize[0]);
  }

  const ratingsInfo = ratingsData[productId] || {
    sum: 0,
    count: 0,
    average: 0,
  };

  return (
    <React.Fragment>
      <div
        className="productDetailsContainer   bg-[#fff]"
        style={{ padding: "30px" }}
      >
        {/* <Breadcrumbs />*/}
        {productDetails && (
          <div className="product-details flex mb-4 pb-5 gap-8 justify-start bg-[#fff]">
            <div className="prod-img-section relative">
              <div
                className="prod-additional-images flex flex-col gap-2 overflow-y-scroll"
                style={{
                  maxHeight: "425px",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {galleryPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="m-1 bg-[#C4C4C4] w-[100px] h-[100px] rounded-full flex items-center justify-center"
                    style={{
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={photo}
                      style={{ height: "100%", width: "100%" }}
                      className="rounded-full object-cover"
                      alt={`Image ${index + 1}`}
                      onClick={() => setSelectedPhoto(photo)}
                    />
                  </div>
                ))}
              </div>

              {/* Image with zoom effect */}
              <div>
                <div
                  className="prod-single-img"
                  style={{
                    width: "450px",
                    height: "450px",
                    overflow: "hidden",
                    position: "relative",
                    borderRadius: "10px", // Optional for a rounded container
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Add a slight shadow for depth
                  }}
                >
                  {/* Left Arrow */}
                  <button
                    onClick={() =>
                      setSelectedPhoto(
                        galleryPhotos[
                          (galleryPhotos.indexOf(selectedPhoto) -
                            1 +
                            galleryPhotos.length) %
                            galleryPhotos.length
                        ]
                      )
                    }
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "10px",
                      transform: "translateY(-50%)",
                      backgroundColor: "#f0f0f0",
                      border: "none",
                      borderRadius: "50%",
                      padding: "10px",
                      cursor: "pointer",
                      zIndex: 10,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <FaChevronLeft size={24} />
                  </button>

                  <TransformWrapper
                    initialScale={1}
                    minScale={1}
                    maxScale={3}
                    wheel={{ step: 0.1 }}
                    pinch={{ step: 0.1 }}
                  >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                      <>
                        <TransformComponent>
                          <img
                            src={selectedPhoto}
                            style={{
                              width: "450px",
                              height: "450px",
                              objectFit: "contain",
                            }}
                            alt="Product"
                          />
                        </TransformComponent>

                        <div
                          className="tools"
                          style={{
                            position: "absolute",
                            bottom: "20px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            gap: "10px",
                          }}
                        >
                          {/* Zoom In Button */}
                          <button
                            onClick={() => zoomIn()}
                            style={{
                              backgroundColor: "#f0f0f0",
                              border: "none",
                              borderRadius: "50%",
                              padding: "10px",
                              cursor: "pointer",
                              fontSize: "24px", // Increased icon size
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Button shadow for depth
                            }}
                          >
                            <FaSearchPlus />
                          </button>

                          {/* Zoom Out Button */}
                          <button
                            onClick={() => zoomOut()}
                            style={{
                              backgroundColor: "#f0f0f0",
                              border: "none",
                              borderRadius: "50%",
                              padding: "10px",
                              cursor: "pointer",
                              fontSize: "24px", // Increased icon size
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <FaSearchMinus />
                          </button>

                          {/* Reset Button */}
                          <button
                            onClick={() => resetTransform()}
                            style={{
                              backgroundColor: "#f0f0f0",
                              border: "none",
                              borderRadius: "50%",
                              padding: "10px",
                              cursor: "pointer",
                              fontSize: "16px", // Text size for Reset
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            Reset
                          </button>
                        </div>
                      </>
                    )}
                  </TransformWrapper>

                  {/* Right Arrow */}
                  <button
                    onClick={() =>
                      setSelectedPhoto(
                        galleryPhotos[
                          (galleryPhotos.indexOf(selectedPhoto) + 1) %
                            galleryPhotos.length
                        ]
                      )
                    }
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      backgroundColor: "#f0f0f0",
                      border: "none",
                      borderRadius: "50%",
                      padding: "10px",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <FaChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>

            <div className="product-details-info flex flex-col pl-5 ">
              <h1 className="text-[22px] font-semibold mb-4 pt-1">
                {" "}
                {productDetails.productName}
              </h1>
              {productDetails.lightning ? (
                <div className="text-white text-[18px] px-2 font-bold bg-[#F70000] mb-2 w-[162px] py-1">
                  Lightning Deal
                </div>
              ) : null}
              {productDetails.offered ? (
                <h3 className="text-[18px] font-bold text-[#FF0000] py-2">
                  Offered
                </h3>
              ) : null}
              <span className="d-flex gap-1">
                {[...Array(5)].map((star, i) =>
                  i < ratingsInfo.average ? (
                    <FaStar key={i} color="#FDB022" size={18} />
                  ) : (
                    <FaRegStar key={i} color="#FDB022" size={18} />
                  )
                )}
              </span>
              <div className="flex gap-2 items-center">
                <span className="text-[24px]">Rs {grandTotal}</span>
                <span className="text-[#6D6D6D] line-through">
                  Rs
                  {originalPriceWithoutDiscount}
                </span>
              </div>
              {productDetails.colors && (
                <div className="flex gap-2 my-3 items-center">
                  <span className="mt-[-5px] ">Color:</span>

                  <select
                    id="color-select"
                    value={selectedColor?.colorname}
                    onChange={(e) => {
                      const selectedColorObj = availableColors.find(
                        (color) => color.id === +e.target.value
                      );
                      setSelectedColor(selectedColorObj?.colorname || "");
                    }}
                    className="w-full border-[1px] h-[2.3rem]"
                  >
                    {availableColors.length != 1 && (
                      <option value={+""}>Select Color</option>
                    )}
                    {availableColors.map((color, i) => (
                      <option value={+color.id} key={i}>
                        {color.colorname}
                      </option>
                    ))}
                  </select>
                  {/* <CustomizeSelect
                  content="Color"
                  values={availableColors}
                  selectedValue={selectedColor}
                  setSelectedValue={setSelectedColor}
                /> */}
                </div>
              )}
              {productDetails.stoneWeight ? (
                <div className="flex gap-2 my-3 items-center mt-2">
                  <span className="mt-[-5px] ">Diamond Purity:</span>

                  <CustomizeSelect
                    content="DiamondPurity"
                    values={productDetails.diamondPurities || purities}
                    selectedValue={selectedDiamondPurity}
                    backupPurities={purities}
                    setSelectedValue={setSelectedDiamondPurity}
                  />
                </div>
              ) : (
                ""
              )}
              {productDetails.goldPurities && (
                <div className="flex gap-2 my-3 items-center mt-2">
                  <span className="mt-[-5px]">Gold Purity:</span>
                  <CustomizeSelect
                    content="GoldPurity"
                    values={productDetails.goldPurities}
                    selectedValue={selectedGoldPurity}
                    setSelectedValue={setSelectedGoldPurity}
                  />
                </div>
              )}
              {productDetails.sizes && (
                <div className="size-span flex gap-2 mb-3 items-center mt-2">
                  <span className="mt-[-5px]">Sizes:</span>
                  <CustomizeSelect
                    content="Sizes"
                    values={productDetails.sizes}
                    selectedValue={selectedSize}
                    setSelectedValue={setSelectedSize}
                  />
                  <span className="note" style={{ color: "grey" }}>
                    Note: Select size 0 for free size.
                  </span>
                </div>
              )}

              <div className="weights d-flex align-items-center gap-4">
                {productDetails.goldWeight ? (
                  <div className="flex gap-2  items-center ">
                    <span className="">Gold weight:</span>
                    <span>{productDetails.goldWeight} grams</span>
                  </div>
                ) : (
                  ""
                )}

                {productDetails.stoneWeight ? (
                  <div className="flex gap-2 items-center ">
                    <span>Diamond weight:</span>
                    <span>{productDetails.stoneWeight.toFixed(2)} ct</span>
                  </div>
                ) : (
                  ""
                )}
              </div>

              {productDetails.minStk > 0 ? (
                <div className="flex gap-2 mb-3 items-center mt-2">
                  <span className="text-[green] font-bold">In Stock:</span>
                  <span>{productDetails.minStk}</span>
                </div>
              ) : (
                ""
              )}

              <div>
                <button
                  className="product-customize-btn"
                  onClick={() => {
                    localStorage.setItem(
                      "selectedCustomizedCategory",
                      productCategory
                    );
                    localStorage.setItem(
                      "selectedCustomizedSubCategory",
                      productDetails.subcategoryId
                    );
                    const tempcolor = selectedColor ? selectedColor : "Yellow";
                    localStorage.setItem("selectedCustomizedColor", tempcolor);
                    localStorage.setItem(
                      "selectedCustomizedPriceRange",
                      JSON.stringify([15000, 1000000])
                    );
                    localStorage.setItem(
                      "selectedCustomizedDiamondPurity",
                      selectedDiamondPurity
                    );
                    localStorage.setItem(
                      "selectedCustomizedGoldPurity",
                      selectedGoldPurity
                    );
                    localStorage.setItem(
                      "selectedCustomizedGoldWeight",
                      productDetails.goldWeight
                    );
                    localStorage.setItem(
                      "selectedCustomizedDiamondWeight",
                      productDetails.stoneWeight.toFixed(2)
                    );
                    localStorage.setItem("selectedCustomizedSize", temp);
                    localStorage.setItem(
                      "productName",
                      productDetails.productName
                    );
                    navigate("/customize");
                  }}
                >
                  Want to Customise?
                </button>
              </div>

              <span className="py-2 mb-3">
                Price inclusive of taxes. See the full{" "}
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToPriceBreakup();
                  }}
                  style={{ textDecoration: "underline", color: "#68b6ff" }}
                >
                  price breakup
                </a>
                .
              </span>

              {productDetails.minStk === 0 ? (
                <div className="text-[20px] text-[#FF0000] font-bold ">
                  Out of Stock
                </div>
              ) : (
                <>
                  <div className="flex gap-2 text-white">
                    <button
                      className="px-8 py-2 bg-[#5D0B86] rounded-[30px]"
                      onClick={() =>
                        handleAddToCartAndNavigate(productDetails.productId)
                      }
                    >
                      BUY NOW
                    </button>

                    {cartItems.some(
                      (item) => item.productid === productDetails.productId
                    ) ? (
                      <button
                        type="submit"
                        className="px-8 py-2 bg-[#5D0B86] rounded-[30px]"
                      >
                        Added to cart
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-8 py-2 bg-[#5D0B86] rounded-[30px]"
                        onClick={() =>
                          handleAddToCart(productDetails.productId)
                        }
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        <VerifyPincode />
        <div ref={priceBreakupRef}>
          <Pricebreakup
            setGrandTotal={setGrandTotal}
            setOriginalPriceWithoutDiscount={setOriginalPriceWithoutDiscount}
            productDetails={productDetails}
            goldPurities={selectedGoldPurity}
            diamondPurities={selectedDiamondPurity}
            weight={selectedWeight}
            mrp={mrp}
            setMrp={setMrp}
            price={price}
            setPrice={setPrice}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default TopSection;
