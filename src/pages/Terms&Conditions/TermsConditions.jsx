import React, { useState } from "react";
import "./Terms&Conditions.css";

const TermsConditions = () => {
  const [activeTab, setActiveTab] = useState("tab_item_1");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="wrapper flex_align_justify">
        <div className="tc_wrap">
          <div className="tabs_list">
            <ul>
              <li
                data-tc="tab_item_1"
                className={activeTab === "tab_item_1" ? "active" : ""}
                onClick={() => handleTabClick("tab_item_1")}
              >
                Introduction
              </li>
              <li
                data-tc="tab_item_2"
                className={activeTab === "tab_item_2" ? "active" : ""}
                onClick={() => handleTabClick("tab_item_2")}
              >
                Products and Orders
              </li>
              <li
                data-tc="tab_item_3"
                className={activeTab === "tab_item_3" ? "active" : ""}
                onClick={() => handleTabClick("tab_item_3")}
              >
                Payment and Shipping
              </li>
              <li
                data-tc="tab_item_4"
                className={activeTab === "tab_item_4" ? "active" : ""}
                onClick={() => handleTabClick("tab_item_4")}
              >
                Returns and Exchanges
              </li>
              <li
                data-tc="tab_item_5"
                className={activeTab === "tab_item_5" ? "active" : ""}
                onClick={() => handleTabClick("tab_item_5")}
              >
                User Conduct
              </li>
              <li
                data-tc="tab_item_6"
                className={activeTab === "tab_item_6" ? "active" : ""}
                onClick={() => handleTabClick("tab_item_6")}
              >
                Intellectual Property
              </li>
              <li
                data-tc="tab_item_7"
                className={activeTab === "tab_item_7" ? "active" : ""}
                onClick={() => handleTabClick("tab_item_7")}
              >
                Limitation of Liability
              </li>
              <li
                data-tc="tab_item_9"
                className={activeTab === "tab_item_9" ? "active" : ""}
                onClick={() => handleTabClick("tab_item_9")}
              >
                Contact Information
              </li>
            </ul>
          </div>
          <div className="tabs_content">
            <div className="tab_head">
              <h2 style={{ fontSize: "25px", fontWeight: "bold" }}>
                Terms & Conditions
              </h2>
            </div>
            <div className="tab_body">
              <div
                className={`tab_item tab_item_1 ${
                  activeTab === "tab_item_1" ? "active" : "hidden"
                }`}
              >
                <h3>Introduction</h3>
                <p>
                  <strong>1.1. Acceptance of Terms</strong>
                  <br />
                  By using our website, you agree to these Terms and Conditions
                  and our Privacy Policy. If you do not agree, please do not use
                  our website.
                  <br />
                  <br />
                  <strong>1.2. Modifications</strong>
                  <br />
                  We reserve the right to modify these Terms at any time. Any
                  changes will be posted on this page with an updated revision
                  date.
                </p>
              </div>
              <div
                className={`tab_item tab_item_2 ${
                  activeTab === "tab_item_2" ? "active" : "hidden"
                }`}
              >
                <h3>Products and Orders</h3>
                <p>
                  <strong>2.1. Product Descriptions</strong>
                  <br />
                  We make every effort to ensure that the descriptions and
                  images of our Products are accurate. However, we do not
                  guarantee that they are error-free.
                  <br />
                  <br />
                  <strong>2.2. Order Acceptance</strong>
                  <br />
                  All orders are subject to acceptance. We reserve the right to
                  refuse or cancel any order at our discretion.
                  <br />
                  <br />
                  <strong>2.3. Pricing</strong>
                  <br />
                  Prices are subject to change without notice. Any changes will
                  be reflected in the updated product listings.
                </p>
              </div>
              <div
                className={`tab_item tab_item_3 ${
                  activeTab === "tab_item_3" ? "active" : "hidden"
                }`}
              >
                <h3>Payment and Shipping</h3>
                <p>
                  <strong>3.1. Payment Methods</strong>
                  <br />
                  We accept various payment methods as indicated on our website.
                  All payments must be made in full before Products are shipped.
                  <br />
                  <br />
                  <strong>3.2. Shipping</strong>
                  <br />
                  We offer various shipping options. Delivery times may vary
                  based on your location and the shipping method chosen.
                  <br />
                  <br />
                  <strong>3.3. International Shipping</strong>
                  <br />
                  For international orders, you are responsible for any customs
                  duties and taxes that may apply.
                </p>
              </div>
              <div
                className={`tab_item tab_item_4 ${
                  activeTab === "tab_item_4" ? "active" : "hidden"
                }`}
              >
                <h3>Returns and Exchanges</h3>
                <p>
                  <strong>4.1. Return Policy</strong>
                  <br />
                  We accept returns and exchanges within 15 days of receipt.
                  Products must be returned in their original condition and
                  packaging.
                  <br />
                  <br />
                  <strong>4.2. Refunds</strong>
                  <br />
                  Refunds will be processed to the original payment method once
                  we receive and inspect the returned items.
                </p>
              </div>
              <div
                className={`tab_item tab_item_5 ${
                  activeTab === "tab_item_5" ? "active" : "hidden"
                }`}
              >
                <h3>User Conduct</h3>
                <p>
                  <strong>5.1. Prohibited Activities</strong>
                  <br />
                  You agree not to use our website for any unlawful or
                  prohibited activities, including but not limited to:
                  harassment, fraud, or the distribution of malware.
                  <br />
                  <br />
                  <strong>5.2. Account Security</strong>
                  <br />
                  You are responsible for maintaining the confidentiality of
                  your account information and for all activities that occur
                  under your account.
                </p>
              </div>
              <div
                className={`tab_item tab_item_6 ${
                  activeTab === "tab_item_6" ? "active" : "hidden"
                }`}
              >
                <h3>Intellectual Property</h3>
                <p>
                  <strong>6.1. Ownership</strong>
                  <br />
                  All content on our website, including text, images, and logos,
                  is the property of Neel Jewels by Arman Siddiqui and protected by
                  intellectual property laws.
                  <br />
                  <br />
                  <strong>6.2. Usage Restrictions</strong>
                  <br />
                  You may not use, reproduce, or distribute any content from our
                  website without our express written permission.
                </p>
              </div>
              <div
                className={`tab_item tab_item_7 ${
                  activeTab === "tab_item_7" ? "active" : "hidden"
                }`}
              >
                <h3>Limitation of Liability</h3>
                <p>
                  <strong>7.1. No Warranties</strong>
                  <br />
                  Our website and Products are provided "as is" without
                  warranties of any kind. We do not guarantee that our website
                  will be free of errors or interruptions.
                  <br />
                  <br />
                  <strong>7.2. Limitation of Liability</strong>
                  <br />
                  We are not liable for any indirect, incidental, or
                  consequential damages arising from the use of our website or
                  Products.
                </p>
              </div>
              <div
                className={`tab_item tab_item_9 ${
                  activeTab === "tab_item_9" ? "active" : "hidden"
                }`}
              >
                <h3>Contact Information</h3>
                <p>
                  If you have any questions about these Terms and Conditions,
                  please contact us at:
                  <br />
                  <br />
                  <strong>Email:</strong> armansid6783@gmail.com
                  <br />
                  <br />
                  <strong>Phone:</strong> +91 8707428216 
                  <br />
                  <br />
                  <strong>Address:</strong> Shop No. F8, (First Floor), The
                  Affaires, Sector-XX, Abcdefg Ghji - 40xx23x
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
