import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../constant";
import BookCallComponent from "../../components/CommonComponents/BookACallComponent/BookCallComponent";
import styles from "./OrderHistory.module.css";
import Modal from "react-bootstrap/Modal";
import { ProgressBar } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoArrowRedoOutline } from "react-icons/io5";
import orderImg from "../../assets/Images/order-new.png";
import BackButton from "../../components/CommonComponents/BackButton";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumbs";

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [returnRequestStatuses, setReturnRequestStatuses] = useState({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelSerialNo, setCancelSerialNo] = useState(null);
  const [showReturn, setShowReturn] = useState(false);
  const [returnOrder, setReturnOrder] = useState({
    reason: "",
    comment: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    accountHolderName: "",
  });
  const [returnSerialNo, setReturnSerialNo] = useState(null);
  const [show, setShow] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [variantData, setVariantData] = useState({
    colors: {},
    weights: {},
    sizes: {},
    goldPurities: {},
    diamondPurities: {},
  });

  const [purities, setPurities] = useState([]);

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

  const handleClose = () => setShow(false);
  const handleShow = async (order) => {
    setShow(true);
    setViewOrder(order);
    await fetchVariantData(order);
  };

  useEffect(() => {}, [viewOrder]);

  const handleCancelConfirmClose = () => setShowCancelConfirm(false);
  const handleCancelConfirmShow = (serialNo) => {
    setCancelSerialNo(serialNo);
    setShowCancelConfirm(true);
  };

  const handleReturnClose = () => setShowReturn(false);
  const handleReturnShow = (serialNo) => {
    setReturnSerialNo(serialNo);
    setShowReturn(true);
  };

  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${BASE_URL}/orders/summary?userId=${userId}`
      );
      // console.log("orders", response.data);
      setOrders(response.data);
      response.data.forEach((order) =>
        fetchReturnRequestStatus(order.orders[0].serialNo)
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchReturnRequestStatus = async (serialNo) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/return-request/status-string?orderId=${serialNo}`
      );
      setReturnRequestStatuses((prevState) => ({
        ...prevState,
        [serialNo]: response.data,
      }));
    } catch (error) {
      navigate("/error");
      console.error("Error fetching return request status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchVariantData = async (order) => {
    const ids = {
      colors: new Set(),
      weights: new Set(),
      sizes: new Set(),
      goldPurities: new Set(),
      diamondPurities: new Set(),
    };

    order.orders.forEach((product) => {
      ids.colors.add(product.productObject.colors);
      ids.weights.add(product.productObject.weights);
      ids.sizes.add(product.productObject.sizes);
      ids.goldPurities.add(product.productObject.goldPurities);
      ids.diamondPurities.add(product.productObject.diamondPurities);
    });

    const fetchColorNames = Array.from(ids.colors).map(
      (id) =>
        axios
          .get(`${BASE_URL}/product-variants/colors/${id}`)
          .then((res) => ({ id, name: res.data.colorname }))
          .catch(() => ({ id, name: "N/A" })) // Handle errors
    );

    const fetchWeightNames = Array.from(ids.weights).map(
      (id) =>
        axios
          .get(`${BASE_URL}/product-variants/weights/${id}`)
          .then((res) => ({ id, name: res.data.weight }))
          .catch(() => ({ id, name: "N/A" })) // Handle errors
    );

    const fetchSizeNames = Array.from(ids.sizes).map(
      (id) =>
        axios
          .get(`${BASE_URL}/product-variants/sizes/${id}`)
          .then((res) => ({ id, name: res.data.sizenumber }))
          .catch(() => ({ id, name: "N/A" })) // Handle errors
    );

    const fetchGoldPurityNames = Array.from(ids.goldPurities).map(
      (id) =>
        axios
          .get(`${BASE_URL}/api/purity/${id}`)
          .then((res) => ({ id, name: res.data.name }))
          .catch(() => ({ id, name: "N/A" })) // Handle errors
    );

    const fetchDiamondPurityNames = Array.from(ids.diamondPurities).map(
      (id) =>
        axios
          .get(`${BASE_URL}/api/purity/${id}`)
          .then((res) => ({ id, name: res.data.name }))
          .catch(() => ({ id, name: "N/A" })) // Handle errors
    );

    try {
      const [
        colorNames,
        weightNames,
        sizeNames,
        goldPurityNames,
        diamondPurityNames,
      ] = await Promise.all([
        Promise.all(fetchColorNames),
        Promise.all(fetchWeightNames),
        Promise.all(fetchSizeNames),
        Promise.all(fetchGoldPurityNames),
        Promise.all(fetchDiamondPurityNames),
      ]);

      setVariantData({
        colors: Object.fromEntries(
          colorNames.map(({ id, name }) => [id, name])
        ),
        weights: Object.fromEntries(
          weightNames.map(({ id, name }) => [id, name])
        ),
        sizes: Object.fromEntries(sizeNames.map(({ id, name }) => [id, name])),
        goldPurities: Object.fromEntries(
          goldPurityNames.map(({ id, name }) => [id, name])
        ),
        diamondPurities: Object.fromEntries(
          diamondPurityNames.map(({ id, name }) => [id, name])
        ),
      });
    } catch (error) {
      console.error("Error fetching variant data:", error);
      // Optionally handle any global error state
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case "ORDERED":
        return 15;
      case "SHIPPED":
        return 35;
      case "DELIVERED":
        return 65;
      case "CANCELED":
        return 100;
      default:
        return 0;
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/orders/status/${cancelSerialNo}?newStatus=CANCELED`
      );

      toast.success("Order Cancelled");
      window.location.reload();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleReturnOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/api/return-request/${returnSerialNo}`,
        returnOrder
      );
      toast.success("Return Initiated");
      await fetchOrders(); // Refresh orders to check updated status
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleReturnOrderChange = (e) => {
    const { name, value } = e.target;
    setReturnOrder({ ...returnOrder, [name]: value });
  };

  function isReturnActive(statusUpdateDate) {
    const currentDate = new Date();
    const updateDate = new Date(statusUpdateDate);
    const timeDiff = currentDate - updateDate;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    return daysDiff <= 15;
  }

  return (
    <div
      className={`bg-[#F6F6F6] sm:px-4 md:px-2 lg:px-12 py-5 ${styles.orderhistorypage_container}`}
    >
      {/*<Breadcrumbs />*/}
      <div
        className={`rounded-[20px] bg-[#F6F1FA] pt-3 pb-2 mb-8 md:px-2 lg:px-12 shadow-[0_1px_1px_0px_rgb(167, 187, 0)] ${styles.subcontainer}`}
      >
        <h1 className="text-[24px] font-bold">Order History</h1>

        {orders.length > 0 ? (
          orders.map((order, index) => (
            <React.Fragment key={index}>
              <div
                className={` flex md:gap-4 my-4 ${styles.orderitem_container}`}
              >
                <img
                  src={order.orderImage}
                  className={`lg:w-[295px] self-start ${styles.order_image}`}
                  alt="Order"
                />
                <div className="flex flex-col gap-3 sm:flex-row flex-grow">
                  <div className="flex gap-12 flex-col flex-grow">
                    <div>
                      <h2 className="font-semibold md:text-[20px]">
                        {order.orders[0].productName}
                      </h2>
                      {order.productCount > 1 ? (
                        <span>+{order.productCount - 1} more</span>
                      ) : (
                        ""
                      )}
                      <button
                        // onClick={() =>
                        //   handleCancelConfirmShow(order.orders[0].serialNo)
                        // }
                        onClick={() => {
                          handleShow(order);
                        }}
                        style={{
                          border: "2px solid #5D0B86", // Red color for cancel
                          color: "#5D0B86",
                          fontWeight: "600",
                          fontSize: "15px",
                          padding: "2px 10px",
                          borderRadius: "5px",
                          marginTop: "10px",
                          marginLeft: "5px",
                        }}
                        type="button"
                      >
                        View Order
                      </button>
                      <div className="flex mt-2">
                        <div className="flex flex-col ">
                          <span className="sm:text-[20px]">
                            ₹ {order.orders[0].finalOrderAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex text-[#383737] mt- ${styles.order_subdetails}`}
                    >
                      <div className="flex flex-col ">
                        <span>Order Placed</span>
                        <span>
                          {new Date(
                            order.orders[0].billDate
                          ).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span>Order ID</span>
                        <span>#{order.billNo}</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="flex justify-between absolute w-full top-[-1.5rem] left-0">
                        <span className="text-xs font-bold">ORDERED</span>
                        <span className="text-xs font-bold">SHIPPED</span>
                        <span className="text-xs font-bold">DELIVERED</span>
                        <span className="text-xs font-bold">CANCELLED</span>
                      </div>
                      <ProgressBar
                        style={{ height: "10px" }}
                        variant="success"
                        now={getProgressPercentage(order.orders[0].orderStatus)}
                        label={false}
                      />
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex flex-col">
                      {order.orders[0].orderStatus === "ORDERED" ||
                      order.orders[0].orderStatus === "SHIPPED" ? (
                        <button
                          onClick={() =>
                            handleCancelConfirmShow(order.orders[0].serialNo)
                          }
                          style={{
                            border: "2px solid #dc3545",
                            color: "#dc3545",
                            fontWeight: "600",
                            fontSize: "15px",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                          type="button"
                        >
                          Cancel Order
                        </button>
                      ) : (
                        ""
                      )}
                      {order.orders[0].orderStatus === "DELIVERED" &&
                        !returnRequestStatuses[order.orders[0].serialNo] &&
                        isReturnActive(order.orders[0].statusUpdateDate) && (
                          <button
                            style={{
                              border: "2px solid #198754",
                              color: "#198754",
                              fontWeight: "600",
                              fontSize: "15px",
                              padding: "5px 10px",
                              borderRadius: "5px",
                            }}
                            type="button"
                            onClick={() =>
                              handleReturnShow(order.orders[0].serialNo)
                            }
                          >
                            Return Order
                          </button>
                        )}
                      {order.orders[0].orderStatus === "DELIVERED" &&
                        returnRequestStatuses[order.orders[0].serialNo] &&
                        (returnRequestStatuses[order.orders[0].serialNo] ===
                        "Return Rejected" ? (
                          <p className="d-flex text-[red] align-items-center font-bold">
                            Request Cancelled
                          </p>
                        ) : (
                          <p className="d-flex text-[green] align-items-center font-bold">
                            Return Initiated
                            <IoArrowRedoOutline />
                          </p>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[99%] h-2 border-t-2 border-[#a29c9c] mx-auto "></div>
            </React.Fragment>
          ))
        ) : (
          <div className="d-flex flex-col gap-3 mb-5 justify-content-center align-items-center">
            <img width={"220px"} src={orderImg} />
            <h1 style={{ fontWeight: "bold", fontSize: "25px" }}>
              Oops! No Orders Yet!
            </h1>
            {/*<h1 style={{ fontSize: "20px", textAlign: "center" }}>
              Your next great find is just a click away!
            </h1>
            <button
              style={{
                background: "#7d22aa",
                color: "#fff",
                textTransform: "uppercase",
                padding: "5px 10px",
                borderRadius: "5px",
              }}
              onClick={() => navigate("/")}
            >
              Shop Now
            </button>*/}
          </div>
        )}
      </div>

      {/* Modals for Cancel Confirmation and Return Order */}
      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelConfirm} onHide={handleCancelConfirmClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this order?</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={handleCancelConfirmClose}
          >
            Close
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              handleCancelOrder();
              handleCancelConfirmClose();
            }}
          >
            Cancel Order
          </button>
        </Modal.Footer>
      </Modal>

      {/* Return Order Modal */}
      <Modal show={showReturn} onHide={handleReturnClose}>
        <Modal.Header closeButton>
          <Modal.Title>Return Order</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleReturnOrderSubmit}>
          <Modal.Body>
            {/* Return Order Form */}
            <div className="form-group">
              <label>Reason for Return</label>
              <input
                type="text"
                className="form-control"
                name="reason"
                value={returnOrder.reason}
                onChange={handleReturnOrderChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Comment (Optional)</label>
              <textarea
                className="form-control"
                name="comment"
                value={returnOrder.comment}
                onChange={handleReturnOrderChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Bank Account Number</label>
              <input
                type="text"
                className="form-control"
                name="accountNumber"
                value={returnOrder.accountNumber}
                onChange={handleReturnOrderChange}
                required
              />
            </div>
            <div className="form-group">
              <label>IFSC Code</label>
              <input
                type="text"
                className="form-control"
                name="ifscCode"
                value={returnOrder.ifscCode}
                onChange={handleReturnOrderChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Bank Name</label>
              <input
                type="text"
                className="form-control"
                name="bankName"
                value={returnOrder.bankName}
                onChange={handleReturnOrderChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Account Holder Name</label>
              <input
                type="text"
                className="form-control"
                name="accountHolderName"
                value={returnOrder.accountHolderName}
                onChange={handleReturnOrderChange}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={handleReturnClose}>
              Close
            </button>
            <button type="submit" className="btn btn-success">
              Submit Return
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* View more details modal */}
      <Modal
        show={show}
        className={`${styles.view_modal} w-full max-w-5xl`} // Ensures the modal is full width with a max width
        onHide={handleClose}
        size="xl"
        style={{ minWidth: "100%" }} // Ensures a minimum width for the modal
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${styles.view_modal_body} overflow-auto`}>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Product Name</th>
                <th className="border border-gray-300 p-2">Color</th>
                <th className="border border-gray-300 p-2">
                  Gold/Diamond Weight
                </th>
                <th className="border border-gray-300 p-2">Size</th>
                <th className="border border-gray-300 p-2">Gold Purity</th>
                <th className="border border-gray-300 p-2">Diamond Purity</th>
                <th className="border border-gray-300 p-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {viewOrder &&
                viewOrder.orders.map((product, index) => {
                  // console.log("orders", orders);
                  const goldPurity =
                    purities.find((purity) => purity.name === product.gold) ||
                    {};
                  const diamondPurity =
                    purities.find(
                      (purity) => purity.name === product.diamond
                    ) || {};
                  const rubyPurity =
                    purities.find((purity) => purity.name === "1 carat") || {};
                  const solitairePurity =
                    purities.find((purity) => purity.name === "1 ct") || {};

                  const goldPricePerGram = product.productObject.goldWeight
                    ? goldPurity?.price
                    : 0;
                  const diamondPrice = product.productObject.stoneWeight
                    ? diamondPurity?.price
                    : 0;

                  const rubyPrice = product.productObject.rubyWeight
                    ? rubyPurity.price
                    : 0;
                  const solitairePrice = product.productObject.solitaireWeight
                    ? solitairePurity.price
                    : 0;

                  const makingCharges =
                    product.productObject?.makingcharges || 0;
                  const additionaldiscount =
                    product.productObject?.discount || 0;
                  const gstPercentage = product.productObject?.gst || 3;
                  const goldWeight = product.productObject?.goldWeight || 0;
                  const stoneWeight = product.productObject?.stoneWeight || 0;

                  const goldDiscount = product.productObject?.goldDiscount || 0;
                  const diamondDiscount =
                    product.productObject?.diamondDiscount || 10;
                  const makingChargesDiscount =
                    product.productObject?.makingChargesDiscount || 25;

                  const goldValue = goldPricePerGram * goldWeight;
                  const stoneValue = diamondPrice
                    ? diamondPrice * stoneWeight
                    : 0;
                  const rubyValue =
                    rubyPrice * product.productObject.rubyWeight;
                  const solitaireValue =
                    solitairePrice * product.productObject.solitaireWeight;

                  const discountedGoldValue = (goldDiscount / 100) * goldValue;
                  const discountedDiamondValue =
                    (diamondDiscount / 100) * stoneValue;
                  const discountedMakingCharges =
                    (makingChargesDiscount / 100) * makingCharges;

                  const finalGoldValue = goldValue - discountedGoldValue;
                  const finalDiamondValue = stoneValue - discountedDiamondValue;
                  const finalMakingCharges =
                    makingCharges - discountedMakingCharges;

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
                    rubyValue +
                    solitaireValue;

                  const discountAmount =
                    (additionaldiscount / 100) * discountedBasePrice;

                  const finalDiscountedPrice =
                    discountedBasePrice - discountAmount;

                  const gstAmount =
                    (gstPercentage / 100) * finalDiscountedPrice;

                  const calculatedMrp =
                    basePrice + (gstPercentage / 100) * basePrice;

                  const calculatedPrice = finalDiscountedPrice + gstAmount;

                  return (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        {product.productName || "-"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {product.color || "-"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {product.goldWeight}g {product.stoneWeight || "-"} ct
                      </td>
                      <td className="border border-gray-300 p-2">
                        {product.size || "-"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {product.gold || "-"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {product.diamond || "-"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        Rs. {calculatedPrice?.toFixed(2) || "-"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default OrderHistory;
