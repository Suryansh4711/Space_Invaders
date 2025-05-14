import { useEffect, useState } from 'react';

const BULLET_SPEED = 8;

const Bullet = ({ initialPosition, onDestroy }) => {
  const [position, setPosition] = useState({
    x: initialPosition.x,
    y: initialPosition.y
  });

  useEffect(() => {
    let frameId;
    const animate = () => {
      setPosition(prev => {
        const newY = prev.y - BULLET_SPEED;
        if (newY < 0) {
          onDestroy();
          return prev;
        }
        return { x: prev.x, y: newY };
      });
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [onDestroy]);

  return (
    <div
      className="bullet"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '4px',
        height: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 0 4px #fff, 0 0 8px #0f0',
        zIndex: 1000,
        transform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden'
      }}
    />
  );
};

export default Bullet;
