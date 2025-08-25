import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';

const GameFlowController = ({ 
  currentScreen, 
  gameState, 
  onNavigate, 
  canNavigateBack = false,
  nextAction = 'continue',
  disabled = false 
}) => {
  const navigate = useNavigate();

  const handleNavigation = (direction, targetScreen) => {
    if (onNavigate) {
      onNavigate(direction, targetScreen);
    } else {
      navigate(targetScreen);
    }
  };

  const getNextScreenConfig = () => {
    switch (currentScreen) {
      case 'lobby':
        return {
          nextScreen: '/main-game-board',
          nextLabel: 'Start Game',
          nextIcon: 'Play',
          variant: 'default'
        };
      case 'game':
        return {
          nextScreen: '/game-results',
          nextLabel: 'View Results',
          nextIcon: 'Trophy',
          variant: 'success'
        };
      case 'results':
        return {
          nextScreen: '/game-lobby',
          nextLabel: 'Play Again',
          nextIcon: 'RotateCcw',
          variant: 'secondary'
        };
      default:
        return null;
    }
  };

  const getBackScreenConfig = () => {
    switch (currentScreen) {
      case 'game':
        return {
          backScreen: '/game-lobby',
          backLabel: 'Back to Lobby',
          backIcon: 'ArrowLeft'
        };
      case 'results':
        return {
          backScreen: '/main-game-board',
          backLabel: 'Back to Game',
          backIcon: 'ArrowLeft'
        };
      default:
        return null;
    }
  };

  const nextConfig = getNextScreenConfig();
  const backConfig = getBackScreenConfig();

  if (!nextConfig) return null;

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mt-8">
      {/* Back Button */}
      {canNavigateBack && backConfig ? (
        <Button
          variant="outline"
          size="default"
          onClick={() => handleNavigation('back', backConfig?.backScreen)}
          iconName={backConfig?.backIcon}
          iconPosition="left"
          iconSize={16}
          disabled={disabled}
          className="game-transition"
        >
          {backConfig?.backLabel}
        </Button>
      ) : (
        <div></div>
      )}
      {/* Next/Action Button */}
      <Button
        variant={nextConfig?.variant}
        size="lg"
        onClick={() => handleNavigation('forward', nextConfig?.nextScreen)}
        iconName={nextConfig?.nextIcon}
        iconPosition="right"
        iconSize={18}
        disabled={disabled}
        className="game-transition px-8"
      >
        {nextConfig?.nextLabel}
      </Button>
    </div>
  );
};

export default GameFlowController;