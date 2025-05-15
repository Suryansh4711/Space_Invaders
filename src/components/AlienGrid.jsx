import { useState, useEffect, useCallback } from 'react';
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
const RESPAWN_DELAY = 2000; // 2 seconds delay for respawn

const MOVEMENT = {
  MIN_RESPAWN_DELAY: 1500,
  MAX_RESPAWN_DELAY: 3000
};

const AlienGrid = ({ bullets, onAlienDestroyed, onUpdateBullets, isGameActive }) => {
  const [aliens, setAliens] = useState([]);
  const [direction, setDirection] = useState(1);
  const [position, setPosition] = useState({ 
    x: window.innerWidth * 0.15, 
    y: 100 
  });
  const [destroyedAliens, setDestroyedAliens] = useState(new Set());

  const initializeAliens = () => {
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
    return initialAliens;
  };

  // Reset everything when game starts
  useEffect(() => {
    if (isGameActive) {
      const initialAliens = initializeAliens();
      setAliens(initialAliens);
      setPosition({ x: window.innerWidth * 0.15, y: 100 });
      setDirection(1);
      setDestroyedAliens(new Set());
    } else {
      // Clear aliens when game is not active
      setAliens([]);
    }
  }, [isGameActive]);

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

  const respawnAlien = useCallback((destroyedAlien) => {
    const delay = MOVEMENT.MIN_RESPAWN_DELAY + 
      Math.random() * (MOVEMENT.MAX_RESPAWN_DELAY - MOVEMENT.MIN_RESPAWN_DELAY);

    setTimeout(() => {
      if (isGameActive && aliens.length < GRID_WIDTH * GRID_HEIGHT) {
        // Create grid position map
        const positionMap = new Set(
          aliens.map(a => `${Math.floor(a.x / ALIEN_SPACING_X)},${Math.floor(a.y / ALIEN_SPACING_Y)}`)
        );

        // Find available positions
        const availablePositions = [];
        for (let row = 0; row < GRID_HEIGHT; row++) {
          for (let col = 0; col < GRID_WIDTH; col++) {
            if (!positionMap.has(`${col},${row}`)) {
              availablePositions.push({ row, col });
            }
          }
        }

        if (availablePositions.length > 0) {
          // Pick random available position
          const pos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
          
          setAliens(prev => [...prev, {
            id: `alien-${Date.now()}-${Math.random()}`,
            x: pos.col * ALIEN_SPACING_X,
            y: pos.row * ALIEN_SPACING_Y,
            type: Math.ceil(Math.random() * GRID_HEIGHT)
          }]);
        }
      }
    }, delay);
  }, [isGameActive, aliens.length]);

  const handleAlienDestroyed = (alien) => {
    setDestroyedAliens(prev => new Set([...prev, alien.id]));
    
    setTimeout(() => {
      setAliens(prev => prev.filter(a => a.id !== alien.id));
      onAlienDestroyed?.(alien);
      respawnAlien(alien);  // Re-enable respawn call
    }, 300); // Match animation duration
  };

  useEffect(() => {
    const checkBulletCollisions = () => {
      bullets.forEach(bullet => {
        aliens.forEach(alien => {
          if (checkCollision(bullet, alien)) {
            handleAlienDestroyed(alien);
            onUpdateBullets(bullet.id);
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
          onAnimationEnd={() => destroyedAliens.delete(alien.id)}
        />
      ))}
    </div>
  );
};

export default AlienGrid;
