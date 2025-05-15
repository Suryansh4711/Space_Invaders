import { useState, useEffect, useCallback, memo } from 'react';
import Player from './components/Player';
import Bullet from './components/Bullet';
import Stars from './components/Stars';
import StartScreen from './components/StartScreen';
import Lives from './components/Lives';
import Score from './components/Score';
import AlienGrid from './components/AlienGrid';
import GameOver from './components/GameOver';
import './App.css';

const BULLET_SETTINGS = {
  WIDTH: 4,
  HEIGHT: 12,
  COOLDOWN: 250
};

// Memoize the Bullet component to prevent unnecessary re-renders
const MemoizedBullet = memo(Bullet);

function App() {
  const [bullets, setBullets] = useState([]);
  const [lastShot, setLastShot] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('highScore')) || 0
  );
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [aliens, setAliens] = useState([]); // Add aliens state

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    let timer;
    if (gameStarted && !isGameOver && timeLeft > 0) {
      setIsGameActive(true);
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsGameOver(true);
            setIsGameActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, isGameOver, timeLeft]);

  const handleShoot = useCallback((playerPosition) => {
    if (!isGameActive) return;
    const now = Date.now();
    if (now - lastShot < BULLET_SETTINGS.COOLDOWN) return;

    const bulletId = now;
    setBullets(prev => [...prev, {
      id: bulletId,
      x: playerPosition.x,
      y: playerPosition.y - 30 // Adjust starting position
    }]);
    setLastShot(now);
  }, [isGameActive, lastShot]);

  const handleAlienDestroyed = (alien) => {
    const pointValues = {
      1: 30,
      2: 20,
      3: 10
    };
    setScore(prev => prev + pointValues[alien.type]);
  };

  const handleAlienHit = useCallback((alien, bulletId) => {
    setAliens(prev => prev.filter(a => a.id !== alien.id));
    setBullets(prev => prev.filter(b => b.id !== bulletId));
    handleAlienDestroyed(alien);
  }, []);

  const startGame = () => {
    setBullets([]);
    setScore(0);
    setLives(3);
    setGameStarted(true);
  };

  const restartGame = () => {
    setBullets([]);
    setLastShot(0);
    setScore(0);
    setLives(3);
  };

  const handleRestart = () => {
    setTimeLeft(60);
    setIsGameOver(false);
    setIsGameActive(true);
    restartGame();
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
              <div className="timer">TIME: {timeLeft}</div>
              <Lives lives={lives} />
            </div>
            <AlienGrid 
              bullets={bullets}
              onAlienDestroyed={handleAlienDestroyed}
              onUpdateBullets={(bulletId) => setBullets(prev => 
                prev.filter(b => b.id !== bulletId)
              )}
              isGameActive={isGameActive}
              setAliens={setAliens} // Pass setAliens to AlienGrid
            />
            {isGameActive && <Player onShoot={handleShoot} />}
            {bullets.map(bullet => (
              <MemoizedBullet
                key={bullet.id}
                initialPosition={bullet}
                onDestroy={() => {
                  requestAnimationFrame(() => {
                    setBullets(prev => prev.filter(b => b.id !== bullet.id));
                  });
                }}
                onHit={(alien) => handleAlienHit(alien, bullet.id)}
                aliens={aliens}
              />
            ))}
            {isGameOver && (
              <GameOver 
                score={score}
                highScore={highScore}
                livesLost={lives}
                onRestart={handleRestart}
              />
            )}
          </>
        )}
      </div>
      <div className="crt-effect" />
    </>
  );
}

export default App;
