import { useEffect, useState } from 'react';

const BULLET_SPEED = 8;

const Bullet = ({ initialPosition, onDestroy }) => {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    let animationId;
    
    const animate = () => {
      setPosition(prev => {
        const newY = prev.y - BULLET_SPEED;
        if (newY < 0) {
          onDestroy();
          return prev;
        }
        return { ...prev, y: newY };
      });
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
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
        transform: 'translateZ(0)',
      }}
    />
  );
};

export default Bullet;
