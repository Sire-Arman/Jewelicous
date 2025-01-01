import React, { useEffect, useState, useRef } from "react";
import { BASE_URL } from "../../../constant";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

function CustomizeSelect({
  content,
  values,
  selectedValue,
  setSelectedValue,
  backupPurities,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [actaulValues, setActualValues] = useState([]);

  let basis, subbasis;
  if (content === "Color") {
    basis = "colors";
    subbasis = "colorname";
  } else if (content === "DiamondPurity") {
    basis = "diamondPurities";
    subbasis = "name";
  } else if (content === "GoldPurity") {
    basis = "goldPurities";
    subbasis = "name";
  } else if (content === "Sizes") {
    basis = "sizes";
    subbasis = ["sizenumber", "sizemm"];
  } else if (content === "Weight") {
    basis = "goldWeight";
    subbasis = "goldWeight";
  }

  const fetchProductDetails = async () => {
    try {
      let promises;

      if (basis === "diamondPurities" || basis === "goldPurities") {
        promises = valuesArray.map((id) =>
          axios.get(`${BASE_URL}/api/purity/${id}`)
        );
      } else {
        promises = valuesArray.map((id) =>
          axios.get(`${BASE_URL}/product-variants/${basis}/${id}`)
        );
      }

      const results = await Promise.allSettled(promises);

      const fetchedValues = results.flatMap((result) => {
        if (result.status === "fulfilled") {
          const response = result.value;
          if (Array.isArray(response.data)) {
            return response.data.map((item) => {
              if (subbasis instanceof Array) {
                return `${item[subbasis[0]]} - ${item[subbasis[1]]} mm`;
              }
              return item[subbasis];
            });
          } else if (typeof response.data === "object") {
            if (subbasis instanceof Array) {
              return [
                `${response.data[subbasis[0]]} - ${
                  response.data[subbasis[1]]
                } mm`,
              ];
            }
            return [response.data[subbasis]];
          }
        } else {
          console.error("Error fetching a product detail:", result.reason);
        }
        return [];
      });

      if (content === "Sizes") {
        const sizesValues = fetchedValues.map((item) => {
          const sizeParts = item.split(" - ");
          sizeParts[1] = sizeParts[1].replace(/ /g, "");
          if (sizeParts[1] === "0mm") {
            sizeParts[1] = " - (FS)";
          } else {
            sizeParts[1] = ` - (${sizeParts[1]})`;
          }
          return sizeParts[0].concat(sizeParts[1]);
        });
        setActualValues(sizesValues.length > 0 ? sizesValues : null);
        return;
      }

      setActualValues(fetchedValues.length > 0 ? fetchedValues : null);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [values]);

  const toggleDropdown = () => {
    if (content === "Sizes" && (!actaulValues || actaulValues.length === 0)) {
      return; // Do not open dropdown if sizes are null or empty
    }
    setIsOpen(!isOpen);
  };

  const handleValueSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false); // Close dropdown after selection
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedValue("Select your Option");
  }, [values]);

  const valuesArray = Array.isArray(values)
    ? values
    : typeof values === "string"
    ? values.split(",")
    : [];

  useEffect(() => {
    if (content === "GoldPurity") {
      const defaultGoldPurity = actaulValues?.find((value) =>
        value.includes("14K")
      );
      setSelectedValue(
        defaultGoldPurity || actaulValues?.[0] || "Not available"
      );
    } else if (content === "DiamondPurity") {
      const defaultDiamondPurity =
        actaulValues?.find((value) => value.includes("IJ VS SI")) || "";

      setSelectedValue(
        defaultDiamondPurity ||
          actaulValues?.[0] ||
          backupPurities?.[0] ||
          "Not available"
      );
    } else if (content === "Sizes") {
      const defaultSize = actaulValues?.find((value) => value.includes("14"));
      setSelectedValue(defaultSize || actaulValues?.[0] || "0 - (FS)");
    } else {
      setSelectedValue(actaulValues?.[0] || "0 - (FS)");
    }
  }, [actaulValues, backupPurities, content]);

  const dropdownValues =
    actaulValues && actaulValues.length > 0 ? actaulValues : backupPurities;

  return (
    <div className="selector" ref={dropdownRef}>
      <div className="selectedField" onClick={toggleDropdown}>
        <p id="selectText">
          {selectedValue === "0 - (FS)" ? (
            <>
              0 - (<span className="font-bold">FS</span>)
            </>
          ) : (
            selectedValue
          )}
        </p>
        {content !== "Sizes" || actaulValues?.length > 0 ? (
          <FontAwesomeIcon className="arrow-down" icon={faAngleDown} />
        ) : null}
      </div>
      {isOpen && (
        <ul className="hide" id="list">
          {dropdownValues ? (
            dropdownValues.map((value, index) => (
              <li
                key={index}
                className={`options ${
                  content === "Color" ? "color-options" : ""
                }`}
                onClick={() => handleValueSelect(value)}
              >
                <div
                  className={`h-[20px] w-[20px] rounded-full ${
                    content === "Color" ? "" : "hidden"
                  }`}
                  style={{ backgroundColor: value }}
                ></div>
                <p>
                  {value === "0 - (FS)" ? (
                    <>
                      0 - (<span className="font-bold">FS</span>)
                    </>
                  ) : (
                    value
                  )}
                </p>
              </li>
            ))
          ) : (
            <li className="options">Not available</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default CustomizeSelect;
