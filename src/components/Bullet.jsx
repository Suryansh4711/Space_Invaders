import { useEffect, useRef } from 'react';

const BULLET_SPEED = 8;

const Bullet = ({ initialPosition, onDestroy, aliens }) => {
  const positionRef = useRef(initialPosition);
  const bulletRef = useRef(null);

  useEffect(() => {
    let frameId;
    const animate = () => {
      const newY = positionRef.current.y - BULLET_SPEED;
      
      if (newY < 0) {
        onDestroy();
        return;
      }

      if (aliens?.length > 0) {
        const hitAlien = aliens.find(alien => {
          const bulletRect = {
            x: positionRef.current.x - 2,
            y: newY,
            width: 4,
            height: 12
          };
          
          const alienRect = {
            x: alien.position.x,
            y: alien.position.y,
            width: 40,
            height: 40
          };

          return bulletRect.x < alienRect.x + alienRect.width &&
                 bulletRect.x + bulletRect.width > alienRect.x &&
                 bulletRect.y < alienRect.y + alienRect.height &&
                 bulletRect.y + bulletRect.height > alienRect.y;
        });

        if (hitAlien) {
          onDestroy();
          return;
        }
      }

      positionRef.current.y = newY;
      if (bulletRef.current) {
        bulletRef.current.style.transform = `translate(-50%, 0)`;
        bulletRef.current.style.top = `${newY}px`;
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [onDestroy, aliens]);

  return (
    <div
      ref={bulletRef}
      className="bullet"
      style={{
        position: 'absolute',
        left: `${positionRef.current.x}px`,
        top: `${positionRef.current.y}px`,
        width: '4px',
        height: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 0 4px #fff, 0 0 8px #0f0',
        zIndex: 1000,
        transform: 'translate(-50%, 0)',
        backfaceVisibility: 'hidden'
      }}
    />
  );
};

export default Bullet;
