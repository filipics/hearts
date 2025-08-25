import React from 'react';
import Icon from '../../../components/AppIcon';

const PassTurnButton = ({ 
  onClick, 
  disabled = false, 
  currentPlayer = null 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-16 h-16 rounded-full bg-destructive text-destructive-foreground
        border-4 border-destructive/20 font-bold text-sm
        flex flex-col items-center justify-center
        game-transition hover:bg-destructive/90 hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2
        game-shadow-hover
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label="Pass turn to next player"
    >
      <Icon name="SkipForward" size={16} color="white" />
      <span className="text-xs mt-1">PASS</span>
    </button>
  );
};

export default PassTurnButton;