import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./css/leftnav.css";
import logo from "./assets/images/logo.png";
import search from "./assets/images/icons/search.png";
import close from "./assets/images/icons/close.png";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export default function Navbar({ listItems, selectedItem, setSelectedItem }) {
    const isDesktop = useMediaQuery({ query: "(min-width: 801px)" });
    const [searchText, setSearchText] = useState("");
    const [showList, setShowList] = useState(false);

    const navigate = useNavigate();

    const openItem = (item) => {
        setSelectedItem(item);
        navigate("/item");
    };

    const filteredList = listItems.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className={`left-nav ${showList ? "list" : ""}`}>
            {isDesktop && (
                <div className="chip">
                    <Link to="https://miiree12lb.site/">
                        <img src={logo} alt="logo" width="50" height="50" />
                    </Link>
                    <Link to="/" onClick={() => setSelectedItem(null)}>How To</Link>
                </div>
            )}

            {!isDesktop && !showList && (
                <div className="icons">
                    <Link to="https://miiree12lb.site/">
                        <img src={logo} alt="logo" width="50" height="50" />
                    </Link>

                    <img src={search} alt="search" width="30" height="30" onClick={() => setShowList(true)} />
                </div>
            )}

            {!isDesktop && showList &&
                <div className="search-bar">
                    <img src={close} alt="close" width="30" height="30" onClick={() => setShowList(false)} />
                    <input
                        type="text"
                        placeholder="search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            }

            {isDesktop && (
                <input
                    type="text"
                    placeholder="search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            )}

            {(isDesktop || showList) && (
                <div className="list" onClick={() => setShowList(false)}>
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
