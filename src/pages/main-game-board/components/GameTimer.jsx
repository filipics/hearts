import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const GameTimer = ({ 
  initialTime = 20, 
  isActive = false, 
  onTimeUp, 
  onTick,
  resetTrigger = 0,
  isSoundEnabled = true
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  // Play ticking sound (respects sound toggle)
  const playTickSound = () => {
    if (!isSoundEnabled) return;
    
    try {
      // Create audio context for a subtle tick sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext?.createOscillator();
      const gainNode = audioContext?.createGain();
      
      oscillator?.connect(gainNode);
      gainNode?.connect(audioContext?.destination);
      
      // Create a subtle "chk" tick sound
      oscillator?.frequency?.setValueAtTime(1200, audioContext?.currentTime); // Higher pitch for tick
      gainNode?.gain?.setValueAtTime(0.1, audioContext?.currentTime); // Quieter than the end sound
      gainNode?.gain?.exponentialRampToValueAtTime(0.01, audioContext?.currentTime + 0.1);
      
      oscillator?.start(audioContext?.currentTime);
      oscillator?.stop(audioContext?.currentTime + 0.1);
    } catch (error) {
      console.log('Tick audio not supported or blocked:', error);
    }
  };

  // Audio feedback for timer end (ALWAYS plays - ignores sound toggle)
  const playTimeUpSound = () => {
    try {
      // Create audio context for a beep sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext?.createOscillator();
      const gainNode = audioContext?.createGain();
      
      oscillator?.connect(gainNode);
      gainNode?.connect(audioContext?.destination);
      
      // Create a beep sound
      oscillator?.frequency?.setValueAtTime(800, audioContext?.currentTime); // High pitch beep
      gainNode?.gain?.setValueAtTime(0.3, audioContext?.currentTime);
      gainNode?.gain?.exponentialRampToValueAtTime(0.01, audioContext?.currentTime + 0.5);
      
      oscillator?.start(audioContext?.currentTime);
      oscillator?.stop(audioContext?.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported or blocked:', error);
      // Fallback: Try HTML5 Audio with data URI (ALWAYS attempt fallback)
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhESp+y+7PfzoIGGO69t+STg0NTKXh8bllHgg2jdT0z4IxBSt+yO/cgzoIGGC87eGURQwPTqPn9bNpJAg+ltryxnkpBSl8yPDdizEIFV+79dqVUwwOUarm7rlrJgg5jND0vnIxBSl8x+7bizoIGGG88eGTRAsPTqLn9LNpJAg+ltryxnkpBSt8yO/diz');
        audio?.play();
      } catch (fallbackError) {
        console.log('Fallback audio also failed:', fallbackError);
      }
    }
  };

  useEffect(() => {
    setTimeLeft(initialTime);
    setIsRunning(isActive);
  }, [initialTime, isActive, resetTrigger]);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          
          // Play tick sound on each second (respects sound toggle)
          if (newTime > 0) {
            playTickSound();
          }
          
          if (onTick) onTick(newTime);
          
          if (newTime <= 0) {
            setIsRunning(false);
            playTimeUpSound(); // ALWAYS plays when timer reaches 0
            if (onTimeUp) onTimeUp();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp, onTick, isSoundEnabled]);

  const getTimerColor = () => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage > 60) return 'text-success';
    if (percentage > 30) return 'text-warning';
    return 'text-destructive';
  };

  const getTimerBgColor = () => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage > 60) return 'bg-success/10 border-success/20';
    if (percentage > 30) return 'bg-warning/10 border-warning/20';
    return 'bg-destructive/10 border-destructive/20';
  };

  const getProgressWidth = () => {
    return `${(timeLeft / initialTime) * 100}%`;
  };

  return (
    <div className={`
      bg-card border-2 rounded-lg p-4 game-shadow mb-6
      ${getTimerBgColor()}
    `}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon 
            name={timeLeft <= 5 ? "AlertTriangle" : "Clock"} 
            size={20} 
            color={`var(--color-${timeLeft <= 5 ? 'destructive' : 'text-secondary'})`}
          />
          <span className="text-sm font-medium text-text-secondary">
            Time Remaining
          </span>
          {isSoundEnabled && (
            <Icon 
              name="Volume2" 
              size={16} 
              color="var(--color-text-secondary)"
              className="opacity-60"
            />
          )}
          {!isSoundEnabled && (
            <Icon 
              name="VolumeX" 
              size={16} 
              color="var(--color-text-secondary)"
              className="opacity-40"
            />
          )}
        </div>
        
        <div className={`text-3xl font-bold ${getTimerColor()}`}>
          {timeLeft}s
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div 
          className={`
            h-full game-transition-state
            ${timeLeft > 10 ? 'bg-success' : timeLeft > 5 ? 'bg-warning' : 'bg-destructive'}
          `}
          style={{ width: getProgressWidth() }}
        />
      </div>
      
      {timeLeft <= 5 && timeLeft > 0 && (
        <div className="mt-2 text-center">
          <span className="text-xs font-medium text-destructive animate-pulse">
            Hurry up! Time is running out!
          </span>
        </div>
      )}
      
      {/* Sound Status Indicator */}
      {!isSoundEnabled && (
        <div className="mt-2 text-center">
          <span className="text-xs text-text-secondary opacity-70">
            Ticking sound disabled • End sound will always play
          </span>
        </div>
      )}
    </div>
  );
};

export default GameTimer;