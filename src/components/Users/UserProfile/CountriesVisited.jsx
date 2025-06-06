import React, { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const CountriesVisited = ({ visitedCountries = [] }) => {
  const visitedSet = useMemo(() => new Set(visitedCountries), [visitedCountries]);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const getCountryStyle = (geo) => {
    const isVisited = visitedSet.has(geo.properties.name);
    return {
      default: {
        fill: isVisited ? 'var(--primary-color)' : '#ECEFF1',
        stroke: isVisited ? 'var(--primary-color-dark)' : '#CFD8DC',
        strokeWidth: 0.5,
        outline: 'none',
      },
      hover: {
        fill: isVisited ? 'var(--primary-color-dark)' : '#CFD8DC',
        outline: 'none',
      },
      pressed: {
        fill: isVisited ? 'var(--primary-color-dark)' : '#B0BEC5',
        outline: 'none',
      },
    };
  };

  return (
    <div className="countries-visited-map-container" style={{ position: 'relative' }}>
      <ComposableMap
        projectionConfig={{ scale: 150 }}
        aria-label="Map showing countries visited by the user"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={getCountryStyle(geo)}
                onMouseEnter={() => {
                  setHoveredCountry(geo.properties.name);
                }}
                onMouseLeave={() => {
                  setHoveredCountry(null);
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip display */}
      {hoveredCountry && (
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {hoveredCountry}
        </div>
      )}
    </div>
  );
};

export default CountriesVisited;
