import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/pagination.css";

export default function HowTo({ listItems, selectedItem, setSelectedItem }) {
    const navigate = useNavigate();
    const [list, setList] = useState(listItems);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        setSelectedItem(null)
    }, [])

    // Shuffle list on mount
    useEffect(() => {
        const shuffleList = () => {
            const shuffled = [...list];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            setList(shuffled);
        };
        shuffleList();
    }, [listItems]);

    const openItem = (item) => {
        setSelectedItem(item);
        navigate("/item");
    };

    // Calculate the indices for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

    // Pagination controls
    const totalPages = Math.ceil(list.length / itemsPerPage);
    const goToPage = (page) => setCurrentPage(page);
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return (
        <div className="how-to">
            <h1>React How To</h1>

            <div className="items-list">
                {currentItems.map((item, index) => (
                    <div key={index} className="item">
                        {item.component}
                        <div className="how-to-button">
                            <button onClick={() => openItem(item)}>How to</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>
                    &laquo;
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => goToPage(index + 1)}
                        className={currentPage === index + 1 ? "active" : ""}
                    >
                        {index + 1}
                    </button>
                ))}
                <button onClick={nextPage} disabled={currentPage === totalPages}>
                    &raquo;
                </button>
            </div>
        </div>
    );
}
