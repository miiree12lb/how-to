import React, { useState } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const visitedCountries = [
  "United States of America", "Spain", "France", "Italy", "Germany", "United Kingdom",
  "Belgium", "Ireland", "Netherlands", "Switzerland", "Norway", "Sweden", "Turkey", "Greece",
  "Croatia", "Slovenia", "Luxembourg", "Monaco", "Andorra", "Portugal"
];

export default function WorldMap() {
  const [clickedCountry, setClickedCountry] = useState("");

  const handleCountryClick = (name) => {
    setClickedCountry(name);
  };

  return (
    <>
      <h1>World Map</h1>
      <div id="world-map">
        <ComposableMap className="composable-map">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleCountryClick(geo.properties.name)}
                  style={{
                    default: {
                      fill: visitedCountries.includes(geo.properties.name)
                        ? "#94692D"
                        : "#ECEFF1",
                      outline: "none",
                    },
                    hover: { fill: "#FF4136", outline: "none" },
                    pressed: { fill: "#292929", outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>

        <div id="map-info">
        <div>
            <b>Last country you clicked: </b> {clickedCountry}
          </div>

          <div>
            <b>Visited countries: </b>
            {visitedCountries.map((country, idx) => (
              country + (idx !== visitedCountries.length - 1 ? ", " : "")
            ))}
          </div>
        </div>
          
      </div>
    </>
  );
}