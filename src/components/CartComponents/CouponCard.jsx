import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../constant";
import cogoToast from "cogo-toast";
import pincodes from "../../utils/pincodes.json";
import { Message } from "@mui/icons-material";

const CouponCard = ({ cartItems }) => {
  const navigate = useNavigate();
  const [validCoupons, setValidCoupons] = useState();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [pincode, setPincode] = useState("");
  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [customPincodes, setCustomPincodes] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [productDiscount, setProductDiscount] = useState(0);
  const [gstTotal, setGstTotal] = useState(0);
  const [purities, setPurities] = useState([]);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const fetchPincodeData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/pincode/get-all`);
      const items = response?.data;
      setCustomPincodes(items);
    } catch (error) {
      console.log(error);
    }
  };
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

  let goldPurity = "";
  let diamondPurity = "";

  useEffect(() => {
    let totalGoldValue = 0;
    let totalStoneValue = 0;
    let totalMakingCharges = 0;
    let totalDiscount = 0;
    let totalGst = 0;
    let finalCalculatedPrice = 0; // Temporary variable

    cartItems.forEach((cartItem) => {
      const details = productDetails[cartItem.productid] || {};

      const goldWeight = details?.goldWeight || 0;
      const stoneWeight = details?.stoneWeight || 0;
      const makingCharges = details?.makingcharges || 0;

      const goldPricePerGram =
        purities.find((purity) => purity.name === cartItem.gold)?.price || 0;
      const diamondPrice =
        purities.find((purity) => purity.name === cartItem.diamond)?.price || 0;

      const rubyPurity =
        purities.find((purity) => purity.name === "1 carat") || {};
      const solitairePurity =
        purities.find((purity) => purity.name === "1 ct") || {};

      const rubyPrice = details.rubyWeight ? rubyPurity.price : 0;
      const solitairePrice = details.solitaireWeight
        ? solitairePurity.price
        : 0;

      const goldValue = goldPricePerGram * goldWeight;
      const stoneValue = diamondPrice * stoneWeight;
      const rubyValue = rubyPrice * details.rubyWeight;
      const solitaireValue = solitairePrice * details.solitaireWeight;
      const gstPercentage = details?.gst || 3;
      const goldDiscount = details?.goldDiscount || 0;
      const diamondDiscount = details?.diamondDiscount || 10;
      const makingChargesDiscount = details?.makingChargesDiscount || 25;
      const additionaldiscount = details?.discount || 0;

      const discountedGoldValue = (goldDiscount / 100) * goldValue;
      const discountedDiamondValue = (diamondDiscount / 100) * stoneValue;
      const discountedMakingCharges =
        (makingChargesDiscount / 100) * makingCharges;

      const finalGoldValue =
        (goldValue - discountedGoldValue) * cartItem.orderQuantity;
      const finalDiamondValue =
        (stoneValue - discountedDiamondValue) * cartItem.orderQuantity;
      const finalMakingCharges =
        (makingCharges - discountedMakingCharges) * cartItem.orderQuantity;

      const basePrice =
        goldValue + stoneValue + rubyValue + solitaireValue + makingCharges;
      const discountedBasePrice =
        finalGoldValue +
        finalDiamondValue +
        finalMakingCharges +
        rubyValue * cartItem.orderQuantity +
        solitaireValue * cartItem.orderQuantity;

      const discountAmount = (additionaldiscount / 100) * discountedBasePrice;

      const finalDiscountedPrice = discountedBasePrice - discountAmount;

      const gstAmount = (gstPercentage / 100) * finalDiscountedPrice;
      const finalPrice = finalDiscountedPrice + gstAmount;

      // Accumulate the total calculated price
      finalCalculatedPrice += finalPrice;
    });

    // Update the calculatedPrice state with the final accumulated value
    setCalculatedPrice(finalCalculatedPrice);
  }, [cartItems, productDetails, purities]);

  // Apply the discounts from the coupon
  let totalPrice = calculatedPrice;

  useEffect(() => {
    fetchCoupons();
    fetchPincodeData();
  }, []);

  const fetchCoupons = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await axios.get(`${BASE_URL}/api/coupons`);
        setValidCoupons(response.data);
      }
    } catch (error) {
      console.error("Error fetching Coupon codes:", error);
    }
  };

  const handleCheckPincode = async () => {
    setPincodeChecked(true);

    // First check in the local pincodes
    const isPincodeInLocalList = pincodes.some(
      (entry) => entry.CPINCODE === pincode
    );

    if (isPincodeInLocalList) {
      setIsPincodeValid(true);
      setIsEditing(false);
      cogoToast.success("Pincode is valid.");
      return; // Exit if valid
    }

    // If not found in local, check the external API
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      if (response.data[0].Status === "Success") {
        setIsPincodeValid(true);
        cogoToast.success("Pincode is valid");
      } else {
        setIsPincodeValid(false);
        cogoToast.error("Please enter a valid pincode");
      }
    } catch (error) {
      console.error("Error checking pincode:", error);
      cogoToast.error("An error occurred while checking the pincode.");
    }
  };

  const applyCoupon = () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      cogoToast.error("Please log in to apply a coupon.");
      return;
    }

    if (cartItems.length === 0) {
      cogoToast.error("Add items to your cart before applying a coupon code.");
      return;
    }

    const matchingCoupon = validCoupons.find(
      (coupon) =>
        coupon.couponName === couponCode && coupon.couponStatus === "active"
    );

    if (matchingCoupon) {
      if (matchingCoupon.is_product_copoun) {
        const productInCart = cartItems.some(
          (item) => item.productid === matchingCoupon.productId
        );
        if (productInCart) {
          if (matchingCoupon.couponType === "%") {
            setDiscount((total / 100) * matchingCoupon.couponValue);
            setAppliedCode(matchingCoupon.couponName);
            cogoToast.success(
              `Coupon applied! You get a ${matchingCoupon.couponValue}% discount on the subtotal.`
            );
          } else if (matchingCoupon.couponType === "Rs") {
            setDiscount(parseFloat(matchingCoupon.couponValue));
            setAppliedCode(matchingCoupon.couponName);
            cogoToast.success(
              `Coupon applied! You get a ₹${matchingCoupon.couponValue} discount on the subtotal.`
            );
          }
        } else {
          // Product not found in the cart
          cogoToast.error(
            "No matching product found in your cart for this coupon."
          );
        }
      } else {
        if (matchingCoupon.couponType === "%") {
          setDiscount((total / 100) * matchingCoupon.couponValue);
          setAppliedCode(matchingCoupon.couponName);
          cogoToast.success(
            `Coupon applied! You get a ${matchingCoupon.couponValue}% discount on the subtotal.`
          );
        } else if (matchingCoupon.couponType === "Rs") {
          setDiscount(parseFloat(matchingCoupon.couponValue));
          setAppliedCode(matchingCoupon.couponName);
          cogoToast.success(
            `Coupon applied! You get a ₹${matchingCoupon.couponValue} discount on the subtotal.`
          );
        }
      }
    } else {
      setDiscount(0);
      cogoToast.error("Invalid or inactive coupon code.");
    }
  };

  const subtotal = cartItems?.reduce(
    (total, item) => total + item.orderQuantity * item.productRate,
    0
  );

  let total = discount ? totalPrice - discount : totalPrice;
  total -= productDiscount;

  return (
    <div className="coupon-card-continer d-flex align-items-center justify-content-center gap-3 mt-4">
      <div className="coupon-card">
        <h1
          style={{ fontSize: "25px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Coupon Code
        </h1>
        <div className="d-flex flex-column align-items-center justify-content-center gap-4">
          <input
            className="coupon-input"
            type="text"
            placeholder="Apply coupon code here"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button
            style={{
              background: "#5D0B86",
              color: "#fff",
              padding: "10px 30px",
              borderRadius: "50px",
              width: "100%",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }}
            type="button"
            onClick={applyCoupon}
          >
            Apply
          </button>
        </div>
      </div>
      <div className="coupon-card" id="total-price-card">
        <div className="d-flex flex-column align-items-center justify-content-center ">
          <table className="coupon-table">
            <tr>
              <td>Subtotal</td>
              <td>Rs {totalPrice?.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td>Free</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td>Rs {(discount + productDiscount).toFixed(2)}</td>
            </tr>
            {/*<tr>
              <td>GST</td>
              <td>Rs {(gstTotal).toFixed(2)}</td>
            </tr>*/}
            <tr>
              <td>Total</td>
              <td>Rs {total?.toFixed(2)}</td>
            </tr>
          </table>
          <div className="w-[100%] mb-3 d-flex align-items-center justify-content-center gap-2">
            <input
              type="number"
              placeholder="Enter Pincode"
              style={{
                width: "80%",
                height: "35px",
                border: "2px solid ",
                borderRadius: "5px",
                padding: "0px 10px",
              }}
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value);
                setIsEditing(true);
              }}
              onFocus={() => setIsEditing(true)}
              onBlur={() => {
                setIsEditing(true);
              }}
              onKeyPress={(e) => {
                if (e.key === "e" || e.key === "E" || e.key === ".") {
                  e.preventDefault();
                }
              }}
            />
            <button
              style={{
                background: "#FFC35B",
                color: "#000",
                width: "100px",
                borderRadius: "5px",
                height: "35px",
              }}
              type="button"
              onClick={handleCheckPincode}
            >
              Check
            </button>
          </div>
          {isPincodeValid && !isEditing ? (
            <button
              style={{
                background: "#5D0B86",
                color: "#fff",
                padding: "10px 30px",
                borderRadius: "50px",
                width: "100%",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              }}
              type="button"
              onClick={() => {
                const userId = localStorage.getItem("userId");
                if (userId && cartItems.length > 0) {
                  navigate("/checkout", { state: { appliedCode } });
                } else {
                  cogoToast.warning(
                    "Add Items in cart before proceed to checkout"
                  );
                }
              }}
            >
              Proceed to Buy
            </button>
          ) : (
            ""
          )}
          {!isPincodeValid && pincodeChecked && (
            <div
              style={{
                color: "#FF7875",
                fontSize: "16px",
                marginTop: "10px",
              }}
            >
              We cannot deliver to this address.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
