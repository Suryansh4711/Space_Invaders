import { useEffect, useState } from 'react';

const Alien = ({ position, type, isDestroyed, onAnimationEnd }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const animation = setInterval(() => {
      setFrame(prev => prev === 0 ? 1 : 0);
    }, 500);
    return () => clearInterval(animation);
  }, []);

  const getAlienStyle = (type) => {
    // Base alien styles
    const baseStyle = {
      width: '30px',
      height: '30px',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      position: 'relative'
    };

    // Different alien types
    switch(type) {
      case 1: // Top row aliens
        return frame === 0 ? `
          ▀▄ ▄▀
          ▄█▄█▄
          ▀▄█▄▀
        ` : `
          ▀▄ ▄▀
          ▄███▄
          ▀▀▀▀▀
        `;
      case 2: // Middle row aliens
        return frame === 0 ? `
          ▄ ▄ ▄
          ▀███▀
          ▄▀▀▀▄
        ` : `
          ▄ ▄ ▄
          ▀███▀
          ▄███▄
        `;
      case 3: // Bottom row aliens
        return frame === 0 ? `
          ▄███▄
          █████
          ▀ ▀ ▀
        ` : `
          ▄███▄
          █████
          ▀▄▄▄▀
        `;
      default:
        return '';
    }
  };

  const colors = {
    1: '#ff0',  // Yellow
    2: '#0f0',  // Green
    3: '#f0f'   // Purple
  };

  return (
    <div
      className={`alien alien-type-${type} ${isDestroyed ? 'destroyed' : ''}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        color: colors[type],
        fontSize: '8px',
        lineHeight: '8px',
        fontFamily: 'monospace',
        whiteSpace: 'pre',
        textShadow: `0 0 5px ${colors[type]}`,
        transform: `scale(${frame === 0 ? 1 : 1.1})`,
        transition: 'transform 0.25s ease-in-out',
        userSelect: 'none',
        animation: isDestroyed ? 'alienDestroy 0.5s forwards' : undefined
      }}
      onAnimationEnd={() => {
        if (isDestroyed) {
          onAnimationEnd?.();
        }
      }}
    >
      {getAlienStyle(type)}
    </div>
  );
};

export default Alien;
