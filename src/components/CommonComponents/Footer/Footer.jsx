import React, { useState, useEffect } from "react";
import styles from "./Footer.module.css";
import { Link, useNavigate } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { IoMailOutline } from "react-icons/io5";
import { CiMobile3 } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram, FaFacebookSquare, FaLinkedin } from "react-icons/fa";
// import toast from "cogo-toast";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "../../../../constant";

const Footer = ({ setOpeningCategory }) => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("home");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [emailSubscribedValue, setEmailSubscribedValue] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const handleHeaderClick = (section) => {
    setActiveSection(section);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 900);
  };

  const fetchAllNewsletter = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/newsletter/get-all`);
      setSubscribers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllNewsletter();
  }, []);

  const handleSubscibe = async () => {
    // Basic email validation regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailSubscribedValue)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/newsletter/join?email=${emailSubscribedValue}`
        );
        if (response.data == "Email already signed up.") {
          toast.info(response.data);
        } else {
          toast.success(response.data);
          setEmailSubscribedValue("");
        }
      } catch (error) {
        toast.error("Error subscribing to the NeelJewells");
      }
    } else {
      toast.error(
        "Please signup first in order to Subscribe our Newsletter"
      );
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.footer}>
      <div className={styles.footer_items}>
        <div className={styles.footer_item1}>
          <div className={styles.all_links}>
            <div className={styles.footer_links}>
              <h3
                onClick={() => isMobile && handleHeaderClick("home")}
                className={`${isMobile ? styles.clickable : ""} ${
                  activeSection === "home" ? styles.active : ""
                }`}
              >
                Quick Links
              </h3>
              {(!isMobile || activeSection === "home") && (
                <ul>
                  <li>
                    <Link to={"/"}>Home</Link>
                  </li>
                  <li>
                    <Link to={"/aboutus"}>About Us</Link>
                  </li>
                  <li>
                    <Link to={"/contactus"}>Contact Us</Link>
                  </li>
                  <li>
                    <Link to={"/shop"} onClick={() => setOpeningCategory("")}>
                      Our Shop
                    </Link>
                  </li>
                </ul>
              )}
            </div>
            <div className={styles.footer_links}>
              <h3
                onClick={() => isMobile && handleHeaderClick("account")}
                className={`${isMobile ? styles.clickable : ""} ${
                  activeSection === "account" ? styles.active : ""
                }`}
              >
                Account
              </h3>
              {(!isMobile || activeSection === "account") && (
                <ul>
                  <li
                    onClick={() => {
                      const userId = localStorage.getItem("userId");
                      if (userId) navigate("/orderhistory");
                      else navigate("/sign-in");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Track Order
                  </li>
                </ul>
              )}
            </div>
            <div className={styles.footer_links}>
              <h3
                onClick={() => isMobile && handleHeaderClick("policy")}
                className={`${isMobile ? styles.clickable : ""} ${
                  activeSection === "policy" ? styles.active : ""
                }`}
              >
                Policy
              </h3>
              {(!isMobile || activeSection === "policy") && (
                <ul>
                  <li>
                    <Link to={"/terms&conditions"}>Terms & Conditions</Link>
                  </li>
                  <li>
                    <Link to={"/privacy-policy"}>Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to={"/return-refund-policy"}>Return Policy</Link>
                  </li>
                </ul>
              )}
            </div>
            <div className={styles.footer_links}>
              <h3
                onClick={() => isMobile && handleHeaderClick("help")}
                className={`${isMobile ? styles.clickable : ""} ${
                  activeSection === "help" ? styles.active : ""
                }`}
              >
                Help
              </h3>
              {(!isMobile || activeSection === "help") && (
                <ul>
                  <li>
                    <Link to={"/faq"}> FAQs</Link>
                  </li>
                  
                </ul>
              )}
            </div>
          </div>
          <div className={styles.subscribe_input_container}>
            <h3>Be The first to know</h3>
            <p>
              Sign up to stay updated on new products, brand stories and events.
            </p>
            <div className={styles.input_box}>
              <input
                required
                type="email"
                placeholder="Email Address"
                value={emailSubscribedValue}
                onChange={(e) => setEmailSubscribedValue(e.target.value)}
              />
              <button onClick={handleSubscibe}>Subscribe</button>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.contact_info}>
            <CiLocationOn id={styles.location_icon} />
            <p>
              Shop No. FXX, (First Floor), The Affaires, Sector-XX, Asaas Sbsasan sasa - 4xxx05
            </p>
          </div>
          <div className={styles.contact_info}>
            <IoMailOutline size={25} />
            <p> armansid6783@gmail.com </p>
          </div>
          <div className={styles.contact_info}>
            <CiMobile3 size={25} />
            <span>
              <p>+91 8707428216</p> 
            </span>
          </div>
        </div>
      </div>
      <div className={styles.footer_bottom}>
        <div
          className={`${styles.footer_icons} d-flex align-items-center gap-3`}
        >
          <a href="https://x.com/JewelsNeel86569">
            <FaXTwitter size={25} />
          </a>
          <a href="https://www.instagram.com/neeljewels/">
            <FaInstagram size={25} />
          </a>
          <a href="https://www.facebook.com/NEELJEWELS">
            <FaFacebookSquare size={25} />
          </a>
          <a href="https://www.linkedin.com/in/neel-jewels-75bb0a32b/">
            <FaLinkedin size={25} />
          </a>
        </div>
        <div>
          <p className="text-center ">
            Design and Developed By{" "}
            <a href="https://www.linkedin.com/in/arman-siddiqui-07495a226/" target="blank">
              Arman Siddiqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
