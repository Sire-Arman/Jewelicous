import React, { useEffect, useState } from "react";
import "./style.css";
import { BASE_URL } from "../../../constant";
import axios from "axios";
import { IoInformationCircleOutline } from "react-icons/io5";

const PriceBreakup = ({
  productDetails,
  goldPurities,
  diamondPurities,
  weight,
  mrp,
  setMrp,
  price,
  setPrice,
  setGrandTotal,
  setOriginalPriceWithoutDiscount,
}) => {
  const [purities, setPurities] = useState([]);
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
    fetchAdminDiscounts();
  }, []);

  const goldPurity =
    purities.find((purity) => purity.name === goldPurities) || {};
  const diamondPurity =
    purities.find((purity) => purity.name === diamondPurities) || {};

  const rubyPurity = purities.find((purity) => purity.name === "1 carat");
  const solitairePurity = purities.find((purity) => purity.name === "1 ct");

  const goldPricePerGram = goldPurity?.price || 0;
  const diamondPrice = diamondPurity?.price || 0;
  const rubyPrice = rubyPurity?.price || 0;
  const solitairePrice = solitairePurity?.price || 0;
  const discount = productDetails?.discount || 0;
  const gstPercentage = productDetails?.gst || 3;
  const goldWeight = productDetails?.goldWeight || 0;
  const stoneWeight = productDetails?.stoneWeight || 0;
  const rubyWeight = productDetails?.rubyWeight || 0;
  const solitaireWeight = productDetails?.solitaireWeight || 0;
  const makingcharges = adminMakingCharges * goldWeight;

  const goldValue = goldPricePerGram * goldWeight;
  const stoneValue = diamondPrice ? diamondPrice * stoneWeight : 0;
  const rubyValue = rubyWeight ? rubyPrice * rubyWeight : 0;
  const solitaireValue = solitaireWeight ? solitairePrice * solitaireWeight : 0;
  const solitaireDiscount = adminSolitaireDiscount;
  const stoneDiscount = adminStoneDiscount;

  const discountedGoldValue = goldValue - (adminGoldDiscount / 100) * goldValue;
  const discountedDiamondValue =
    stoneValue - (adminDiamondDiscount / 100) * stoneValue;
  const discountedMakingCharges =
    makingcharges - (adminMakingChargeDiscount / 100) * makingcharges;
  const discountedSolitaireValue = (solitaireDiscount / 100) * solitaireValue;
  const discountedStoneValue = (stoneDiscount / 100) * rubyValue;

  const finalSolitaireValue = solitaireValue - discountedSolitaireValue;
  const finalStoneValue = rubyValue - discountedStoneValue;

  const subTotal =
    (discountedGoldValue || goldValue) +
    (discountedDiamondValue || stoneValue) +
    (discountedMakingCharges || makingcharges) +
    (finalStoneValue || 0) +
    (finalSolitaireValue || 0);

  const discountAmount = (discount / 100) * subTotal;
  const subTotalAfterDiscount = subTotal - discountAmount;
  const gstAmount = (gstPercentage / 100) * subTotalAfterDiscount;
  const grandTotal = subTotalAfterDiscount + gstAmount;
  const totalmrp =
    goldValue + stoneValue + makingcharges + rubyValue + solitaireValue;
  const originalPriceWithoutDiscount =
    totalmrp + (totalmrp * gstPercentage) / 100;

  useEffect(() => {
    setGrandTotal(grandTotal.toFixed(2));
    setOriginalPriceWithoutDiscount(originalPriceWithoutDiscount.toFixed(2));
  }, [
    grandTotal,
    setGrandTotal,
    originalPriceWithoutDiscount,
    setOriginalPriceWithoutDiscount,
  ]);

  if (subTotal > 0) {
    setMrp(subTotal.toFixed(2));
  }
  if (grandTotal > 0) {
    setPrice(grandTotal.toFixed(2));
  }

  const totalCaratWeight = stoneWeight + rubyWeight + solitaireWeight;

  return (
    <div className="price-box-container ">
      <h1 className="text-[40px]">Price Breakup</h1>
      <div className="price-box">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Rate</th>
              <th>Weight</th>
              <th>Discount</th>
              <th>Final Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{goldPurity.name || "N/A"} Gold </td>
              <td>Rs {goldPricePerGram || "_"}</td>
              <td id="tooltip" style={{ cursor: "pointer" }}>
                <span className="d-flex align-items-center gap-2">
                  <span>{goldWeight || "_"}g</span>
                  <span>
                    <IoInformationCircleOutline size={20} />
                  </span>
                </span>
                <span id="tooltip-text">
                  There can be a weight difference in final product. A refund
                  will be initiated if it is lesser than the weight mentioned.
                </span>
              </td>
              <td>{adminGoldDiscount ? `${adminGoldDiscount}%` : "-"}</td>
              <td>
                <small style={{ fontWeight: "bold" }}>Original Value: </small>
                Rs {goldValue ? goldValue.toFixed(2) : "-"}
                <br />
                <small style={{ fontWeight: "bold" }}>Discount Amount: </small>
                {goldValue && adminGoldDiscount
                  ? (goldValue * (adminGoldDiscount / 100)).toFixed(2)
                  : "-"}
                <br />
                <small style={{ fontWeight: "bold" }}>Final Value: </small>
                {discountedGoldValue ? discountedGoldValue.toFixed(2) : "-"}
              </td>
            </tr>

            <tr>
              <td>Making Charges</td>
              <td>-</td>
              <td>-</td>
              <td>
                {adminMakingChargeDiscount
                  ? `${adminMakingChargeDiscount}%`
                  : "-"}
              </td>
              <td>
                <small style={{ fontWeight: "bold" }}>Original Value: </small>
                Rs {makingcharges ? makingcharges.toFixed(2) : "-"}
                <br />
                <small style={{ fontWeight: "bold" }}>Discount Amount: </small>
                Rs{" "}
                {makingcharges && adminMakingChargeDiscount
                  ? (makingcharges * (adminMakingChargeDiscount / 100)).toFixed(
                      2
                    )
                  : "-"}
                <br />
                <small style={{ fontWeight: "bold" }}>Final Amount: </small>
                {discountedMakingCharges
                  ? discountedMakingCharges.toFixed(2)
                  : "_"}
              </td>
            </tr>

            {diamondPurity && (
              <tr>
                <td>Diamond ({diamondPurity.name})</td>
                <td>-</td>
                <td id="tooltip" style={{ cursor: "pointer" }}>
                  <span className="d-flex align-items-center gap-2">
                    <span>{stoneWeight.toFixed(2) || "_"}ct</span>
                    <span>
                      <IoInformationCircleOutline size={20} />
                    </span>
                  </span>
                  <span id="tooltip-text">
                    There can be a weight difference in final product. A refund
                    will be initiated if it is lesser than the weight mentioned.
                  </span>
                </td>
                <td>
                  {adminDiamondDiscount ? `${adminDiamondDiscount}%` : "-"}
                </td>
                <td>
                  <small style={{ fontWeight: "bold" }}>Original Value: </small>
                  Rs {stoneValue ? stoneValue.toFixed(2) : "-"}
                  <br />
                  <small style={{ fontWeight: "bold" }}>
                    Discount Amount:{" "}
                  </small>
                  Rs{" "}
                  {stoneValue && adminDiamondDiscount
                    ? (stoneValue * (adminDiamondDiscount / 100)).toFixed(2)
                    : "-"}
                  <br />
                  <small style={{ fontWeight: "bold" }}>Final Value: </small>
                  Rs{" "}
                  {discountedDiamondValue
                    ? discountedDiamondValue.toFixed(2)
                    : "-"}
                </td>
              </tr>
            )}

            {rubyPurity && (
              <tr>
                <td>Color Stone </td>
                <td>-</td>
                <td id="tooltip" style={{ cursor: "pointer" }}>
                  <span className="d-flex align-items-center gap-2">
                    <span>{rubyWeight || "_"}ct</span>
                    <span>
                      <IoInformationCircleOutline size={20} />
                    </span>
                  </span>
                  <span id="tooltip-text">
                    There can be a weight difference in final product. A refund
                    will be initiated if it is lesser than the weight mentioned.
                  </span>
                </td>
                <td>-</td>
                <td>Rs {rubyValue ? rubyValue.toFixed(2) : "-"}</td>
              </tr>
            )}

            {solitairePurity && (
              <tr>
                <td>Solitaire </td>
                <td>-</td>
                <td id="tooltip" style={{ cursor: "pointer" }}>
                  <span className="d-flex align-items-center gap-2">
                    <span>{solitaireWeight || "_"}ct</span>
                    <span>
                      <IoInformationCircleOutline size={20} />
                    </span>
                  </span>
                  <span id="tooltip-text">
                    There can be a weight difference in final product. A refund
                    will be initiated if it is lesser than the weight mentioned.
                  </span>
                </td>
                <td>-</td>
                <td>Rs {solitaireValue ? solitaireValue.toFixed(2) : "-"}</td>
              </tr>
            )}
          </tbody>
        </table>
        <table className="custom-table2">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sub Total</td>
              <td>-</td>
              <td id="tooltip" style={{ cursor: "pointer" }}>
                <span className="d-flex align-items-center gap-2">
                  <span>
                    {goldWeight || "-"}g {totalCaratWeight.toFixed(2) || "-"}
                    ct
                  </span>
                  <span>
                    <IoInformationCircleOutline size={20} />
                  </span>
                </span>
                <span>(gross weight)</span>
                <span id="tooltip-text">
                  There can be a weight difference in final product. A refund
                  will be initiated if it is lesser than the weight mentioned.
                </span>
              </td>
              <td>-</td>
              <td>Rs {subTotal ? subTotal.toFixed(2) : "-"}</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td>-</td>
              <td>-</td>
              <td>{discount ? `${discount}%` : "-"}</td>
              <td>Rs {discountAmount ? discountAmount.toFixed(2) : "-"}</td>
            </tr>
            <tr>
              <td>Subtotal after Discount</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>
                Rs{" "}
                {subTotalAfterDiscount ? subTotalAfterDiscount.toFixed(2) : "-"}
              </td>
            </tr>
            <tr>
              <td>GST ({gstPercentage}%)</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>Rs {gstAmount ? gstAmount.toFixed(2) : "-"}</td>
            </tr>
            <tr>
              <td className="font-bold">Grand Total</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>Rs {grandTotal ? grandTotal.toFixed(2) : "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceBreakup;
