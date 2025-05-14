import { useEffect, useState } from 'react';

const BULLET_SPEED = 7;
const BULLET_UPDATE_INTERVAL = 16; // 60fps

const Bullet = ({ initialPosition, onDestroy }) => {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPosition(prev => {
        const newY = prev.y - BULLET_SPEED;
        if (newY < 0) {
          onDestroy();
          return prev;
        }
        return { ...prev, y: newY };
      });
    }, BULLET_UPDATE_INTERVAL);

    return () => clearInterval(moveInterval);
  }, [onDestroy]);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '3px',
        height: '12px',
        backgroundColor: '#0f0',
        boxShadow: '0 0 5px #0f0',
        borderRadius: '1px',
      }}
    />
  );
};

export default Bullet;
