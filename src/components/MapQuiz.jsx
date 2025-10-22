import React, { useState, useEffect, useCallback } from 'react';
import InteractiveMap from './InteractiveMap';
import WordBank from './WordBank';
import ScoreDisplay from './ScoreDisplay';
import './MapQuiz.css';

const MapQuiz = ({ mode, onBackToMenu, locations }) => {
  const [selectedLocationName, setSelectedLocationName] = useState(null);
  const [answeredLocations, setAnsweredLocations] = useState(new Set());
  const [correctAnswers, setCorrectAnswers] = useState(new Set());
  const [incorrectAnswers, setIncorrectAnswers] = useState(new Set());
  const [clickedMarkers, setClickedMarkers] = useState([]); // {lon, lat, type: 'correct'|'incorrect'|'answer'}
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const resetQuiz = useCallback(() => {
    setSelectedLocationName(null);
    setAnsweredLocations(new Set());
    setCorrectAnswers(new Set());
    setIncorrectAnswers(new Set());
    setClickedMarkers([]);
    setQuizComplete(false);
    setScore(0);
    setAttempts(prev => prev + 1);
  }, []);

  // User selects a location name from the word bank
  const handleLocationSelect = (locationName) => {
    if (answeredLocations.has(locationName)) return;
    setSelectedLocationName(locationName);
  };

  // Calculate distance between two points in nautical miles
  const calculateDistance = (lon1, lat1, lon2, lat2) => {
    const R = 3440.065; // Earth's radius in nautical miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // User clicks on the map
  const handleMapClick = (lon, lat, countryName) => {
    if (!selectedLocationName) return;
    
    const selectedLocation = locations.find(loc => loc.name === selectedLocationName);
    if (!selectedLocation) return;

    let isCorrect = false;
    let markerType = 'incorrect';
    
    if (mode === 'countries') {
      // Check if clicked within the correct country
      isCorrect = countryName === selectedLocationName;
    } else {
      // For cities, check if within 200 nm
      const distance = calculateDistance(lon, lat, selectedLocation.x, selectedLocation.y);
      isCorrect = distance <= 200;
      
      // If wrong distance but right country, use yellow marker
      if (!isCorrect && selectedLocation.country && countryName === selectedLocation.country) {
        markerType = 'near-miss';
      }
    }

    const newAnsweredLocations = new Set([...answeredLocations, selectedLocationName]);
    
    if (isCorrect) {
      setCorrectAnswers(prev => new Set([...prev, selectedLocationName]));
      setScore(prev => prev + 1);
      setClickedMarkers(prev => [...prev, { lon, lat, type: 'correct', name: selectedLocationName }]);
    } else {
      setIncorrectAnswers(prev => new Set([...prev, selectedLocationName]));
      setClickedMarkers(prev => [...prev, { lon, lat, type: markerType, name: selectedLocationName }]);
    }
    
    setAnsweredLocations(newAnsweredLocations);
    setSelectedLocationName(null);

    // Check if quiz is complete
    if (newAnsweredLocations.size === locations.length) {
      setTimeout(() => setQuizComplete(true), 500);
    }
  };

  const handleShowAnswer = () => {
    if (!selectedLocationName) return;
    
    const selectedLocation = locations.find(loc => loc.name === selectedLocationName);
    if (!selectedLocation) return;

    const newAnsweredLocations = new Set([...answeredLocations, selectedLocationName]);
    setIncorrectAnswers(prev => new Set([...prev, selectedLocationName]));
    setClickedMarkers(prev => [...prev, { 
      lon: selectedLocation.x, 
      lat: selectedLocation.y, 
      type: 'answer', 
      name: selectedLocationName 
    }]);
    setAnsweredLocations(newAnsweredLocations);
    setSelectedLocationName(null);

    // Check if quiz is complete
    if (newAnsweredLocations.size === locations.length) {
      setTimeout(() => setQuizComplete(true), 500);
    }
  };

  const getCompletionPercentage = () => {
    return Math.round((answeredLocations.size / locations.length) * 100);
  };

  return (
    <div className="map-quiz">
      <header className="quiz-header">
        <button className="back-button" onClick={onBackToMenu}>
          ← Back to Menu
        </button>
        <h1>
          {mode === 'countries' ? '🌍' : '🏙️'} 
          {mode === 'countries' ? 'Countries' : 'Cities'} Quiz
        </h1>
        <div className="quiz-stats">
          <span>Score: {score}/{locations.length}</span>
          <span>Progress: {getCompletionPercentage()}%</span>
          <span>Attempt: #{attempts + 1}</span>
        </div>
      </header>

      <div className="quiz-content">
        <div className="map-container">
          <InteractiveMap
            mode={mode}
            clickedMarkers={clickedMarkers}
            onMapClick={handleMapClick}
            selectedLocationName={selectedLocationName}
          />
        </div>

        <div className="quiz-panel">
          {selectedLocationName && !answeredLocations.has(selectedLocationName) && (
            <div className="location-info">
              <h3>Selected: {selectedLocationName}</h3>
              <p>
                {mode === 'countries' 
                  ? 'Click within the border of this country on the map' 
                  : 'Click within 200 nm of this city on the map'}
              </p>
              
              <div className="hint-section">
                <button 
                  className="hint-button" 
                  onClick={handleShowAnswer}
                >
                  💡 Show Answer
                </button>
              </div>
            </div>
          )}

          <WordBank
            locations={locations}
            answeredLocations={answeredLocations}
            onLocationSelect={handleLocationSelect}
            selectedLocationName={selectedLocationName}
          />

          <div className="quiz-actions">
            <button 
              className="reset-button" 
              onClick={resetQuiz}
              disabled={answeredLocations.size === 0}
            >
              🔄 Reset Quiz
            </button>
          </div>
        </div>
      </div>

      {quizComplete && (
        <div className="quiz-complete-overlay">
          <div className="quiz-complete-modal">
            <h2>🎉 Quiz Complete!</h2>
            <div className="final-score">
              <p>Final Score: <strong>{score}/{locations.length}</strong></p>
              <p>Accuracy: <strong>{Math.round((score / locations.length) * 100)}%</strong></p>
            </div>
            <div className="completion-actions">
              <button className="retake-button" onClick={resetQuiz}>
                🔄 Retake Quiz
              </button>
              <button className="menu-button" onClick={onBackToMenu}>
                🏠 Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapQuiz;
