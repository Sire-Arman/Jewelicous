import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../constant";
import axios from "axios";

const Breadcrumb = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [history, setHistory] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const path = location.pathname;

    if (!history.includes(path)) {
      setHistory((prevHistory) => [...prevHistory, path]);
    }
  }, [location.pathname]);

  const pathnames = history
    .filter((x) => x)
    .map((path) => path.split("/").filter((x) => x));

  // Get the category from the query parameters
  const category = searchParams.get("category");

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/category/all-unhide`);
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [category]);

  const handleLinkClick = (event, routePath) => {
    event.preventDefault();
    window.location.href = routePath;
  };

  const categoryName = categories?.find(
    (cat) => Number(cat.categoryId) == Number(category)
  );

  console.log("categoryName", categoryName);

  return (
    <nav className="bd-nav">
      <ol className="text-xl">
        <li className="text-xl">
          <Link to="/" onClick={(e) => handleLinkClick(e, "/")}>
            Home
          </Link>
        </li>

        {pathnames.map((pathnameArray, index) => {
          const routePath = `/${pathnameArray.join("/")}`;
          const lastSegment = pathnameArray[pathnameArray.length - 1];

          return (
            <li key={routePath}>
              <Link
                to={routePath}
                onClick={(e) => handleLinkClick(e, routePath)}
                className="text-xl"
              >
                {lastSegment
                  ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
                  : ""}
              </Link>
            </li>
          );
        })}
        {/* Add the category to the breadcrumbs if it exists */}
        {category && (
          <li>
            <Link
              to={`/${location.pathname}?category=${category}`}
              onClick={(e) =>
                handleLinkClick(e, `/${location.pathname}?category=${category}`)
              }
              className="text-xl"
            >
              {categoryName?.categoryName || ""}
            </Link>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
