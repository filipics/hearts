import React from 'react';
import Icon from '../../../components/AppIcon';

const ScoreBoard = ({ players = [] }) => {
  const sortedPlayers = [...players]?.sort((a, b) => b?.score - a?.score);

  return (
    <div className="bg-card border border-border rounded-lg p-4 game-shadow">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Trophy" size={20} color="var(--color-primary)" />
        <h3 className="font-bold text-text-primary">Scoreboard</h3>
      </div>
      <div className="space-y-3">
        {sortedPlayers?.map((player, index) => (
          <div 
            key={player?.id || index}
            className={`
              flex items-center justify-between p-3 rounded-lg
              ${index === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'}
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-text-secondary'}
              `}>
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-text-primary">{player?.name}</div>
                {player?.wordsFound && (
                  <div className="text-xs text-text-secondary">
                    {player?.wordsFound} words found
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-text-primary">{player?.score}</div>
              {index === 0 && sortedPlayers?.length > 1 && (
                <div className="text-xs text-primary">Leading</div>
              )}
            </div>
          </div>
        ))}
      </div>
      {players?.length === 0 && (
        <div className="text-center py-8 text-text-secondary">
          <Icon name="Users" size={32} color="var(--color-text-secondary)" className="mx-auto mb-2" />
          <p>No players yet</p>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;