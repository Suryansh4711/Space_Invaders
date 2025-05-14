import { useState } from 'react';
import Player from './components/Player';
import Bullet from './components/Bullet';
import Stars from './components/Stars';
import StartScreen from './components/StartScreen';
import './App.css';

function App() {
  const [bullets, setBullets] = useState([]);
  const [lastShot, setLastShot] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const handleShoot = (playerPosition) => {
    const now = Date.now();
    if (now - lastShot < 250) return;

    setBullets(prev => [...prev, {
      id: now,
      x: playerPosition.x + 23.5,
      y: playerPosition.y
    }]);
    setLastShot(now);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const restartGame = () => {
    setBullets([]);
    setLastShot(0);
    setScore(0);
    setLives(3);
  };

  return (
    <div className="game-board">
      <Stars />
      {!gameStarted ? (
        <StartScreen onStart={startGame} />
      ) : (
        <>
          <div className="game-info">
            <div>SCORE: {score}</div>
            <button className="restart-button" onClick={restartGame}>
              RESTART
            </button>
            <div>LIVES: {lives}</div>
          </div>
          <h1 className="title">SPACE INVADERS</h1>
          <Player onShoot={handleShoot} />
          {bullets.map(bullet => (
            <Bullet
              key={bullet.id}
              initialPosition={bullet}
              onDestroy={() => setBullets(prev => prev.filter(b => b.id !== bullet.id))}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default App;
