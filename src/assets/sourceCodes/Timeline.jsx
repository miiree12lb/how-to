import React, { useState } from "react";
import "../styles/timeline.css";

export default function Timeline() {
  const currentYear = new Date().getFullYear();

  const experiences = [
    { title: "M.A.C.S", startTime: 2024, endTime: 2024, type: "work"},
    { title: "GoStudent", startTime: 2022, endTime: currentYear, type: "work" },
    { title: "OIFem", startTime: 2022, endTime: currentYear, type: "volunteer" },
    { title: "Repair of Computers", startTime: 2021, endTime: 2021, type: "volunteer"},
    { title: "Repair of Phones", startTime: 2020, endTime: 2020, type: "volunteer" },
  ];

  const minYear = Math.min(...experiences.map((exp) => exp.startTime));
  const maxYear = Math.max(...experiences.map((exp) => exp.endTime));
  const totalYears = maxYear - minYear + 1;

  return (
    <>
      <h1>Timeline</h1>
      <div className="timeline-container">
        <div className="timeline-grid">
          {experiences.map((exp, index) => {
            const startColumn = exp.startTime - minYear + 1;
            const spanColumns = exp.endTime - exp.startTime + 1;

            return (
              <div
                key={index}
                className={`timeline-grid-item ${exp.type}`}
                style={{
                  gridColumn: `${startColumn} / span ${spanColumns}`,
                  gridRow: `${index + 1}`,
                }}
              >
                {exp.title}
              </div>
            );
          })}

          {/* Years row */}
          {Array.from({ length: totalYears }, (_, i) => (
            <div
              key={`year-${i}`}
              className="timeline-year"
              style={{ gridColumn: `${i + 1}`, gridRow: experiences.length + 1 }}
            >
              {minYear + i}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}