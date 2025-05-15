import React, { useEffect, useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";
import { feature } from "topojson-client";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const TripItinerary = ({ itinerary }) => {
  const [geographies, setGeographies] = useState([]);

  // Extract coordinates (lat, lng) from itinerary
  const points = useMemo(
    () => itinerary.map((item) => [item.geoLocation.lng, item.geoLocation.lat]),
    [itinerary]
  );

  // Calculate the min/max lat and lng for bounding box
  const mapView = useMemo(() => {
    if (points.length === 0) return { center: [0, 0], zoom: 1 };

    const lats = points.map((p) => p[1]);
    const lngs = points.map((p) => p[0]);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Calculate center and extent for better zooming
    const center = [(minLng + maxLng) / 2, (minLat + maxLat) / 2];

    // Calculate the width and height of the bounding box (based on lat/lng diff)
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const padding = 0; // Optional: padding around the bounding box to prevent clipping

    // Set zoom level based on the difference between latitudes and longitudes
    const zoom = Math.max(1, Math.min(5000, Math.max(latDiff, lngDiff)));

    return {
      center,
      zoom,
      bounds: {
        minLat: minLat - padding,
        maxLat: maxLat + padding,
        minLng: minLng - padding,
        maxLng: maxLng + padding,
      },
    };
  }, [points]);

  useEffect(() => {
    fetch(geoUrl)
      .then((res) => res.json())
      .then((topology) => {
        const geoData = feature(topology, topology.objects.countries).features;
        setGeographies(geoData);
      });
  }, []);

  if (!geographies.length) return <p>Loading map...</p>;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      <div className="w-full md:w-2/3 h-[500px]">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ center: mapView.center,scale: 1000}}
          width={800}
          height={500}
        >
          <Geographies geography={geographies}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#EAEAEC"
                  stroke="#D6D6DA"
                />
              ))
            }
          </Geographies>

          {/* Render the line connecting the itinerary points */}
          {points.length > 1 && (
            <Line
              from={points[0]}
              to={points[points.length - 1]}
              coordinates={points}
              stroke="#2b6cb0"
              strokeWidth={2}
              strokeLinecap="round"
            />
          )}

          {/* Render markers at each itinerary point */}
          {points.map((coords, index) => (
            <Marker key={index} coordinates={coords}>
              <circle r={5} fill="#2b6cb0" stroke="#fff" strokeWidth={1} />
              <text
                textAnchor="middle"
                y={-10}
                style={{ fontFamily: "system-ui", fontSize: "10px", fill: "#333" }}
              >
                {itinerary[index].title}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {/* Timeline */}
      <div className="w-full md:w-1/3">
  <div className="relative border-l-2 border-gray-300 pl-4 space-y-6">
    {itinerary.map((item, index) => (
      <div key={index} className="relative">
        <div className="absolute left-[-10px] top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
        <div>
          <h4 className="font-semibold">{item.location}</h4>
          <p className="text-sm text-gray-600">
            {new Date(item.startDate).toLocaleDateString()} —{" "}
            {new Date(item.endDate).toLocaleDateString()}
          </p>
          {item.notes && (
            <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default TripItinerary;
