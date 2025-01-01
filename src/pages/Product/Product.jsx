import React, { useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import TopSellers from "../../components/HomePageComponents/TopSellers";
import BookCallComponent from "../../components/CommonComponents/BookACallComponent/BookCallComponent";
import TopSection from "../../components/ProductPageComponents/TopSection";
import DescriptionandReviews from "../../components/ProductPageComponents/DescriptionandReviews";
import ReviewSection from "../../components/ProductPageComponents/ReviewSection";
import PriceBreakup from "../../components/ProductPageComponents/Pricebreakup";
import HallMarks from "../../components/ProductPageComponents/HallMarks";

function Product() {
  const [productCategory, setProductCategory] = useState("");
  return (
    <div className="bg-[#F6F6F6]">
      <TopSection
        productCategory={productCategory}
        setProductCategory={setProductCategory}
      />

      <DescriptionandReviews />
      <HallMarks />
      <TopSellers title="Related Products" productCategory={productCategory} />
      <ReviewSection />
      <BookCallComponent />
    </div>
  );
}

export default Product;
