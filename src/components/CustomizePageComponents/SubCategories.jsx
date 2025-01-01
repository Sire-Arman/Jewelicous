import React, { useEffect, useState } from "react";

const SubCategories = ({
  selectedCategory,
  onSelectSubCategory,
  onApplyClick,
  noOfTimesFormSubmitted,
}) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    localStorage.getItem("selectedCustomizedSubCategory") || null
  );

  const [subcategoryList, setsubcategoryList] = useState([]);

  // useEffect(() => {
  //   setSelectedSubCategory(null);
  // }, [selectedCategory]);

  useEffect(() => {
    if (noOfTimesFormSubmitted != 0) {
      setSelectedSubCategory(null);
    }
  }, [noOfTimesFormSubmitted]);

  useEffect(() => {
    if (noOfTimesFormSubmitted == 0) {
      if (selectedCategory?.subcategoryList?.length > 0) {
        setsubcategoryList(selectedCategory.subcategoryList);
      }
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (subcategoryList.length > 0) {
      const temp = subcategoryList.find((item) => {
        return item.subCategoryId == selectedSubCategory;
      });

      setSelectedSubCategory(temp);
      if (temp) {
        handleApplyClick(temp);
      }
      localStorage.removeItem("selectedCustomizedSubCategory");
    }
  }, [subcategoryList]);

  if (!selectedCategory) {
    return <div>No category selected</div>;
  }

  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };
  const handleApplyClick = (...args) => {
    if (!subcategoryList.length) {
      onApplyClick();
      return;
    }
    onApplyClick();

    if (args[0]?.subCategoryId) {
      onSelectSubCategory(args[0]);
    } else {
      onSelectSubCategory(selectedSubCategory);
    }
  };

  return (
    <div className="subcategories">
      <div className="subcategory-scroll-container pr-4">
        {selectedCategory.subcategoryList.length > 0 ? (
          selectedCategory.subcategoryList.map((sub) => (
            <div
              key={sub.subCategoryId}
              onClick={() => handleSubCategoryClick(sub)}
              className={`cursor-pointer ml-5 bg-white shadow-[0_0_3px] font-bold text-[20px] p-3 mb-2 rounded-lg ${
                selectedSubCategory === sub ? "selected-option" : ""
              }`}
            >
              {sub.subCategoryName}
            </div>
          ))
        ) : (
          <div>No subcategories available</div>
        )}
      </div>
      <div className="d-flex justify-content-center mt-3">
        <button
          className="apply-btn"
          disabled={subcategoryList.length === 0 ? false : !selectedSubCategory}
          onClick={handleApplyClick}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default SubCategories;
