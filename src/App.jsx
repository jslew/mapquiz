import React, { useState, useEffect } from 'react';
import './App.css';
import MapQuiz from './components/MapQuiz';
import { countries, cities } from './data/locations';

function App() {
  const [quizMode, setQuizMode] = useState(null); // 'countries' or 'cities'
  const [showModeSelection, setShowModeSelection] = useState(true);

  const handleModeSelect = (mode) => {
    setQuizMode(mode);
    setShowModeSelection(false);
  };

  const handleBackToMenu = () => {
    setQuizMode(null);
    setShowModeSelection(true);
  };

  if (showModeSelection) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>🗺️ MapQuiz</h1>
          <p>Test your geography knowledge!</p>
        </header>
        
        <main className="app-main">
          <div className="mode-selection">
            <h2>Choose Your Quiz Mode</h2>
            <div className="mode-cards">
              <div className="mode-card" onClick={() => handleModeSelect('countries')}>
                <div className="mode-icon">🌍</div>
                <h3>Countries Quiz</h3>
                <p>Test your knowledge of {countries.length} countries around the world</p>
                <div className="mode-stats">
                  <span>{countries.length} countries</span>
                </div>
              </div>
              
              <div className="mode-card" onClick={() => handleModeSelect('cities')}>
                <div className="mode-icon">🏙️</div>
                <h3>Cities Quiz</h3>
                <p>Identify {cities.length} major cities across the globe</p>
                <div className="mode-stats">
                  <span>{cities.length} cities</span>
                </div>
              </div>
            </div>
            
            <div className="instructions">
              <h3>How to Play:</h3>
              <ul>
                <li>🎯 Click on locations on the map</li>
                <li>📝 Select the correct name from the word bank</li>
                <li>💡 Use hints if you get stuck</li>
                <li>🔄 Retake the quiz as many times as you want</li>
              </ul>
            </div>
          </div>
        </main>
        
        <footer className="app-footer">
          <p>Built with React + Vite</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="app">
      <MapQuiz 
        mode={quizMode} 
        onBackToMenu={handleBackToMenu}
        locations={quizMode === 'countries' ? countries : cities}
      />
    </div>
  );
}

export default App;