import React, { useState, useEffect } from 'react';
import "./css/root.css";
import Footer from './Footer.jsx';
import LeftNav from './LeftNav.jsx';
import Item from './Item.jsx';
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import HowTo from './HowTo.jsx';
import MusicPlayer from './assets/sourceCodes/MusicPlayer.jsx';
import WorldMap from './assets/sourceCodes/WorldMap.jsx';
import CircularProgress from './assets/sourceCodes/CircularProgress.jsx';
import Timeline from './assets/sourceCodes/Timeline.jsx';
import Parallax from './assets/sourceCodes/Parallax.jsx';
import ImageSlider from './assets/sourceCodes/ImageSlider.jsx';
import FlipClock from './assets/sourceCodes/FlipClock.jsx';
import QuoteSlideshow from './assets/sourceCodes/QuoteSlideshow.jsx';

export default function Root() {
    const [selectedItem, setSelectedItem] = useState(null);

    const listItems = [
        {
            title: "Music Player",
            component: <MusicPlayer />,
            css: `#songs-list {
    border-radius: 10px;
    border: solid 1px #94692D;
    background-color: black;
    margin-top: 10px;
    overflow-y: auto;
    width: 100%;
    height: 30vw;
}

#songs-list-and-autoplay{
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 5px;
}

input[type="checkbox"] {
    accent-color: #94692D;
}

.song-holder {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    margin: 10px;
    cursor: pointer;
    padding-left: 10px;
    border-radius: 10px;
}

.song-holder:hover {
    background-color: #292929;
}

.song-title, .song-artist {
    margin: 0;
}

.song-artist {
    margin-bottom: 10px;
}

.song-number {
    min-width: 30px;
}

#music {
    display: flex;
    flex-direction: row;
    gap: 30px;
    align-items: center;
}

.music-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.arrows {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: white;
    font-size: 4vw;
}

.arrows:hover {
    background-color: transparent;
    color: #94692D;
}

.song-holder.active {
    background-color: #FF4136;
}

.song-holder.active h4 {
    color: #292929;
}

#current-title, #current-artist {
    color: white;
    margin: 0;
}

#current-image-holder {
    margin: 10px;
    width: 30vw;
    height: 30vw;
    position: relative;
}

#current-image {
    width: 100%;
    height: 100%;
    cursor: pointer;
    object-fit: cover;
}

input[type="range"] {
    accent-color: #94692D;
    width: 80%;
}

.control-btn {
    border: none;
    background-color: transparent;
    color: white;
    cursor: pointer;
    font-size: 18px;
}
  
.control-btn:hover {
    color: #94692D;
    background-color: transparent;
}
  
.control-btn svg {
    pointer-events: none;
}

.time-controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.player-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    margin: 0 auto;
}

#spotify-logo {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    z-index: 2;
    pointer-events: none;
}

@media screen and (max-width: 870px) {
    #music {
        flex-direction: column;
        justify-content: baseline;
        gap: 10px;
        min-width: 80vw;
        max-width: 80vw;
    }

    #songs-list {
        margin-top: 0;
        height: 50vw;
    }

    #current-image-holder {
        min-width: 80vw;
        max-width: 80vw;
        min-height: 80vw;
        max-height: 80vw;
        width: 100%;
        height: 100%;
    }

    .music-controls {
        min-width: 100%;
        max-width: 100%;
        height: auto;
        align-items: center;
        justify-content: center;
    }
};`,
            jsx: `
import React, {useState, useRef} from 'react';
import { Link } from "react-router-dom";
import { FaPlay, FaPause, FaFastBackward, FaFastForward } from "react-icons/fa";

//import your songs according to your file structure
//@ts-ignore
import unwritten from '../music/Unwritten (Audio) -Natasha Bedingfield.mp3'
import unwrittenImage from '../music/unwritten.png';
import spotify from '../music/spotify.png';
import littleHollywood from '../music/Little Hollywood  Lyrics (Alle Farben feat. Janieck).mp3';
import littleHollywoodImage from '../music/littleHollywood.png';

//import your css file according to your file structure
import "../styles/musicPlayer.css"

export default function MusicPlayer() {
    const songs =[
        {title: "Unwritten", artist: "Natasha Bedingfield", url: "https://open.spotify.com/track/3U5JVgI2x4rDyHGObzJfNf?si=227203f433ed4511", source: unwritten, image: unwrittenImage},
        {title: "Little Hollywood", artist: "Alle Farben, Janiek", url: "https://open.spotify.com/track/1f3flfdU4VDM2OBDD2FMia?si=2700163fb72e4a73", source: littleHollywood, image: littleHollywoodImage},
    ];//Load your own songs

    const [currentSong, setCurrentSong] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [autoplay, setAutoplay] = useState(false);

    const audioRef = useRef(null);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);

        // If autoplay is enabled, play the new song when loaded
        if (autoplay && audioRef.current) {
            audioRef.current
                .play()
                .then(() => setIsPlaying(true))
                .catch((error) => {
                    console.error("Playback error: ", error);
                });
        }
    };

    const handleSeek = (e) => {
        const newTime = (e.target.value / 100) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleSongEnd = () => {
        const nextSongIndex = (currentSong + 1) % songs.length;
        changeSong(nextSongIndex);

        if (autoplay) {
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play().catch((error) => {
                        console.error("Playback error: ", error);
                    });
                }
                setIsPlaying(true);
            }, 100);
        }
    };

    const changeSong = (newSongIndex) => {
        setCurrentSong(newSongIndex);
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    return (
        <div>
            <h2>Music</h2>
            <div id="music">
                <div className="music-controls">
                    <div>
                        <h2 id="current-title">{songs[currentSong].title}</h2>
                        <h3 id="current-artist">{songs[currentSong].artist}</h3>
                        <div id="current-image-holder">
                            <Link to={songs[currentSong].url} target="_blank" rel="noopener noreferrer">
                                <img
                                    id="current-image"
                                    alt={songs[currentSong].title}
                                    src={songs[currentSong].image}
                                />
                            </Link>

                            <img
                                id="spotify-logo"
                                alt="Spotify"
                                src={spotify}
                            />
                        </div>
                        <div>
                            <audio
                                ref={audioRef}
                                src={songs[currentSong].source}
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleLoadedMetadata}
                                onEnded={handleSongEnd}
                            />
                            <div className="time-controls">
                                {Math.floor(currentTime / 60)}:
                                {String(Math.floor(currentTime % 60)).padStart(2, "0")}
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={(currentTime / duration) * 100 || 0}
                                    onChange={handleSeek}
                                />
                                <span>
                                    {Math.floor(duration / 60)}:
                                    {String(Math.floor(duration % 60)).padStart(2, "0")}
                                </span>
                            </div>
                        </div>
                        <div className="player-controls">
                            <button
                                className="control-btn"
                                onClick={() =>
                                    changeSong((currentSong - 1 + songs.length) % songs.length)
                                }
                            >
                                <FaFastBackward size={20} />
                            </button>

                            <button className="control-btn" onClick={togglePlayPause}>
                                {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                            </button>

                            <button
                                className="control-btn"
                                onClick={() => changeSong((currentSong + 1) % songs.length)}
                            >
                                <FaFastForward size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div id="songs-list-and-autoplay">
                    <div>
                        <input
                            type="checkbox"
                            id="autoplay"
                            checked={autoplay}
                            onChange={() => setAutoplay(!autoplay)}
                        />
                        <label htmlFor="autoplay">Play songs automatically</label>
                    </div>

                    <div id="songs-list">
                        {songs.map((s, index) => (
                            <div
                                key={s.id}
                                className={\`song-holder \${
                                    currentSong === index ? "active" : ""
                                }\`}
                                onClick={() => changeSong(index)}
                            >
                                <div className="song-number">{index + 1}</div>
                                <img
                                    alt={s.title}
                                    src={s.image}
                                    className="song-image"
                                    width="50px"
                                    height="50px"
                                />
                                <div>
                                    <h4 className="song-title">{s.title}</h4>
                                    <p className="song-artist">{s.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
            `
        },
        {
            title: 'World Map',
            component: <WorldMap />,
            css: ``,
            jsx: `
import React, { useState } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const visitedCountries = [
  "United States of America", "Spain", "France", "Italy", "Germany", "United Kingdom",
  "Belgium", "Ireland", "Netherlands", "Switzerland", "Norway", "Sweden", "Turkey", "Greece",
  "Croatia", "Slovenia", "Luxembourg", "Monaco", "Andorra", "Portugal"
];

export default function WorldMap() {
  const [clickedCountry, setClickedCountry] = useState("");

  const handleCountryClick = (name) => {
    setClickedCountry(name);
  };

  return (
    <div id="world-map">
      <ComposableMap className="composable-map">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleCountryClick(geo.properties.name)}
                style={{
                  default: {
                    fill: visitedCountries.includes(geo.properties.name)
                      ? "#94692D"
                      : "#ECEFF1",
                    outline: "none",
                  },
                  hover: { fill: "#FF4136", outline: "none" },
                  pressed: { fill: "#292929", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>

      <div id="map-info">
      <div>
          <b>Last country you clicked: </b> {clickedCountry}
        </div>

        <div>
          <b>Visited countries: </b>
          {visitedCountries.map((country, idx) => (
            country + (idx !== visitedCountries.length - 1 ? ", " : "")
          ))}
        </div>
      </div>
        
    </div>
  );
}            
            `,
        },

        {
            title: 'Circular Progress',
            component: <CircularProgress />,
            css: `
.circular-progress-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;
}

.circular-progress {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: conic-gradient(#94692D 0%, #e6e6e6 100%);
}

.circular-progress-inner {
    width: 170px;
    height: 170px;
    border-radius: 50%;
    background-color: #151515;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    flex-direction: column;
}

.progress-text {
    font-size: 30px;
    font-weight: bold;
    color: #d3d3d3;
}

.progress-text p {
    margin:0;
    text-align: center;
    font-weight: normal;
    font-size: 15px;
}        
            `,
            jsx: `
import React, { useState, useEffect } from "react";
import "./css/circularProgress.css"; // Import CSS for styling

const CircularProgress = ({ credits, totalCredits }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const percentage = (credits / totalCredits) * 100;
        setProgress(percentage);
    }, [credits, totalCredits]);

    return (
        <div className="circular-progress-container">
            <div
                className="circular-progress"
                style={{
                    background: \`conic-gradient(#94692D \${progress}%, #e6e6e6 \${progress}% 100%)\`,
                }}
            >
                <div className="circular-progress-inner">
                    <div className="progress-text">
                        {credits}/{totalCredits}
                        <p>credits</p>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default CircularProgress;            
            `
        },
        {
            title: "Timeline",
            component: <Timeline />,
            css: `
.timeline-container {
    padding: 20px;
    font-family: Arial, sans-serif;
    overflow-x: auto; /* Enable horizontal scrolling */
}
  
.timeline-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); /* Columns for years */
    gap: 10px;
    position: relative;
    align-items: center;
}
  
.timeline-grid-item {
    background-color: #6cb2eb;
    color: white;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-size: 14px;
    font-weight: bold;
    padding: 20px 10px;
}
  
.timeline-grid-item.work {
    background-color: #94692d;
}
  
.timeline-grid-item.volunteer {
    background-color: black;
    border:#94692d solid 1px;
}
  
.timeline-year {
    border: solid 1px #94692d;
    color: white;
    text-align: center;
    border-radius: 10px;
    font-weight: bold;
}
            `,
            jsx: `
import React, { useState } from "react";
import "../styles/timeline.css";

export default function Timeline() {
  const currentYear = new Date().getFullYear();

  const experiences = [
    { title: "M.A.C.S", startTime: 2024, endTime: 2024, type: "work"},
    { title: "GoStudent", startTime: 2022, endTime: currentYear, type: "work" },
    { title: "OIFem", startTime: 2022, endTime: currentYear, type: "volunteer" },
    { title: "Repair of Computers", startTime: 2021, endTime: 2021, type: "volunteer"},
    { title: "Repair of Phones", startTime: 2020, endTime: 2020, type: "volunteer" },
  ];

  const minYear = Math.min(...experiences.map((exp) => exp.startTime));
  const maxYear = Math.max(...experiences.map((exp) => exp.endTime));
  const totalYears = maxYear - minYear + 1;

  return (
    <>
      <h1>Timeline</h1>
      <div className="timeline-container">
        <div className="timeline-grid">
          {experiences.map((exp, index) => {
            const startColumn = exp.startTime - minYear + 1;
            const spanColumns = exp.endTime - exp.startTime + 1;

            return (
              <div
                key={index}
                className={\`timeline-grid-item \${exp.type}\`}
                style={{
                  gridColumn: \`\${startColumn} / span \${spanColumns}\`,
                  gridRow: \`\${index + 1}\`,
                }}
              >
                {exp.title}
              </div>
            );
          })}

          {/* Years row */}
          {Array.from({ length: totalYears }, (_, i) => (
            <div
              key={\`year-\${i}\`}
              className="timeline-year"
              style={{ gridColumn: \`\${i + 1}\`, gridRow: experiences.length + 1 }}
            >
              {minYear + i}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}            
            `
        }, 
        {
            title: "Parallax",
            component: <Parallax />,
            css:`
.parallax {
    height: 500px;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.parallax button {
    font-size: xx-large;
    color:#94692d;
    background-color:#151515;
    padding: 10px 30px;
    border: solid 3px #94692d;
    cursor: pointer;
}

.parallax button:hover {
    background-color:#94692d;
    color: #151515;
} 
            `,
            jsx:`
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
                    backgroundImage: \`url(\${p.img})\`
                }}
            >
                
                <button>{p.title}</button>
            </div>
            ))}
        </>
    );
}
            `
        },
        {
            title: "Image Slider",
            component: <ImageSlider />,
            css: ``,
            jsx: `
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
                        <img src={images[slideIndex].img} alt={\`Slide \${slideIndex + 1}\`} />
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
                        className={\`demo cursor \${index === slideIndex ? "active" : ""}\`}
                        src={img.img}
                        alt={\`Thumbnail \${index + 1}\`}
                        onClick={() => currentSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
            `
        },
        {
            title: "Flip Clock Countdown",
            component: <FlipClock />,
            css: `
/* General styles */
label {
    margin-right: 10px;
}

.flip-clock {
    display: flex;
    flex-wrap: wrap; /* Enable wrapping on small screens */
    gap: 20px; /* Adjust spacing */
    justify-content: center;
    padding: 20px;
    max-width: 100%; /* Ensure it doesn't exceed screen width */
}

.time-holder {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

/* Flip number styles */
.flip-number {
    display: flex;
    flex-direction: row; /* Place two digits in a row */
    gap: 5px;
}

/* Flip digit styles */
.flip-digit {
    position: relative;
    width: 40px;
    height: 60px;
    perspective: 1000px; /* Creates the 3D perspective */
}

.flip-digit .digit-front,
.flip-digit .digit-back {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36px;
    font-weight: bold;
    background-color: #94692D;
    color: white;
    border-radius: 5px;
    transform-origin: center; /* Flip from the middle of the digit */
    transition: transform 0.6s ease-in-out;

    /* Backface visibility for browsers */
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}

.flip-digit .digit-back {
    transform: rotateX(90deg);
}

.flip-digit.flipping .digit-front {
    transform: rotateX(-90deg);
}

.flip-digit.flipping .digit-back {
    transform: rotateX(0deg);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .flip-clock {
        gap: 15px;
    }

    .flip-digit {
        width: 30px;
        height: 45px;
    }

    .flip-digit .digit-front,
    .flip-digit .digit-back {
        font-size: 24px;
    }

    .time-text {
        font-size: 12px;
    }
}

@media (max-width: 480px) {
    .flip-clock {
        gap: 10px;
    }

    .flip-digit {
        width: 25px;
        height: 40px;
    }

    .flip-digit .digit-front,
    .flip-digit .digit-back {
        font-size: 18px;
    }

    .time-text {
        font-size: 10px;
    }
}

            `,
            jsx: `
import React, { useState, useEffect } from "react";
import "../styles/flipClock.css";

function FlipDigit({ value }) {
    const [prevValue, setPrevValue] = useState(value);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (value !== prevValue) {
            setIsFlipping(true);
            const timeout = setTimeout(() => {
                setIsFlipping(false);
                setPrevValue(value);
            }, 600); // Match this duration to the CSS animation
            return () => clearTimeout(timeout);
        }
    }, [value, prevValue]);

    return (
        <div className={\`flip-digit \${isFlipping ? "flipping" : ""}\`}>
            <div className="digit-front">{prevValue}</div>
            <div className="digit-back">{value}</div>
        </div>
    );
}

function FlipNumber({ value }) {
    const digits = String(value).padStart(2, "0").split(""); // Ensure two digits, split into an array
    return (
        <div className="flip-number">
            {digits.map((digit, index) => (
                <FlipDigit key={index} value={digit} />
            ))}
        </div>
    );
}

export default function FlipClock() {
    const [targetDate, setTargetDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
    });
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            updateTimeLeft();
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const updateTimeLeft = () => {
        const currentTime = new Date();
        const diff = targetDate - currentTime;

        const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
        const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
        const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
        const seconds = Math.max(0, Math.floor((diff / 1000) % 60));

        setTimeLeft({ days, hours, minutes, seconds });
    };

    return (
        <>
            <h1>Flip Clock Countdown</h1>
            <div>
                <label htmlFor="date-picker">Select target date:</label>
                <input
                    id="date-picker"
                    type="date"
                    value={targetDate.toISOString().split("T")[0]}
                    onChange={(e) => setTargetDate(new Date(e.target.value))}
                />
            </div>
            <div className="flip-clock">
                <div className="time-holder">
                    <FlipNumber value={timeLeft.days} />
                    <div className="time-text">Days</div>
                </div>
                <div className="time-holder">
                    <FlipNumber value={timeLeft.hours} />
                    <div className="time-text">Hours</div>
                </div>
                <div className="time-holder">
                    <FlipNumber value={timeLeft.minutes} />
                    <div className="time-text">Minutes</div>
                </div>
                <div className="time-holder">
                    <FlipNumber value={timeLeft.seconds} />
                    <div className="time-text">Seconds</div>
                </div>
            </div>
        </>
    );
}

            `
        },
        {
            title: "Quote Slideshow",
            component: <QuoteSlideshow />,
            css: `
#quotes_container{
    background: black;
    text-align: center;
    display: flex;
    border: solid 1px #94692D;
    border-radius: 10px;
}

#quote {
    border-radius: 10px;
    flex: 1;
}

#next_quote, #previous_quote {
    background-color: transparent;
    border: none;
    color: #94692D;
    border-radius: 10px;
}

#next_quote:hover, #previous_quote:hover {
    color: #FF4136;
}

#autoplay_toggle {
    margin-top: 20px;
}

#autoplay_toggle input {
    margin-right: 10px;
}
            `,
            jsx: `
import React, { useState, useEffect } from "react";
import "../styles/quotes.css";

const QuoteSlideshow = () => {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [autoPlay, setAutoPlay] = useState(false);
    const quotes = [
        { text: 'Everybody\'s a genius. But if you judge a fish by its ability to climb a tree, it will live its whole  life believing that it is stupid.', author: 'Albert Einstein' },
        { text: 'No és el pas del temps qui et porta a créixer són els seus cops.', author: 'Txarango' },
        { text: 'On ne voit bien qu\'avec le coeur. L\'essentiel est invisuble pour les yeux.', author: 'Antoine de Saint-Exupéry' },
        { text: 'Hay cosas encerradas dentro de los muros que, si salieran de pronto a la calle y gritaran, llenarían el mundo.', author: 'Federico García Lorca'}
    ];

    const nextQuote = () => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    };

    const prevQuote = () => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length);
    };

    // Start autoplay if enabled
    useEffect(() => {
        let interval;
        if (autoPlay) {
            interval = setInterval(nextQuote, 5000); // Change quote every 5 seconds
        } else {
            clearInterval(interval); // Stop autoplay when disabled
        }

        return () => clearInterval(interval); // Cleanup on unmount or toggle
    }, [autoPlay]);

    const currentQuote = quotes[currentQuoteIndex];

    return (
        <>
            <h1>Quote Slideshow</h1>
            <div id="autoplay_toggle">
                <label>
                    <input
                        type="checkbox"
                        checked={autoPlay}
                        onChange={() => setAutoPlay(!autoPlay)}
                    />
                    Autoplay
                </label>
            </div>
            <div id="quotes_container">
                <button id="previous_quote" onClick={prevQuote}>
                    &#10094;
                </button>
                <div id="quote">
                    <p>
                        <i>{currentQuote.text}</i>
                    </p>
                    <p>- {currentQuote.author}</p>
                </div>
                <button id="next_quote" onClick={nextQuote}>
                    &#10095;
                </button>
            </div>
        </>
    );
};

export default QuoteSlideshow;

            `
        },
    ];

    return (
        <HashRouter>
            <div className="view">
                <LeftNav 
                    listItems={listItems} 
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HowTo
                                listItems={listItems}
                                selectedItem={selectedItem}
                                setSelectedItem={setSelectedItem}
                            />
                        }
                    />
                    <Route path="/item" element={<Item item={selectedItem} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            <Footer />
        </HashRouter>
    );
}

// Rendering the Root component to the DOM
const rootElement = document.getElementById("root");
if (rootElement) {
    createRoot(rootElement).render(<Root />);
}
