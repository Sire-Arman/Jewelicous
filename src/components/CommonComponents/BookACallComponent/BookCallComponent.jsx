import React, { useState } from "react";
import callIcon from "../../../assets/Images/Call-PNG.png";
import VCIcon from "../../../assets/Images/unnamed.png";
import WAIcon from "../../../assets/Images/whts.png";
import "./styles.css";
import ReactWhatsapp from "react-whatsapp";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { BASE_URL } from "../../../../constant";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookCallComponent = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [messageReason, setMessageReason] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [reqMessage, setReqMessage] = useState("");
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleContactForm = async (e) => {
    e.preventDefault();

    const sanitizedUsername = name.replace(/\s+/g, "");
    // const sanitizedMessageReason = messageReason.replace(/\s+/g, "");
    // const sanitizedMessage = reqMessage.replace(/\s+/g, "");
    const sanitizedPhonenumber = phoneNo.replace(/\D/g, "");

    if (sanitizedUsername == "") {
      toast.error("Please Enter valid Username");
      return;
    // } else if (sanitizedMessageReason == "") {
    //   toast.error("Please Enter valid Message Reason");
    //   return;
    } else if (phoneNo.length != 10 || phoneNo !== sanitizedPhonenumber) {
      toast.error("Please Enter valid 10 digit Mobile number");
      return;
    // } else if (sanitizedMessage == "") {
    //   toast.error("Please Enter valid Message");
    //   return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await axios.post(`${BASE_URL}/customerMessage/add`, {
          messageReason: messageReason,
          reqMessage: reqMessage,
          name: sanitizedUsername,
          phoneNo: sanitizedPhonenumber,
          userId: userId,
        });

        const { errorMessage } = response.data;
        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          toast.success("Message sent!");
          setName("");
          setPhoneNo("");
          setMessageReason("");
          setReqMessage("");
          handleClose();
        }

        handleClose();
      } else {
        navigate("/signup");
      }
    } catch (error) {
      console.error(error.response.data);
      toast.error("Something went wrong! Try again later");
    }
  };

  return (
    <div className="book-call-components d-flex justify-content-center align-items-center gap-5 ">
      <div
        className="p-4 d-flex justify-content-center align-items-center gap-3 call-component"
        onClick={handleShow}
        style={{
          background: "#e9e9e9",
          fontSize: "25px",
          fontWeight: "bold",
          borderRadius: "10px",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          cursor: "pointer",
        }}
      >
        Book a call
        <img src={callIcon} width={"60px"} height={"60px"} alt="Call Icon" />
        <img src={VCIcon} width={"80px"} height={"80px"} alt="VC Icon" />
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="font-bold">Request a Callback</Modal.Title>
        </Modal.Header>
        <form method="post" onSubmit={handleContactForm}>
          <Modal.Body>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">
                Name
              </label>
              <input
                type="text"
                class="form-control"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">
                Message Reason
              </label>
              <input
                type="text"
                class="form-control"
                value={messageReason}
                onChange={(e) => {
                  setMessageReason(e.target.value);
                }}
                required
              />
              <p className="">
                <b>Note:</b> Upto 4 words only.
              </p>
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">
                Mobile Number
              </label>
              <input
                type="number"
                class="form-control"
                value={phoneNo}
                onChange={(e) => {
                  setPhoneNo(e.target.value);
                }}
                required
              />
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">
                Message
              </label>
              <textarea
                type="text"
                class="form-control"
                value={reqMessage}
                onChange={(e) => {
                  setReqMessage(e.target.value);
                }}
                required
              />
              <p className="">
                <b>Note:</b> Upto 4 words only
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" type="submit">
              Send Request
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <ReactWhatsapp number="+91 8707428216" message="I am interested">
        <div
          className="p-4 d-flex justify-content-center align-items-center gap-3 chat-component"
          style={{
            background: "#e9e9e9",
            fontSize: "25px",
            fontWeight: "bold",
            borderRadius: "10px",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
        >
          Connect us on Whatsapp
          <img
            src={WAIcon}
            width={"100px"}
            height={"100px"}
            alt="WhatsApp Icon"
          />
        </div>
      </ReactWhatsapp>

      {/* Call Modal */}
      <div
        className="modal fade"
        id="callModal"
        tabIndex="-1"
        aria-labelledby="callModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "rgba(0, 0, 0, 0.5) 0px 3px 8px",
              width: "350px",
              padding: "20px",
              position: "relative", // To position the close icon
            }}
          >
            {/* Close Icon */}
            <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{
                position: "absolute",
                top: "6px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "35px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>

            <div
              style={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "600",
                position: "relative",
                top: "40px",
              }}
            >
              Talk to our experts at
            </div>
            <div
              style={{
                padding: "60px 0 30px 0",
                fontSize: "22px",
                textAlign: "center",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "15px",
              }}
              className="gradient-text"
            >
              <img
                src={callIcon}
                width={"25px"}
                height={"0px"}
                alt="Call Icon"
              />
              <span>+91 8707428216</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCallComponent;
