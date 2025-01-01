import React, { useEffect, useState } from "react";
import "./EditAddress.css";
import axios from "axios";
import { BASE_URL } from "../../../constant";
import { toast } from "react-toastify";
import cogoToast from "cogo-toast";

function EditAddress({ address }) {
  const userId = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    houseName: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    landMark: "",
    addrType: "",
  });

  useEffect(() => {
    // console.log(address);
    if (address) {
      setFormData({
        houseName: address.houseName || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        pinCode: address.pinCode || "",
        country: address.country || "India",
        landMark: address.landMark || "",
        addrType: address.addrType,
      });
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, "===", value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  // console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if address and userId are available
    if (!address || !userId) {
      // console.error("Address or userId is missing");
      return;
    }

    const sanitizedAddressName = formData.houseName.replace(/\s+/g, "");
    const sanitizedCity = formData.city.replace(/\s+/g, "");
    const sanitizedStreet = formData.street.replace(/\s+/g, "");
    const sanitizedState = formData.state.replace(/\s+/g, "");
    const sanitizedCountry = formData.country.replace(/\s+/g, "");
    const sanitizedPinCode = formData.pinCode.replace(/\s+/g, "");
    const sanitizedLandMark = formData.pinCode.replace(/\s+/g, "");
    if (
      !sanitizedAddressName ||
      !sanitizedCity ||
      !sanitizedStreet ||
      !sanitizedState ||
      !sanitizedCountry ||
      !sanitizedPinCode ||
      !sanitizedLandMark
    ) {
      cogoToast.error("Please fill in all required fields!");
      return;
    }

    if (!/^\d{6}$/.test(formData.pinCode)) {
      toast.error("Please enter a valid 6-digit pin code.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/users/updateAddress/${userId}`,
        {
          addrId: address.addrId,
          houseName: formData.houseName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          country: formData.country,
          landMark: formData.landMark,
          addrType: address.addrType,
        }
      );
      toast.success("Address updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating address", error);
    }
  };

  return (
    <div
      className="modal fade"
      id="editaddressModal"
      tabIndex="-1"
      aria-labelledby="searchModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="btn btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{ display: "block" }}
            ></button>
          </div>
          <div className="modal-body">
            <h5 className="text-center">Edit Address</h5>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  House Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="houseName"
                  value={formData.houseName}
                  onChange={handleChange}
                  id="exampleFormControlInput1"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Street
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  id="exampleFormControlInput1"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-control"
                  id="exampleFormControlInput1"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="form-control"
                  id="exampleFormControlInput1"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Pin Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  id="exampleFormControlInput1"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Country
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  id="exampleFormControlInput1"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="landMark" className="form-label">
                  landMark
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="landMark"
                  value={formData.landMark}
                  onChange={handleChange}
                  id="landMark"
                />
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  className="btn"
                  id="form-submit-btn"
                  style={{
                    textAlign: "center",
                    backgroundColor: "black",
                    color: "white",
                    display: "block",
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EditAddress;
