import React from 'react';
import Icon from '../../../components/AppIcon';

const PlayerLeaderboard = ({ players }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return { icon: 'Trophy', color: '#FFD700', bgColor: 'bg-yellow-100' };
      case 2:
        return { icon: 'Medal', color: '#C0C0C0', bgColor: 'bg-gray-100' };
      case 3:
        return { icon: 'Award', color: '#CD7F32', bgColor: 'bg-orange-100' };
      default:
        return { icon: 'User', color: '#6B7280', bgColor: 'bg-gray-50' };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 game-shadow mb-6">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Icon name="BarChart3" size={24} className="mr-2" />
          Final Rankings
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {players?.map((player, index) => {
            const rank = index + 1;
            const rankData = getRankIcon(rank);
            
            return (
              <div
                key={player?.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${rankData?.bgColor} game-transition hover:game-shadow-hover`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-gray-200">
                    <Icon name={rankData?.icon} size={20} color={rankData?.color} />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      #{rank} {player?.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Icon name="Target" size={14} />
                        <span>{player?.wordsContributed} words</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Timer" size={14} />
                        <span>{player?.avgResponseTime}s avg</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="CheckCircle" size={14} />
                        <span>{player?.successfulSelections} selections</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {player?.score}
                  </div>
                  <div className="text-sm text-gray-500">points</div>
                  {player?.bestCategory && (
                    <div className="text-xs text-gray-500 mt-1">
                      Best: {player?.bestCategory}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerLeaderboard;