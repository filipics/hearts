import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const PlayerSetup = ({ players, onPlayersChange, onStartGame }) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [errors, setErrors] = useState({});

  const addPlayer = () => {
    const trimmedName = newPlayerName?.trim();
    
    if (!trimmedName) {
      setErrors({ newPlayer: 'Player name cannot be empty' });
      return;
    }

    if (players?.some(player => player?.name?.toLowerCase() === trimmedName?.toLowerCase())) {
      setErrors({ newPlayer: 'Player name already exists' });
      return;
    }

    if (players?.length >= 6) {
      setErrors({ newPlayer: 'Maximum 6 players allowed' });
      return;
    }

    const newPlayer = {
      id: Date.now(),
      name: trimmedName,
      score: 0,
      isHost: players?.length === 0
    };

    onPlayersChange([...players, newPlayer]);
    setNewPlayerName('');
    setErrors({});
  };

  const removePlayer = (playerId) => {
    const updatedPlayers = players?.filter(player => player?.id !== playerId);
    onPlayersChange(updatedPlayers);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      addPlayer();
    }
  };

  const canStartGame = players?.length >= 2;

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Player List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Users" size={20} className="mr-2" />
          Players ({players?.length}/6)
        </h3>
        
        {players?.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <Icon name="UserPlus" size={32} className="mx-auto mb-2 opacity-50" />
            <p>Add players to start the game</p>
          </div>
        ) : (
          <div className="space-y-2">
            {players?.map((player, index) => (
              <div
                key={player?.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {player?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{player?.name}</p>
                    {player?.isHost && (
                      <p className="text-xs text-secondary flex items-center">
                        <Icon name="Crown" size={12} className="mr-1" />
                        Host
                      </p>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePlayer(player?.id)}
                  iconName="X"
                  iconSize={16}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Add Player Section */}
      <div className="space-y-3">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e?.target?.value)}
              onKeyPress={handleKeyPress}
              error={errors?.newPlayer}
              disabled={players?.length >= 6}
            />
          </div>
          <Button
            variant="outline"
            onClick={addPlayer}
            disabled={!newPlayerName?.trim() || players?.length >= 6}
            iconName="Plus"
            iconSize={16}
            className="px-4"
          >
            Add
          </Button>
        </div>
      </div>
      {/* Start Game Button */}
      <div className="pt-4">
        <Button
          variant="default"
          size="lg"
          fullWidth
          onClick={onStartGame}
          disabled={!canStartGame}
          iconName="Play"
          iconPosition="right"
          iconSize={18}
          className="game-transition"
        >
          {canStartGame ? 'Start New Game' : `Need ${2 - players?.length} more player${2 - players?.length === 1 ? '' : 's'}`}
        </Button>
        
        {canStartGame && (
          <p className="text-xs text-text-secondary text-center mt-2">
            Ready to play with {players?.length} players
          </p>
        )}
      </div>
    </div>
  );
};

export default PlayerSetup;