import React, { useState } from 'react';
import './WordBank.css';

const WordBank = ({ locations, answeredLocations, onLocationSelect, selectedLocationName }) => {
  const [shuffledLocations, setShuffledLocations] = useState(
    locations && locations.length > 0 ? [...locations].sort(() => Math.random() - 0.5) : []
  );

  // Shuffle locations when component mounts or locations change
  React.useEffect(() => {
    if (locations && locations.length > 0) {
      const shuffled = [...locations].sort(() => Math.random() - 0.5);
      setShuffledLocations(shuffled);
    }
  }, [locations]);

  const handleLocationClick = (locationName) => {
    if (answeredLocations.has(locationName)) {
      return;
    }
    onLocationSelect(locationName);
  };

  const shuffleAnswers = () => {
    const shuffled = [...locations].sort(() => Math.random() - 0.5);
    setShuffledLocations(shuffled);
  };

  return (
    <div className="word-bank">
      <div className="word-bank-header">
        <h3>Word Bank</h3>
        <button 
          className="shuffle-button" 
          onClick={shuffleAnswers}
          title="Shuffle answers"
        >
          🔀 Shuffle
        </button>
      </div>
      
      <div className="word-bank-content">
        {shuffledLocations.map((location) => {
          const isAnswered = answeredLocations.has(location.name);
          const isSelected = selectedLocationName === location.name;
          
          return (
            <button
              key={location.name}
              className={`word-button${isAnswered ? ' answered' : ''}${isSelected ? ' selected' : ''}`}
              onClick={() => handleLocationClick(location.name)}
              disabled={isAnswered}
            >
              {location.name}
            </button>
          );
        })}
      </div>
      
      <div className="word-bank-stats">
        <div className="stat">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{locations.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Answered:</span>
          <span className="stat-value">{answeredLocations.size}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Remaining:</span>
          <span className="stat-value">{locations.length - answeredLocations.size}</span>
        </div>
      </div>
      
      {selectedLocationName && !answeredLocations.has(selectedLocationName) && (
        <div className="selection-instruction">
          <p>📍 Now click on the map to place {selectedLocationName}</p>
        </div>
      )}
      
      {!selectedLocationName && (
        <div className="selection-instruction">
          <p>🎯 Select a location from above to start</p>
        </div>
      )}
    </div>
  );
};

export default WordBank;
