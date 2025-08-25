import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { GameStateProvider } from "./components/GameStateManager";
import NotFound from "pages/NotFound";
import GameLobby from './pages/game-lobby';
import MainGameBoard from './pages/main-game-board';
import GameResults from './pages/game-results';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <GameStateProvider>
          <ScrollToTop />
          <RouterRoutes>
            {/* Define your route here */}
            <Route path="/" element={<GameLobby />} />
            <Route path="/game-lobby" element={<GameLobby />} />
            <Route path="/main-game-board" element={<MainGameBoard />} />
            <Route path="/game-results" element={<GameResults />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </GameStateProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;