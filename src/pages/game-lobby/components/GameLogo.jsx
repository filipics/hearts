import React from 'react';
import Icon from '../../../components/AppIcon';

const GameLogo = () => {
  return (
    <div className="text-center space-y-4 mb-8">
      {/* Logo Icon */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center game-shadow-hover">
            {/* Inner circle with letter */}
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="Zap" size={24} color="var(--color-text-primary)" />
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
            <Icon name="Star" size={12} color="white" />
          </div>
        </div>
      </div>

      {/* Game Title */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-text-primary">
          Letter<span className="text-primary">Rush</span>
        </h1>
        <p className="text-text-secondary text-lg">
          Fast-paced word game for friends
        </p>
      </div>

      {/* Game Description */}
      <div className="max-w-md mx-auto">
        <p className="text-sm text-text-secondary leading-relaxed">
          Challenge your vocabulary in this exciting multiplayer word game. 
          Take turns selecting letters and naming words within the time limit!
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="flex justify-center space-x-6 mt-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Users" size={14} color="var(--color-primary)" />
          </div>
          <span className="text-xs text-text-secondary">2-6 Players</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
            <Icon name="Clock" size={14} color="var(--color-secondary)" />
          </div>
          <span className="text-xs text-text-secondary">20s Rounds</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
            <Icon name="Trophy" size={14} color="var(--color-success)" />
          </div>
          <span className="text-xs text-text-secondary">Score Points</span>
        </div>
      </div>
    </div>
  );
};

export default GameLogo;