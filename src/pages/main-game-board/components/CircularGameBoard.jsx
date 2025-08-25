import React from 'react';
import LetterTile from './LetterTile';
import PassTurnButton from './PassTurnButton';

const CircularGameBoard = ({ 
  usedLetters = [], 
  onLetterSelect, 
  onPassTurn, 
  disabled = false,
  currentPlayer = null 
}) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'?.split('');
  
  const getLetterPosition = (index, total) => {
    const angle = (index * 360) / total;
    const radius = 140; // Distance from center
    const radian = (angle * Math.PI) / 180;
    
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
      rotation: angle + 90 // Rotate letter to face center
    };
  };

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Outer Blue Ring */}
      <div className="absolute inset-0 rounded-full bg-primary border-4 border-primary game-shadow-hover">
        {/* Inner Yellow Ring */}
        <div className="absolute inset-4 rounded-full bg-secondary border-2 border-secondary/20">
          {/* Center Area for Pass Turn Button */}
          <div className="absolute inset-8 rounded-full bg-card flex items-center justify-center">
            <PassTurnButton 
              onClick={onPassTurn}
              disabled={disabled}
              currentPlayer={currentPlayer}
            />
          </div>
        </div>
      </div>
      {/* Letter Tiles positioned around the circle */}
      <div className="absolute inset-0">
        {letters?.map((letter, index) => {
          const position = getLetterPosition(index, letters?.length);
          const isUsed = usedLetters?.includes(letter);
          
          return (
            <LetterTile
              key={letter}
              letter={letter}
              isUsed={isUsed}
              disabled={disabled || isUsed}
              onClick={() => onLetterSelect(letter)}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${position?.x}px, ${position?.y}px)`
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CircularGameBoard;