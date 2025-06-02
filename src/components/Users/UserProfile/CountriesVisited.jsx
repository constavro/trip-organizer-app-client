// src/components/Users/UserProfile/CountriesVisited.jsx
import React, { useMemo } from 'react'; // Added useMemo for performance
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
// CSS is imported by UserProfile.jsx or ProfileDetails.jsx

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const CountriesVisited = ({ visitedCountries = [] }) => {
  // Memoize visited countries set for performance, prevents re-creating on every render
  const visitedSet = useMemo(() => new Set(visitedCountries), [visitedCountries]);

  const getCountryStyle = (geo) => {
    const isVisited = visitedSet.has(geo.properties.name);
    return {
      default: {
        fill: isVisited ? 'var(--primary-color)' : '#ECEFF1', // Use CSS variable
        stroke: isVisited ? 'var(--primary-color-dark)' : '#CFD8DC', // Add subtle stroke
        strokeWidth: 0.5,
        outline: 'none',
      },
      hover: {
        fill: isVisited ? 'var(--primary-color-dark)' : '#CFD8DC', // Darken on hover
        outline: 'none',
      },
      pressed: {
        fill: isVisited ? 'var(--primary-color-dark)' : '#B0BEC5',
        outline: 'none',
      },
    };
  };


  return (
    <div className="countries-visited-map-container">
      <ComposableMap
        projectionConfig={{ scale: 150 }} // Adjusted scale slightly
        aria-label="Map showing countries visited by the user" // Accessibility
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={getCountryStyle(geo)}
                // UX: Add a title for tooltip on hover
                onMouseEnter={() => {
                  // Potentially set a state to show country name if desired
                  // console.log(geo.properties.name);
                }}
                onMouseLeave={() => {
                  // Clear country name state
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default CountriesVisited;