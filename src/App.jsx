import React, { useEffect, useState, Suspense } from "react";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import "./App.css";
import Header from "./components/CommonComponents/Header/Header";
import Footer from "./components/CommonComponents/Footer/Footer";
import ScrollToTop from "./ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loader from "./assets/Images/loader.gif";
import ErrorPage from "./pages/Error/ErrorPage";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import PasswordReset from "./pages/LoginPage/PasswordReset";
import Breadcrumb from "./components/BreadCrumbs";

// Lazy load pages
const Home = React.lazy(() => import("./pages/Home/Home"));
const ShopPage = React.lazy(() => import("./pages/Shop/ShopPage"));
const ContactUs = React.lazy(() => import("./pages/ContactUs/ContactUs"));
const CartPage = React.lazy(() => import("./pages/Cart/CartPage"));
const ProfilePage = React.lazy(() => import("./pages/Profile/ProfilePage"));
const WishlistPage = React.lazy(() => import("./pages/Wishlist/WishlistPage"));
const Checkout = React.lazy(() => import("./pages/Checkout/Checkout"));
const OrderHistory = React.lazy(() =>
  import("./pages/OrderHistory/OrderHistory")
);
const CustomizePage = React.lazy(() =>
  import("./pages/Customize/CustomizePage")
);
const Product = React.lazy(() => import("./pages/Product/Product"));
const TermsConditions = React.lazy(() =>
  import("./pages/Terms&Conditions/TermsConditions")
);
const ReturnRefundPolicy = React.lazy(() =>
  import("./pages/Return&Refund/ReturnRefundPolicy")
);
const AboutUs = React.lazy(() => import("./pages/AboutUs/AboutUs"));
const Login = React.lazy(() => import("./pages/LoginPage/Login"));
const Signup = React.lazy(() => import("./pages/Signup/Signup"));
const PaymentSuccessfull = React.lazy(() =>
  import("./pages/PaymentStatus/PaymentSuccessfull")
);
const PaymentUnsuccessfull = React.lazy(() =>
  import("./pages/PaymentStatus/PaymentUnSuccessfull")
);
const FaqPage = React.lazy(() => import("./pages/Faq/FaqPage"));

function App() {
  const [openingCategory, setOpeningCategory] = useState(
    localStorage.getItem("openingCategory") || ""
  );
  const location = useLocation();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const preloadPages = async () => {
      await Promise.all([
        import("./pages/Home/Home"),
        import("./pages/Shop/ShopPage"),
        import("./pages/ContactUs/ContactUs"),
        import("./pages/Profile/ProfilePage"),
        import("./pages/Wishlist/WishlistPage"),
        import("./pages/Cart/CartPage"),
        import("./pages/Checkout/Checkout"),
        import("./pages/OrderHistory/OrderHistory"),
        import("./pages/Customize/CustomizePage"),
        import("./pages/Product/Product"),
        import("./pages/Terms&Conditions/TermsConditions"),
        import("./pages/Return&Refund/ReturnRefundPolicy"),
        import("./pages/AboutUs/AboutUs"),
        import("./pages/LoginPage/Login"),
        import("./pages/Signup/Signup"),
        import("./pages/PaymentStatus/PaymentSuccessfull"),
        import("./pages/PaymentStatus/PaymentUnSuccessfull"),
        import("./pages/Faq/FaqPage"),
      ]);
    };

    preloadPages();
  }, []);

  // Update localStorage whenever openingCategory changes
  useEffect(() => {
    localStorage.setItem("openingCategory", openingCategory);
  }, [openingCategory]);

  return (
    <div>
      <Header
        openingCategory={openingCategory}
        setOpeningCategory={setOpeningCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <ScrollToTop />
      {location.pathname === "/shop" && <Breadcrumb />}
      <Suspense
        fallback={
          <div className="d-flex justify-content-center align-items-center h-[100vh]">
            <img src={loader} className="h-[150px]  w-[150px]" />
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <Home
                openingCategory={openingCategory}
                setOpeningCategory={setOpeningCategory}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <ShopPage
                openingCategory={openingCategory}
                setOpeningCategory={setOpeningCategory}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            }
          />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orderhistory" element={<OrderHistory />} />
          <Route path="/customize" element={<CustomizePage />} />
          <Route path="/productdetails/:productId" element={<Product />} />
          <Route path="/terms&conditions" element={<TermsConditions />} />
          <Route
            path="/return-refund-policy"
            element={<ReturnRefundPolicy />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/forgot-password" element={<PasswordReset />} />
          <Route path="/reset" element={<PasswordReset />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/payment-successful" element={<PaymentSuccessfull />} />

          <Route
            path="/payment-unsuccessful"
            element={<PaymentUnsuccessfull />}
          />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </Suspense>
      <ToastContainer position="top-center" />
      <Footer setOpeningCategory={setOpeningCategory} />
    </div>
  );
}

export default App;
