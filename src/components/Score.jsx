const Score = ({ score }) => {
  const paddedScore = score.toString().padStart(6, '0');
  
  return (
    <div className="score-display">
      {paddedScore.split('').map((digit, index) => (
        <span key={index} className="score-digit">{digit}</span>
      ))}
    </div>
  );
};

export default Score;
