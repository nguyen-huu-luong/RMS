import React, { useState, useEffect } from "react";
import "./style.css";

interface ICarouselProps {
    images: string[]
}
const Carousel: React.FC<ICarouselProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1
                    ? 0
                    : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1
                ? 0 :
                prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0
                ? images.length - 1
                : prevIndex - 1
        );
    };

    return (
        <div className="carousel-container">
            <div className="carousel">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={
                            index === currentIndex
                                ? "carousel-slide active-slide"
                                : "carousel-slide"
                        }>
                        <img src={image}
                            alt={`Slide ${index + 1}`} />
                    </div>
                ))}
            </div>
            <button className="carousel-button prev"
                onClick={prevSlide}>
                &#10094; Prev
            </button>
            <button className="carousel-button next"
                onClick={nextSlide}>
                Next &#10095;
            </button>
        </div>
    );
};

export default Carousel;