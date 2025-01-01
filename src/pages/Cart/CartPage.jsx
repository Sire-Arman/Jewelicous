import React, { useRef } from "react";
import CartItems from "../../components/CartComponents/CartItems";
import CouponCard from "../../components/CartComponents/CouponCard";
import RelatedProducts from "../../components/CartComponents/RelatedProducts";
import BookCallComponent from "../../components/CommonComponents/BookACallComponent/BookCallComponent";
import "../../components/CartComponents/style.css";

const CartPage = () => {
  const relatedProductsRef = useRef(null);
  const handleSeeMoreClick = (e) => {
    e.preventDefault();
    if (relatedProductsRef.current) {
      relatedProductsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="main-cart-container bg-[#f6f6f6]">
      <CartItems scrollToRelatedProducts={relatedProductsRef} />

      <div ref={relatedProductsRef}>
        <RelatedProducts />
      </div>
      <BookCallComponent />
    </div>
  );
};

export default CartPage;
