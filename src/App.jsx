import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [playerX, setPlayerX] = useState(window.innerWidth / 2 - 25);
  const [bullets, setBullets] = useState([]);

  useEffect(() => {
    function handleKeyDown(event) {
      const speed = 10;

      if (event.key === "ArrowLeft") {
        setPlayerX(prevX => Math.max(prevX - speed, 0));
      }
      if (event.key === "ArrowRight") {
        setPlayerX(prevX => Math.min(prevX + speed, window.innerWidth - 50));
      }
      if (event.key === " ") { // Spacebar to shoot
        shootBullet();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function shootBullet() {
    setBullets(prevBullets => [
      ...prevBullets,
      { x: playerX + 48 - 2.5, y: window.innerHeight - 96 } // 96 is spaceship height
    ]);
  }
  

  useEffect(() => {
    const interval = setInterval(() => {
      setBullets(prevBullets => 
        prevBullets
          .map(bullet => ({ ...bullet, y: bullet.y - 10 })) // Move up
          .filter(bullet => bullet.y > 0) // Remove bullets that go off screen
      );
    }, 50); // Move bullets every 50ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="game-board">
      <h1 className="title">Space Invaders</h1>
      <img 
        src="src/assets/player.png" 
        alt="Player" 
        className="player"
        style={{ left: `${playerX}px` }}
      />
      {bullets.map((bullet, index) => (
        <div 
          key={index} 
          className="bullet"
          style={{ left: `${bullet.x}px`, top: `${bullet.y}px` }}
        />
      ))}
    </div>
  );
}

export default App;
