import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./css/leftnav.css";
import logo from "./assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export default function Navbar({ listItems, selectedItem, setSelectedItem }) {
    const isDesktop = useMediaQuery({ query: "(min-width: 951px)" });
    const [searchText, setSearchText] = useState("");

    const navigate = useNavigate();

    const openItem = (item) => {
        setSelectedItem(item);
        navigate("/item");
    };

    // Filter list items based on search text
    const filteredList = listItems.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div id="left-nav">
            {isDesktop && (
                <div className="chip">
                    <Link to="https://miiree12lb.site/">
                        <img src={logo} alt="logo" width="50" height="50" />
                    </Link>
                    <Link to="/" onClick={() => setSelectedItem(null)}>How To</Link>
                </div>
            )}

            {!isDesktop && (
                <Link to="https://miiree12lb.site/">
                    <img src={logo} alt="logo" width="50" height="50" />
                </Link>
            )}

            {isDesktop && (
                <input
                    type="text"
                    placeholder="search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            )}

            {isDesktop && (
                <div className="list">
                    {filteredList.map((item) => (
                        <p
                            className={`left-nav-item ${
                                selectedItem?.title === item.title ? "selected" : ""
                            }`}
                            onClick={() => openItem(item)}
                            key={item.title}
                        >
                            {item.title}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}
