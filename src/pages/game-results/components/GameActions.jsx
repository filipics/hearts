import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GameActions = ({ onShare, gameData }) => {
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    navigate('/game-lobby');
  };

  const handleViewHistory = () => {
    // Navigate to game history or show modal
    console.log('View game history');
  };

  const handleNewGame = () => {
    navigate('/game-lobby');
  };

  const shareOptions = [
    {
      name: 'Twitter',
      icon: 'Twitter',
      color: '#1DA1F2',
      action: () => onShare('twitter')
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      color: '#4267B2',
      action: () => onShare('facebook')
    },
    {
      name: 'Copy Link',
      icon: 'Link',
      color: '#6B7280',
      action: () => onShare('copy')
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 game-shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Icon name="Settings" size={20} className="mr-2" />
          Game Actions
        </h2>
      </div>
      <div className="p-6 space-y-6">
        {/* Primary Actions */}
        <div className="space-y-3">
          <Button
            variant="default"
            size="lg"
            onClick={handlePlayAgain}
            iconName="RotateCcw"
            iconPosition="left"
            iconSize={18}
            fullWidth
            className="game-transition"
          >
            Play Again with Same Players
          </Button>
          
          <Button
            variant="outline"
            size="default"
            onClick={handleNewGame}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
            fullWidth
            className="game-transition"
          >
            Start New Game
          </Button>
        </div>

        {/* Share Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Icon name="Share2" size={16} className="mr-2" />
            Share Results
          </h3>
          
          <div className="grid grid-cols-3 gap-2">
            {shareOptions?.map((option) => (
              <button
                key={option?.name}
                onClick={option?.action}
                className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 game-transition"
              >
                <Icon name={option?.icon} size={20} color={option?.color} />
                <span className="text-xs text-gray-600 mt-1">{option?.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewHistory}
              iconName="History"
              iconPosition="left"
              iconSize={14}
              fullWidth
              className="game-transition"
            >
              Game History
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/game-lobby')}
              iconName="Home"
              iconPosition="left"
              iconSize={14}
              fullWidth
              className="game-transition"
            >
              Main Menu
            </Button>
          </div>
        </div>

        {/* Game Stats Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Most Active:</span>
              <div className="font-medium text-gray-800">{gameData?.mostActivePlayer}</div>
            </div>
            <div>
              <span className="text-gray-600">Best Category:</span>
              <div className="font-medium text-gray-800">{gameData?.bestCategory}</div>
            </div>
            <div>
              <span className="text-gray-600">Hardest Letter:</span>
              <div className="font-medium text-gray-800">{gameData?.hardestLetter}</div>
            </div>
            <div>
              <span className="text-gray-600">Total Rounds:</span>
              <div className="font-medium text-gray-800">{gameData?.totalRounds}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameActions;