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
