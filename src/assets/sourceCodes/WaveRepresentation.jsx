import React, { useEffect, useState, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

import "../styles/wave.css";

export default function WaveRepresentation() {
    const [file, setFile] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const canvasRef = useRef(null);
    const audioRef = useRef(null);
    const waveformDataRef = useRef(null);

    const handleFileChange = (e) => {
        setIsPlaying(false);
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileURL = URL.createObjectURL(selectedFile);
            setFile(fileURL);
        }
    };

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
    };

    const handleSeek = (e) => {
        const newTime = (e.target.value / 100) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    useEffect(() => {
        if (!file) return;

        const generateWaveform = async () => {
            const audioCtx = new AudioContext();
            const response = await fetch(file);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

            const rawData = audioBuffer.getChannelData(0);
            const canvas = canvasRef.current;
            const width = canvas.width;
            const step = Math.ceil(rawData.length / width);

            const waveformData = [];
            for (let i = 0; i < width; i++) {
                const slice = rawData.slice(i * step, (i + 1) * step);
                const max = Math.max(...slice);
                const min = Math.min(...slice);
                waveformData.push({ max, min });
            }
            waveformDataRef.current = waveformData;
        };

        generateWaveform();
    }, [file]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const waveformData = waveformDataRef.current;

        if (!canvas || !waveformData || !duration) return;

        const width = canvas.width;
        const height = canvas.height;
        const progress = currentTime / duration;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < width; i++) {
            const { max, min } = waveformData[i];
            const y = (1 + min) * height / 2;
            const h = Math.max(1, (max - min) * height / 2);

            ctx.fillStyle = i / width <= progress ? "#DCA75C" : "#94692D";
            ctx.fillRect(i, y, 1, h);
        }
    }, [currentTime, duration]);

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Audio Wave Representation</h1>
            <div>
                <label htmlFor="audio-file">Audio file (mp3/mp4/wav): </label>
                <input
                    type="file"
                    id="audio-file"
                    accept="audio/*,video/mp4"
                    onChange={handleFileChange}
                />
            </div>

            <div style={{ marginTop: "1rem", width: "100%" }}>
                <canvas ref={canvasRef} width={600} height={100}></canvas>
            </div>

            {file && (
                <div style={{ marginTop: "1rem" }}>
                    <audio
                        ref={audioRef}
                        src={file}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                    />

                    <div className="time-controls" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div onClick={togglePlayPause}>
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
                            value={(currentTime / duration) * 100 || 0}
                            onChange={handleSeek}
                            style={{ flex: 1 }}
                        />
                        <span>
                            {Math.floor(duration / 60)}:
                            {String(Math.floor(duration % 60)).padStart(2, "0")}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
