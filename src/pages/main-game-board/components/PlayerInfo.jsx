import React from 'react';
import Icon from '../../../components/AppIcon';

const PlayerInfo = ({ 
  players = [], 
  currentPlayerIndex = 0, 
  usedLettersCount = 0 
}) => {
  const currentPlayer = players?.[currentPlayerIndex] || { name: "Player 1", score: 0 };
  const totalLetters = 26;
  const remainingLetters = totalLetters - usedLettersCount;

  return (
    <div className="bg-card border border-border rounded-lg p-4 game-shadow mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Icon name="User" size={20} color="white" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">{currentPlayer?.name}</h3>
            <p className="text-sm text-text-secondary">Current Turn</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{currentPlayer?.score}</div>
          <div className="text-xs text-text-secondary">Score</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-bold text-text-primary">{remainingLetters}</div>
          <div className="text-xs text-text-secondary">Letters Left</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-text-primary">{players?.length}</div>
          <div className="text-xs text-text-secondary">Total Players</div>
        </div>
      </div>
      {/* Next Player Preview */}
      {players?.length > 1 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Next Turn:</span>
            <span className="text-sm font-medium text-text-primary">
              {players?.[(currentPlayerIndex + 1) % players?.length]?.name || "Player 2"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerInfo;