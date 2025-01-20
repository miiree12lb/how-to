import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Item({item}) {
    const [selectedCode, setSelectedCode] = useState("jsx");
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (event) => {
          // Check for F5 or Ctrl+R
          if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
            event.preventDefault(); // Prevent the default browser refresh
            navigate('/'); // Redirect to "/"
          }
        };
    
        window.addEventListener('keydown', handleKeyDown);

        if (!item) {
            navigate("/");
        }
    
        // Cleanup the event listener on component unmount
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
    }, [navigate]);

    return (
        <div className="item-page">
            <div className="component-preview">
                {item.component}
            </div>

            <h2>Code</h2>
            <div className="code-section">
                <div className="tabs">
                    <h3 className={`tab ${selectedCode === 'jsx' ? 'selected' : ''}`} onClick={() => setSelectedCode('jsx')}>JSX</h3>
                    <h3 className={`tab ${selectedCode === 'css' ? 'selected' : ''}`} onClick={() => setSelectedCode('css')}>CSS</h3>
                </div>
                
                <pre className="code">
                    <code>{selectedCode === 'jsx' ? item.jsx : item.css}</code>
                </pre>
            </div>
        </div>
    );
}
