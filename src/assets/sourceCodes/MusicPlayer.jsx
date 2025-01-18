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
    ];

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
                                className={`song-holder ${
                                    currentSong === index ? "active" : ""
                                }`}
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