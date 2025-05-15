import { useState, useEffect } from 'react';
import Alien from './Alien';

const GRID_WIDTH = 8;
const GRID_HEIGHT = 3;
const ALIEN_SPACING_X = 60;
const ALIEN_SPACING_Y = 50;
const MOVEMENT_SPEED = 3;
const MOVEMENT_INTERVAL = 32;
const SCREEN_PADDING = 80;   // Adjusted padding
const ALIEN_WIDTH = 30;
const ALIEN_HEIGHT = 30;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 12;

const AlienGrid = ({ bullets, onAlienDestroyed, onUpdateBullets, isGameActive }) => {
  const [aliens, setAliens] = useState([]);
  const [direction, setDirection] = useState(1);
  const [position, setPosition] = useState({ 
    x: window.innerWidth * 0.15, 
    y: 100 
  });
  const [destroyedAliens, setDestroyedAliens] = useState(new Set());

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
    const bulletCenter = {
      x: bullet.x,
      y: bullet.y
    };

    const alienPosition = {
      x: position.x + alien.x,
      y: position.y + alien.y
    };

    // Adjusted collision detection with proper hitbox
    return (
      bulletCenter.x >= alienPosition.x &&
      bulletCenter.x <= alienPosition.x + ALIEN_WIDTH &&
      bulletCenter.y >= alienPosition.y &&
      bulletCenter.y <= alienPosition.y + ALIEN_HEIGHT
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

    if (isGameActive) {
      checkBulletCollisions();
    }
  }, [bullets, aliens, position, isGameActive]);

  useEffect(() => {
    let moveInterval;
    
    if (isGameActive) {
      moveInterval = setInterval(() => {
        setPosition(prev => {
          const gridWidth = GRID_WIDTH * ALIEN_SPACING_X;
          const newX = prev.x + (direction * MOVEMENT_SPEED);
          
          if (newX <= SCREEN_PADDING) {
            setDirection(1);
            return { ...prev, x: SCREEN_PADDING };
          }
          
          if (newX + gridWidth >= window.innerWidth - SCREEN_PADDING) {
            setDirection(-1);
            return { ...prev, x: window.innerWidth - gridWidth - SCREEN_PADDING };
          }
          
          return { ...prev, x: newX };
        });
      }, MOVEMENT_INTERVAL);
    }

    return () => clearInterval(moveInterval);
  }, [direction, isGameActive]);

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
          isDestroyed={destroyedAliens.has(alien.id)}
        />
      ))}
    </div>
  );
};

export default AlienGrid;
