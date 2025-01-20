import React, {useState} from 'react';

//import your images
import northernLights from "../images/landscapes/auroraBoreal.png";
import sunset from "../images/landscapes/sunset.png";
import nature from "../images/landscapes/nature.png";

//import your css file
import styles from "../styles/imageSlider.css";

export default function ImageSlider() {
    const [slideIndex, setSlideIndex] = useState(0);

    const images = [
        {title: "Northern Lights", img: northernLights},
        {title: "Sunset", img: sunset},
        {title: "Nature", img: nature}
    ];

    const plusSlides = (n) => {
        let newIndex = slideIndex + n;
        if (newIndex >= images.length) newIndex = 0;
        if (newIndex < 0) newIndex = images.length - 1;
        setSlideIndex(newIndex);
    };

    const currentSlide = (n) => {
        setSlideIndex(n);
    };

    return (
        <>
            <h2>Image Slider</h2>
            <div className="container">
                <div className="slider-container">
                    <a
                        className="prev"
                        onClick={() => plusSlides(-1)}
                    >
                        &#10094;
                    </a>

                    <div className="slider-img">
                        <img src={images[slideIndex].img} alt={`Slide ${slideIndex + 1}`} />
                    </div>
                    
                    <a
                        className="next"
                        onClick={() => plusSlides(1)}
                    >
                        &#10095;
                    </a>
                </div>
                <div className='img-title'>{images[slideIndex].title}</div>
                <div className="row">
                    {images.map((img, index) => (
                        <img
                        className={`demo cursor ${index === slideIndex ? "active" : ""}`}
                        src={img.img}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => currentSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}