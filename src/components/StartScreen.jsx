import React from 'react';

const StartScreen = ({ onStart, highScore }) => {
  return (
    <div className="start-screen">
      <h1 className="game-title">SPACE INVADERS</h1>
      <div className="high-score">
        HIGH SCORE: {highScore.toString().padStart(6, '0')}
      </div>
      <button className="start-button" onClick={onStart}>
        PRESS START
      </button>
      <div className="instructions">
        <p>← → TO MOVE</p>
        <p>SPACE TO SHOOT</p>
      </div>
    </div>
  );
};

export default StartScreen;
