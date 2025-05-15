import { useEffect, useRef } from 'react';

const BULLET_SPEED = 8;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 12;
const ALIEN_WIDTH = 30;  // Match actual alien size
const ALIEN_HEIGHT = 30; // Match actual alien size

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
        const bulletCenter = {
          x: positionRef.current.x,
          y: newY + (BULLET_HEIGHT / 2)
        };

        const hitAlien = aliens.find(alien => {
          const alienCenter = {
            x: alien.position.x + (ALIEN_WIDTH / 2),
            y: alien.position.y + (ALIEN_HEIGHT / 2)
          };

          // More precise collision detection using center points and half-sizes
          return Math.abs(bulletCenter.x - alienCenter.x) < (ALIEN_WIDTH / 2 + BULLET_WIDTH / 2) &&
                 Math.abs(bulletCenter.y - alienCenter.y) < (ALIEN_HEIGHT / 2 + BULLET_HEIGHT / 2);
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
        width: `${BULLET_WIDTH}px`,
        height: `${BULLET_HEIGHT}px`,
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
