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
        <div className={`flip-digit ${isFlipping ? "flipping" : ""}`}>
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
