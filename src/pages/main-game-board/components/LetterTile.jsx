import React from 'react';

const LetterTile = ({ 
  letter, 
  isUsed = false, 
  disabled = false, 
  onClick, 
  style = {} 
}) => {
  const handleClick = () => {
    if (!disabled && !isUsed && onClick) {
      onClick(letter);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isUsed}
      style={style}
      className={`
        w-14 h-14 rounded-lg border-2 font-bold text-xl game-transition
        flex items-center justify-center
        ${isUsed 
          ? 'bg-muted border-muted text-muted-foreground used-letter cursor-not-allowed' 
          : 'bg-card border-border text-text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary letter-tile-hover cursor-pointer'
        }
        ${disabled && !isUsed ? 'opacity-50 cursor-not-allowed' : ''}
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        game-shadow hover:scale-105 active:scale-95
      `}
      aria-label={`Letter ${letter}${isUsed ? ' (used)' : ''}`}
      aria-pressed={isUsed}
    >
      {letter}
    </button>
  );
};

export default LetterTile;