import React from 'react';
import { convertToSVG } from '../data/locations';
import './InteractiveMap.css';

const InteractiveMap = ({ 
  locations, 
  answeredLocations, 
  correctAnswers, 
  incorrectAnswers, 
  onLocationClick, 
  selectedLocation 
}) => {
  const handleLocationClick = (location) => {
    onLocationClick(location);
  };

  const getLocationStatus = (locationName) => {
    if (correctAnswers.has(locationName)) return 'correct';
    if (incorrectAnswers.has(locationName)) return 'incorrect';
    if (selectedLocation?.name === locationName) return 'selected';
    return 'unanswered';
  };

  const renderLocationMarker = (location) => {
    const { x, y } = convertToSVG(location.x, location.y);
    const status = getLocationStatus(location.name);
    
    return (
      <g key={location.name} className={`location-marker ${status}`}>
        <circle
          cx={x}
          cy={y}
          r={status === 'selected' ? 8 : 6}
          onClick={() => handleLocationClick(location)}
          className={`marker-circle ${status}`}
        />
        <text
          x={x}
          y={y - 12}
          textAnchor="middle"
          className={`marker-label ${status}`}
          fontSize="10"
        >
          {location.name}
        </text>
      </g>
    );
  };

  return (
    <div className="interactive-map">
      <svg 
        viewBox="0 0 800 400" 
        className="world-map"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Simple world map background */}
        <rect 
          x="0" 
          y="0" 
          width="800" 
          height="400" 
          fill="#e6f3ff" 
          stroke="#b3d9ff" 
          strokeWidth="2"
        />
        
        {/* Continent outlines (simplified) */}
        <g className="continents">
          {/* North America */}
          <path 
            d="M 50 100 L 200 80 L 250 120 L 200 200 L 100 180 L 50 100 Z" 
            fill="#f0f8ff" 
            stroke="#87ceeb" 
            strokeWidth="1"
          />
          
          {/* South America */}
          <path 
            d="M 150 200 L 200 180 L 220 280 L 180 300 L 150 200 Z" 
            fill="#f0f8ff" 
            stroke="#87ceeb" 
            strokeWidth="1"
          />
          
          {/* Europe */}
          <path 
            d="M 350 80 L 450 70 L 480 120 L 450 140 L 380 130 L 350 80 Z" 
            fill="#f0f8ff" 
            stroke="#87ceeb" 
            strokeWidth="1"
          />
          
          {/* Africa */}
          <path 
            d="M 380 140 L 450 130 L 480 200 L 450 280 L 400 270 L 380 140 Z" 
            fill="#f0f8ff" 
            stroke="#87ceeb" 
            strokeWidth="1"
          />
          
          {/* Asia */}
          <path 
            d="M 450 70 L 650 60 L 700 100 L 680 180 L 600 200 L 500 150 L 450 70 Z" 
            fill="#f0f8ff" 
            stroke="#87ceeb" 
            strokeWidth="1"
          />
          
          {/* Australia */}
          <path 
            d="M 600 250 L 700 240 L 720 300 L 650 320 L 600 250 Z" 
            fill="#f0f8ff" 
            stroke="#87ceeb" 
            strokeWidth="1"
          />
        </g>
        
        {/* Location markers */}
        <g className="location-markers">
          {locations.map(renderLocationMarker)}
        </g>
        
        {/* Grid lines for reference */}
        <g className="grid" opacity="0.3">
          {/* Vertical lines */}
          {Array.from({ length: 9 }, (_, i) => (
            <line 
              key={`v-${i}`} 
              x1={i * 100} 
              y1="0" 
              x2={i * 100} 
              y2="400" 
              stroke="#ccc" 
              strokeWidth="0.5"
            />
          ))}
          
          {/* Horizontal lines */}
          {Array.from({ length: 5 }, (_, i) => (
            <line 
              key={`h-${i}`} 
              x1="0" 
              y1={i * 100} 
              x2="800" 
              y2={i * 100} 
              stroke="#ccc" 
              strokeWidth="0.5"
            />
          ))}
        </g>
      </svg>
      
      <div className="map-legend">
        <h4>Legend:</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-marker unanswered"></div>
            <span>Not answered</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker correct"></div>
            <span>Correct</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker incorrect"></div>
            <span>Incorrect</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
