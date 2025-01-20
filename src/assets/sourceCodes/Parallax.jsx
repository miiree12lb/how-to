import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
//import your images
import northernLights from "../images/landscapes/auroraBoreal.png";
import sunset from "../images/landscapes/sunset.png";
import nature from "../images/landscapes/nature.png";
//import your css file
import "../styles/parallax.css";

export default function Parallax() {
    const parallax_contents = [
        { title: "Northern Lights", img: northernLights },
        { title: "Sunset", img: sunset },
        { title: "Nature", img: nature}
        //add more images and titles as needed...
    ];

    return (
        <>
            {parallax_contents.map((p) => (
                <div className="parallax"
                style={{
                    backgroundImage: `url(${p.img})`
                }}
            >
                
                <button>{p.title}</button>
            </div>
            ))}
        </>
    );
}