import React, { useEffect, useState } from "react";
import Faq from "react-faq-component";
import "./style.css"

const data = [
    //International Shipping
    // {
    //     title: "International Shipping",
    //     rows: [
    //         {
    //             title: "What countries do you ship to?",
    //             content: "We ship to most countries around the world. You can check our shipping policy for specific details."
    //         },
    //         {
    //             title: "How long does international shipping take?",
    //             content: "International shipping times vary by destination. Generally, it takes 7-14 business days. However, some locations may experience delays."
    //         },
    //         {
    //             title: "How much does international shipping cost?",
    //             content: "Shipping costs depend on the destination and weight of the package. You can view shipping costs at checkout before placing your order."
    //         },
    //     ],
    // },
    // Category: Product Information
    {
        title: "Product Information",
        rows: [
            {
                title: "Are your products genuine?",
                content: "Yes, all our products are genuine and sourced from reputable manufacturers."
            },
            {
                title: "Do you offer product warranties?",
                content: "Yes, we offer warranties on many of our products. Please refer to the specific product's warranty information for details."
            },
            {
                title: "Can I get more information about a product?",
                content: "Yes, you can contact our customer service for detailed information about any product."
            },
        ]
    },
    // Category: Returns and Exchanges
    {
        title: "Returns and Exchanges",
        rows: [
            {
                title: "What is your return policy?",
                content: "We accept returns within 15 days of purchase. Items must be unused and in their original packaging. For more details, please refer to our return policy page."
            },
            {
                title: "How do I return an item?",
                content: "To return an item, please contact our customer service team to initiate the return process. We will provide you with instructions on how to return the item."
            },
            {
                title: "Can I exchange an item?",
                content: "Yes, exchanges are allowed for items of equal or lesser value. Please contact our customer service team to process an exchange."
            },
        ]
    },
    // Category: Payment and Orders
    {
        title: "Payment and Orders",
        rows: [
            {
                title: "What payment methods do you accept?",
                content: "We accept various payment methods including credit/debit cards, PayPal, and bank transfers."
            },
            {
                title: "Can I change my order after it's been placed?",
                content: "Once an order is placed, it cannot be modified. However, you can contact our customer service team to cancel or return the order."
            },
            {
                title: "How can I track my order?",
                content: "After your order has been shipped, you will receive a tracking number via email. You can use this number to track your order on our shipping partner's website."
            },
        ]
    },
    // Category: Store Locations
    {
        title: "Store Locations",
        rows: [
            {
                title: "Where are your stores located?",
                content: "We have stores in various locations. Please visit our store locator page to find the nearest store."
            },
            {
                title: "What are the store hours?",
                content: "Store hours vary by location. You can check the hours for each store on our website or by contacting the store directly."
            },
            {
                title: "Do you offer in-store pickup?",
                content: "Yes, we offer in-store pickup for online orders. You can select this option at checkout."
            }
        ]
    }
];

const styles = {
    // bgColor: 'white',
    titleTextColor: "black",
    rowTitleColor: "black",
    rowContentPaddingRight: '20px',
    rowContentPaddingBottom: '20px',
    rowContentColor: 'grey',
    // arrowColor: "red",
};

const config = {
    // animate: true,
    // arrowIcon: "V",
    // tabFocus: true
};

export default function FaqPage() {

    return (
        <div className="px-4 my-8">
            <h2 className="text-center text-[30px]">Frequently asked questions</h2>
            <div className="flex justify-center mt-14" style={{ fontFamily: 'monospace' }}>
                <Faq
                    data={data[0]}
                    styles={styles}
                    config={config}
                />
            </div>
            <div className="flex justify-center mt-16" style={{ fontFamily: 'monospace' }}>
                <Faq
                    data={data[1]}
                    styles={styles}
                    config={config}
                />
            </div>
            <div className="flex justify-center mt-16" style={{ fontFamily: 'monospace' }}>
                <Faq
                    data={data[2]}
                    styles={styles}
                    config={config}
                />
            </div>
            <div className="flex justify-center mt-16" style={{ fontFamily: 'monospace' }}>
                <Faq
                    data={data[3]}
                    styles={styles}
                    config={config}
                />
            </div>
            <div className="flex justify-center mt-16" style={{ fontFamily: 'monospace' }}>
                <Faq
                    data={data[4]}
                    styles={styles}
                    config={config}
                />
            </div>
        </div>

    );
}