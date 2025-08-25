import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import WinnerAnnouncement from './components/WinnerAnnouncement';
import PlayerLeaderboard from './components/PlayerLeaderboard';
import GameSummary from './components/GameSummary';
import GameActions from './components/GameActions';
import DetailedAnalytics from './components/DetailedAnalytics';
import Icon from '../../components/AppIcon';

const GameResults = () => {
  const navigate = useNavigate();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  // Mock game results data
  const gameResults = {
    players: [
      {
        id: 1,
        name: "Sarah Johnson",
        score: 245,
        wordsContributed: 18,
        avgResponseTime: 12.5,
        successfulSelections: 15,
        bestCategory: "Animals"
      },
      {
        id: 2,
        name: "Mike Chen",
        score: 220,
        wordsContributed: 16,
        avgResponseTime: 14.2,
        successfulSelections: 13,
        bestCategory: "Movies"
      },
      {
        id: 3,
        name: "Emma Davis",
        score: 195,
        wordsContributed: 14,
        avgResponseTime: 16.8,
        successfulSelections: 12,
        bestCategory: "Food"
      },
      {
        id: 4,
        name: "Alex Rodriguez",
        score: 180,
        wordsContributed: 12,
        avgResponseTime: 18.3,
        successfulSelections: 10,
        bestCategory: "Sports"
      }
    ],
    gameStats: {
      duration: "24:35",
      totalPlayers: 4,
      totalDuration: "24 minutes 35 seconds",
      totalWords: 60,
      unusedLetters: 8
    },
    wordsByCategory: {
      "Animals": {
        words: [
          { word: "Antelope", player: "Sarah", creative: false },
          { word: "Butterfly", player: "Mike", creative: true },
          { word: "Cheetah", player: "Emma", creative: false },
          { word: "Dolphin", player: "Alex", creative: false }
        ],
        challenging: false
      },
      "Movies": {
        words: [
          { word: "Avatar", player: "Sarah", creative: false },
          { word: "Batman", player: "Mike", creative: false },
          { word: "Casablanca", player: "Emma", creative: true },
          { word: "Dune", player: "Alex", creative: false }
        ],
        challenging: true
      },
      "Food": {
        words: [
          { word: "Apple", player: "Sarah", creative: false },
          { word: "Burrito", player: "Mike", creative: false },
          { word: "Croissant", player: "Emma", creative: true },
          { word: "Donut", player: "Alex", creative: false }
        ],
        challenging: false
      },
      "Sports": {
        words: [
          { word: "Archery", player: "Sarah", creative: false },
          { word: "Basketball", player: "Mike", creative: false },
          { word: "Cricket", player: "Emma", creative: false },
          { word: "Diving", player: "Alex", creative: true }
        ],
        challenging: false
      }
    },
    quickStats: {
      mostActivePlayer: "Sarah Johnson",
      bestCategory: "Animals",
      hardestLetter: "Q",
      totalRounds: 8
    }
  };

  const analyticsData = {
    responseTimesByPlayer: [
      { name: "Sarah", avgTime: 12.5 },
      { name: "Mike", avgTime: 14.2 },
      { name: "Emma", avgTime: 16.8 },
      { name: "Alex", avgTime: 18.3 }
    ],
    successRatesByPlayer: [
      { name: "Sarah", successRate: 83 },
      { name: "Mike", successRate: 81 },
      { name: "Emma", successRate: 86 },
      { name: "Alex", successRate: 83 }
    ],
    insights: {
      fastestResponse: "8.2s",
      mostCreative: "Emma",
      mostConsistent: "Sarah"
    },
    categoryBreakdown: [
      {
        name: "Animals",
        totalWords: 15,
        completionRate: 85,
        topContributors: [
          { name: "Sarah", words: 5 },
          { name: "Mike", words: 4 },
          { name: "Emma", words: 3 },
          { name: "Alex", words: 3 }
        ]
      },
      {
        name: "Movies",
        totalWords: 12,
        completionRate: 70,
        topContributors: [
          { name: "Mike", words: 4 },
          { name: "Sarah", words: 3 },
          { name: "Emma", words: 3 },
          { name: "Alex", words: 2 }
        ]
      }
    ],
    letterUsage: {
      mostUsed: [
        { letter: "A", count: 8 },
        { letter: "B", count: 6 },
        { letter: "C", count: 5 },
        { letter: "D", count: 4 }
      ],
      unused: ["Q", "X", "Z", "J", "K", "V", "W", "Y"]
    },
    letterDifficulty: [
      { letter: "Q", difficulty: "Hard", avgTime: 25.3 },
      { letter: "X", difficulty: "Hard", avgTime: 22.1 },
      { letter: "A", difficulty: "Easy", avgTime: 8.5 },
      { letter: "B", difficulty: "Easy", avgTime: 9.2 }
    ],
    timeline: [
      { action: "Game Started", player: "System", time: "00:00", category: null },
      { action: "Selected Letter A", player: "Sarah", time: "00:15", category: "Animals" },
      { action: "Found Word: Antelope", player: "Sarah", time: "00:28", category: "Animals" },
      { action: "Selected Letter B", player: "Mike", time: "01:45", category: "Movies" },
      { action: "Found Word: Batman", player: "Mike", time: "01:58", category: "Movies" },
      { action: "Turn Passed", player: "Emma", time: "03:22", category: "Food" },
      { action: "Selected Letter C", player: "Alex", time: "04:10", category: "Sports" },
      { action: "Game Ended", player: "System", time: "24:35", category: null }
    ]
  };

  const winner = gameResults?.players?.[0];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleShare = (platform) => {
    const shareText = `Just finished an amazing LetterRush game! 🎉\n${winner?.name} won with ${winner?.score} points!\nTotal words found: ${gameResults?.gameStats?.totalWords}\nGame duration: ${gameResults?.gameStats?.duration}`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location?.href)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard?.writeText(shareText)?.then(() => {
          setShareMessage('Results copied to clipboard!');
          setTimeout(() => setShareMessage(''), 3000);
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Winner Announcement */}
        <WinnerAnnouncement 
          winner={winner} 
          gameStats={gameResults?.gameStats} 
        />

        {/* Share Message */}
        {shareMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-2 text-green-800">
              <Icon name="CheckCircle" size={20} />
              <span>{shareMessage}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Player Leaderboard */}
            <PlayerLeaderboard players={gameResults?.players} />

            {/* Game Summary */}
            <GameSummary 
              wordsByCategory={gameResults?.wordsByCategory}
              gameStats={gameResults?.gameStats}
            />

            {/* Detailed Analytics (Desktop Only) */}
            <div className="hidden lg:block">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="w-full mb-4 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 game-transition flex items-center justify-between"
              >
                <span className="font-semibold text-gray-800 flex items-center">
                  <Icon name="BarChart3" size={20} className="mr-2" />
                  {showAnalytics ? 'Hide' : 'Show'} Detailed Analytics
                </span>
                <Icon 
                  name={showAnalytics ? "ChevronUp" : "ChevronDown"} 
                  size={20} 
                  color="#6B7280" 
                />
              </button>
              
              {showAnalytics && (
                <DetailedAnalytics analytics={analyticsData} />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <GameActions 
              onShare={handleShare}
              gameData={gameResults?.quickStats}
            />
          </div>
        </div>

        {/* Mobile Analytics */}
        <div className="lg:hidden mt-8">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="w-full mb-4 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 game-transition flex items-center justify-between"
          >
            <span className="font-semibold text-gray-800 flex items-center">
              <Icon name="BarChart3" size={20} className="mr-2" />
              {showAnalytics ? 'Hide' : 'Show'} Detailed Analytics
            </span>
            <Icon 
              name={showAnalytics ? "ChevronUp" : "ChevronDown"} 
              size={20} 
              color="#6B7280" 
            />
          </button>
          
          {showAnalytics && (
            <DetailedAnalytics analytics={analyticsData} />
          )}
        </div>

        {/* Back to Top Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 game-transition flex items-center justify-center"
          >
            <Icon name="ArrowUp" size={20} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default GameResults;