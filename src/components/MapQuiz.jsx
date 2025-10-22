import React, { useState, useEffect, useCallback } from 'react';
import InteractiveMap from './InteractiveMap';
import WordBank from './WordBank';
import ScoreDisplay from './ScoreDisplay';
import './MapQuiz.css';

const MapQuiz = ({ mode, onBackToMenu, locations }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [answeredLocations, setAnsweredLocations] = useState(new Set());
  const [correctAnswers, setCorrectAnswers] = useState(new Set());
  const [incorrectAnswers, setIncorrectAnswers] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const resetQuiz = useCallback(() => {
    setSelectedLocation(null);
    setAnsweredLocations(new Set());
    setCorrectAnswers(new Set());
    setIncorrectAnswers(new Set());
    setShowHint(false);
    setQuizComplete(false);
    setScore(0);
    setAttempts(prev => prev + 1);
  }, []);

  const handleLocationClick = (location) => {
    if (answeredLocations.has(location.name)) return;
    setSelectedLocation(location);
    setShowHint(false);
  };

  const handleAnswer = (answer) => {
    if (!selectedLocation) return;

    const isCorrect = answer === selectedLocation.name;
    
    const newAnsweredLocations = new Set([...answeredLocations, selectedLocation.name]);
    
    if (isCorrect) {
      setCorrectAnswers(prev => new Set([...prev, selectedLocation.name]));
      setScore(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => new Set([...prev, selectedLocation.name]));
    }
    
    setAnsweredLocations(newAnsweredLocations);
    setSelectedLocation(null);
    setShowHint(false);

    // Check if quiz is complete
    if (newAnsweredLocations.size === locations.length) {
      setTimeout(() => setQuizComplete(true), 500);
    }
  };

  const toggleHint = () => {
    setShowHint(prev => !prev);
  };

  const getHint = () => {
    if (!selectedLocation) return '';
    const name = selectedLocation.name;
    return `Hint: ${name.charAt(0)}${'*'.repeat(name.length - 2)}${name.charAt(name.length - 1)}`;
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
            locations={locations}
            answeredLocations={answeredLocations}
            correctAnswers={correctAnswers}
            incorrectAnswers={incorrectAnswers}
            onLocationClick={handleLocationClick}
            selectedLocation={selectedLocation}
          />
        </div>

        <div className="quiz-panel">
          {selectedLocation && !answeredLocations.has(selectedLocation.name) && (
            <div className="location-info">
              <h3>Selected Location</h3>
              <p>Click on the map to select: <strong>{selectedLocation.name}</strong></p>
              
              <div className="hint-section">
                <button 
                  className="hint-button" 
                  onClick={toggleHint}
                  disabled={showHint}
                >
                  💡 {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                {showHint && (
                  <div className="hint-text">
                    {getHint()}
                  </div>
                )}
              </div>
            </div>
          )}

          <WordBank
            locations={locations}
            answeredLocations={answeredLocations}
            onAnswer={handleAnswer}
            selectedLocation={selectedLocation}
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
