import React, { useState, useEffect } from "react";
import "../styles/circularProgress.css"; // Import CSS for styling

const CircularProgress = () => {
    const credits = 120; // change value with your current progress
    const totalCredits = 180; // change value with your total progress goal
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const percentage = (credits / totalCredits) * 100;
        setProgress(percentage);
    }, [credits, totalCredits]);

    return (
        <>
            <h1>Circular Progress</h1>
            <div className="circular-progress-container">
                <div
                    className="circular-progress"
                    style={{
                        background: `conic-gradient(#94692D ${progress}%, #e6e6e6 ${progress}% 100%)`,
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
        </>
    );
};

export default CircularProgress;