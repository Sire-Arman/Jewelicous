import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Checkout.css";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../constant.jsx";
import cogoToast from "cogo-toast";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import NewAddress from "./NewAddress.jsx";
import EditAddress from "./EditAddress.jsx";
import { v4 as uuidv4 } from "uuid";
import VerifyPincode from "../../components/ProductPageComponents/VerifyPincode.jsx";
import { toast } from "react-toastify";

const Checkout = () => {
  const location = useLocation();
  const { appliedCode } = location.state || {};
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("cashOnDelivery");
  const [coupon, setCoupon] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [allAddresses, setAllAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [personaldetails, setpersonaldetails] = useState({
    name: "",
    phoneNumber: "",
  });
  const [address, setAddress] = useState({
    houseName: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    landMark: "",
    addrType: "",
  });

  const [termsChecked, setTermsChecked] = useState(false);
  const [addressErrors, setAddressErrors] = useState({});
  const [purities, setPurities] = useState([]);
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    fetchAddresses();
    fetchUserDetails();
    fetchCartItems();
  }, []);

  useEffect(() => {
    const fetchPurities = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/purity/get-all`);
        const data =
          response.data && Array.isArray(response.data) ? response.data : [];
        setPurities(data);
      } catch (error) {
        navigate("/error");
        console.error("Error fetching purities:", error);
      }
    };
    fetchPurities();
  }, []);

  const fetchProductDetails = async (productId) => {
    // console.log(productId);
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
      // console.log(response);
      // console.log('first');
      return response.data;
    } catch (error) {
      navigate("/error");
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
    const calculateSubtotal = () => {
      let total = 0;

      cartItems.forEach((ele) => {
        const goldPurity =
          purities.find((purity) => purity.name === ele.gold) || {};
        const diamondPurity =
          purities.find((purity) => purity.name === ele.diamond) || {};

        const rubyPurity =
          purities.find((purity) => purity.name === "1 carat") || {};
        const solitairePurity =
          purities.find((purity) => purity.name === "1 ct") || {};

        const details = productDetails[ele.productid] || {};
        const goldPricePerGram = goldPurity?.price || 0;
        const diamondPrice = diamondPurity?.price || 0;
        const makingCharges = details?.makingcharges || 0;
        const additionaldiscount = details?.discount || 0;
        const gstPercentage = details?.gst || 3;
        const goldWeight = details?.goldWeight || 0;
        const stoneWeight = details?.stoneWeight || 0;

        const goldDiscount = details?.goldDiscount || 0;
        const diamondDiscount = details?.diamondDiscount || 10;
        const makingChargesDiscount = details?.makingChargesDiscount || 25;

        const rubyPrice = details.rubyWeight ? rubyPurity.price : 0;
        const solitairePrice = details.solitaireWeight
          ? solitairePurity.price
          : 0;

        const goldValue = goldPricePerGram * goldWeight;
        const stoneValue = diamondPrice * stoneWeight || 0;
        const rubyValue = rubyPrice * details.rubyWeight;
        const solitaireValue = solitairePrice * details.solitaireWeight;

        const discountedGoldValue = (goldDiscount / 100) * goldValue;
        const discountedDiamondValue = (diamondDiscount / 100) * stoneValue;
        const discountedMakingCharges =
          (makingChargesDiscount / 100) * makingCharges;

        const finalGoldValue = goldValue - discountedGoldValue;
        const finalDiamondValue = stoneValue - discountedDiamondValue;
        const finalMakingCharges = makingCharges - discountedMakingCharges;

        const basePrice =
          goldValue + stoneValue + rubyValue + solitaireValue + makingCharges;
        const discountedBasePrice =
          finalGoldValue +
          finalDiamondValue +
          finalMakingCharges +
          rubyValue +
          solitaireValue;

        const discountAmount = (additionaldiscount / 100) * discountedBasePrice;

        const finalDiscountedPrice = discountedBasePrice - discountAmount;

        const gstAmount = (gstPercentage / 100) * finalDiscountedPrice;

        const calculatedMrp = basePrice + (gstPercentage / 100) * basePrice;

        const calculatedPrice = finalDiscountedPrice + gstAmount;

        // Accumulate the calculated price into the total
        total += calculatedPrice * ele.orderQuantity;
        // console.log(calculatedPrice);
      });

      setSubtotal(total);
      setTotal(total + deliveryCharge - discount);
    };

    calculateSubtotal();
  }, [cartItems, purities, productDetails, deliveryCharge, discount]);

  useEffect(() => {
    getCopounData();
  }, []);
  const handleEditAddressClick = (address) => {
    setSelectedAddress(address);
  };
  const fetchUserDetails = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${BASE_URL}/users/getUserNamePhone/${userId}`
      );
      const [name, phoneNumber] = response.data;
      // console.log("Name and Phone Number:", name, phoneNumber);
      setpersonaldetails({ name, phoneNumber });
    } catch (error) {
      navigate("/error");
      console.error("Error Name and Phone Number", error);
    }
  };
  const fetchAddresses = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${BASE_URL}/users/getAllAddresses/${userId}`
      );
      // console.log("Address response:", response.data);
      if (response.data && response.data.length > 0) {
        setAllAddresses(response.data);
        setSelectedAddress(response.data[0]);
        updateAddressFields(response.data[0]);
      }
    } catch (error) {
      toast.warn("Please Add Address to Place Order");
    }
  };

  const updateAddressFields = (selectedAddress) => {
    setAddress({
      houseName: selectedAddress.houseName || "",
      street: selectedAddress.street || "",
      city: selectedAddress.city || "",
      state: selectedAddress.state || "",
      pinCode: selectedAddress.pinCode || "",
      country: "India",
      landMark: selectedAddress.landMark || "",
      addrType: selectedAddress.addrType,
    });
  };

  // console.log("SELECTED ADDRESS", selectedAddress);

  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await axios.post(
          `${BASE_URL}/usercart/in-cart?userId=${userId}&pageSize=100`
        );
        setCartItems(response.data);
        // console.log("Cart Items:", response.data);
        let subtotal = 0;
        response.data.forEach((item) => {
          subtotal += item.productRate * item.orderQuantity;
        });
        setSubtotal(subtotal);
        // setTotal(subtotal + (2.5 / 100 * subtotal ));
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
    // console.log("discount:", typeof discount, discount);
  };

  useEffect(() => {
    const codcharges = parseFloat(
      ((2.5 / 100) * (subtotal - discount)).toFixed(2)
    );
    // console.log("subtotal:", typeof subtotal, subtotal);
    // console.log("discount:", typeof discount, discount);
    // console.log("codcharges:", typeof codcharges, codcharges);
    setDeliveryCharge(codcharges);
  }, [subtotal]);

  useEffect(() => {
    const codcharges = parseFloat(
      ((2.5 / 100) * (subtotal - discount)).toFixed(2)
    );
    // console.log(typeof codcharges);
    setDeliveryCharge(
      selectedPaymentMethod === "cashOnDelivery" ? codcharges : 0
    );
  }, [selectedPaymentMethod]);

  useEffect(() => {
    // console.log("final calculation");
    // console.log("Delivery charge", typeof deliveryCharge, deliveryCharge);
    // console.log("subtotal", typeof subtotal, subtotal);
    // console.log("Discount", typeof discount, discount);

    setTotal(subtotal + deliveryCharge - discount);
  }, [deliveryCharge, discount]);

  const handleSelectAddress = (selectedAddress) => {
    setSelectedAddress(selectedAddress);
    updateAddressFields(selectedAddress);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };
  const getCurrentFormattedDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const currentDateString = getCurrentFormattedDate();

  const placeOrder = async () => {
    try {
      if (!termsChecked) {
        cogoToast.error(
          "Please agree to the terms & conditions before placing the order."
        );
        return;
      }

      if (allAddresses.length === 0) {
        cogoToast.error(
          "Please add a shipping address before placing the order."
        );
        return;
      }

      const userId = localStorage.getItem("userId");
      const {
        addrId,
        houseName,
        street,
        city,
        state,
        pinCode,
        country,
        phone,
      } = selectedAddress;
      const paymentMethod = selectedPaymentMethod;
      let orderAmount = parseFloat(total.toFixed(1));
      let discountVal = parseFloat(discount).toFixed(1);
      let shipping = parseFloat(deliveryCharge).toFixed(1);
      setTotal(orderAmount + 100);
      setCouponApplied(true);

      // fill the items array with the cartItems

      const itemsData = cartItems.map((item) => {
        return {
          description: item.productName,
          quantity: item.orderQuantity,
          value: {
            currency: "INR",
            amount: item.productRate,
          },
        };
      });
      // console.log(selectedAddress);

      const shippingRequestData = {
        order_id: uuidv4(),
        store_name: "neeljewels",
        store_id: "6707693774",
        shopify_order_id: "123456789",
        order_created_on: currentDateString,
        is_cod: selectedPaymentMethod === "cashOnDelivery",
        shipment_value: total,
        cod_amount: selectedPaymentMethod === "cashOnDelivery" ? total : 0,
        order_currency: "INR",
        order_status: "fulfilled",
        shipment_type: "Parcel",
        receiver_address: {
          first_name: personaldetails.name.split(" ")[0],
          last_name: personaldetails.name.split(" ")[1],
          company_name: "",
          address: "123 APC Road",
          city: selectedAddress.city,
          state: selectedAddress.state,
          country: "IN",
          zipcode: selectedAddress.pinCode,
          landmark: selectedAddress.landMark,
          phone: selectedAddress.mobile,
          email: "amanjaiswal@gamil.com",
        },
        items: itemsData,
        is_mps: false,
      };

      const shippingRequestDataString = JSON.stringify(shippingRequestData);
      // console.log("Shipping Request Data (JSON):", shippingRequestDataString);

      // Send the request to the third-party shipping service
      const shippingResponse = await axios.post(
        BASE_URL + "/eshipz/create",
        shippingRequestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Shipping response:", shippingResponse);

      // Check if the shipping API request was successful
      if (shippingResponse.status === 200) {
        const shippingData = shippingResponse.data;

        // Proceed with placing the order after successful shipping API response
        const response = await axios.post(
          `${BASE_URL}/usercart/finalize?userId=${userId}&finalOrderAmount=${orderAmount}&addrId=${addrId}&paymentMethod=${paymentMethod}&discount=${discountVal}&shipping=${shipping}&trackingId=${shippingData.trackingId}`
        );

        navigate("/payment-successful");
      } else {
        throw new Error("Shipping service failed");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      navigate("/payment-unsuccessful");
    }
  };

  const handleAddAddress = async (event) => {
    if (event) event.preventDefault();

    if (allAddresses.length >= 3) {
      setSelectedAddress(allAddresses[0]);
      toast.error("You cannot add more than 3 addresses");
    }

    // Reset errors
    setAddressErrors({ allFields: "" });

    const sanitizedAddressName = address.houseName.replace(/\s+/g, "");
    const sanitizedCity = address.city.replace(/\s+/g, "");
    const sanitizedStreet = address.street.replace(/\s+/g, "");
    const sanitizedState = address.state.replace(/\s+/g, "");
    const sanitizedCountry = address.country.replace(/\s+/g, "");
    const sanitizedPinCode = address.pinCode.replace(/\s+/g, "");

    if (
      !sanitizedAddressName ||
      !sanitizedCity ||
      !sanitizedStreet ||
      !sanitizedState ||
      !sanitizedCountry ||
      !sanitizedPinCode
    ) {
      setAddressErrors({ allFields: "Please fill in all required fields." });
      cogoToast.error("Please fill in all required fields!");
      return false;
    }

    if (!/^\d{6}$/.test(address.pinCode)) {
      setAddressErrors({ pinCode: "Please enter a valid 6-digit pin code." });
      cogoToast.error("Please enter valid 6-digit code");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const newAddrId = allAddresses.length + 1;
      const newAddressData = { ...address, addrId: newAddrId.toString() };

      const addressRes = await axios.post(
        `${BASE_URL}/users/addNewAddress/${userId}`,
        newAddressData
      );

      if (addressRes && addressRes.data) {
        cogoToast.success("Address added successfully!");
        await fetchAddresses();
        setSelectedAddress(newAddressData);
        return true;
      }
    } catch (error) {
      console.error("Error adding address:", error);
      cogoToast.error("Error adding address. Please try again.");
      return false;
    }
  };

  const getCopounData = async () => {
    try {
      if (appliedCode === "") {
        return;
      }
      const response = await fetch(
        `${BASE_URL}/api/coupons/name/${appliedCode}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        return;
      }

      const couponData = await response.json();
      let discount = 0;

      if (couponData.couponType === "%") {
        discount = subtotal * (couponData.couponValue / 100);
      } else if (couponData.couponType === "Rs") {
        discount = couponData.couponValue;
      }
      setDiscount(discount);
      // console.log("discount", discount);
      setCouponApplied(true);
    } catch (error) {
      console.error("Error in API request:", error);
    }
  };

  // console.log(selectedAddress);

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <Container fluid className="p-3">
        <Row className="mt-4 justify-content-center">
          <Col sm={12} md={8} lg={6} xl={7}>
            <Card
              className="mb-3"
              style={{
                background: "#F6F1FA",
                border: "none",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              }}
            >
              <Card.Body>
                <Card.Title
                  style={{ fontWeight: "bold", marginBottom: "30px" }}
                >
                  Delivery Address
                </Card.Title>
                <Form>
                  <Form.Group controlId="address" className="mb-3">
                    <Form.Control
                      type="text"
                      name="country"
                      placeholder="Address"
                      value={address.country}
                      onChange={handleInputChange}
                      style={{ width: "100%", height: "50px" }}
                    />
                  </Form.Group>
                  <Row>
                    <Col className="mb-3">
                      <Form.Group
                        controlId="firstName"
                        style={{ width: "100%" }}
                      >
                        <Form.Control
                          type="text"
                          name="Name"
                          placeholder="Full Name"
                          value={personaldetails.name}
                          onChange={handleInputChange}
                          style={{
                            width: "100%",
                            height: "50px",
                            cursor: "not-allowed",
                          }}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group controlId="address" className="mb-3">
                    <Form.Control
                      type="text"
                      name="houseName"
                      placeholder="Address"
                      value={address.houseName}
                      onChange={handleInputChange}
                      style={{ width: "100%", height: "50px" }}
                    />
                  </Form.Group>
                  <Form.Group controlId="address" className="mb-3">
                    <Form.Control
                      type="text"
                      name="street"
                      placeholder="Street"
                      value={address.street}
                      onChange={handleInputChange}
                      style={{ width: "100%", height: "50px" }}
                    />
                  </Form.Group>
                  <Row>
                    <Col className="mb-3">
                      <Form.Group controlId="city">
                        <Form.Control
                          type="text"
                          name="city"
                          placeholder="City"
                          value={address.city}
                          onChange={handleInputChange}
                          style={{ width: "100%", height: "50px" }}
                        />
                      </Form.Group>
                    </Col>
                    <Col className="mb-3">
                      <Form.Group controlId="state">
                        <Form.Control
                          type="text"
                          name="state"
                          placeholder="State"
                          value={address.state}
                          onChange={handleInputChange}
                          style={{ width: "100%", height: "50px" }}
                        />
                      </Form.Group>
                    </Col>
                    <Col className="mb-3">
                      <Form.Group controlId="pinCode">
                        <Form.Control
                          type="text"
                          name="pinCode"
                          placeholder="PIN Code"
                          value={address.pinCode}
                          onChange={handleInputChange}
                          style={{ width: "100%", height: "50px" }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="mb-3">
                      <Form.Group controlId="phoneNumber" className="mb-3">
                        <Form.Control
                          type="text"
                          name="phoneNumber"
                          placeholder="Phone Number"
                          value={personaldetails.phoneNumber}
                          onChange={handleInputChange}
                          readOnly
                          style={{
                            width: "100%",
                            height: "50px",
                            cursor: "not-allowed",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col className="mb-3">
                      <Form.Group controlId="landMark" className="mb-3">
                        <Form.Control
                          type="text"
                          name="landMark"
                          placeholder="landMark"
                          value={address.landMark}
                          onChange={handleInputChange}
                          readOnly
                          style={{
                            width: "100%",
                            height: "50px",
                            cursor: "not-allowed",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-center  mb-3">
                    <button
                      type="submit"
                      style={{
                        width: "80%",
                        color: "green",
                        border: "2px solid green",
                        borderRadius: "5px",
                        padding: "2px 10px",
                      }}
                      onClick={handleAddAddress}
                    >
                      Save Address
                    </button>
                  </div>
                </Form>
                <div className="saved-addresses">
                  {allAddresses.map((savedAddress) => (
                    <Card
                      key={savedAddress.addrId}
                      className="saved-address-card mb-3"
                    >
                      <Card.Body>
                        <Form.Check
                          type="radio"
                          className="custom-radio2"
                          name="savedAddress"
                          id={`savedAddress${savedAddress.addrId}`}
                          label={
                            <>
                              <div>
                                {savedAddress.houseName}, {savedAddress.street}{" "}
                              </div>
                              <div>
                                {savedAddress.city}, {savedAddress.state} -{" "}
                                {savedAddress.pinCode}
                              </div>
                            </>
                          }
                          onChange={() => handleSelectAddress(savedAddress)}
                          checked={
                            selectedAddress &&
                            selectedAddress.addrId === savedAddress.addrId
                          }
                        />
                        <div>
                          <Button
                            variant="link"
                            className="edit-button"
                            style={{
                              color: "black",
                              padding: "5px",
                              fontSize: "15px",
                              display: "inline-block",
                            }}
                            data-bs-toggle="modal"
                            data-bs-target="#editaddressModal"
                            onClick={() => handleEditAddressClick(savedAddress)}
                          >
                            Edit
                          </Button>
                          <EditAddress address={selectedAddress} />
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
                {allAddresses.length < 3 && (
                  <div>
                    <Button
                      variant="link"
                      className="add-new-address-button"
                      style={{ color: "black", fontSize: "18px" }}
                      data-bs-toggle="modal"
                      data-bs-target="#addressModal"
                    >
                      <FaPlus className="me-2" /> Add a new address
                    </Button>
                    <NewAddress />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col sm={12} md={8} lg={4}>
            <Card
              className="mb-3 order-Summery"
              style={{
                background: "#F6F1FA",
                border: "none",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              }}
            >
              <Card.Body>
                <Card.Title style={{ fontWeight: "bold" }}>
                  Order Summary
                </Card.Title>
                <ul className="list-group list-group-flush ">
                  {cartItems.map((ele) => {
                    const goldPurity =
                      purities.find((purity) => purity.name === ele.gold) || {};
                    const diamondPurity =
                      purities.find((purity) => purity.name === ele.diamond) ||
                      {};

                    const rubyPurity =
                      purities.find((purity) => purity.name === "1 carat") ||
                      {};
                    const solitairePurity =
                      purities.find((purity) => purity.name === "1 ct") || {};

                    const details = productDetails[ele.productid] || {};
                    const goldPricePerGram = goldPurity?.price || 0;
                    const diamondPrice = diamondPurity?.price || 0;
                    const makingCharges = details?.makingcharges || 0;
                    const additionaldiscount = details?.discount || 0;
                    const gstPercentage = details?.gst || 3;
                    const goldWeight = details?.goldWeight || 0;
                    const stoneWeight = details?.stoneWeight || 0;

                    const rubyPrice = details.rubyWeight ? rubyPurity.price : 0;
                    const solitairePrice = details.solitaireWeight
                      ? solitairePurity.price
                      : 0;

                    const goldDiscount = details?.goldDiscount || 0;
                    const diamondDiscount = details?.diamondDiscount || 10;
                    const makingChargesDiscount =
                      details?.makingChargesDiscount || 25;

                    const goldValue = goldPricePerGram * goldWeight;
                    const stoneValue = diamondPrice
                      ? diamondPrice * stoneWeight
                      : 0;

                    const rubyValue = rubyPrice * details.rubyWeight;
                    const solitaireValue =
                      solitairePrice * details.solitaireWeight;

                    const discountedGoldValue =
                      goldValue - (goldDiscount / 100) * goldValue;
                    const discountedDiamondValue =
                      stoneValue - (diamondDiscount / 100) * stoneValue;
                    const discountedMakingCharges =
                      makingCharges -
                      (makingChargesDiscount / 100) * makingCharges;

                    const discountAmount =
                      (additionaldiscount / 100) *
                      (discountedGoldValue +
                        discountedDiamondValue +
                        discountedMakingCharges +
                        rubyValue +
                        solitaireValue);

                    const basePrice =
                      goldValue +
                      stoneValue +
                      makingCharges +
                      rubyValue +
                      solitaireValue;
                    const discountedBasePrice =
                      discountedGoldValue +
                      discountedDiamondValue +
                      discountedMakingCharges +
                      solitaireValue +
                      rubyValue -
                      discountAmount;

                    const gstAmount =
                      (gstPercentage / 100) * discountedBasePrice;

                    const calculatedMrp =
                      basePrice + (gstPercentage / 100) * basePrice;

                    const calculatedPrice =
                      (discountedBasePrice + gstAmount) * ele.orderQuantity;
                    return (
                      <li
                        key={ele.id}
                        className="list-group-item font-bold d-flex bg-[#F6F1FA] orderSummery justify-content-start gap-3 align-items-center py-3"
                      >
                        <div
                          className="productImage-container"
                          data-quantity={ele.orderQuantity}
                        >
                          <img
                            className="productImage"
                            width="100%"
                            height="100px"
                            src={ele.productImage}
                            alt="item image"
                          />
                        </div>
                        <div className="d-flex align-items-center justify-content-between  w-[100%]">
                          <span> {ele.productName}</span>
                          <span> Rs {calculatedPrice.toFixed(2)}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <hr style={{ borderWidth: "2px", borderColor: "black" }} />
                <div className="mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <div>Items ({cartItems.length}) </div>
                    <div>Rs {subtotal?.toFixed(2)}</div>
                  </div>

                  {couponApplied && (
                    <div className="d-flex justify-content-between mb-2">
                      <div>Coupon Discount</div>
                      <div>Rs {discount}</div>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-2">
                    <div>Sub Total</div>
                    <div>Rs {subtotal.toFixed(2) - discount}</div>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <div>Delivery charge</div>

                    <div>Rs {deliveryCharge?.toFixed(2)}</div>
                  </div>
                  <hr style={{ borderWidth: "2px", borderColor: "black" }} />
                  <div className="d-flex justify-content-between fw-bold mt-3">
                    <div>Total</div>
                    <div>
                      <span className="mr-2">INR </span>
                      {total?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <VerifyPincode />
            <Form.Check
              type="radio"
              checked={termsChecked}
              onChange={() => setTermsChecked(!termsChecked)}
              label="I have read and agree to the terms & conditions"
              className="mt-4 custom-radio2 mb-3 d-flex"
            />
            <Form.Check
              type="radio"
              label="Cash On Delivery "
              id="cashOnDelivery"
              value="cashOnDelivery"
              checked={selectedPaymentMethod === "cashOnDelivery"}
              onChange={handlePaymentMethodChange}
              name="paymentMethod"
              style={{ fontWeight: "bold" }}
              className="mt-2 custom-radio"
            />

            <Form.Check
              type="radio"
              name="paymentMethod"
              id="onlinePayment"
              value="onlinePayment"
              label="Online Payment"
              style={{ fontWeight: "bold" }}
              checked={selectedPaymentMethod === "onlinePayment"}
              onChange={handlePaymentMethodChange}
              className="mt-2 custom-radio"
            />
          </Col>
        </Row>

        <Row className="d-flex justify-content-center">
          <Col sm={6} md={6} lg={3}>
            <Button
              onClick={placeOrder}
              className="w-100 mt-3 pt-3 pb-3 "
              style={{
                background: "#5D0B86",
                border: "none",
                fontSize: "20px",
                display: "block",
              }}
            >
              Place Order
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Callback Modal */}
    </div>
  );
};

export default Checkout;
