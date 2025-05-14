import { useState, useEffect } from 'react';

const PLAYER_SETTINGS = {
  SPEED: 5,
  WIDTH: 50,
  INITIAL_Y: window.innerHeight - 120
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
      if (e.code === 'Space') onShoot(position);
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
    <img
      src="src/assets/player.png"
      alt="Player"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        bottom: '60px',
        width: `${PLAYER_SETTINGS.WIDTH}px`,
        filter: 'brightness(1.2) contrast(1.2)',
        transition: 'transform 0.1s'
      }}
    />
  );
};

export default Player;
