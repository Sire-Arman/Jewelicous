import React, { useState } from "react";
import BookCallComponent from "../../components/CommonComponents/BookACallComponent/BookCallComponent";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../constant";
import cogoToast from "cogo-toast";
import styles from "./ContactUs.module.css";

function ContactUs() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [messageReason, setMessageReason] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [reqMessage, setReqMessage] = useState("");

  const handleContactForm = async (e) => {
    e.preventDefault();

    const sanitizedUsername = name.replace(/\s+/g, "");
    // const sanitizedMessageReason = messageReason.replace(/\s+/g, "");
    // const sanitizedMessage = reqMessage.replace(/\s+/g, "");
    const sanitizedPhonenumber = phoneNo.replace(/\D/g, "");

    if (sanitizedUsername == "") {
      cogoToast.error("Please Enter valid Username");
      return;
    // } else if (sanitizedMessageReason == "") {
    //   cogoToast.error("Please Enter valid Message Reason");
    //   return;
    } else if (phoneNo.length != 10 || phoneNo !== sanitizedPhonenumber) {
      cogoToast.error("Please Enter a valid 10 digit Mobile number");
      return;
    // } else if (sanitizedMessage == "") {
    //   cogoToast.error("Please Enter valid Message");
    //   return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        console.log(messageReason);
        console.log(reqMessage);
        const response = await axios.post(`${BASE_URL}/customerMessage/add`, {
          messageReason: messageReason,
          reqMessage: reqMessage,
          name: sanitizedUsername,
          phoneNo: sanitizedPhonenumber,
          userId: userId,
        });

        const { errorMessage } = response.data;
        if (errorMessage) {
          cogoToast.error(errorMessage);
        } else {
          cogoToast.success("Message sent!");
          setName("");
          setPhoneNo("");
          setMessageReason("");
          setReqMessage("");
        }
      } else {
        navigate("/signup");
      }
    } catch (error) {
      navigate("/error");
      console.error(error.response.data);
      cogoToast.error("Something went wrong! Try again later");
    }
  };

  return (
    <div className="bg-[#F6F6F6]  pb-5">
      {/* <div className="bg-[#5D0B86] hidden sm:flex justify-between pr-10  py-4 text-white text-[48px] font-bold italic gap-5 ">
        <h2 className="text-white relative top-28 pl-4 md:pl-24">Contact Us</h2>
        <img src="ContactUsBanner.png" className="h-[78vh]" />
      </div> */}
      <div className={styles.contactus_herosection}>
        <img
          src={
            "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/contact-us.png"
          }
          class
        />
        <div>
          <h1 className={styles.contactus_mainheading}>Contact Us</h1>
          <h2 className={styles.contactus_subheading}>
            We’re here to assist you with all your jewelry needs. Reach out to
            us with any questions or concerns.
          </h2>
        </div>
      </div>
      <div className="pt-5 sm:pt-0">
        <form
          className={`bg-[#FFFEFB] rounded-[34px] shadow-[0_4px_4px_0px_rgba(0,0,0,0.3)] border-[#FFC68D99] border-[1px] py-6 ${styles.contactusform}`}
          method="post"
          onSubmit={handleContactForm}
        >
          <h1 className="text-center  pb-16  font-semibold text-[32px]">
            Leave Us A Message
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 px-4  ">
            <input
              placeholder="Name"
              className="h-[55px] pl-4 bg-[#F6F1FA] rounded-[10px]  shadow-[inset_0_4px_4px_0px_rgba(0,0,0,0.3)] sm:w-0 flex-grow"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              placeholder="Message reason"
              className="h-[55px] pl-4 bg-[#F6F1FA] rounded-[10px] shadow-[inset_0_4px_4px_0px_rgba(0,0,0,0.3)] sm:w-0 flex-grow"
              type="text"
              name="messagereason"
              value={messageReason}
              onChange={(e) => {
                setMessageReason(e.target.value);
              }}
              required
            />
            <input
              placeholder="Phone number"
              className="h-[55px] pl-4 bg-[#F6F1FA] rounded-[10px] shadow-[inset_0_4px_4px_0px_rgba(0,0,0,0.3)] sm:w-0 flex-grow"
              type="number"
              name="phoneNo"
              value={phoneNo}
              onChange={(e) => {
                setPhoneNo(e.target.value);
              }}
              required
            />
          </div>
          <div className="flex px-4 mt-4">
            <textarea
              placeholder="Message"
              className="pl-4 pt-3 bg-[#F6F1FA] rounded-[10px] shadow-[inset_0_4px_4px_0px_rgba(0,0,0,0.3)] flex-grow"
              rows="7"
              value={reqMessage}
              onChange={(e) => {
                setReqMessage(e.target.value);
              }}
              required
            />
          </div>
          <div className="flex justify-center mt-4 mb-2">
            <button
              className="text-[white] font-semibold bg-[#5D0B86] px-4 py-2 rounded-[5px] "
              type="submit"
            >
              SEND MESSAGE
            </button>
          </div>
        </form>
      </div>

      <div
        className="flex px-7 pt-12 lg:justify-between gap-3 flex-wrap sm:justify-center lg:flex-nowrap"
        style={{ fontFamily: "jost" }}
      >
        <div className="flex flex-grow sm:flex-grow-0 bg-[#FCFCFF] rounded-[29px]  py-3 w-[420px] items-center gap-1 px-4 shadow-[0_4px_4px_0px_rgba(0,0,0,0.3)]">
          <img src="Location.png" className="w-[50px]" />
          <div className="flex flex-col leading-5">
            <div className="mb-1">
              <span className="font-bold text-xl">Office Address</span>
              <p className="mt-1">
                Neel Jewels by Arman Siddiqui <br />
                Office xxx, Acss Sdcc, <br />
                A S Wsaaa SSd, Chembur Station <br />
                Ardddsa 4xxx71
              </p>
            </div>
            <div>
              <span className="font-bold text-xl">Shop Address</span>
              <p className="mt-1">
                Neel Jewels by Arman Siddiqui <br />
                Office xxx, Acss Sdcc, <br />
                A S Wsaaa SSd, Chembur Station <br />
                Ardddsa 4xxx71
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-grow sm:flex-grow-0 bg-[#FCFCFF] rounded-[29px] py-3 w-[320px] items-center gap-1 px-4 shadow-[0_4px_4px_0px_rgba(0,0,0,0.3)]">
          <img src="Email.png" className="w-[50px]" />
          <div className="flex flex-col leading-5 pl-4">
            <span>Email address</span>
            <a href="mailto:shopneeljewels@gmail.com">
              armansid6783@gmail.com
            </a>
          </div>
        </div>
        <div className="flex flex-grow sm:flex-grow-0 bg-[#FCFCFF] rounded-[29px] py-3 w-[320px] items-center gap-1 px-4  shadow-[0_4px_4px_0px_rgba(0,0,0,0.3)] ">
          <img src="Telephone2.png" className="w-[50px]" />
          <div className="flex flex-col leading-5 pl-6 ">
            <span>Phone number</span>
            <a href="tel:+8707428216">+91 8707428216</a>{" "}
          </div>
        </div>
      </div>
      <div className="mx-4 my-12 ">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.1539807762056!2d73.00095577497689!3d19.056966382143656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c1575bffffff%3A0x2a2d9acca19f90!2sThe%20Affaires!5e0!3m2!1sen!2sin!4v1724925762300!5m2!1sen!2sin"
          width="100%"
          style={{ border: "2px solid green", borderRadius: "20px" }}
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          className={styles.map}
        ></iframe>
      </div>
      <BookCallComponent />
    </div>
  );
}

export default ContactUs;
