// InteractiveMap.jsx
import React, { useMemo, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3-geo';
import { feature, mesh } from 'topojson-client';
// Vite/CRA will bundle this JSON directly (no fetch)
// Try this path first:
import world110m from 'world-atlas/countries-110m.json';
// If your bundler needs explicit .json import without "assert", try:
// import world110m from 'world-atlas/110m.json';
import './InteractiveMap.css';

const WIDTH = 800;
const HEIGHT = 400;

export default function InteractiveMap({
  locations,
  answeredLocations,
  correctAnswers,
  incorrectAnswers,
  onLocationClick,
  selectedLocation,
}) {
  // Pan/zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Build projection + path
  const { projection, geoPath, graticule } = useMemo(() => {
    const proj = d3.geoNaturalEarth1()
      .scale(160 * zoom)                // baseline world scale with zoom
      .translate([WIDTH / 2 + pan.x, HEIGHT / 2 + pan.y]);  // center with pan
  
    const path = d3.geoPath(proj);
    const graticule = d3.geoGraticule10();
  
    return { projection: proj, geoPath: path, graticule };
  }, [zoom, pan.x, pan.y]);
  

  // Convert TopoJSON → GeoJSON
  const { countries, borders } = useMemo(() => {
    // world-atlas/110m.json typically has objects: { land, countries, ... }
    const obj = world110m.objects?.countries || world110m.objects?.land;
    const f = feature(world110m, obj);
    const m = obj ? mesh(world110m, obj, (a, b) => a !== b) : null;
    return { countries: f, borders: m };
  }, []);

  const getLocationStatus = (name) => {
    if (correctAnswers?.has(name)) return 'correct';
    if (incorrectAnswers?.has(name)) return 'incorrect';
    if (selectedLocation?.name === name) return 'selected';
    return 'unanswered';
  };

  const renderLocationMarker = (loc) => {
    const lon = loc.lon ?? loc.x;
    const lat = loc.lat ?? loc.y;
    if (lon == null || lat == null) return null;
    const [x, y] = projection([lon, lat]);
    const status = getLocationStatus(loc.name);
    return (
      <g key={loc.name} className={`location-marker ${status}`}>
        <circle
          cx={x}
          cy={y}
          r={status === 'selected' ? 8 : 6}
          onClick={() => {
            if (onLocationClick) {
              onLocationClick(loc);
            }
          }}
          className={`marker-circle ${status}`}
        />
        {(status === 'correct' || status === 'incorrect') && (
          <text x={x} y={y - 12} textAnchor="middle" className={`marker-label ${status}`} fontSize="10">
            {loc.name}
          </text>
        )}
      </g>
    );
  };

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * 0.0015);
    setZoom((z) => clamp(z * factor, 0.6, 6));
  }, []);

  const handleMouseDown = useCallback((e) => {
    draggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
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
        style={{ cursor: draggingRef.current ? 'grabbing' : 'grab' }}
      >
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="#e6f3ff" stroke="#b3d9ff" strokeWidth="2" />
        <g className="grid" opacity="0.25">
          <path d={geoPath(graticule)} fill="none" stroke="#ccc" strokeWidth="0.5" />
        </g>
        {countries && (
          <g className="countries">
            <path d={geoPath(countries)} fill="#f0f8ff" stroke="#87ceeb" strokeWidth="0.6" />
            {borders && (
              <path
                d={geoPath(borders)}
                fill="none"
                stroke="#7fb3d5"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </g>
        )}
        <g className="location-markers">{Array.isArray(locations) && locations.map(renderLocationMarker)}</g>
      </svg>

      <div className="map-legend">
        <h4>Legend:</h4>
        <div className="legend-items">
          <div className="legend-item"><div className="legend-marker unanswered"></div><span>Not answered</span></div>
          <div className="legend-item"><div className="legend-marker selected"></div><span>Selected</span></div>
          <div className="legend-item"><div className="legend-marker correct"></div><span>Correct</span></div>
          <div className="legend-item"><div className="legend-marker incorrect"></div><span>Incorrect</span></div>
        </div>
      </div>
    </div>
  );
}
