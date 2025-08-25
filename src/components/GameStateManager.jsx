import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameStateContext = createContext();

const initialState = {
  phase: 'lobby', // 'lobby' | 'game' | 'results'
  players: [],
  currentPlayer: null,
  gameData: {
    score: 0,
    timeRemaining: 0,
    round: 1,
    category: null,
    usedLetters: [],
    foundWords: []
  },
  gameHistory: [],
  navigationEnabled: true,
  isLoading: false,
  error: null
};

const gameStateReducer = (state, action) => {
  switch (action?.type) {
    case 'SET_PHASE':
      return {
        ...state,
        phase: action?.payload,
        navigationEnabled: true
      };

    case 'SET_PLAYERS':
      return {
        ...state,
        players: action?.payload
      };

    case 'SET_CURRENT_PLAYER':
      return {
        ...state,
        currentPlayer: action?.payload
      };

    case 'UPDATE_GAME_DATA':
      return {
        ...state,
        gameData: {
          ...state?.gameData,
          ...action?.payload
        }
      };

    case 'START_GAME':
      return {
        ...state,
        phase: 'game',
        gameData: {
          ...state?.gameData,
          timeRemaining: action?.payload?.timeLimit || 60,
          round: 1,
          score: 0,
          usedLetters: [],
          foundWords: []
        },
        navigationEnabled: false
      };

    case 'END_GAME':
      return {
        ...state,
        phase: 'results',
        navigationEnabled: true,
        gameHistory: [
          ...state?.gameHistory,
          {
            id: Date.now(),
            players: state?.players,
            finalScore: state?.gameData?.score,
            foundWords: state?.gameData?.foundWords,
            completedAt: new Date()?.toISOString()
          }
        ]
      };

    case 'RESET_GAME':
      return {
        ...state,
        phase: 'lobby',
        gameData: {
          score: 0,
          timeRemaining: 0,
          round: 1,
          category: null,
          usedLetters: [],
          foundWords: []
        },
        currentPlayer: null,
        navigationEnabled: true,
        error: null
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action?.payload,
        navigationEnabled: !action?.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action?.payload,
        isLoading: false
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    case 'DISABLE_NAVIGATION':
      return {
        ...state,
        navigationEnabled: false
      };

    case 'ENABLE_NAVIGATION':
      return {
        ...state,
        navigationEnabled: true
      };

    default:
      return state;
  }
};

export const GameStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameStateReducer, initialState);

  // Auto-save game state to localStorage
  useEffect(() => {
    const gameStateToSave = {
      phase: state?.phase,
      players: state?.players,
      gameData: state?.gameData,
      gameHistory: state?.gameHistory
    };
    localStorage.setItem('letterrush-game-state', JSON.stringify(gameStateToSave));
  }, [state?.phase, state?.players, state?.gameData, state?.gameHistory]);

  // Load saved game state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('letterrush-game-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'SET_PHASE', payload: parsedState?.phase });
        dispatch({ type: 'SET_PLAYERS', payload: parsedState?.players || [] });
        dispatch({ type: 'UPDATE_GAME_DATA', payload: parsedState?.gameData || {} });
        if (parsedState?.gameHistory) {
          dispatch({ type: 'UPDATE_GAME_DATA', payload: { gameHistory: parsedState?.gameHistory } });
        }
      } catch (error) {
        console.error('Failed to load saved game state:', error);
      }
    }
  }, []);

  const navigate = (targetPhase, gameData = {}) => {
    if (!state?.navigationEnabled) {
      console.warn('Navigation is currently disabled');
      return false;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    // Simulate async navigation with validation
    setTimeout(() => {
      try {
        if (Object.keys(gameData)?.length > 0) {
          dispatch({ type: 'UPDATE_GAME_DATA', payload: gameData });
        }
        dispatch({ type: 'SET_PHASE', payload: targetPhase });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error?.message });
      }
    }, 300);

    return true;
  };

  const contextValue = {
    state,
    dispatch,
    navigate,
    // Helper functions
    startGame: (gameConfig) => {
      dispatch({ type: 'START_GAME', payload: gameConfig });
    },
    endGame: () => {
      dispatch({ type: 'END_GAME' });
    },
    resetGame: () => {
      dispatch({ type: 'RESET_GAME' });
    },
    updateScore: (newScore) => {
      dispatch({ type: 'UPDATE_GAME_DATA', payload: { score: newScore } });
    },
    updateTimer: (timeRemaining) => {
      dispatch({ type: 'UPDATE_GAME_DATA', payload: { timeRemaining } });
    },
    addFoundWord: (word) => {
      const updatedWords = [...state?.gameData?.foundWords, word];
      dispatch({ type: 'UPDATE_GAME_DATA', payload: { foundWords: updatedWords } });
    },
    setError: (error) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },
    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' });
    }
  };

  return (
    <GameStateContext.Provider value={contextValue}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

export default GameStateProvider;