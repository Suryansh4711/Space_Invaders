import React from 'react';
import RetroHeart from './RetroHeart';

const Lives = ({ lives }) => (
  <div className="lives-container">
    {[...Array(lives)].map((_, index) => (
      <RetroHeart key={index} />
    ))}
  </div>
);

export default Lives;
