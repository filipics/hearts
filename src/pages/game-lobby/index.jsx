import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../../components/GameStateManager';
import Header from '../../components/ui/Header';
import GameLogo from './components/GameLogo';
import PlayerSetup from './components/PlayerSetup';
import GameRoomList from './components/GameRoomList';
import GameStats from './components/GameStats';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const GameLobby = () => {
  const navigate = useNavigate();
  const { state, dispatch, startGame } = useGameState();
  const [players, setPlayers] = useState([]);
  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'join'
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    // Load saved players if any
    if (state?.players && state?.players?.length > 0) {
      setPlayers(state?.players);
    }
  }, [state?.players]);

  const handlePlayersChange = (newPlayers) => {
    setPlayers(newPlayers);
    dispatch({ type: 'SET_PLAYERS', payload: newPlayers });
  };

  const handleStartGame = async () => {
    if (players?.length < 2) return;

    setIsStarting(true);
    
    try {
      // Set up game configuration
      const gameConfig = {
        players: players,
        timeLimit: 20,
        maxRounds: 10,
        categories: ['Animals', 'Movies', 'Countries', 'Foods', 'Sports', 'Colors']
      };

      // Update game state
      dispatch({ type: 'SET_PLAYERS', payload: players });
      dispatch({ type: 'SET_CURRENT_PLAYER', payload: players?.[0] });
      
      // Start the game
      startGame(gameConfig);
      
      // Navigate to game board after a short delay
      setTimeout(() => {
        navigate('/main-game-board');
      }, 1000);
      
    } catch (error) {
      console.error('Failed to start game:', error);
      setIsStarting(false);
    }
  };

  const handleJoinRoom = (room) => {
    // Mock joining a room - in real app this would connect to the room
    const mockPlayers = [
      { id: Date.now(), name: 'You', score: 0, isHost: false },
      { id: room?.id, name: room?.hostName, score: 0, isHost: true }
    ];
    
    setPlayers(mockPlayers);
    dispatch({ type: 'SET_PLAYERS', payload: mockPlayers });
    
    // Auto-start after joining
    setTimeout(() => {
      handleStartGame();
    }, 500);
  };

  const tabs = [
    { id: 'create', label: 'Create Game', icon: 'Plus' },
    { id: 'join', label: 'Join Game', icon: 'LogIn' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Game Logo */}
          <GameLogo />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg game-shadow p-6">
                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
                  {tabs?.map((tab) => (
                    <Button
                      key={tab?.id}
                      variant={activeTab === tab?.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTab(tab?.id)}
                      iconName={tab?.icon}
                      iconPosition="left"
                      iconSize={16}
                      fullWidth
                      className="game-transition"
                    >
                      {tab?.label}
                    </Button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                  {activeTab === 'create' ? (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-text-primary mb-2">
                          Create New Game
                        </h2>
                        <p className="text-text-secondary">
                          Add players and start your word game adventure
                        </p>
                      </div>
                      
                      <PlayerSetup
                        players={players}
                        onPlayersChange={handlePlayersChange}
                        onStartGame={handleStartGame}
                      />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-text-primary mb-2">
                          Join Existing Game
                        </h2>
                        <p className="text-text-secondary">
                          Enter a game code or select from available rooms
                        </p>
                      </div>
                      
                      <GameRoomList onJoinRoom={handleJoinRoom} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Stats and Info */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg game-shadow p-6">
                <GameStats gameHistory={state?.gameHistory} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                iconName="HelpCircle"
                iconPosition="left"
                iconSize={16}
                className="game-transition"
              >
                How to Play
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                iconName="Settings"
                iconPosition="left"
                iconSize={16}
                className="game-transition"
              >
                Game Settings
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                iconName="Trophy"
                iconPosition="left"
                iconSize={16}
                className="game-transition"
              >
                Leaderboard
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Loading Overlay */}
      {isStarting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg p-8 text-center game-shadow-hover">
            <div className="w-12 h-12 mx-auto mb-4 animate-spin">
              <Icon name="Loader2" size={48} color="var(--color-primary)" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Starting Game...
            </h3>
            <p className="text-text-secondary">
              Preparing the game board for {players?.length} players
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLobby;