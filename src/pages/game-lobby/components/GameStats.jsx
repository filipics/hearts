import React from 'react';
import Icon from '../../../components/AppIcon';

const GameStats = ({ gameHistory = [] }) => {
  // Mock game statistics
  const stats = {
    totalGames: gameHistory?.length || 12,
    totalWords: 156,
    averageScore: 24.5,
    bestScore: 45,
    favoriteCategory: 'Animals',
    winRate: 68
  };

  const recentGames = gameHistory?.slice(0, 3)?.length > 0 ? gameHistory?.slice(0, 3) : [
    {
      id: 1,
      date: new Date(Date.now() - 86400000), // 1 day ago
      players: ['You', 'Sarah', 'Mike'],
      finalScore: 32,
      category: 'Movies',
      duration: '8 min'
    },
    {
      id: 2,
      date: new Date(Date.now() - 172800000), // 2 days ago
      players: ['You', 'Emma', 'John', 'Lisa'],
      finalScore: 28,
      category: 'Countries',
      duration: '12 min'
    },
    {
      id: 3,
      date: new Date(Date.now() - 259200000), // 3 days ago
      players: ['You', 'Alex'],
      finalScore: 45,
      category: 'Animals',
      duration: '6 min'
    }
  ];

  const formatDate = (date) => {
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className="w-full space-y-6">
      {/* Game Statistics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2" />
          Your Stats
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-card border border-border rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">{stats?.totalGames}</div>
            <div className="text-xs text-text-secondary">Games Played</div>
          </div>
          
          <div className="p-3 bg-card border border-border rounded-lg text-center">
            <div className="text-2xl font-bold text-success">{stats?.totalWords}</div>
            <div className="text-xs text-text-secondary">Words Found</div>
          </div>
          
          <div className="p-3 bg-card border border-border rounded-lg text-center">
            <div className="text-2xl font-bold text-secondary">{stats?.averageScore}</div>
            <div className="text-xs text-text-secondary">Avg Score</div>
          </div>
          
          <div className="p-3 bg-card border border-border rounded-lg text-center">
            <div className="text-2xl font-bold text-accent">{stats?.bestScore}</div>
            <div className="text-xs text-text-secondary">Best Score</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Favorite Category</span>
              <span className="text-sm font-medium text-text-primary">{stats?.favoriteCategory}</span>
            </div>
          </div>
          
          <div className="p-3 bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Win Rate</span>
              <span className="text-sm font-medium text-success">{stats?.winRate}%</span>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Games */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Clock" size={20} className="mr-2" />
          Recent Games
        </h3>
        
        {recentGames?.length === 0 ? (
          <div className="text-center py-6 text-text-secondary">
            <Icon name="GamepadIcon" size={32} className="mx-auto mb-2 opacity-50" />
            <p>No recent games</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentGames?.map((game) => (
              <div
                key={game?.id}
                className="p-3 bg-card border border-border rounded-lg game-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="Trophy" size={14} className="text-secondary" />
                    <span className="text-sm font-medium text-text-primary">
                      Score: {game?.finalScore}
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary">
                    {formatDate(game?.date)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Icon name="Tag" size={12} />
                    <span>{game?.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{game?.duration}</span>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center space-x-1">
                  <Icon name="Users" size={12} className="text-text-secondary" />
                  <span className="text-xs text-text-secondary">
                    {game?.players?.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameStats;