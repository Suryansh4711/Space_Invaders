import { useState, useEffect } from 'react';
import Alien from './Alien';

const GRID_WIDTH = 8;
const GRID_HEIGHT = 3;
const ALIEN_SPACING_X = 60;
const ALIEN_SPACING_Y = 50;
const MOVEMENT_SPEED = 2;  // Increased for more visible effect
const MOVEMENT_INTERVAL = 16;
const SCREEN_PADDING = 100;  // Increased padding for better visibility
const ALIEN_WIDTH = 30;
const ALIEN_HEIGHT = 30;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 12;

const AlienGrid = ({ bullets, onAlienDestroyed, onUpdateBullets }) => {
  const [aliens, setAliens] = useState([]);
  const [direction, setDirection] = useState(1);
  const [position, setPosition] = useState({ 
    x: window.innerWidth * 0.15, 
    y: 100 
  });

  useEffect(() => {
    // Initialize three rows of aliens
    const initialAliens = [];
    for (let row = 0; row < GRID_HEIGHT; row++) {
      for (let col = 0; col < GRID_WIDTH; col++) {
        initialAliens.push({
          id: `alien-${row}-${col}`,
          x: col * ALIEN_SPACING_X,
          y: row * ALIEN_SPACING_Y,
          type: GRID_HEIGHT - row // Different types for each row
        });
      }
    }
    setAliens(initialAliens);
  }, []);

  const checkCollision = (bullet, alien) => {
    const alienBox = {
      left: position.x + alien.x,
      right: position.x + alien.x + ALIEN_WIDTH,
      top: position.y + alien.y,
      bottom: position.y + alien.y + ALIEN_HEIGHT
    };

    const bulletBox = {
      left: bullet.x,
      right: bullet.x + BULLET_WIDTH,
      top: bullet.y,
      bottom: bullet.y + BULLET_HEIGHT
    };

    return (
      bulletBox.left < alienBox.right &&
      bulletBox.right > alienBox.left &&
      bulletBox.top < alienBox.bottom &&
      bulletBox.bottom > alienBox.top
    );
  };

  useEffect(() => {
    const checkBulletCollisions = () => {
      bullets.forEach(bullet => {
        aliens.forEach(alien => {
          if (checkCollision(bullet, alien)) {
            onAlienDestroyed?.(alien);
            onUpdateBullets(bullet.id);
            setAliens(prev => prev.filter(a => a.id !== alien.id));
          }
        });
      });
    };

    checkBulletCollisions();
  }, [bullets, aliens, position]);

  useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId;

    const animate = (currentTime) => {
      if (currentTime - lastTime >= MOVEMENT_INTERVAL) {
        setPosition(prev => {
          const gridWidth = GRID_WIDTH * ALIEN_SPACING_X;
          const newX = prev.x + (direction * MOVEMENT_SPEED);
          
          // Check boundaries and reverse direction
          if (newX <= SCREEN_PADDING) {
            setDirection(1); // Force right direction
            return { ...prev, x: SCREEN_PADDING };
          }
          if (newX + gridWidth >= window.innerWidth - SCREEN_PADDING) {
            setDirection(-1); // Force left direction
            return { ...prev, x: window.innerWidth - gridWidth - SCREEN_PADDING };
          }
          
          return { ...prev, x: newX };
        });
        lastTime = currentTime;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [direction]);

  return (
    <div className="alien-grid">
      {aliens.map(alien => (
        <Alien
          key={alien.id}
          position={{
            x: position.x + alien.x,
            y: position.y + alien.y
          }}
          type={alien.type}
        />
      ))}
    </div>
  );
};

export default AlienGrid;
