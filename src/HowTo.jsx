import React from "react";
import { useNavigate } from "react-router-dom";

export default function HowTo({ listItems, selectedItem, setSelectedItem }) {
    const navigate = useNavigate();

    const openItem = (item) => {
        setSelectedItem(item);
        navigate("/item");
    };

    return (
        <div className="how-to">
            <h1>React How To</h1>

            <div className="items-list">
                {listItems.map((item, index) => (
                    <div key={index} className="item">
                        {item.component}
                        <div className="how-to-button">
                            <button onClick={() => openItem(item)}>How to</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
