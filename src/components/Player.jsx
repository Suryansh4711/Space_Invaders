import { useState, useEffect } from 'react';

const PLAYER_SETTINGS = {
  SPEED: 5,
  WIDTH: 50,
  INITIAL_Y: window.innerHeight - 120,
  CANNON_OFFSET: 23 // Center of ship
};

const Player = ({ onShoot }) => {
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - PLAYER_SETTINGS.WIDTH / 2,
    y: PLAYER_SETTINGS.INITIAL_Y
  });
  const [movement, setMovement] = useState({ left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') setMovement(prev => ({ ...prev, left: true }));
      if (e.key === 'ArrowRight') setMovement(prev => ({ ...prev, right: true }));
      if (e.code === 'Space') {
        const bulletSpawnPos = {
          x: position.x + (PLAYER_SETTINGS.WIDTH / 2) - 2, // Center bullet
          y: window.innerHeight - 200 // Adjust spawn height
        };
        onShoot(bulletSpawnPos);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft') setMovement(prev => ({ ...prev, left: false }));
      if (e.key === 'ArrowRight') setMovement(prev => ({ ...prev, right: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onShoot]);

  useEffect(() => {
    const movePlayer = setInterval(() => {
      setPosition(prev => {
        let newX = prev.x;
        if (movement.left) newX -= PLAYER_SETTINGS.SPEED;
        if (movement.right) newX += PLAYER_SETTINGS.SPEED;
        newX = Math.max(0, Math.min(newX, window.innerWidth - PLAYER_SETTINGS.WIDTH));
        return { ...prev, x: newX };
      });
    }, 16);

    return () => clearInterval(movePlayer);
  }, [movement]);

  return (
    <div
      className="player-ship"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        bottom: '60px',
        width: `${PLAYER_SETTINGS.WIDTH}px`,
        height: '36px',
      }}
    >
      <div className="ship-wings" />
      <div className="ship-body">
        <div className="ship-window" />
      </div>
      <div className="ship-cannon" />
      <div className="ship-engines">
        <div className="engine-left" />
        <div className="engine-right" />
      </div>
    </div>
  );
};

export default Player;
