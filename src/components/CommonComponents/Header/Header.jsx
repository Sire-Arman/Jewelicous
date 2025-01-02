import { useEffect, useRef, useState } from "react"; // Import useState for managing active state
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import styles from "./Header.module.css";
import { FaSearch, FaUserAlt, FaRegUserCircle, FaHeart } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { TbPhoneCall } from "react-icons/tb";
import { IoHome } from "react-icons/io5";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { GoPackageDependents } from "react-icons/go";
import { GiHamburgerMenu } from "react-icons/gi";
// import toast from "cogo-toast";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../../public/conpanylogo1.png";
import { RiHeartAddLine } from "react-icons/ri";
import callIcon from "../../../assets/Images/call.png";
import { BASE_URL } from "../../../../constant";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import MarqueeBanner from "./FlashSale";
import CustomHeader from "../../HomePageComponents/CustomHeader";
import iconLogo from "../../../../public/NJ.png";
import { FaCartShopping } from "react-icons/fa6";
import { CiShop } from "react-icons/ci";

export default function Header({
  openingCategory,
  setOpeningCategory,
  searchTerm,
  setSearchTerm,
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [activeItem, setActiveItem] = useState("home");
  const userId = localStorage.getItem("userId");
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [flashMessage, setFlashMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  const [searchField, setSearchField] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const offcanvasRef = useRef(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/category/all-unhide
          `
        );

        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    fetchFlashSaleMessage();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("userId");
    toast.success("Logout successfully");
    navigate("/");
  };
  const fetchFlashSaleMessage = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/flashSale/message`);
      const temp = response.data;

      setFlashMessage(temp);
      const repeatedMessages = Array(20).fill(flashMessage || "Flash Sale");
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearchProduct = async () => {
    try {
      const userId = localStorage.getItem("userId");
      // const response = await axios.get(
      //   `${BASE_URL}/products/filter?userId=${userId}&searchName=${searchTerm}`
      // );

      navigate(`/shop?userId=${userId}&searchName=${searchTerm}`);
      if (offcanvasRef.current) {
        const offcanvas = window.bootstrap.Offcanvas.getInstance(
          offcanvasRef.current
        );
        if (offcanvas) offcanvas.hide();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    if (item === "home") navigate("/");
    else if (item === "callback") navigate("/");
    else if (item === "profile") {
      if (userId) navigate("/profile");
      else navigate("/sign-in");
    } else if (item === "orderhistory") {
      if (userId) navigate("/orderhistory");
      else navigate("/sign-in");
    } else if (item === "cart") {
      if (userId) navigate("/cart");
      else navigate("/sign-in");
    } else if (item === "wishlist") {
      if (userId) navigate("/wishlist");
      else navigate("/sign-in");
    } else if (item === "signin") {
      navigate("/sign-in");
    } else if (item === "signout") {
      handleLogout();
    }
    if (offcanvasRef.current) {
      const offcanvas = window.bootstrap.Offcanvas.getInstance(
        offcanvasRef.current
      );
      if (offcanvas) offcanvas.hide();
    }
  };

  useEffect(() => {
    if (offcanvasRef.current) {
      const offcanvas = new window.bootstrap.Offcanvas(offcanvasRef.current);
      offcanvas.hide();
    }
  }, [offcanvasRef]);

  return (
    <div
      style={{
        position: "sticky",
        top: "0px",
        zIndex: "100",
        backgroundColor: "black",
        boxShadow:
          "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
      }}
    >
      <MarqueeBanner flashMessage={flashMessage} />

      <div
        className={`${styles.header_style} flex flex-row items-center py-2 lg:py-[11px] px-4 lg:px-1 justify-between lg:justify-between`}
      >
        <div className="d-flex align-items-center gap-2">
          <GiHamburgerMenu
            size={35}
            style={{ cursor: "pointer", color: "#fff" }}
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            className={styles.menu_logo}
            aria-controls="offcanvasRight"
          />
          {/*<img
            src={iconLogo}
            alt="Image"
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
            id={styles.icon_logo}
            style={{ cursor: "pointer" }}
          />*/}
        </div>

        <div>
          {/*<img
            src={logo}
            alt="Image"
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
            id={styles.res_logo}
            style={{ cursor: "pointer" }}
          />*/}
          <div className={`${styles.res_icons} `}>
            <CiShop onClick={() => navigate("/shop")} size={28} />
            <FaHeart onClick={() => navigate("/wishlist")} size={28} />
            <FaCartShopping onClick={() => navigate("/cart")} size={28} />
          </div>
        </div>
        {/* Responsive mode sidebar */}
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasRight"
          aria-labelledby="offcanvasRightLabel"
          ref={offcanvasRef}
        >
          <div className="offcanvas-header d-flex justify-content-between">
            {/*<img
              src="./companylogo.svg"
              alt="Image"
              onClick={() => {
                navigate("/");
                window.scrollTo(0, 0);
              }}
              style={{ cursor: "pointer" }}
            />*/}
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              className="bg-[black] rounded-full p-2"
              style={{ color: "white" }}
            >
              <RxCross1 size={20} />
            </button>
          </div>
          <div className="offcanvas-body">
            <div className="d-flex ">
              <input
                type="text"
                className={`form-control ${styles.res_search_input}`}
                placeholder="Type to Search"
                // value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setSearchTerm(e.target.value);
                    setOpeningCategory("");
                    handleSearchProduct();
                  }
                }}
                style={{
                  width: "100%",
                  height: "45px",
                  border: "2px solid silver",
                }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSearchTerm(e.target.value);
                  setOpeningCategory("");
                  handleSearchProduct();
                }}
                style={{ marginLeft: "-35px" }}
              >
                <FaSearch size={20} />
              </button>
            </div>
            <ul className="d-flex flex-column gap-2 pt-4">
              <li
                className={`d-flex align-items-center gap-3 p-2 ${
                  activeItem === "home" ? styles.active : ""
                }`}
                onClick={() => handleItemClick("home")}
              >
                <IoHome size={25} />
                <button style={{ fontSize: "20px" }}>Home</button>
              </li>
              <li
                className={`d-flex align-items-center gap-3 p-2 ${
                  activeItem === "callback" ? styles.active : ""
                }`}
                onClick={() => {
                  handleItemClick("callback");
                  handleShow();
                }}
                // data-bs-toggle="modal"
                // data-bs-target="#callModal"
              >
                <TbPhoneCall size={25} />
                <button style={{ fontSize: "20px" }}>
                  Talk to our Experts
                </button>
              </li>
              <li
                className={`d-flex align-items-center gap-3 p-2 ${
                  activeItem === "profile" ? styles.active : ""
                }`}
                onClick={() => handleItemClick("profile")}
              >
                <FaRegUserCircle size={25} />
                <button style={{ fontSize: "20px" }}>Profile</button>
              </li>

              <li
                className={`d-flex align-items-center gap-3 p-2 ${
                  activeItem === "orderhistory" ? styles.active : ""
                }`}
                onClick={() => handleItemClick("orderhistory")}
              >
                <GoPackageDependents size={25} />
                <button style={{ fontSize: "20px" }}>Return & Orders</button>
              </li>
              <li
                className={`d-flex align-items-center gap-3 p-2 ${
                  activeItem === "cart" ? styles.active : ""
                }`}
                onClick={() => handleItemClick("cart")}
              >
                <MdAddShoppingCart size={25} />
                <button style={{ fontSize: "20px" }}>Cart</button>
              </li>
              <li
                className={`d-flex align-items-center gap-3 p-2 ${
                  activeItem === "wishlist" ? styles.active : ""
                }`}
                onClick={() => handleItemClick("wishlist")}
              >
                <RiHeartAddLine size={25} />
                <button style={{ fontSize: "20px" }}>Wishlist</button>
              </li>
              {userId ? (
                <li
                  className={`d-flex align-items-center gap-3 p-2 ${
                    activeItem === "signout" ? styles.active : ""
                  }`}
                  onClick={() => handleItemClick("signout")}
                >
                  <LiaSignOutAltSolid size={25} />
                  <button onClick={handleLogout} style={{ fontSize: "20px" }}>
                    Sign Out
                  </button>
                </li>
              ) : (
                <li
                  className={`d-flex align-items-center gap-3 p-2 ${
                    activeItem === "signout" ? styles.active : ""
                  }`}
                  onClick={() => handleItemClick("signin")}
                >
                  <LiaSignOutAltSolid size={25} />
                  <button
                    onClick={() => navigate("/sign-in")}
                    style={{ fontSize: "20px" }}
                  >
                    Sign In
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Website mode navbar */}
        <div
          className={`hidden lg:flex cursor-pointer ${styles.callbackButton} shinningbutton `}
          id="header_shining_btn"
          onClick={() => {
            handleShow();
          }}
          // data-bs-toggle="modal"
          // data-bs-target="#callModal"
        >
          <TbPhoneCall size={25} />
          <div className="flex flex-col pr-2">
            <span className="text-[14px]">Talk to</span>
            <span className="font-semibold text-[14px]">Our Experts</span>
          </div>
        </div>
        <div className="hidden lg:block rounded-[5px] overflow-hidden">
          <div className="d-flex">
            <button
              className="all-btn btn bg-[silver] dropdown-toggle rounded-[5px]"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              All
            </button>
            <ul className="dropdown-menu">
              {categories.map((category, index) => (
                <Link
                  to={""}
                  onClick={() => {
                    setSearchTerm("");
                    setOpeningCategory(category.categoryId);
                    window.location.href = `/shop?category=${category.categoryId}`;
                  }}
                >
                  <li
                    className={`text-center py-2 border-b-[2px] ${styles.hoveroncategories}`}
                  >
                    {category.categoryName}
                  </li>
                </Link>
              ))}
            </ul>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setSearchTerm(e.target.value);
                  setOpeningCategory("");
                  handleSearchProduct();
                }
              }}
              // ref={inputRef}
              type="text"
              placeholder="Search"
              id={styles.nav_search_input}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // onKeyDown={(e) => {
              //   if (e.key === "Enter") {
              //     e.preventDefault();
              //     setOpeningCategory("");
              //     setSearchTerm(e.target.value);
              //     handleSearchProduct();
              //   }
              // }}
              className="w-[550px] h-[40px] border-[#626060S] border-[0.5px] outline-none pl-3 hidden lg:block bg-gray-800 text-white rounded-[5px]"
            />
            <button
              className="bg-[#5d0b86] h-[40px] px-3 hidden lg:block"
              onClick={() => {
                // setOpeningCategory("");
                // setSearchTerm(inputRef.current.value);
                handleSearchProduct();
              }}
            >
              <FaSearch color="white" />
            </button>
          </div>
        </div>

        <button
          className="hidden lg:flex shinningbutton"
          id="header_shining_btn"
          style={{
            borderRadius: 100,
            backgroundColor: "#5D0B86",
            color: "#ffff",
            height: 45,
            width: 45,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: "0",
          }}
          onClick={() => {
            const userId = localStorage.getItem("userId");
            if (userId) navigate("/profile");
            else navigate("/sign-in");
          }}
        >
          <FaUserAlt />
        </button>

        {userId ? (
          <button
            onClick={handleLogout}
            id="header_shining_btn"
            className="h-10 w-24 text-base font-semibold bg-purple text-white rounded-[5px] flex-shrink-0 hidden lg:block shinningbutton"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => navigate("/sign-in")}
            id="header_shining_btn"
            className="h-10 w-24 text-base font-semibold bg-purple text-white rounded-[5px] flex-shrink-0 hidden lg:block shinningbutton"
          >
            Sign In
          </button>
        )}
        <button
          id="header_shining_btn"
          onClick={() => {
            const userId = localStorage.getItem("userId");
            if (userId) navigate("/orderhistory");
            else navigate("/sign-in");
          }}
          className="h-10 w-34 text-base font-semibold bg-purple text-white rounded-[5px] flex-col flex-shrink-0 pl-3 pr-3 justify-center ml-1 mr-1 hidden lg:flex shinningbutton"
        >
          <button
            onClick={() => {
              const userId = localStorage.getItem("userId");
              if (userId) navigate("/orderhistory");
              else navigate("/sign-in");
            }}
          >
            <span className="text-[14px]">Return & Order</span>
          </button>
        </button>
        <button
          onClick={() => {
            const userId = localStorage.getItem("userId");
            if (userId) navigate("/cart");
            else navigate("/sign-in");
          }}
          id="header_shining_btn"
          className="h-10 w-16 text-base font-semibold bg-purple text-white rounded-[5px] flex-shrink-0 justify-center items-center hidden lg:flex shinningbutton"
        >
          <MdAddShoppingCart /> Cart
        </button>
        <button
          onClick={() => {
            const userId = localStorage.getItem("userId");
            if (userId) navigate("/wishlist");
            else navigate("/sign-in");
          }}
          id="header_shining_btn"
          className="h-10 w-30 px-2 text-base font-semibold bg-purple text-white rounded-[5px] flex-shrink-0 justify-center items-center hidden lg:flex gap-1 shinningbutton"
        >
          <RiHeartAddLine size={20} /> Wishlist
        </button>
      </div>

      {/* Callback Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className={styles.requestACallModal}
      >
        <Modal.Header
          closeButton
          className={styles.requestACallModalHeader}
        ></Modal.Header>
        <Modal.Body>
          <div
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "600",
              position: "relative",
              top: "-20px",
            }}
          >
            Talk to our experts at
          </div>
          <div className="d-flex justify-content-center align-items-center pb-6">
            <img src={callIcon} width="25" alt="Call Icon" />
            <a
              href="tel:+91 8707428216"
              className={styles.gradienttext}
              style={{ marginLeft: "10px" }}
            >
              +91 8707428216
            </a>
          </div>
        </Modal.Body>
      </Modal>
      {isMobile ? (
        <CustomHeader
          openingCategory={openingCategory}
          setOpeningCategory={setOpeningCategory}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
      ) : (
        ""
      )}
    </div>
  );
}
