import { lazy, Suspense } from "react";
import Category from "../../components/HomePageComponents/Category";
// import Dealoftheday from "../../components/HomePageComponents/Dealoftheday";
//import TopSellers from "../../components/HomePageComponents/TopSellers";
import HeroSectionSlider from "../../components/HomePageComponents/HomeHeroSection/HeroSectionSlider";
import DiscountBanner from "../../components/HomePageComponents/DiscountBannerSection/DiscountBanner";
import GrowingCommunity from "../../components/HomePageComponents/GrowingCommunitySection/GrowingCommunity";
import BookCallComponent from "../../components/CommonComponents/BookACallComponent/BookCallComponent";
//import CustomizeJewellery from "../../components/HomePageComponents/CustomizeJewellerySection/CustomizeJewellery";
import SaleBanner from "../../components/HomePageComponents/SaleBanner/SaleBanner";
import { useEffect, useState } from "react";
import loader from "../../assets/Images/loader.gif";
import ResponsiveHeroSectionSlider from "../../components/HomePageComponents/HomeHeroSection/ResponsiveHeroSectionSlider";
const Dealoftheday = lazy(() =>
  import("../../components/HomePageComponents/Dealoftheday")
);
const TopSellers = lazy(() =>
  import("../../components/HomePageComponents/TopSellers")
);
const CustomizeJewellery = lazy(() =>
  import(
    "../../components/HomePageComponents/CustomizeJewellerySection/CustomizeJewellery"
  )
);

export default function Home({ openingCategory, setOpeningCategory }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-[80vh]">
        <video autoPlay loop muted className="preloader-video h-[40%] w-[40%]">
          <source src="/Neel_jew-preloader.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div>
      {isMobile ? <ResponsiveHeroSectionSlider /> : <HeroSectionSlider />}
      {isMobile ? (
        ""
      ) : (
        <Category
          openingCategory={openingCategory}
          setOpeningCategory={setOpeningCategory}
        />
      )}

      <DiscountBanner />
      <Suspense fallback={<h3>loading...</h3>}>
        <Dealoftheday
          title="Deals Of the day"
          cartItems={cartItems}
          setCartItems={setCartItems}
          wishlistItems={wishlistItems}
          setWishlistItems={setWishlistItems}
        />
      </Suspense>
      <SaleBanner
        openingCategory={openingCategory}
        setOpeningCategory={setOpeningCategory}
      />
      <Suspense fallback={<h3>Loading our best sellers...</h3>}>
        <TopSellers title="Top Sellers" />
      </Suspense>
      <Suspense fallback={<h3>Loading our best sellers...</h3>}>
        <CustomizeJewellery />
      </Suspense>
      <GrowingCommunity />
      <Dealoftheday
        title="New Designs"
        cartItems={cartItems}
        setCartItems={setCartItems}
        wishlistItems={wishlistItems}
        setWishlistItems={setWishlistItems}
      />
      <BookCallComponent />
    </div>
  );
}
