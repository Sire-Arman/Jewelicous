import React, { useEffect, useState } from "react";
import "./style.css";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineStarPurple500, MdStarPurple500 } from "react-icons/md";

import axios from "axios";
import { BASE_URL } from "../../../constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CouponCard from "./CouponCard";
import ShareModal from "./CopyLinkModal.jsx";
import cartImg from "../../assets/Images/empty-cart-new.png";
import BackButton from "../CommonComponents/BackButton.jsx";
import Breadcrumb from "../BreadCrumbs.jsx";

const CartItems = ({ scrollToRelatedProducts }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [productData, setProductData] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [purities, setPurities] = useState([]);
  const [ratingsData, setRatingsData] = useState({});
  const [adminGoldDiscount, setAdminGoldDiscount] = useState(0);
  const [adminDiamondDiscount, setAdminDiamondDiscount] = useState(0);
  const [adminMakingChargeDiscount, setAdminMakingChargeDiscount] = useState(0);
  const [adminSolitaireDiscount, setAdminSolitaireDiscount] = useState(0);
  const [adminStoneDiscount, setAdminStoneDiscount] = useState(0);
  const [adminMakingCharges, setAdminMakingCharges] = useState(0);
  const fetchAdminDiscounts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/discounts/get-discounts`);
      const data = response.data;

      if (data.goldDiscount) {
        setAdminGoldDiscount(data.goldDiscount);
      }
      if (data.diamondDiscount) {
        setAdminDiamondDiscount(data.diamondDiscount);
      }
      if (data.makingChargesDiscount) {
        setAdminMakingChargeDiscount(data.makingChargesDiscount);
      }
      if (data.solitaireDiscount) {
        setAdminSolitaireDiscount(data.solitaireDiscount);
      }
      if (data.stoneDiscount) {
        setAdminStoneDiscount(data.stoneDiscount);
      }
      if (data.makingCharges) {
        setAdminMakingCharges(data.makingCharges);
      }
    } catch (error) {
      // navigate("/error")
      console.error("Error found in fetching admin discounts", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchAdminDiscounts();
  }, []);

  useEffect(() => {
    cartItems.forEach((cartItem) => fetchReviews(cartItem.productid));
  }, [cartItems]);

  const fetchReviews = async (productId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-ratings/product/${productId}`
      );
      const reviews = response.data;

      const totalRatings = reviews.reduce(
        (acc, review) => acc + Number(review.ratings),
        0
      );
      const countRatings = reviews.length;

      // Update the ratingsData state
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
    }
  };

  useEffect(() => {
    cartItems.forEach((cartItem) => fetchReviews(cartItem.productid));
  }, [cartItems]);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/products/get-by-productId`,
        {
          params: {
            productId: productId,
          },
        }
      );
      setProductDetails(response.data);

      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllProductDetails = async () => {
      const updatedProductDetails = {}; // Create an object to store all product details

      for (const cartItem of cartItems) {
        const productData = await fetchProductDetails(cartItem.productid);
        if (productData) {
          updatedProductDetails[cartItem.productid] = productData;
        }
      }

      // Update state after all product details have been fetched
      setProductDetails(updatedProductDetails);
    };

    fetchAllProductDetails();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await axios.post(
          `${BASE_URL}/usercart/in-cart?userId=${userId}&pageSize=100`
        );
        setCartItems(response.data);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleProductRemove = async (productId, showNotification = true) => {
    const userId = localStorage.getItem("userId");
    try {
      await axios.post(
        `${BASE_URL}/usercart/remove-product?userId=${userId}&productId=${productId}`
      );

      fetchCartItems();
      if (showNotification) {
        toast.warn("Product removed from cart");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
      toast.error("Something went wrong! Try again later");
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    const userId = localStorage.getItem("userId");
    try {
      await axios.post(
        `${BASE_URL}/usercart/update-quantity?userId=${userId}&productId=${productId}&orderQuantity=${newQuantity}`
      );

      fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Something went wrong! Try again later");
    }
  };

  const handleSaveForLater = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        await fetch(`${BASE_URL}/wishlist/add/${userId}`, {
          method: "POST",
          headers: {
            contentType: "application/json",
          },
          // body: JSON.stringify({ productId }),
          body: productId, // Ensure body is a JSON string
        });
        await handleProductRemove(productId, false);

        toast.success("Product added to wishlist");
      } catch (error) {
        console.error("Error adding product to wishlist:", error);
        toast.error("Something went wrong! Try again later");
      }
    } else {
      navigate("/login");
    }
  };

  const openShareModal = (productId) => {
    const baseUrl = `${window.location.origin}`;
    const productDetailsUrl = `${baseUrl}/productdetails/${productId}`;
    setShareLink(productDetailsUrl);
    setModalIsOpen(true);
  };

  const closeShareModal = () => {
    setModalIsOpen(false);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareLink)
        .then(() => {
          toast.success("Product link copied");
        })
        .catch((error) => {
          console.error("Error copying text: ", error);
          toast.error("Failed to copy product link");
        });
    } else {
      // Fallback method
      const textarea = document.createElement("textarea");
      textarea.value = shareLink;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        toast.success("Product link copied");
      } catch (error) {
        console.error("Fallback copy failed: ", error);
        toast.error("Failed to copy product link");
      }
      document.body.removeChild(textarea);
    }
  };

  const handleSeeMoreClick = (e) => {
    e.preventDefault();
    if (scrollToRelatedProducts && scrollToRelatedProducts.current) {
      scrollToRelatedProducts.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchPurities = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/purity/get-all`);
        const data =
          response.data && Array.isArray(response.data) ? response.data : [];
        setPurities(data);
      } catch (error) {
        console.error("Error fetching purities:", error);
      }
    };
    fetchPurities();
  }, []);

  return (
    <React.Fragment>
      {/*<Breadcrumbs />*/}
      <div className="cart-items-container">
        {cartItems.length > 0 ? (
          <h1 style={{ fontWeight: "bold", fontSize: "25px" }}>Your Cart</h1>
        ) : (
          ""
        )}
        <div className="cart-items">
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const ratingsInfo = ratingsData[item.productid] || {
                sum: 0,
                count: 0,
                average: 0,
              };
              const goldPurity =
                purities.find((purity) => purity.name === item.gold) || {};
              const diamondPurity =
                purities.find((purity) => purity.name === item.diamond) || {};

              const rubyPurity = purities.find(
                (purity) => purity.name === "1 carat"
              );
              const solitairePurity = purities.find(
                (purity) => purity.name === "1 ct"
              );

              const details = productDetails[item.productid] || {};
              const goldPricePerGram = details.goldWeight
                ? goldPurity?.price
                : 0;
              const diamondPrice = details.stoneWeight
                ? diamondPurity?.price
                : 0;

              const rubyPrice = details.rubyWeight ? rubyPurity.price : 0;
              const solitairePrice = details.solitaireWeight
                ? solitairePurity.price
                : 0;

              const goldWeight = details?.goldWeight || 0;
              const additionaldiscount = details?.discount || 0;
              const gstPercentage = details?.gst || 3;
              const stoneWeight = details?.stoneWeight || 0;
              const makingcharges = adminMakingCharges * goldWeight;

              const goldValue = goldPricePerGram * goldWeight;
              const stoneValue = diamondPrice ? diamondPrice * stoneWeight : 0;
              const rubyValue = rubyPrice * details.rubyWeight;
              const solitaireValue = solitairePrice * details.solitaireWeight;
              const solitaireDiscount = adminSolitaireDiscount;
              const stoneDiscount = adminStoneDiscount;

              const discountedGoldValue =
                goldValue - (adminGoldDiscount / 100) * goldValue;
              const discountedDiamondValue =
                stoneValue - (adminDiamondDiscount / 100) * stoneValue;
              const discountedMakingCharges =
                makingcharges -
                (adminMakingChargeDiscount / 100) * makingcharges;
              const discountedSolitaireValue =
                (solitaireDiscount / 100) * solitaireValue;
              const discountedStoneValue = (stoneDiscount / 100) * rubyValue;

              const finalSolitaireValue =
                solitaireValue - discountedSolitaireValue;
              const finalStoneValue = rubyValue - discountedStoneValue;

              const subTotal =
                (discountedGoldValue || goldValue) +
                (discountedDiamondValue || stoneValue) +
                (discountedMakingCharges || makingcharges) +
                (finalStoneValue || 0) +
                (finalSolitaireValue || 0);

              const discountAmount = (additionaldiscount / 100) * subTotal;
              const subTotalAfterDiscount = subTotal - discountAmount;
              const gstAmount = (gstPercentage / 100) * subTotalAfterDiscount;
              const calculatedPrice = subTotalAfterDiscount + gstAmount;
              const totalmrp =
                goldValue +
                stoneValue +
                makingcharges +
                rubyValue +
                solitaireValue;
              const originalPriceWithoutDiscount =
                totalmrp + (totalmrp * gstPercentage) / 100;
              return (
                <div className="single-cart-item" key={item.productid}>
                  <div
                    className="single-cart-item-img cursor-pointer"
                    onClick={() =>
                      navigate(`/productdetails/${item.productId}`)
                    }
                  >
                    <img
                      src={item.productImage ? item.productImage : ""}
                      alt={item.productName}
                      loading="lazy"
                      style={{ borderRadius: "20px" }}
                      onClick={() => navigate("/cart")}
                    />
                  </div>
                  <div
                    className="cart-item-info d-flex justify-content-between "
                    style={{ width: "100%" }}
                  >
                    <div>
                      <h1 style={{ fontWeight: "bold", fontSize: "25px" }}>
                        {item.productName}
                      </h1>
                      <div className="d-flex flex-column">
                        {item.color && (
                          <span>
                            <strong>Color:</strong> {item.color}
                          </span>
                        )}
                        {item.weight && (
                          <span>
                            <strong>Weight:</strong> {item.weight} gms
                          </span>
                        )}
                        {item.gold && (
                          <span>
                            <strong>Gold Purity:</strong> {item.gold}
                          </span>
                        )}
                        {item.diamond && (
                          <span>
                            <strong>Diamond Purity:</strong> {item.diamond}
                          </span>
                        )}
                      </div>

                      <div className="d-flex justify-between items-center mt-3">
                        <div>
                          <h1 className="mb-2 mt-2">Quantity</h1>
                          <span
                            style={{
                              border: "2px solid ",
                              borderRadius: "50px",
                              padding: "2px 10px ",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "120px",
                            }}
                          >
                            <button
                              type="button"
                              disabled={item.orderQuantity <= 1}
                              onClick={() =>
                                handleQuantityChange(
                                  item.productid,
                                  parseInt(item.orderQuantity, 10) - 1
                                )
                              }
                            >
                              <FiMinus size={18} />
                            </button>
                            <span>{item.orderQuantity}</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productid,
                                  parseInt(item.orderQuantity, 10) + 1
                                )
                              }
                            >
                              <FiPlus size={18} />
                            </button>
                          </span>
                        </div>
                      </div>
                      <div className="cart-item-links d-flex gap-4 mt-3">
                        <Link
                          to={""}
                          onClick={() =>
                            handleProductRemove(item.productid, true)
                          }
                        >
                          Delete
                        </Link>
                        <Link
                          to={""}
                          onClick={() => handleSaveForLater(item.productid)}
                        >
                          Save for later
                        </Link>
                        <button type="button" onClick={handleSeeMoreClick}>
                          See more like this
                        </button>
                        <button
                          type="button"
                          onClick={() => openShareModal(item.productid)}
                        >
                          Share
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="d-flex">
                        {[...Array(5)].map((star, i) =>
                          i < ratingsInfo.average ? (
                            <MdOutlineStarPurple500
                              key={i}
                              color="#FDB022"
                              size={18}
                            />
                          ) : (
                            <MdStarPurple500
                              key={i}
                              color="#FDB022"
                              size={18}
                            />
                          )
                        )}
                      </span>
                      <span style={{ fontSize: "20px" }}>
                        ₹ {calculatedPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="d-flex flex-col gap-3 mb-5 justify-content-center align-items-center">
              <img width={"200px"} src={cartImg} />
              <h1 style={{ fontWeight: "bold", fontSize: "25px" }}>
                Your Cart is empty
              </h1>
              <h1 style={{ fontSize: "20px", textAlign: "center" }}>
                Must add items before you proceed to checkout.
              </h1>
              <button
                style={{
                  background: "#9B69B5",
                  color: "#fff",
                  textTransform: "uppercase",
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
                onClick={() => navigate("/shop")}
              >
                Add Products
              </button>
            </div>
          )}
        </div>
      </div>

      <CouponCard cartItems={cartItems} />
      {/* Modal for sharing */}
      <ShareModal
        show={modalIsOpen}
        handleClose={closeShareModal}
        shareLink={shareLink}
        handleCopyLink={handleCopyLink}
      />
    </React.Fragment>
  );
};

export default CartItems;
