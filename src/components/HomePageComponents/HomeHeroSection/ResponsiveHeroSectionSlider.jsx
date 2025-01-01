import React, { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import "./style.css";
import { BASE_URL } from "../../../../constant";
import { useNavigate } from "react-router-dom";

const ResponsiveHeroSectionSlider = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/homepage/carousel/get-images`
        );
        setCarouselImages(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchImages();
  }, []);

  const handleClick = (link) => {
    if (link) {
      window.open(link, "_blank");
    } else {
      console.error("No link provided for the carousel item.");
    }
  };

  return (
    <div>
      <Carousel
        className="res-hero-section-carousel"
        controls={false}
        indicators={true}
        fade
      >
        {carouselImages.map((carouselImage, index) => (
          <Carousel.Item
            interval={800}
            key={index}
            onClick={() => handleClick(carouselImage.link)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={carouselImage.imageUrl}
              alt={`Slide ${index}`}
              text="First slide"
              onClick={() => handleClick(carouselImage.link)}
              style={{ cursor: "pointer" }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ResponsiveHeroSectionSlider;
