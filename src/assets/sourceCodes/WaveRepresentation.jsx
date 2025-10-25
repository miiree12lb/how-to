import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { createRoot } from "react-dom/client";

import "../styles/wave.css";

export default function Root () {
    const [file, setFile] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrenTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const waveFormDataRef = useRef(null);

    const handleFileChange = (e) => {
        setIsPlaying(false);
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileURL = URL.createObjectURL(selectedFile);
            setFile(fileURL);
        }
    }

    const togglePlayPause = () => {
        isPlaying ? audioRef.current.pause() : audioRef.current.play();
        setIsPlaying(!isPlaying);
    }

    const handleTimeUpdate = () => {
        setCurrenTime(audioRef.current.currentTime);
    }

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    }

    const handleSeek = (e) => {
        const newTime = (e.target.value / 100) * duration;
        audioRef.current.currentTime = newTime;
        setCurrenTime(newTime);
    }

    useEffect(() => {
        if (!file) return;

        const generateWaveForm = async () => {
            const audioCtx = new AudioContext();
            const response = await fetch(file);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

            const rawData = audioBuffer.getChannelData(0);
            const canvas = canvasRef.current;
            const width = canvas.width;
            const step = Math.ceil(rawData.length / width);

            const waveFormData = [];
            for (let i = 0; i < width; i++) {
                const slice = rawData.slice(i * step, (i + 1) * step);
                const max = Math.max(...slice);
                const min = Math.min(...slice);
                waveFormData.push({max, min});
            }
            waveFormDataRef.current = waveFormData;
        }

        generateWaveForm();
    }, [file]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const waveFormData = waveFormDataRef.current;

        if (!canvas || !waveFormData || !duration) return;

        const width = canvas.width;
        const height = canvas.height;
        const progress = currentTime / duration;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < width; i++) {
            const {max, min} = waveFormData[i];
            const y = (1 + min)  * height / 2;
            const h = Math.max(1, (max - min) * height / 2);

            ctx.fillStyle = i / width <= progress ? "#DCA75C" : "#94692D";
            ctx.fillRect(i, y, 1, h);
        }
    }, [currentTime, duration]);

    return (
        <>
            <h1>Wave Representation of Audio</h1>

            <div>
                <div>
                    <label htmlFor="audio-input">Audio file (mp3, mp4, wav)</label>
                    <input 
                        type="file"
                        id="audio-input"
                        accept="audio/*, video/mp4"
                        onChange={handleFileChange}
                    />
                </div>

                <div>
                    <canvas ref={canvasRef}></canvas>
                </div>

                {file && <div>
                    <audio
                        ref={audioRef}
                        src={file}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                    />    

                    <div className="time-controls">
                        <div id="play-pause" onClick={togglePlayPause}>
                            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                        </div>

                        <span>
                            {Math.floor(currentTime / 60)}:
                            {String(Math.floor(currentTime % 60)).padStart(2, "0")}
                        </span>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={(currentTime / duration) * 100}
                            onChange={handleSeek}
                        />

                        <span>
                            {Math.floor(duration / 60)}:
                            {String(Math.floor(duration % 60)).padStart(2, "0")}
                        </span>
                    </div>
                </div>}
            </div>
        </>
    );
}

const rootElement = document.getElementById("root");
if (rootElement) {
    createRoot(rootElement).render(<Root />);
}