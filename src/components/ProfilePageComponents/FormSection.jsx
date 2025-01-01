import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "./styles.css";
import { BASE_URL } from "../../../constant";
import cogoToast from "cogo-toast";

const FormSection = () => {
  const [user, setUser] = useState({
    name: "",
    lastname: "",
    email: "",
    mobile: "",
  });
  const [address, setAddress] = useState({
    addrId: "",
    addrType: "",
    houseName: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  });
  console.log("Address", address);
  const [existingAddress, setExistingAddress] = useState([]);
  const [editableAddressId, setEditableAddressId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For delete confirmation
  const [addressToDelete, setAddressToDelete] = useState(null);

  const toggleEdit = (addrId) => {
    if (editableAddressId === addrId) {
      setEditableAddressId(null);
    } else {
      setEditableAddressId(addrId);
      const addressToEdit = existingAddress.find(
        (addr) => addr.addrId === addrId
      );
      if (addressToEdit) {
        setAddress(addressToEdit);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`${BASE_URL}/users/userByID/${userId}`);
      const userData = response.data;
      setUser({
        name: userData.parName,
        lastname: userData.lastname,
        email: userData.email,
        mobile: userData.mobile1,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${BASE_URL}/users/getAllAddresses/${userId}`
      );
      if (response.data && response.data.length > 0) {
        setExistingAddress(response.data);
        setOriginalAddresses(response.data); // Store the original addresses
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  console.log("Existing Address", existingAddress);

  // const validateMobileNumber = (number) => {
  //   const isValid = /^[0-9]{10}$/.test(number);
  //   if (!isValid) {
  //     setError('Mobile number must be exactly 10 digits.');
  //   } else {
  //     setError('');
  //   }
  //   return isValid;
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    console.log(name, "===", value);
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSaveDetails = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const nameRegex = /^[A-Za-z\s]+$/;
      const sanitizedname = user.name.trim();

      if (!nameRegex.test(sanitizedname)) {
        cogoToast.error("Name should only contain letters and spaces.");
        return;
      }
      // Update user information

      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(user.mobile)) {
        cogoToast.error("Mobile number must be exactly 10 digits.");
        return;
      }

      const userData = {
        parName: user.name,
        mobile1: user.mobile,
      };

      await axios.post(`${BASE_URL}/users/updateUser/${userId}`, userData);
      cogoToast.success("Your profile have been updated!");
      fetchAddresses();
    } catch (error) {
      console.error(error);
      cogoToast.error("Error while updating profile. Please try again.");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");

      // Check if the user already has 3 addresses
      if (existingAddress.length >= 3) {
        cogoToast.error("You can't add more than three addresses.");
        return;
      }

      const sanitizedAddressType = address.addrType.replace(/\s+/g, "");
      const sanitizedAddressName = address.houseName.replace(/\s+/g, "");
      const sanitizedCity = address.city.replace(/\s+/g, "");
      const sanitizedStreet = address.street.replace(/\s+/g, "");
      const sanitizedState = address.state.replace(/\s+/g, "");
      const sanitizedCountry = address.country.replace(/\s+/g, "");
      const sanitizedPinCode = address.pinCode.replace(/\s+/g, "");

      if (sanitizedAddressType == "") {
        cogoToast.error("Please Enter valid Address Type");
        return;
      }
      if (sanitizedAddressName == "") {
        cogoToast.error("Please Enter valid House Name");
        return;
      }
      if (sanitizedCity == "") {
        cogoToast.error("Please Enter valid City Name");
        return;
      }
      if (sanitizedStreet == "") {
        cogoToast.error("Please Enter valid Street Name");
        return;
      }
      if (sanitizedState == "") {
        cogoToast.error("Please Enter valid State Name");
        return;
      }
      if (sanitizedCountry == "") {
        cogoToast.error("Please Enter valid Country Name");
        return;
      }
      if (sanitizedPinCode == "") {
        cogoToast.error("Please Enter valid Pin code");
        return;
      }

      // Generate a new addrId based on the existing addresses
      const newAddrId =
        existingAddress.length > 0
          ? Math.max(...existingAddress.map((addr) => parseInt(addr.addrId))) +
            1
          : 1;

      const newAddressData = {
        ...address,
        addrId: newAddrId.toString(),
      };

      console.log("New Address Data", newAddressData);

      await axios.post(
        `${BASE_URL}/users/addNewAddress/${userId}`,
        newAddressData
      );

      fetchAddresses();
      cogoToast.success("Address added successfully!");

      setAddress({
        addrId: "",
        addrType: "",
        houseName: "",
        street: "",
        city: "",
        state: "",
        pinCode: "",
        country: "",
        landMark: "",
      });
    } catch (error) {
      console.error(error);
      cogoToast.error("Error while adding Address. Please try again.");
    }
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const updatedAddress = {
        ...address,
      };
      console.log("Updated Address", updatedAddress);
      const sanitizedAddressType = address.addrType.replace(/\s+/g, "");
      const sanitizedAddressName = address.houseName.replace(/\s+/g, "");
      const sanitizedCity = address.city.replace(/\s+/g, "");
      const sanitizedStreet = address.street.replace(/\s+/g, "");
      const sanitizedState = address.state.replace(/\s+/g, "");
      const sanitizedCountry = address.country.replace(/\s+/g, "");
      const sanitizedPinCode = address.pinCode.replace(/\s+/g, "");
      const sanitizedLandMark = address.landMark.replace(/\s+/g, "");

      if (sanitizedAddressType == "") {
        cogoToast.error("Please Enter valid Address Type");
        return;
      }
      if (sanitizedAddressName == "") {
        cogoToast.error("Please Enter valid House Name");
        return;
      }
      if (sanitizedCity == "") {
        cogoToast.error("Please Enter valid City Name");
        return;
      }
      if (sanitizedStreet == "") {
        cogoToast.error("Please Enter valid Street Name");
        return;
      }
      if (sanitizedState == "") {
        cogoToast.error("Please Enter valid State Name");
        return;
      }
      if (sanitizedCountry == "") {
        cogoToast.error("Please Enter valid Country Name");
        return;
      }
      if (sanitizedPinCode == "") {
        cogoToast.error("Please Enter valid Pin code");
        return;
      }
      if (sanitizedLandMark == "") {
        cogoToast.error("Please Enter valid landmark");
        return;
      }

      await axios.post(
        `${BASE_URL}/users/updateAddress/${userId}`,
        updatedAddress
      );

      setEditableAddressId(null);
      fetchAddresses();
      cogoToast.success("Address updated successfully!");
    } catch (error) {
      console.error(error);
      cogoToast.error("Error updating address. Please try again.");
    }
  };

  const handleDeleteClick = (addrId) => {
    setAddressToDelete(addrId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.delete(
        `${BASE_URL}/users/deleteAddress?userId=${userId}&addrId=${addressToDelete}`
      );
      cogoToast.success("Address deleted successfully!");
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      cogoToast.error("Error deleting address. Please try again.");
    } finally {
      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  return (
    <section>
      <div className="profile-form-section">
        <div>
          <form>
            <div>
              <h1
                style={{
                  fontWeight: "bold",
                  marginBottom: "10px",
                  fontSize: "25px",
                }}
              >
                Account
              </h1>
              <h3 style={{ fontSize: "20px" }}>User Information</h3>
              <div className="d-flex gap-4 mb-3 mt-3">
                <input
                  style={{ width: "100%" }}
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="d-flex gap-4 mb-3 mt-3">
                <input
                  style={{ width: "100%" }}
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  readOnly
                />
                <input
                  style={{ width: "100%" }}
                  type="tel"
                  placeholder="Mobile Number"
                  required
                  name="mobile"
                  value={user.mobile}
                  onChange={handleChange}
                  maxLength={"10"}
                  minLength={"10"}
                  size={"10"}
                />
              </div>
              <div className="d-flex justify-content-center ">
                <button
                  type="button"
                  style={{
                    background: "#5D0B86",
                    color: "#fff",
                    padding: "8px 50px",
                    borderRadius: "5px",
                    marginTop: "20px",
                  }}
                  onClick={handleSaveDetails}
                >
                  {" "}
                  Save Details
                </button>
              </div>
            </div>
            <div className="mt-5">
              <h3 style={{ fontSize: "20px" }}>Shipping Address</h3>

              <div className="d-flex gap-4 mb-3 mt-3">
                <input
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Address Type"
                  name="addrType"
                  value={address.addrType}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="House Name"
                  name="houseName"
                  value={address.houseName}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Street/Landmark"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="d-flex gap-4 mb-3 mt-3">
                <input
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="City"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="landMark"
                  name="landMark"
                  value={address.landMark}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  style={{ width: "100%" }}
                  type="number"
                  placeholder="PinCode"
                  name="pinCode"
                  value={address.pinCode}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="d-flex gap-4 mb-3 mt-3">
                <input
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="State"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Country"
                  name="country"
                  value={address.country}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>
            <p>
              <b>Note:</b> User can save upto 3 address.
            </p>
          </form>
        </div>
        <div className="d-flex justify-content-center ">
          <button
            type="button"
            style={{
              background: "#5D0B86",
              color: "#fff",
              padding: "10px 50px",
              borderRadius: "5px",
            }}
            onClick={handleAddAddress}
          >
            {" "}
            Save Address
          </button>
        </div>
      </div>

      {existingAddress.length > 0 ? (
        existingAddress.map((add) => (
          <div className="profile-form-section" key={add.addrId}>
            <form>
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <h1
                    style={{
                      fontWeight: "bold",
                      marginBottom: "10px",
                      fontSize: "25px",
                    }}
                  >
                    {add.addrType}
                  </h1>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      style={{
                        background: "#5D0B86",
                        color: "#fff",
                        padding: "3px 30px",
                        borderRadius: "5px",
                      }}
                      onClick={() => toggleEdit(add.addrId)}
                    >
                      {editableAddressId === add.addrId ? "Cancel" : "Edit"}
                    </button>
                    <Button
                      style={{
                        background: "#B22222",
                        color: "#fff",
                        border: "none",
                        padding: "3px 30px",
                        borderRadius: "5px",
                      }}
                      onClick={() => handleDeleteClick(add.addrId)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="d-flex gap-4 mb-3 mt-3">
                  <input
                    style={{ width: "100%" }}
                    type="text"
                    placeholder="Address Type"
                    name="addrType"
                    value={
                      add.addrId === editableAddressId
                        ? address.addrType
                        : add.addrType
                    }
                    onChange={handleAddressChange}
                    readOnly={add.addrId !== editableAddressId}
                  />
                  <input
                    style={{ width: "100%" }}
                    type="text"
                    placeholder="House Name"
                    required
                    name="houseName"
                    value={
                      add.addrId === editableAddressId
                        ? address.houseName
                        : add.houseName
                    }
                    onChange={handleAddressChange}
                    readOnly={add.addrId !== editableAddressId}
                  />
                  <input
                    style={{ width: "100%" }}
                    type="text"
                    placeholder="Street/Landmark"
                    name="street"
                    value={
                      add.addrId === editableAddressId
                        ? address.street
                        : add.street
                    }
                    onChange={handleAddressChange}
                    required
                    readOnly={add.addrId !== editableAddressId}
                  />
                </div>
                <div className="d-flex gap-4 mb-3 mt-3">
                  <input
                    style={{ width: "100%" }}
                    type="text"
                    placeholder="City"
                    name="city"
                    value={
                      add.addrId === editableAddressId ? address.city : add.city
                    }
                    onChange={handleAddressChange}
                    required
                    readOnly={add.addrId !== editableAddressId}
                  />
                  <input
                    style={{ width: "100%" }}
                    type="number"
                    placeholder="PinCode"
                    name="pinCode"
                    value={
                      add.addrId === editableAddressId
                        ? address.pinCode
                        : add.pinCode
                    }
                    onChange={handleAddressChange}
                    readOnly={add.addrId !== editableAddressId}
                    required
                  />
                </div>
                <div className="d-flex gap-4 mb-3 mt-3">
                  <input
                    style={{ width: "100%" }}
                    type="text"
                    placeholder="State"
                    name="state"
                    value={
                      add.addrId === editableAddressId
                        ? address.state
                        : add.state
                    }
                    onChange={handleAddressChange}
                    readOnly={add.addrId !== editableAddressId}
                    required
                  />
                  <input
                    style={{ width: "100%" }}
                    type="text"
                    placeholder="landMark"
                    name="landMark"
                    value={
                      add.addrId === editableAddressId
                        ? address.landMark
                        : add.landMark
                    }
                    onChange={handleAddressChange}
                    readOnly={add.addrId !== editableAddressId}
                    required
                  />
                  <input
                    style={{ width: "100%" }}
                    type="text"
                    placeholder="Country"
                    name="country"
                    value={
                      add.addrId === editableAddressId
                        ? address.country
                        : add.country
                    }
                    onChange={handleAddressChange}
                    readOnly={add.addrId !== editableAddressId}
                    required
                  />
                </div>
              </div>
              {editableAddressId === add.addrId && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <button
                    className="save-address-button"
                    style={{
                      background: "#5D0B86",
                      color: "#fff",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: "5px",
                      fontSize: "20px",
                    }}
                    onClick={handleAddressSave}
                  >
                    Save
                  </button>
                </div>
              )}
            </form>
          </div>
        ))
      ) : (
        <div className="profile-form-section">
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
              No Address Found
            </h3>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <Modal show={isDeleteModalOpen} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this address?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default FormSection;
