import React, { useEffect, useState } from "react";
import "./NewAddress.css";
import axios from "axios";
import { BASE_URL } from "../../../constant";
import { toast } from "react-toastify";
import cogoToast from "cogo-toast";

function NewAddress() {
  const [newAddress, setNewAddress] = useState({
    addrId: 1,
    houseName: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    landMark: "",
  });

  const [addressErrors, setAddressErrors] = useState({});
  const [existingAddress, setExistingAddress] = useState([]);

  const fetchAddresses = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${BASE_URL}/users/getAllAddresses/${userId}`
      );
      if (response.data && response.data.length > 0) {
        setExistingAddress(response.data);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleAddAddress = async (event) => {
    event.preventDefault();
    setAddressErrors((prevErrors) => ({ ...prevErrors, allFields: "" }));

    const sanitizedAddressName = newAddress.houseName.replace(/\s+/g, "");
    const sanitizedCity = newAddress.city.replace(/\s+/g, "");
    const sanitizedStreet = newAddress.street.replace(/\s+/g, "");
    const sanitizedState = newAddress.state.replace(/\s+/g, "");
    const sanitizedCountry = newAddress.country.replace(/\s+/g, "");
    const sanitizedPinCode = newAddress.pinCode.replace(/\s+/g, "");
    const sanitizedlandMark = newAddress.landMark.replace(/\s+/g, "");
    if (
      !sanitizedAddressName ||
      !sanitizedCity ||
      !sanitizedStreet ||
      !sanitizedState ||
      !sanitizedCountry ||
      !sanitizedPinCode ||
      !sanitizedlandMark
    ) {
      setAddressErrors({ allFields: "Please fill in all required fields." });
      cogoToast.error("Please fill in all required fields!");
      return;
    }

    if (!/^\d{6}$/.test(newAddress.pinCode)) {
      cogoToast.error("Please enter a valid 6-digit pin code.");
      setAddressErrors((prevErrors) => ({
        ...prevErrors,
        pinCode: "Please enter a valid 6-digit pin code.",
      }));
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      // Check if the user already has 3 addresses
      if (existingAddress.length >= 3) {
        toast.error("You can't add more than three addresses.");
        return;
      }

      // Generate a new addrId based on the existing addresses
      const newAddrId =
        existingAddress.length > 0
          ? Math.max(...existingAddress.map((addr) => parseInt(addr.addrId))) +
            1
          : 1;

      const newAddressData = {
        ...newAddress,
        addrId: newAddrId.toString(),
      };

      const addressRes = await axios.post(
        `${BASE_URL}/users/addNewAddress/${userId}`,
        newAddressData
      );

      if (addressRes && addressRes.data) {
        toast.success("Address added successfully!");
        fetchAddresses();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Error adding address. Please try again.");
    }
  };

  return (
    <div
      className="modal fade"
      id="addressModal"
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
            <h5 className="text-center">Add new Address</h5>
            <p className="text-center">
              Fill accurate details in the below form
            </p>

            <form onSubmit={handleAddAddress}>
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
                  value={newAddress.houseName}
                  onChange={handleAddressChange}
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
                  name="street"
                  value={newAddress.street}
                  onChange={handleAddressChange}
                  className="form-control"
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
                  value={newAddress.city}
                  onChange={handleAddressChange}
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
                  value={newAddress.state}
                  onChange={handleAddressChange}
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
                  name="pinCode"
                  value={newAddress.pinCode}
                  onChange={handleAddressChange}
                  className="form-control"
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
                  name="country"
                  value={newAddress.country}
                  onChange={handleAddressChange}
                  className="form-control"
                  id="exampleFormControlInput1"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="landMark" className="form-label">
                  landMark
                </label>
                <input
                  type="text"
                  name="landMark"
                  value={newAddress.landMark}
                  onChange={handleAddressChange}
                  className="form-control"
                  id="landMark"
                />
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  className="btn"
                  id="form-submit-btn"
                  type="submit"
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
export default NewAddress;
