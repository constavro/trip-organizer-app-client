import React, { useEffect, useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";
import { feature } from "topojson-client";

// Use a more detailed map (50m resolution instead of 110m)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const TripItinerary = ({ itinerary }) => {
  const [geographies, setGeographies] = useState([]);

  // 1. Filter valid itinerary items and extract coordinates
  const validItineraryItems = useMemo(
    () =>
      itinerary.filter(
        (item) =>
          item.geoLocation &&
          item.geoLocation.lat != null &&
          item.geoLocation.lng != null
      ),
    [itinerary]
  );

  const points = useMemo(
    () =>
      validItineraryItems.map((item) => [
        item.geoLocation.lng,
        item.geoLocation.lat,
      ]),
    [validItineraryItems]
  );

  // 2. Calculate bounding box and dynamic scale for map view
  const mapView = useMemo(() => {
    if (points.length === 0) {
      return { center: [0, 0], scale: 100, zoomLevel: "world_empty" };
    }

    if (points.length === 1) {
      // Single point: center on it and zoom to a city-like level
      return {
        center: [points[0][0], points[0][1]],
        scale: 6000, // Adjust this scale as needed for single-point zoom
        zoomLevel: "single_point_city",
      };
    }

    const lats = points.map((p) => p[1]);
    const lngs = points.map((p) => p[0]);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const center = [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
    
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;

    // Determine the maximum extent of the points (in degrees).
    // Add a small epsilon if all points are coincident to prevent maxDimension from being 0.
    const maxDimension = Math.max(latDiff, lngDiff, 0.01); 

    let scale;
    let zoomLevel;

    // Define thresholds for maxDimension (in degrees) and corresponding scales.
    // These values are empirical and might need adjustment based on visual preference
    // and the specific projection used (geoEqualEarth).
    // Higher scale = more zoom.
    if (maxDimension <= 0.2) {      // Very localized, e.g., within a specific site/small town (approx < 20km span)
      scale = 8000; zoomLevel = "local_site";
    } else if (maxDimension <= 1.0) { // City level (approx < 100km span)
      scale = 5000; zoomLevel = "city";
    } else if (maxDimension <= 5.0) { // Regional / Metropolitan area (approx < 500km span)
      scale = 2000; zoomLevel = "region";
    } else if (maxDimension <= 15.0) { // Small country / Large state (approx < 1500km span)
      scale = 800;  zoomLevel = "country";
    } else if (maxDimension <= 40.0) { // Large country / Sub-continent
      scale = 400;  zoomLevel = "sub_continent";
    } else if (maxDimension <= 90.0) { // Continent
      scale = 200;  zoomLevel = "continent";
    } else {                          // Intercontinental / Global
      scale = 120;  zoomLevel = "world";
    }
    
    // Optional: Add a padding factor by slightly reducing the scale (zooming out a bit)
    // This can help ensure all points are comfortably within the viewport.
    // Example: scale *= 0.9; 

    return { center, scale, zoomLevel };
  }, [points]);


  useEffect(() => {
    fetch(geoUrl)
      .then((res) => res.json())
      .then((topology) => {
        // Ensure you're extracting the correct object, for countries-50m.json it's 'countries'
        const geoData = feature(topology, topology.objects.countries).features;
        setGeographies(geoData);
      })
      .catch(error => {
        console.error("Error fetching map data:", error);
        // Optionally set some error state here
      });
  }, []);

  if (!geographies.length && points.length > 0) return <p>Loading map...</p>;
  // If there are no points, you might want to show a different message or an empty map
  if (points.length === 0 && !geographies.length) return <p>Loading map data...</p>;
  if (points.length === 0 && geographies.length > 0) return <p>No locations to display on the map.</p>


  return (
    <div className="trip-itinerary-layout">
      <div className="itinerary-map-container">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            center: mapView.center,
            scale: mapView.scale,
          }}
          // You might want to set width and height here to ensure aspect ratio,
          // or let CSS handle it fully. For responsiveness, CSS is often better.
          // style={{ width: "100%", height: "100%" }} // Ensure map fills container
        >
          <Geographies geography={geographies}>
            {({ geographies: geos }) => // Renamed to avoid conflict with outer 'geographies'
              geos.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  // 3. Theming using CSS variables (or direct values if preferred)
                  fill="var(--map-land-fill, #EAEAEC)" // Default if CSS var not defined
                  stroke="var(--map-land-stroke, #D6D6DA)"
                  style={{
                    default: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {points.length > 1 && (
            <Line
              coordinates={points} // Draws a line through all points in order
              stroke="var(--primary-color, #2b6cb0)"
              strokeWidth={2}
              strokeLinecap="round"
            />
          )}

          {/* Render markers using validItineraryItems to ensure correct titles */}
          {validItineraryItems.map((item, index) => (
            <Marker key={`marker-${index}`} coordinates={[item.geoLocation.lng, item.geoLocation.lat]}>
              <circle
                r={5}
                fill="var(--primary-color, #2b6cb0)"
                stroke="var(--surface-color, #fff)" // Assuming --surface-color is light (e.g., white)
                strokeWidth={1}
              />
              <text
                textAnchor="middle"
                y={-10}
                style={{
                  fontFamily: "system-ui",
                  fontSize: "10px",
                  fill: "var(--text-color, #333)",
                  pointerEvents: "none", // Prevents text from interfering with map interactions
                }}
              >
                {item.title}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {/* Timeline (no changes requested, kept as is) */}
      <div className="itinerary-timeline-container">
        <div className="itinerary-timeline">
          {itinerary.map((item, index) => ( // Original itinerary for timeline
            <div key={`timeline-${index}`} className="itinerary-timeline-item">
              <div className="timeline-marker" />
              <div className="timeline-item-content">
                <h4>{item.location}</h4>
                <p className="dates">
                  {new Date(item.startDate).toLocaleDateString()} —{" "}
                  {new Date(item.endDate).toLocaleDateString()}
                </p>
                {item.notes && (
                  <p className="notes">{item.notes}</p>
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