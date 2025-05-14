import { useState, useEffect } from 'react';
import Player from './components/Player';
import Bullet from './components/Bullet';
import Stars from './components/Stars';
import StartScreen from './components/StartScreen';
import Lives from './components/Lives';
import Score from './components/Score';
import AlienGrid from './components/AlienGrid';
import './App.css';

function App() {
  const [bullets, setBullets] = useState([]);
  const [lastShot, setLastShot] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('highScore')) || 0
  );

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score.toString());
    }
  }, [score, highScore]);

  const handleShoot = (playerPosition) => {
    const now = Date.now();
    if (now - lastShot < 250) return;

    setBullets(prev => [...prev, {
      id: now,
      x: playerPosition.x + 23.5,
      y: playerPosition.y,
      width: 3,
      height: 12
    }]);
    setLastShot(now);
  };

  const handleAlienDestroyed = (alien) => {
    // Score based on alien type
    const pointValues = {
      1: 30,
      2: 20,
      3: 10
    };
    setScore(prev => prev + pointValues[alien.type]);
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
    <>
      <div className="game-board">
        <Stars />
        {!gameStarted ? (
          <StartScreen onStart={startGame} highScore={highScore} />
        ) : (
          <>
            <div className="game-info">
              <Score score={score} />
              <button className="restart-button" onClick={restartGame}>
                RESTART
              </button>
              <Lives lives={lives} />
            </div>
            <AlienGrid 
              bullets={bullets}
              onAlienDestroyed={handleAlienDestroyed}
              onUpdateBullets={(bulletId) => setBullets(prev => 
                prev.filter(b => b.id !== bulletId)
              )}
            />
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
      <div className="crt-effect" />
    </>
  );
}

export default App;
