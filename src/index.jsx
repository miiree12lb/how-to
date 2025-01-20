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
