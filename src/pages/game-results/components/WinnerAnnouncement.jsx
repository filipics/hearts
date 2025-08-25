import React from 'react';
import Icon from '../../../components/AppIcon';

const WinnerAnnouncement = ({ winner, gameStats }) => {
  return (
    <div className="text-center mb-8 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <Icon name="Trophy" size={40} color="#1F2937" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <Icon name="Crown" size={16} color="white" />
          </div>
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        🎉 Congratulations! 🎉
      </h1>
      <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
        {winner?.name} Wins!
      </p>
      <p className="text-lg text-gray-600 mb-4">
        Final Score: <span className="font-bold text-primary">{winner?.score} points</span>
      </p>
      <div className="flex justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Icon name="Clock" size={16} />
          <span>Game Duration: {gameStats?.duration}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Users" size={16} />
          <span>{gameStats?.totalPlayers} Players</span>
        </div>
      </div>
    </div>
  );
};

export default WinnerAnnouncement;