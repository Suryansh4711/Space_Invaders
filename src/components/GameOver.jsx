const GameOver = ({ score, highScore, livesLost, onRestart }) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-dialog">
        <h2>GAME OVER</h2>
        <div className="stats">
          <p>SCORE: {score}</p>
          <p>HIGH SCORE: {highScore}</p>
          <p>LIVES LOST: {3 - livesLost}</p>
        </div>
        <button className="restart-button" onClick={onRestart}>
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
};

export default GameOver;
