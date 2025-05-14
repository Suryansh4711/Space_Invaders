import { useEffect, useState } from 'react';

const STAR_COUNT = 50;

const Stars = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Initialize stars
    const initialStars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 0.5
    }));
    setStars(initialStars);

    // Animate stars
    const animateStars = setInterval(() => {
      setStars(prevStars => 
        prevStars.map(star => ({
          ...star,
          y: star.y + star.speed,
          ...(star.y > window.innerHeight ? {
            y: -5,
            x: Math.random() * window.innerWidth
          } : {})
        }))
      );
    }, 16);

    return () => clearInterval(animateStars);
  }, []);

  return (
    <div className="stars-container">
      {stars.map((star, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: '#fff',
            opacity: Math.random() * 0.5 + 0.5,
            boxShadow: '0 0 3px #fff',
            borderRadius: '50%'
          }}
        />
      ))}
    </div>
  );
};

export default Stars;
