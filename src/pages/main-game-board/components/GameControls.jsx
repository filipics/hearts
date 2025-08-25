import React from 'react';
import Button from '../../../components/ui/Button';

const GameControls = ({ 
  onPauseGame, 
  onEndGame, 
  onResetTimer,
  onToggleSound,
  isPaused = false, 
  isSoundEnabled = true,
  disabled = false 
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={onPauseGame}
        disabled={disabled}
        iconName={isPaused ? "Play" : "Pause"}
        iconPosition="left"
        iconSize={16}
        className="game-transition"
      >
        {isPaused ? "Resume" : "Pause"}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onResetTimer}
        disabled={disabled}
        iconName="RotateCcw"
        iconPosition="left"
        iconSize={16}
        className="game-transition"
      >
        Reset Timer
      </Button>

      <Button
        variant={isSoundEnabled ? "outline" : "ghost"}
        size="sm"
        onClick={onToggleSound}
        iconName={isSoundEnabled ? "Volume2" : "VolumeX"}
        iconPosition="left"
        iconSize={16}
        className="game-transition"
        title={isSoundEnabled ? "Disable sound" : "Enable sound"}
      >
        {isSoundEnabled ? "Sound On" : "Sound Off"}
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={onEndGame}
        disabled={disabled}
        iconName="Square"
        iconPosition="left"
        iconSize={16}
        className="game-transition"
      >
        End Game
      </Button>
    </div>
  );
};

export default GameControls;