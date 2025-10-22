import React from 'react';
import './ScoreDisplay.css';

const ScoreDisplay = ({ score, total, answeredLocations, correctAnswers, incorrectAnswers }) => {
  const accuracy = total > 0 ? Math.round((correctAnswers.size / answeredLocations.size) * 100) : 0;
  const remaining = total - answeredLocations.size;

  const getScoreColor = () => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    if (percentage >= 40) return 'fair';
    return 'poor';
  };

  const getScoreMessage = () => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "Outstanding! 🌟";
    if (percentage >= 80) return "Excellent work! 🎉";
    if (percentage >= 70) return "Great job! 👍";
    if (percentage >= 60) return "Good effort! 👏";
    if (percentage >= 50) return "Not bad! 💪";
    return "Keep practicing! 📚";
  };

  return (
    <div className="score-display">
      <div className="score-main">
        <div className="score-circle">
          <div className="score-number">{score}</div>
          <div className="score-total">/{total}</div>
        </div>
        <div className="score-percentage">
          {Math.round((score / total) * 100)}%
        </div>
      </div>
      
      <div className="score-breakdown">
        <div className="breakdown-item correct">
          <span className="breakdown-icon">✅</span>
          <span className="breakdown-label">Correct:</span>
          <span className="breakdown-value">{correctAnswers.size}</span>
        </div>
        
        <div className="breakdown-item incorrect">
          <span className="breakdown-icon">❌</span>
          <span className="breakdown-label">Incorrect:</span>
          <span className="breakdown-value">{incorrectAnswers.size}</span>
        </div>
        
        <div className="breakdown-item remaining">
          <span className="breakdown-icon">⏳</span>
          <span className="breakdown-label">Remaining:</span>
          <span className="breakdown-value">{remaining}</span>
        </div>
      </div>
      
      <div className="score-message">
        <p className={getScoreColor()}>{getScoreMessage()}</p>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${(answeredLocations.size / total) * 100}%` }}
        ></div>
        <div className="progress-text">
          Progress: {answeredLocations.size}/{total}
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
