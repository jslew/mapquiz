// InteractiveMap.jsx
import React, { useMemo, useRef, useState, useCallback } from 'react';
import { geoNaturalEarth1, geoPath, geoGraticule10, geoContains } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
// Vite/CRA will bundle this JSON directly (no fetch)
// Try this path first:
import world110m from 'world-atlas/countries-110m.json';
// If your bundler needs explicit .json import without "assert", try:
// import world110m from 'world-atlas/110m.json';
import './InteractiveMap.css';

const WIDTH = 800;
const HEIGHT = 400;

// Map TopoJSON country names to our quiz location names
const normalizeCountryName = (topoName) => {
  if (!topoName) return null;
  
  const nameMap = {
    'United States of America': 'United States',
    'United Kingdom': 'United Kingdom',
    'Russian Federation': 'Russia',
    'Korea, Republic of': 'South Korea',
    'Korea, Democratic People\'s Republic of': 'North Korea',
    'Viet Nam': 'Vietnam',
    'Republic of South Africa': 'South Africa',
    'Saudi Arabia': 'Saudi Arabia',
    'United Arab Emirates': 'United Arab Emirates',
  };
  
  return nameMap[topoName] || topoName;
};

export default function InteractiveMap({
  mode,
  clickedMarkers,
  onMapClick,
  selectedLocationName,
}) {
  // Pan/zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const draggedRef = useRef(false);

  // Build projection + path
  const { projection, pathGenerator, graticule } = useMemo(() => {
    const proj = geoNaturalEarth1()
      .scale(160 * zoom)                // baseline world scale with zoom
      .translate([WIDTH / 2 + pan.x, HEIGHT / 2 + pan.y]);  // center with pan
  
    const path = geoPath(proj);
    const grat = geoGraticule10();
  
    return { projection: proj, pathGenerator: path, graticule: grat };
  }, [zoom, pan.x, pan.y]);
  

  // Convert TopoJSON → GeoJSON
  const { countries, borders, countryFeatures } = useMemo(() => {
    // world-atlas/110m.json typically has objects: { land, countries, ... }
    const obj = world110m.objects?.countries || world110m.objects?.land;
    const f = feature(world110m, obj);
    const m = obj ? mesh(world110m, obj, (a, b) => a !== b) : null;
    
    // Get individual country features for click detection
    const features = f.features || [];
    
    return { countries: f, borders: m, countryFeatures: features };
  }, []);

  const renderClickedMarker = (marker, index) => {
    const lon = marker.lon;
    const lat = marker.lat;
    if (lon == null || lat == null) return null;
    const [x, y] = projection([lon, lat]);
    
    return (
      <g key={index} className={`location-marker ${marker.type}`}>
        <circle
          cx={x}
          cy={y}
          r={6}
          className={`marker-circle ${marker.type}`}
        />
        <text x={x} y={y - 12} textAnchor="middle" className={`marker-label ${marker.type}`} fontSize="10">
          {marker.name}
        </text>
      </g>
    );
  };

  // Handle click on the map
  const handleSvgClick = useCallback((e) => {
    if (draggedRef.current || !onMapClick) return;
    draggedRef.current = false;
    
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert SVG coordinates to viewBox coordinates
    const viewBoxWidth = WIDTH;
    const viewBoxHeight = HEIGHT;
    const scaleX = viewBoxWidth / rect.width;
    const scaleY = viewBoxHeight / rect.height;
    const viewBoxX = x * scaleX;
    const viewBoxY = y * scaleY;
    
    // Convert to geographic coordinates
    const coords = projection.invert([viewBoxX, viewBoxY]);
    if (!coords) return;
    
    const [lon, lat] = coords;
    
    // Find which country was clicked
    let clickedCountry = null;
    if (mode === 'countries') {
      for (const feat of countryFeatures) {
        if (geoContains(feat, [lon, lat])) {
          const topoName = feat.properties?.name;
          clickedCountry = normalizeCountryName(topoName);
          break;
        }
      }
    }
    
    onMapClick(lon, lat, clickedCountry);
  }, [projection, onMapClick, countryFeatures, mode]);

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    // Get mouse position in SVG coordinates
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Convert to viewBox coordinates
    const scaleX = WIDTH / rect.width;
    const scaleY = HEIGHT / rect.height;
    const viewBoxX = mouseX * scaleX;
    const viewBoxY = mouseY * scaleY;
    
    const factor = Math.exp(-e.deltaY * 0.0015);
    const newZoom = clamp(zoom * factor, 0.6, 6);
    
    // Calculate the pan adjustment to zoom towards the cursor
    // The point under the cursor should remain stationary
    const zoomRatio = newZoom / zoom;
    const newPanX = viewBoxX - (viewBoxX - pan.x - WIDTH / 2) * zoomRatio - WIDTH / 2;
    const newPanY = viewBoxY - (viewBoxY - pan.y - HEIGHT / 2) * zoomRatio - HEIGHT / 2;
    
    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  }, [zoom, pan.x, pan.y]);

  const handleMouseDown = useCallback((e) => {
    draggingRef.current = true;
    draggedRef.current = false;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      draggedRef.current = true;
    }
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  const endDrag = useCallback(() => {
    draggingRef.current = false;
  }, []);

  return (
    <div className="interactive-map">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="world-map"
        preserveAspectRatio="xMidYMid meet"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onClick={handleSvgClick}
        style={{ cursor: draggingRef.current ? 'grabbing' : (selectedLocationName ? 'crosshair' : 'grab') }}
      >
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="#e6f3ff" stroke="#b3d9ff" strokeWidth="2" />
        <g className="grid" opacity="0.25">
          <path d={pathGenerator(graticule)} fill="none" stroke="#ccc" strokeWidth="0.5" />
        </g>
        {countries && (
          <g className="countries">
            <path d={pathGenerator(countries)} fill="#f0f8ff" stroke="#87ceeb" strokeWidth="0.6" />
            {borders && (
              <path
                d={pathGenerator(borders)}
                fill="none"
                stroke="#7fb3d5"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </g>
        )}
        <g className="location-markers">
          {Array.isArray(clickedMarkers) && clickedMarkers.map(renderClickedMarker)}
        </g>
      </svg>

      <div className="map-legend">
        <h4>Legend:</h4>
        <div className="legend-items">
          <div className="legend-item"><div className="legend-marker correct"></div><span>Correct</span></div>
          <div className="legend-item"><div className="legend-marker incorrect"></div><span>Incorrect</span></div>
          {mode === 'cities' && (
            <div className="legend-item"><div className="legend-marker near-miss"></div><span>Right country</span></div>
          )}
          <div className="legend-item"><div className="legend-marker answer"></div><span>Answer</span></div>
        </div>
      </div>
    </div>
  );
}
