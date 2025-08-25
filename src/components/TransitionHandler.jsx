import React, { useState, useEffect } from 'react';
import Icon from './AppIcon';

const TransitionHandler = ({ 
  from, 
  to, 
  gameData, 
  onComplete, 
  isVisible = false,
  duration = 300 
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState('idle'); // 'idle' | 'fadeOut' | 'loading' | 'fadeIn'

  useEffect(() => {
    if (isVisible && from && to) {
      startTransition();
    }
  }, [isVisible, from, to]);

  const startTransition = async () => {
    setIsTransitioning(true);
    
    // Phase 1: Fade out current screen
    setTransitionPhase('fadeOut');
    await new Promise(resolve => setTimeout(resolve, duration / 3));
    
    // Phase 2: Show loading state
    setTransitionPhase('loading');
    await new Promise(resolve => setTimeout(resolve, duration / 3));
    
    // Phase 3: Fade in new screen
    setTransitionPhase('fadeIn');
    await new Promise(resolve => setTimeout(resolve, duration / 3));
    
    // Complete transition
    setTransitionPhase('idle');
    setIsTransitioning(false);
    
    if (onComplete) {
      onComplete(to, gameData);
    }
  };

  const getTransitionContent = () => {
    switch (transitionPhase) {
      case 'fadeOut':
        return {
          icon: 'ArrowRight',
          message: `Leaving ${getScreenName(from)}...`,
          opacity: 'opacity-100'
        };
      case 'loading':
        return {
          icon: 'Loader2',
          message: 'Loading...',
          opacity: 'opacity-100',
          spin: true
        };
      case 'fadeIn':
        return {
          icon: 'CheckCircle',
          message: `Welcome to ${getScreenName(to)}!`,
          opacity: 'opacity-100'
        };
      default:
        return {
          icon: 'ArrowRight',
          message: '',
          opacity: 'opacity-0'
        };
    }
  };

  const getScreenName = (screen) => {
    switch (screen) {
      case 'lobby': case'/game-lobby':
        return 'Game Lobby';
      case 'game': case'/main-game-board':
        return 'Game Board';
      case 'results': case'/game-results':
        return 'Results';
      default:
        return 'Game';
    }
  };

  const transitionContent = getTransitionContent();

  if (!isVisible || !isTransitioning) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className={`
        flex flex-col items-center justify-center space-y-4 p-8 
        bg-card rounded-lg game-shadow-hover border border-border
        game-transition-state ${transitionContent?.opacity}
      `}>
        <div className={`
          w-12 h-12 flex items-center justify-center rounded-full bg-primary/10
          ${transitionContent?.spin ? 'animate-spin' : ''}
        `}>
          <Icon 
            name={transitionContent?.icon} 
            size={24} 
            color="var(--color-primary)" 
          />
        </div>
        
        <div className="text-center">
          <p className="text-lg font-medium text-text-primary">
            {transitionContent?.message}
          </p>
          
          {gameData && (
            <div className="mt-2 text-sm text-text-secondary">
              {gameData?.score !== undefined && (
                <span>Score: {gameData?.score}</span>
              )}
              {gameData?.round !== undefined && (
                <span className="ml-4">Round: {gameData?.round}</span>
              )}
            </div>
          )}
        </div>
        
        {/* Progress indicator */}
        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary game-transition-state"
            style={{
              width: transitionPhase === 'fadeOut' ? '33%' : 
                     transitionPhase === 'loading' ? '66%' : 
                     transitionPhase === 'fadeIn' ? '100%' : '0%'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TransitionHandler;