import React, { useEffect, useState } from "react";
import "./style.css";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineStarPurple500, MdStarPurple500 } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../../constant";
import wishlistImg from "../../assets/Images/empty-cart.webp";
import BackButton from "../CommonComponents/BackButton";
import Breadcrumb from "../BreadCrumbs";

const CardsContainer = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
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
    fetchAdminDiscounts();
  }, []);

  useEffect(() => {
    wishlistItems.forEach((wishlistItem) =>
      fetchReviews(wishlistItem.productId)
    );
  }, [wishlistItems]);

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
      navigate("/error");
      console.error(`Error fetching reviews for product ${productId}:`, error);
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

  const goldPurity = purities.find((purity) => purity.name === "14K") || {};
  const diamondPurity =
    purities.find((purity) => purity.name === "IJ VS SI") || {};
  const rubyPurity = purities.find((purity) => purity.name === "1 carat") || {};
  const solitairePurity =
    purities.find((purity) => purity.name === "1 ct") || {};

  // Function to fetch wishlist items
  const fetchWishlistItems = async () => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      try {
        const response = await axios.get(`${BASE_URL}/wishlist/get/${userId}`);

        const wishlistData =
          response.data && Array.isArray(response.data) ? response.data : [];

        setWishlistItems(wishlistData);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setWishlistItems([]);
        } else {
          console.error("Error fetching wishlist items:", error);
          setWishlistItems([]);
        }
      }
    } else {
      setWishlistItems([]);
    }
  };

  const removeWishlistItem = async (productId) => {
    const updatedWishlist = wishlistItems.filter(
      (item) => item.productId !== productId
    );
    setWishlistItems(updatedWishlist);

    try {
      const response = await axios.delete(
        `${BASE_URL}/wishlist/delete/${userId}/${productId}`
      );

      toast.error("Product removed from wishlist");
    } catch (error) {
      console.error("Error removing product from wishlist:", error);

      setWishlistItems([...wishlistItems, { productId }]);
      toast.error("Something went wrong! Try again later");
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
    fetchWishlistItems();
    fetchCartItems();
  }, []);

  const handleClearWishlist = async () => {
    try {
      await axios.delete(`${BASE_URL}/wishlist/delete-all/${userId}/clear`);
      setWishlistItems([]);
      toast.success("Wishlist Cleared");
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Something went wrong! Try again later");
    }
  };

  const handleAddToCart = async (productId) => {
    navigate(`/productdetails/${productId}`);
  };

  return (
    <div>
      <div className="wishlist-items-container ">
        {/*<Breadcrumbs />*/}
        <div className="d-flex justify-content-between mb-3">
          <h1
            style={{ fontSize: "25px", fontWeight: "bold", marginLeft: "20px" }}
          >
            Wishlist
          </h1>
          {wishlistItems.length > 0 ? (
            <button
              className="text-white text-[18px] bg-[#4caf50] py-[0px] px-8 rounded-[5px] h-[40px] mr-6"
              onClick={handleClearWishlist}
            >
              Clear Wishlist
            </button>
          ) : (
            ""
          )}
        </div>
        <div className="wishlist-items">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => {
              const ratingsInfo = ratingsData[item.productId] || {
                sum: 0,
                count: 0,
                average: 0,
              };

              const firstPhotoUrl =
                item.product.productPhotos &&
                item.product.productPhotos.length > 0
                  ? item.product.productPhotos[0].photoName
                  : "";
              const isOutOfStock = item.product.minStk <= 0;

              const goldPricePerGram = item.product.goldWeight
                ? goldPurity?.price
                : 0;
              const diamondPrice = item.product.stoneWeight
                ? diamondPurity?.price
                : 0;

              const rubyPrice = item.product.rubyWeight ? rubyPurity.price : 0;
              const solitairePrice = item.product.solitaireWeight
                ? solitairePurity.price
                : 0;

              const additionaldiscount = item.product?.discount || 0;
              const gstPercentage = item.product?.gst || 3;
              const goldWeight = item.product?.goldWeight || 0;
              const stoneWeight = item.product?.stoneWeight || 0;
              const makingCharges = adminMakingCharges * goldWeight || 0;

              const goldDiscount = adminGoldDiscount || 0;
              const diamondDiscount = adminDiamondDiscount || 10;
              const makingChargesDiscount = adminMakingChargeDiscount || 25;

              const goldValue = goldPricePerGram * goldWeight;
              const stoneValue = diamondPrice ? diamondPrice * stoneWeight : 0;
              const rubyValue = rubyPrice * item.product.rubyWeight;
              const solitaireValue =
                solitairePrice * item.product.solitaireWeight;
              const solitaireDiscount = adminSolitaireDiscount;
              const stoneDiscount = adminStoneDiscount;

              const discountedGoldValue = (goldDiscount / 100) * goldValue;
              const discountedDiamondValue =
                (diamondDiscount / 100) * stoneValue;
              const discountedMakingCharges =
                (makingChargesDiscount / 100) * makingCharges;
              const discountedSolitaireValue =
                (solitaireDiscount / 100) * solitaireValue;
              const discountedStoneDiscount = (stoneDiscount / 100) * rubyValue;

              const finalGoldValue = goldValue - discountedGoldValue;
              const finalDiamondValue = stoneValue - discountedDiamondValue;
              const finalMakingCharges =
                makingCharges - discountedMakingCharges;
              const finalSolitaireValue =
                solitaireValue - discountedSolitaireValue;
              const finalRubyValue = rubyValue - discountedStoneDiscount;

              console.log(
                finalGoldValue,
                finalDiamondValue,
                adminMakingCharges
              );

              const basePrice =
                goldValue +
                stoneValue +
                rubyValue +
                solitaireValue +
                makingCharges;
              const discountedBasePrice =
                finalGoldValue +
                finalDiamondValue +
                finalMakingCharges +
                finalSolitaireValue +
                finalRubyValue;

              const discountAmount =
                (additionaldiscount / 100) * discountedBasePrice;

              const finalDiscountedPrice = discountedBasePrice - discountAmount;

              const gstAmount = (gstPercentage / 100) * finalDiscountedPrice;

              const calculatedMrp =
                basePrice + (gstPercentage / 100) * basePrice;

              const calculatedPrice = finalDiscountedPrice + gstAmount;

              return (
                <div
                  key={item.productId}
                  className="product-card responsive-wishlist-product-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/productdetails/${item.productId}`)}
                >
                  <div className="product-image">
                    <img
                      src={firstPhotoUrl}
                      alt={item.product.productName}
                      style={{ borderRadius: "20px" }}
                    />
                  </div>
                  <div className="product-info">
                    <p className="line-clamp-1">{item.product.productName}</p>
                    <div className="prod-price">
                      <span style={{ display: "flex" }}>
                        <p>₹ {calculatedPrice.toFixed(2)}</p>
                      </span>
                    </div>
                    <span className="d-flex">
                      {[...Array(5)].map((star, i) =>
                        i < ratingsInfo.average ? (
                          <MdOutlineStarPurple500
                            key={i}
                            color="#FDB022"
                            size={18}
                          />
                        ) : (
                          <MdStarPurple500 key={i} color="#FDB022" size={18} />
                        )
                      )}
                    </span>

                    <div className="product-card-btn">
                      {item.product.productQuantity > 0 ? (
                        cartItems.some(
                          (cartitem) => cartitem.productid === item.productId
                        ) ? (
                          <button
                            className="add-to-cart"
                            style={{
                              backgroundColor: "var(--addedToCartBgColor)",
                              color: "var(--addedToCartTextColor)",
                            }}
                          >
                            Added to Cart
                          </button>
                        ) : (
                          <button
                            className="add-to-cart"
                            style={{
                              backgroundColor: "var(--addToCartBgColor)",
                              color: "var(--addToCartTextColor)",
                            }}
                            onClick={() => handleAddToCart(item.productId)}
                          >
                            Shop Now
                          </button>
                        )
                      ) : (
                        <button
                          className="add-to-cart"
                          style={{
                            backgroundColor: "var(--outOfStockBgColor)",
                            color: "var(--outOfStockTextColor)",
                          }}
                          disabled
                        >
                          Out of Stock
                        </button>
                      )}

                      <button
                        className="add-to-wishlist"
                        style={{
                          backgroundColor: "var(--wishlistButtonBgColor)",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeWishlistItem(item.productId);
                        }}
                      >
                        <FaHeart style={{ color: "#FF0800" }} size={25} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="d-flex flex-col gap-3 mb-5 justify-content-center align-items-center">
              <img width={"320px"} src={wishlistImg} />
              <h1 style={{ fontWeight: "bold", fontSize: "25px" }}>
                Your Wishlist is empty
              </h1>
              <h1 style={{ fontSize: "20px", textAlign: "center" }}>
                Add items in wishlist to buy them later.
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
    </div>
  );
};

export default CardsContainer;
