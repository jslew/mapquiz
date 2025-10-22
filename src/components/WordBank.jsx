import React, { useState } from 'react';
import './WordBank.css';

const WordBank = ({ locations, answeredLocations, onAnswer, selectedLocation }) => {
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

  const handleAnswerClick = (locationName) => {
    if (!selectedLocation || answeredLocations.has(selectedLocation.name)) {
      return;
    }
    onAnswer(locationName);
  };

  const getButtonStatus = (locationName) => {
    if (answeredLocations.has(locationName)) {
      return 'answered';
    }
    if (selectedLocation?.name === locationName) {
      return 'selected';
    }
    return 'available';
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
          const status = getButtonStatus(location.name);
          const isDisabled = !selectedLocation || answeredLocations.has(selectedLocation.name);
          
          return (
            <button
              key={location.name}
              className={`word-button ${status}`}
              onClick={() => handleAnswerClick(location.name)}
              disabled={isDisabled}
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
      
      {selectedLocation && !answeredLocations.has(selectedLocation.name) && (
        <div className="selection-instruction">
          <p>💡 Click on <strong>{selectedLocation.name}</strong> in the word bank to answer</p>
        </div>
      )}
      
      {!selectedLocation && (
        <div className="selection-instruction">
          <p>🎯 Click on a location on the map to start answering</p>
        </div>
      )}
    </div>
  );
};

export default WordBank;
