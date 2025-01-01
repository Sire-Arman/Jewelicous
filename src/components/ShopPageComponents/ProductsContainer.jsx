import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight, MdOutlineStarPurple500 } from "react-icons/md";
import { FaRegHeart, FaHeart, FaStar, FaRegStar } from "react-icons/fa";
import { useCartContext } from "../../Context/CartContext.jsx";
import { RxMagnifyingGlass } from "react-icons/rx";
import axios from "axios";
import { BASE_URL } from "../../../constant";
import cogoToast from "cogo-toast";
import { Modal, Toast } from "react-bootstrap";
import BeatLoader from "react-spinners/BeatLoader";
import loader from "../../assets/Images/loader.gif";
import { Category } from "@mui/icons-material";

const override = {
  display: "block",
  margin: "0 ",
  borderColor: "red",
};

const ProductsContainer = ({
  searchTerm,
  values,
  sortByAlphabatically,
  stockStatus,
  currentSubcategory,
  currentCategory,
  scheme,
  setScheme,
  openingCategory,
  selectedSize,
  setSearchTerm,
  order,
  setStockStatus,
  currentPage,
  setCurrentPage,
  setCurrentCategory,
}) => {
  const [show, setShow] = useState(false);
  const [zoomedImage, setZoomedImage] = useState("");
  const [loadMore, setLoadMore] = useState(true);
  // const [visiblePages, setVisiblePages] = useState(5);
  const [currentProducts, setCurrentProducts] = useState([]);
  const productsPerPage = 9;
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const { fetchCartCount } = useCartContext();
  const [allSizes, setAllSizes] = useState([]);
  const [selectedSizeId, setSelectedSizeId] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [purities, setPurities] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("category") || "";
  const searchBarQuery = queryParams.get("searchName") || "";
  const [offeredProducts, setOfferedProducts] = useState([]);
  const [lightningDeals, setLightningDeals] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [subcategoryProducts, setsubcategoryProducts] = useState([]);
  const [priceProducts, setPriceProducts] = useState([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [offer, setOffer] = useState(true);
  const [light, setLight] = useState(true);
  const [adminGoldDiscount, setAdminGoldDiscount] = useState(0);
  const [adminDiamondDiscount, setAdminDiamondDiscount] = useState(0);
  const [adminMakingChargeDiscount, setAdminMakingChargeDiscount] = useState(0);
  const [adminSolitaireDiscount, setAdminSolitaireDiscount] = useState(0);
  const [adminStoneDiscount, setAdminStoneDiscount] = useState(0);
  const [adminMakingCharges, setAdminMakingCharges] = useState(0);
  const [ratingsData, setRatingsData] = useState({});

  useEffect(() => {
    currentProducts.forEach((product) => fetchReviews(product.productId));
  }, [currentProducts]);

  const fetchReviews = async (productId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-ratings/product/${productId}`
      );

      const reviews =
        response.data && Array.isArray(response.data) ? response.data : [];

      if (reviews.length === 0) {
        setRatingsData((prevData) => ({
          ...prevData,
          [productId]: {
            sum: 0,
            count: 0,
            average: 0,
          },
        }));
        return;
      }

      const totalRatings = reviews.reduce(
        (acc, review) => acc + Number(review.ratings),
        0
      );
      const countRatings = reviews.length;

      setRatingsData((prevData) => ({
        ...prevData,
        [productId]: {
          sum: totalRatings,
          count: countRatings,
          average: countRatings ? (totalRatings / countRatings).toFixed(1) : 0,
        },
      }));
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);

      setRatingsData((prevData) => ({
        ...prevData,
        [productId]: {
          sum: 0,
          count: 0,
          average: 0,
        },
      }));
    }
  };
  const fetchAdminDiscounts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/discounts/get-discounts`);
      const data = response.data;

      if (data.goldDiscount) {
        setAdminGoldDiscount(data.goldDiscount);
      }
      if (data.diamondDiscount) {
        setAdminDiamondDiscount(data.diamondDiscount);
      }
      if (data.makingChargesDiscount) {
        setAdminMakingChargeDiscount(data.makingChargesDiscount);
      }
      if (data.solitaireDiscount) {
        setAdminSolitaireDiscount(data.solitaireDiscount);
      }
      if (data.stoneDiscount) {
        setAdminStoneDiscount(data.stoneDiscount);
      }
      if (data.makingCharges) {
        setAdminMakingCharges(data.makingCharges);
      }
    } catch (error) {
      // navigate("/error")
      console.error("Error found in fetching admin discounts", error);
    }
  };

  const categoryInitialQuery = queryParams.get("category");

  const handleClose = () => setShow(false);

  const handleShow = (event, image) => {
    event.stopPropagation();
    setShow(true);
    setZoomedImage(image);
  };

  useEffect(() => {
    if (selectedSize != "all") {
      const temp = allSizes.find((item) => item.sizenumber == selectedSize);
      setSelectedSizeId(temp.id);
    } else {
      setSelectedSizeId("");
    }
  }, [selectedSize]);

  useEffect(() => {
    if (setCurrentCategory !== "") {
      setCurrentCategory(categoryInitialQuery);
    }
    fetchAdminDiscounts();
  }, []);

  const fetchOutOfStockProducts = async () => {
    try {
      // setCurrentProducts([]);
      // setCategoryProducts([]);
      // setsubcategoryProducts([]);
      // setOfferedProducts([]);
      // setLightningDeals([]);
      const response = await axios.get(`${BASE_URL}/products/allProductList`);
      const data = response.data;
      const filteredProducts = data.filter((product) => product.minStk === 0);

      setOutOfStockProducts(filteredProducts);
    } catch (error) {
      console.log(error);
      setOutOfStockProducts([]);
    }
  };

  useEffect(() => {
    if (stockStatus == "outOfStock") {
      fetchOutOfStockProducts();
    }
  }, [stockStatus]);

  const fetchAllProducts = async () => {
    setLoading(true);

    try {
      let finalQuery = searchTerm || initialQuery || "";

      const userId = localStorage.getItem("userId");

      let endpoint = `${BASE_URL}/products/filter?userId=${userId}&pageNumber=${currentPage}&pageSize=12&orderBy=${order}`;

      if (searchBarQuery) {
        const formattedQuery = searchBarQuery.trim().toLowerCase();
        endpoint += `&searchName=${formattedQuery}`;
      }

      const response = await axios.get(endpoint);

      const data = response.data.content || [];

      let filteredProducts = data;
      if (stockStatus === "inStock") {
        filteredProducts = data.filter((product) => product.minStk > 0);
      }

      setCurrentProducts((prevProducts) => [
        ...prevProducts,
        ...filteredProducts,
      ]);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching products", error);
      setCurrentProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stockStatus || selectedSizeId || searchBarQuery) {
      fetchAllProducts();
    }
  }, [stockStatus, selectedSizeId, searchBarQuery]);

  const fetchMaxPrice = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const endpoint = `${BASE_URL}/products/filter?userId=${userId}&pageNumber=${currentPage}&pageSize=12&minPrice=${values[0]}&maxPrice=${values[1]}&orderBy=${order}`;

      const response = await axios.get(endpoint);
      const data = response.data.content || [];
      priceMaker(data);
      if (data.length === 0 || response.data.last === true) {
        setHasMoreProducts(false);
        setLoadMore(false);
      } else {
        setHasMoreProducts(true);
        setLoadMore(true);
      }
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching products", error);
      setCurrentProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaxPrice();
  }, [values]);

  const fetchPaginatedProducts = async () => {
    setLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      const endpoint = `${BASE_URL}/products/filter?userId=${userId}&pageNumber=${currentPage}&pageSize=12&orderBy=${order}`;

      const response = await axios.get(endpoint);
      const data = response.data.content || [];

      setCurrentProducts((prevProducts) => [...prevProducts, ...data]);

      if (data.length === 0 || response.data.last === true) {
        setHasMoreProducts(false);
        setLoadMore(false);
      } else {
        setHasMoreProducts(true);
        setLoadMore(true);
      }
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching products", error);
      setCurrentProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginatedProducts();
  }, []);

  const fetchProductsBycategories = async () => {
    try {
      setsubcategoryProducts([]);
      setHasMoreProducts(true);
      setScheme("");

      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${BASE_URL}/products/filter?userId=${userId}&category=${currentCategory}&pageNumber=${currentPage}&pageSize=12&orderBy=${order}`
      );

      const data = response.data.content || [];

      const prevData = [...categoryProducts, ...data];
      const tempArray = prevData.filter(
        (prod) => prod.categoryId == currentCategory
      );

      setCategoryProducts(tempArray);

      if (data.length == 0 || response.data.last === true) {
        setHasMoreProducts(false);
      }

      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching category products", error);
    }
  };

  useEffect(() => {
    if (currentCategory) {
      fetchProductsBycategories();
    }
  }, [currentCategory]);

  const fetchProductsBySubcategories = async () => {
    try {
      setCategoryProducts([]);
      setHasMoreProducts(true);
      setScheme("");

      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${BASE_URL}/products/filter?userId=${userId}&subcategory=${currentSubcategory}&pageNumber=${currentPage}&pageSize=12&orderBy=${order}`
      );
      const data = response.data.content || [];

      const prevData = [...subcategoryProducts, ...data];
      const tempArray = prevData.filter(
        (prod) => Number(prod.subcategoryId) == Number(currentSubcategory)
      );

      setsubcategoryProducts(tempArray);

      if (data.length === 0 || response.data.last === true) {
        setHasMoreProducts(false);
      }
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching subcategory products", error);
    }
  };

  useEffect(() => {
    if (currentSubcategory) {
      fetchProductsBySubcategories();
    }
  }, [currentSubcategory]);

  const fetchAllSizesId = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/product-variants/sizes`);
      setAllSizes(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
      setAllSizes([]);
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchWishlistItems();
    fetchAllSizesId();
  }, []);

  const priceMaker = (priceData) => {
    const temp = priceData.map((product) => {
      const ratingsInfo = ratingsData[product.productId] || {
        sum: 0,
        count: 0,
        average: 0,
      };
      const goldPricePerGram = product?.goldWeight ? goldPurity?.price : 0;
      const diamondPrice = product?.stoneWeight ? diamondPurity?.price : 0;

      const rubyPrice = product?.rubyWeight ? rubyPurity.price : 0;
      const solitairePrice = product?.solitaireWeight
        ? solitairePurity?.price
        : 0;

      const makingCharges = adminMakingCharges || 0;
      const additionaldiscount = product?.discount || 0;
      const gstPercentage = product?.gst || 3;
      const goldWeight = product?.goldWeight || 0;
      const stoneWeight = product?.stoneWeight || 0;

      const goldValue = goldPricePerGram * goldWeight;
      const stoneValue = diamondPrice ? diamondPrice * stoneWeight : 0;
      const rubyValue = product?.rubyWeight
        ? rubyPrice * product?.rubyWeight
        : 0;
      const solitaireValue = product?.solitaireWeight
        ? solitairePrice * product?.solitaireWeight
        : 0;
      const solitaireDiscount = adminSolitaireDiscount;
      const stoneDiscount = adminStoneDiscount;

      const discountedGoldValue =
        goldValue - (adminGoldDiscount / 100) * goldValue;
      const discountedDiamondValue =
        stoneValue - (adminDiamondDiscount / 100) * stoneValue;
      const discountedMakingCharges =
        makingCharges - (adminMakingChargeDiscount / 100) * makingCharges;
      const discountedSolitaireValue =
        (solitaireDiscount / 100) * solitaireValue;
      const discountedStoneValue = (stoneDiscount / 100) * rubyValue;

      const finalSolitaireValue = solitaireValue - discountedSolitaireValue;
      const finalStoneValue = rubyValue - discountedStoneValue;

      const subTotal =
        (discountedGoldValue || goldValue) +
        (discountedDiamondValue || stoneValue) +
        (discountedMakingCharges || makingCharges) +
        (finalStoneValue || 0) +
        (finalSolitaireValue || 0);

      const discountAmount = (additionaldiscount / 100) * subTotal;
      const subTotalAfterDiscount = subTotal - discountAmount;
      const gstAmount = (gstPercentage / 100) * subTotalAfterDiscount;
      const grandTotal = subTotalAfterDiscount + gstAmount;
      const totalmrp =
        goldValue + stoneValue + makingCharges + rubyValue + solitaireValue;
      const originalPriceWithoutDiscount =
        totalmrp + (totalmrp * gstPercentage) / 100;

      product.calculatedMrp = totalmrp;
      product.calculatedPrice = grandTotal;

      return product;
    });

    const data = temp.filter(
      (prod) =>
        +prod.calculatedMrp >= +values[0] && +prod.calculatedMrp <= +values[1]
    );

    setPriceProducts(data);
  };

  useEffect(() => {
    if (sortByAlphabatically) {
      sortProductsByName();
    }
  }, [sortByAlphabatically]);

  useEffect(() => {
    if (scheme === "offered") {
      setOffer(true);
      fetchOfferedProducts();
    } else if (scheme === "lightning") {
      fetchLightningDeals();
      setLight(true);
    } else if (
      !searchBarQuery &&
      !scheme &&
      !currentCategory &&
      !currentSubcategory
    ) {
    }
  }, [scheme, currentCategory, currentSubcategory]);

  const fetchOfferedProducts = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `${BASE_URL}/products/filter?userId=${userId}&offer=${offer}`
      );
      const data = response.data.content || [];
      setOfferedProducts(data);

      if (data.length === 0 || response.data.last === true) {
        setHasMoreProducts(false);
      } else {
        setHasMoreProducts(true);
      }

      setPageNumber((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    }
  };

  const fetchLightningDeals = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `${BASE_URL}/products/filter?userId=${userId}&light=${light}&pageNumber=${currentPage}&pageSize=12`
      );

      const data = response.data.content || [];
      setLightningDeals(data);

      if (data.length === 0 || response.data.last === true) {
        setHasMoreProducts(false);
      } else {
        setHasMoreProducts(true);
      }

      setPageNumber((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    }
  };

  //Alphabetical sorting
  const sortProductsByName = () => {
    const sortedProducts = [...currentProducts].sort((a, b) => {
      if (a.productName.toLowerCase() < b.productName.toLowerCase()) return -1;
      if (a.productName.toLowerCase() > b.productName.toLowerCase()) return 1;
      return 0;
    });

    setCurrentProducts(sortedProducts);
  };

  //------------------ pagination logic -----------------
  const fetchCartItems = async () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const response = await axios.post(
          `${BASE_URL}/usercart/in-cart?userId=${userId}&pageSize=12`
        );
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    }
  };

  const fetchWishlistItems = async () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const response = await axios.get(`${BASE_URL}/wishlist/get/${userId}`);
        setWishlistItems(response.data || []);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setWishlistItems([]);
        } else {
          console.error("Error fetching wishlist items:", error);
        }
      }
    }
  };

  const handleAddToCart = async (productId) => {
    navigate(`/productdetails/${productId}`);
  };

  const handleAddToWishlist = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const wishlistResponse = await fetch(
          `${BASE_URL}/wishlist/add/${userId}`,
          {
            method: "POST",
            headers: {
              contentType: "application/json",
            },
            body: productId,
          }
        );
        setWishlistItems((prevWishlist) => [...prevWishlist, { productId }]);
        cogoToast.success("Product added to wishlist");
        fetchWishlistItems();
      } catch (error) {
        console.error("Error adding product to wishlist:", error);
        cogoToast.error("Something went wrong! Try again later");
      }
    } else {
      navigate("/sign-in");
    }
  };

  const removeWishlistItem = async (productId) => {
    const userId = localStorage.getItem("userId");
    try {
      const wishlistResponse = await axios.delete(
        `${BASE_URL}/wishlist/delete/${userId}/${productId}`
      );

      setWishlistItems((prevWishlist) =>
        prevWishlist.filter((item) => item.productId !== productId)
      );
      cogoToast.error("Product removed from wishlist");
      fetchWishlistItems();
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      cogoToast.error("Something went wrong! Try again later");
    }
  };

  const handleWishlistClick = (event, productId) => {
    event.stopPropagation();
    handleAddToWishlist(productId);
  };

  const removeWishlistClick = (event, productId) => {
    event.stopPropagation();
    removeWishlistItem(productId);
  };

  useEffect(() => {
    const fetchPurities = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/purity/get-all`);
        setPurities(response.data);
      } catch (error) {
        console.error("Error fetching purities:", error);
      }
    };
    fetchPurities();
  }, []);

  const customHandlerFunction = (array) => {
    let dataArr = [];

    if (stockStatus === "inStock") {
      dataArr = array.filter((prod) => +prod.minStk > +0);
    }

    if (!order) {
      let temp = (dataArr.length > 0 ? dataArr : array).sort(
        (a, b) => b.calculatedMrp - a.calculatedMrp
      );
      dataArr = [...temp];
    }
    if (order) {
      let temp = (dataArr.length > 0 ? dataArr : array).sort(
        (a, b) => a.calculatedMrp - b.calculatedMrp
      );
      dataArr = [...temp];
    }
    if (sortByAlphabatically) {
      const sortedProducts = (dataArr.length > 0 ? dataArr : array).sort(
        (a, b) => {
          if (a.productName.toLowerCase() < b.productName.toLowerCase())
            return -1;
          if (a.productName.toLowerCase() > b.productName.toLowerCase())
            return 1;
          return 0;
        }
      );
      dataArr = [...sortedProducts];
    }

    return dataArr.length > 0 ? [...dataArr] : [...array];
  };

  const goldPurity = purities.find((purity) => purity.name === "14K") || {};
  const diamondPurity =
    purities.find((purity) => purity.name === "IJ VS SI") || {};
  const rubyPurity = purities.find((purity) => purity.name === "1 carat") || {};
  const solitairePurity =
    purities.find((purity) => purity.name === "1 ct") || {};

  const productsToDisplay = () => {
    if (currentCategory && !currentSubcategory && scheme == "")
      return customHandlerFunction(categoryProducts);
    if (currentSubcategory && scheme == "")
      return customHandlerFunction(subcategoryProducts);
    if (scheme === "offered") return customHandlerFunction(offeredProducts);
    if (scheme === "lightning") return customHandlerFunction(lightningDeals);
    if (scheme === "price") return customHandlerFunction(priceProducts);
    if (scheme === "price") return customHandlerFunction(priceProducts);
    if (stockStatus == "outOfStock") return outOfStockProducts;

    return customHandlerFunction(currentProducts);
  };

  useEffect(() => {
    if (
      currentProducts.length > 0 ||
      offeredProducts.length > 0 ||
      lightningDeals.length > 0 ||
      subcategoryProducts.length > 0 ||
      categoryProducts.length > 0
    ) {
      const check = productsToDisplay();

      if (check.length < 12) {
        setLoadMore(false);
      } else {
        setLoadMore(true);
      }
    }
  }, [
    lightningDeals,
    offeredProducts,
    subcategoryProducts,
    priceProducts,
    scheme,
    currentProducts,
    sortByAlphabatically,
    order,
    stockStatus,
  ]);

  const handleLoadMoreClick = () => {
    if (currentCategory && !currentSubcategory) {
      fetchProductsBycategories();
    } else if (currentSubcategory) {
      fetchProductsBySubcategories();
    } else if (scheme == "offered") {
      fetchOfferedProducts();
    } else if (scheme == "lightning") {
      fetchLightningDeals();
    } else {
      fetchPaginatedProducts();
    }
    if(values[0] !== 0 || values[1] !== 1838750.85){
      fetchMaxPrice();
    }
    
    setCurrentPage((prevPage) => prevPage + 1);
  };
  return (
    <div>
      <div className="product-items">
        {loading ? (
          <div className="d-flex  h-[80vh]">
            <img
              src={loader}
              alt="Loading..."
              className="w-[150px] h-[150px] ml-4"
            />
          </div>
        ) : (
          <>
            {productsToDisplay().length === 0 ? (
              <div className="text-[20px] font-bold">No products found</div>
            ) : (
              productsToDisplay().map((product) => {
                const ratingsInfo = ratingsData[product.productId] || {
                  sum: 0,
                  count: 0,
                  average: 0,
                };
                const goldPricePerGram = product?.goldWeight
                  ? goldPurity?.price
                  : 0;
                const diamondPrice = product?.stoneWeight
                  ? diamondPurity?.price
                  : 0;

                const rubyPrice = product?.rubyWeight ? rubyPurity.price : 0;
                const solitairePrice = product?.solitaireWeight
                  ? solitairePurity?.price
                  : 0;

                const additionaldiscount = product?.discount || 0;
                const gstPercentage = product?.gst || 3;
                const goldWeight = product?.goldWeight || 0;
                const stoneWeight = product?.stoneWeight || 0;
                const makingCharges = adminMakingCharges * goldWeight || 0;

                const goldValue = goldPricePerGram * goldWeight;
                const stoneValue = diamondPrice
                  ? diamondPrice * stoneWeight
                  : 0;
                const rubyValue = product?.rubyWeight
                  ? rubyPrice * product?.rubyWeight
                  : 0;
                const solitaireValue = product?.solitaireWeight
                  ? solitairePrice * product?.solitaireWeight
                  : 0;
                const solitaireDiscount = adminSolitaireDiscount;
                const stoneDiscount = adminStoneDiscount;

                const discountedGoldValue =
                  goldValue - (adminGoldDiscount / 100) * goldValue;
                const discountedDiamondValue =
                  stoneValue - (adminDiamondDiscount / 100) * stoneValue;
                const discountedMakingCharges =
                  makingCharges -
                  (adminMakingChargeDiscount / 100) * makingCharges;
                const discountedSolitaireValue =
                  (solitaireDiscount / 100) * solitaireValue;
                const discountedStoneValue = (stoneDiscount / 100) * rubyValue;

                const finalSolitaireValue =
                  solitaireValue - discountedSolitaireValue;
                const finalStoneValue = rubyValue - discountedStoneValue;

                const subTotal =
                  (discountedGoldValue || goldValue) +
                  (discountedDiamondValue || stoneValue) +
                  (discountedMakingCharges || makingCharges) +
                  (finalStoneValue || 0) +
                  (finalSolitaireValue || 0);

                const discountAmount = (additionaldiscount / 100) * subTotal;
                const subTotalAfterDiscount = subTotal - discountAmount;
                const gstAmount = (gstPercentage / 100) * subTotalAfterDiscount;
                const calculatedPrice = subTotalAfterDiscount + gstAmount;
                const totalmrp =
                  goldValue +
                  stoneValue +
                  makingCharges +
                  rubyValue +
                  solitaireValue;
                const originalPriceWithoutDiscount =
                  totalmrp + (totalmrp * gstPercentage) / 100;

                product.calculatedMrp = totalmrp;

                if (
                  product.productId == "5a4dc624-0033-43f0-8031-551953441470"
                ) {
                  console.log("makingCharges", adminMakingCharges);
                }

                return (
                  <div
                    key={product.productId}
                    className="product-card cursor-pointer"
                    onClick={() =>
                      navigate(`/productdetails/${product.productId}`)
                    }
                  >
                    <div className="product-image">
                      <Link to={`/productdetails/${product.productId}`} />
                      {product.offered && (
                        <span className="offer-strip">OFFER</span>
                      )}
                      <Link to={`/productdetails/${product.productId}`}>
                        <img
                          src={
                            product.productPhotos[0]?.photoName
                              ? product.productPhotos[0]?.photoName
                              : "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/no-image-available-icon-6.png"
                          }
                          alt={"No Image Available"}
                          loading="lazy"
                        />
                      </Link>
                      <div
                        onClick={(e) =>
                          handleShow(
                            e,
                            product.productPhotos[0]?.photoName
                              ? product.productPhotos[0]?.photoName
                              : ""
                          )
                        }
                      >
                        <RxMagnifyingGlass id="magnifying-glass-icon" />
                      </div>
                    </div>
                    <div className="product-info">
                      <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                        <span className="line-clamp-1 mb-4">
                          {product.productName}{" "}
                        </span>
                        {product.minStk === 0 ? (
                          <span
                            style={{
                              color: "red",
                              fontSize: "13px",
                              float: "right",
                              marginRight: "20px",
                              transform: "translateY(-25px)",
                              marginBottom: "-20px",
                            }}
                          >
                            Out of Stock
                          </span>
                        ) : (
                          ""
                        )}
                      </p>
                      <div className="prod-price" style={{ width: "100%" }}>
                        <span style={{ display: "flex", gap: "6px" }}>
                          <p
                            style={{
                              textDecoration: "line-through",
                              color: "gray",
                              fontSize: "15px",
                            }}
                          >
                            Rs {originalPriceWithoutDiscount?.toFixed(2)}
                          </p>
                          <p style={{ marginTop: "1px", fontSize: "18px" }}>
                            Rs {calculatedPrice?.toFixed(2)}
                          </p>
                        </span>
                      </div>
                      <span className="d-flex">
                        {[...Array(5)].map((star, i) =>
                          i < ratingsInfo.average ? (
                            <FaStar key={i} color="#FDB022" size={18} />
                          ) : (
                            <FaRegStar key={i} color="#FDB022" size={18} />
                          )
                        )}
                      </span>

                      {product.lightning && (
                        <div className="ribbon-2" style={{ top: "100px" }}>
                          {" "}
                          Lightning Deal
                        </div>
                      )}
                      <div className="product-card-btn">
                        {product.minStk > 0 ? (
                          cartItems.some(
                            (item) => item.productid === product.productId
                          ) ? (
                            <button
                              className="add-to-cart"
                              style={{
                                backgroundColor: "var(--addedToCartBgColor)",
                                color: "var(--addedToCartTextColor)",
                              }}
                            >
                              Added to Cart
                            </button>
                          ) : (
                            <button
                              className="add-to-cart"
                              onClick={() => handleAddToCart(product.productId)}
                              style={{
                                backgroundColor: "var(--addToCartBgColor)",
                                color: "var(--addToCartTextColor)",
                              }}
                            >
                              Shop Now
                            </button>
                          )
                        ) : (
                          <button
                            className="add-to-cart"
                            style={{
                              backgroundColor: "var(--outOfStockBgColor)",
                              color: "var(--outOfStockTextColor)",
                            }}
                            disabled
                          >
                            Out of Stock
                          </button>
                        )}
                        {wishlistItems.some(
                          (item) => item.productId === product.productId
                        ) ? (
                          <button
                            className="add-to-wishlist"
                            style={{
                              backgroundColor: "var(--wishlistButtonBgColor)",
                            }}
                            onClick={(e) =>
                              removeWishlistClick(e, product.productId)
                            }
                          >
                            <FaHeart size={25} style={{ color: "red" }} />
                          </button>
                        ) : (
                          <button
                            className="add-to-wishlist"
                            style={{
                              backgroundColor: "var(--wishlistButtonBgColor)",
                            }}
                            onClick={(e) =>
                              handleWishlistClick(e, product.productId)
                            }
                          >
                            <FaRegHeart size={25} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* Modal for zoomed image */}
        <Modal
          show={show}
          onHide={handleClose}
          className="zoomedimagemodal"
          centered
        >
          <Modal.Body>
            <img src={zoomedImage} />
          </Modal.Body>
        </Modal>
      </div>
      {/* {hasMoreProducts == false ? ( */}
      {loadMore == true ? (
        <div className="d-flex justify-content-center align-items-center">
          <button
            onClick={handleLoadMoreClick}
            className="py-1 px-3 text-[20px] rounded-md"
            style={{ background: "#FFD700" }}
          >
            Load More
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ProductsContainer;
