import React, { useState, useEffect } from "react";

export default function Item({item}) {
    const [selectedCode, setSelectedCode] = useState("jsx");

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
