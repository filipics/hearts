import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SquareGameBoard from './components/SquareGameBoard';
import CategoryCard from './components/CategoryCard';
import GameTimer from './components/GameTimer';
import PlayerInfo from './components/PlayerInfo';
import GameControls from './components/GameControls';
import ScoreBoard from './components/ScoreBoard';
import GameFlowController from '../../components/GameFlowController';

const MainGameBoard = () => {
  const navigate = useNavigate();

  // Game state
  const [gameState, setGameState] = useState({
    isActive: true,
    isPaused: false,
    currentPlayerIndex: 0,
    usedLetters: [],
    timerResetTrigger: 0,
    round: 1
  });

  // Sound control state
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Mock data for players
  const [players] = useState([
    { id: 1, name: "Alex Johnson", score: 45, wordsFound: 8 },
    { id: 2, name: "Sarah Chen", score: 38, wordsFound: 6 },
    { id: 3, name: "Mike Rodriguez", score: 52, wordsFound: 9 },
    { id: 4, name: "Emma Davis", score: 41, wordsFound: 7 }
  ]);

  // Mock categories
  const categories = [
    "Male Names", "Female Names", "Fruits", "Vegetables", "Animals", 
    "Countries", "Cities", "Movies", "Books", "Sports", "Colors", 
    "Professions", "Food Items", "Car Brands", "Musicians", "Athletes"
  ];

  const [currentCategory, setCurrentCategory] = useState(categories?.[0]);

  // Audio feedback simulation
  const playSound = (type) => {
    // In a real app, this would play actual audio files
    console.log(`Playing ${type} sound`);
  };

  // Handle letter selection
  const handleLetterSelect = (letter) => {
    if (gameState?.isPaused || gameState?.usedLetters?.includes(letter)) return;

    setGameState(prev => ({
      ...prev,
      usedLetters: [...prev?.usedLetters, letter],
      timerResetTrigger: prev?.timerResetTrigger + 1
    }));

    // Update player score (mock scoring)
    const currentPlayer = players?.[gameState?.currentPlayerIndex];
    if (currentPlayer) {
      currentPlayer.score += Math.floor(Math.random() * 10) + 5;
      currentPlayer.wordsFound = (currentPlayer?.wordsFound || 0) + 1;
    }

    playSound('letterSelect');
    
    // Move to next player
    handleNextPlayer();
  };

  // Handle sound toggle
  const handleToggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };

  // Handle ticking sound callback
  const handleTick = (timeLeft) => {
    if (isSoundEnabled && timeLeft > 0) {
      // Play ticking sound through GameTimer
      console.log('Tick sound - time left:', timeLeft);
    }
  };

  // Move to next player
  const handleNextPlayer = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayerIndex: (prev?.currentPlayerIndex + 1) % players?.length
    }));
  };

  // Handle timer expiration
  const handleTimeUp = () => {
    playSound('timeUp');
    handleNextPlayer();
  };

  // Handle pause/resume
  const handlePauseGame = () => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev?.isPaused,
      isActive: prev?.isPaused // Resume if paused, pause if active
    }));
  };

  // Handle reset timer
  const handleResetTimer = () => {
    setGameState(prev => ({
      ...prev,
      timerResetTrigger: prev?.timerResetTrigger + 1
    }));
  };

  // Handle end game
  const handleEndGame = () => {
    navigate('/game-results');
  };

  // Handle category refresh
  const handleRefreshCategory = () => {
    const randomCategory = categories?.[Math.floor(Math.random() * categories?.length)];
    setCurrentCategory(randomCategory);
  };

  // Check if game should end (all letters used or other conditions)
  useEffect(() => {
    if (gameState?.usedLetters?.length >= 20) { // End game when 20 letters are used
      setTimeout(() => {
        navigate('/game-results');
      }, 2000);
    }
  }, [gameState?.usedLetters?.length, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Player Info & Controls (Desktop) */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <PlayerInfo 
              players={players}
              currentPlayerIndex={gameState?.currentPlayerIndex}
              usedLettersCount={gameState?.usedLetters?.length}
            />
            
            <div className="hidden lg:block">
              <ScoreBoard players={players} />
            </div>
          </div>

          {/* Main Game Area */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Category Card */}
            <CategoryCard 
              category={currentCategory}
              onRefresh={handleRefreshCategory}
              disabled={gameState?.isPaused}
            />

            {/* Timer */}
            <GameTimer 
              initialTime={20}
              isActive={gameState?.isActive && !gameState?.isPaused}
              onTimeUp={handleTimeUp}
              resetTrigger={gameState?.timerResetTrigger}
              onTick={handleTick}
              isSoundEnabled={isSoundEnabled}
            />

            {/* Square Game Board */}
            <div className="flex justify-center mb-6">
              <SquareGameBoard 
                usedLetters={gameState?.usedLetters}
                onLetterSelect={handleLetterSelect}
                disabled={gameState?.isPaused}
              />
            </div>

            {/* Game Controls */}
            <GameControls 
              onPauseGame={handlePauseGame}
              onEndGame={handleEndGame}
              onResetTimer={handleResetTimer}
              onToggleSound={handleToggleSound}
              isPaused={gameState?.isPaused}
              isSoundEnabled={isSoundEnabled}
            />

            {/* Game Flow Controller */}
            <GameFlowController 
              currentScreen="game"
              gameState={gameState}
              canNavigateBack={true}
              disabled={gameState?.isActive && !gameState?.isPaused}
              onNavigate={() => {}} // Added missing required prop
            />
          </div>

          {/* Right Sidebar - Scoreboard (Desktop) */}
          <div className="lg:col-span-1 order-3">
            <div className="lg:hidden mb-6">
              <ScoreBoard players={players} />
            </div>
            
            {/* Game Stats */}
            <div className="bg-card border border-border rounded-lg p-4 game-shadow">
              <h3 className="font-bold text-text-primary mb-4">Game Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Round</span>
                  <span className="font-medium text-text-primary">{gameState?.round}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Letters Used</span>
                  <span className="font-medium text-text-primary">{gameState?.usedLetters?.length}/26</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Current Turn</span>
                  <span className="font-medium text-text-primary">
                    {players?.[gameState?.currentPlayerIndex]?.name || "Player 1"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Status</span>
                  <span className={`font-medium ${gameState?.isPaused ? 'text-warning' : 'text-success'}`}>
                    {gameState?.isPaused ? 'Paused' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainGameBoard;