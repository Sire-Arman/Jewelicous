import React from "react";
import CardsContainer from "../../components/WishlistPageComponents/CardsContainer";
import BookCallComponent from "../../components/CommonComponents/BookACallComponent/BookCallComponent";

const WishlistPage = () => {
  return (
    <div className="bg-[#F8F8F8]">
      <CardsContainer />
      <BookCallComponent />
    </div>
  );
};

export default WishlistPage;
