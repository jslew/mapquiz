import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>🗺️ MapQuiz</h1>
        <p>A fun geography quiz application</p>
      </header>
      
      <main className="app-main">
        <div className="card">
          <h2>Welcome to MapQuiz!</h2>
          <p>
            Test your geography knowledge with interactive map quizzes.
          </p>
          
          <div className="demo-section">
            <button 
              className="demo-button"
              onClick={() => setCount((count) => count + 1)}
            >
              Demo Counter: {count}
            </button>
          </div>
          
          <div className="features">
            <h3>Features Coming Soon:</h3>
            <ul>
              <li>🌍 Interactive world map quizzes</li>
              <li>🏛️ Country capitals and flags</li>
              <li>📊 Score tracking and statistics</li>
              <li>🎯 Multiple difficulty levels</li>
            </ul>
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Built with React + Vite</p>
      </footer>
    </div>
  )
}

export default App

