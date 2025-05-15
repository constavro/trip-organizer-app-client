import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";


const CountriesVisited = ({ visitedCountries = [] }) => {
  const getCountryStyle = (geo) => {
    const isVisited = visitedCountries.includes(geo.properties.name);
    return {
      default: {
        fill: isVisited ? '#00A99D' : '#ECEFF1',
        outline: 'none',
      },
      hover: {
        fill: isVisited ? '#007D74' : '#CFD8DC',
        outline: 'none',
      },
      pressed: {
        fill: '#FF5722',
        outline: 'none',
      },
    };
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
      <ComposableMap projectionConfig={{ scale: 140 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={getCountryStyle(geo)}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default CountriesVisited;
