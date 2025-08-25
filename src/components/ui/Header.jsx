import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/game-lobby', label: 'Game Lobby', icon: 'Users' },
    { path: '/main-game-board', label: 'Play Game', icon: 'Play' },
    { path: '/game-results', label: 'Results', icon: 'Trophy' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full bg-card border-b border-border game-shadow sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">LetterRush</h1>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center space-x-2">
          {navigationItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className="game-transition"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            iconName={isMobileMenuOpen ? "X" : "Menu"}
            iconSize={20}
            className="game-transition"
            onClick={toggleMobileMenu}
          >
            Menu
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            iconSize={16}
            className="game-transition"
          >
            Settings
          </Button>
          <Button
            variant="secondary"
            size="sm"
            iconName="HelpCircle"
            iconPosition="left"
            iconSize={16}
            className="game-transition"
          >
            Help
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="flex flex-col space-y-1 p-4">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleNavigation(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                iconSize={16}
                fullWidth
                className="justify-start game-transition"
              >
                {item?.label}
              </Button>
            ))}
            <div className="border-t border-border pt-2 mt-2 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                iconName="Settings"
                iconPosition="left"
                iconSize={16}
                fullWidth
                className="justify-start game-transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="HelpCircle"
                iconPosition="left"
                iconSize={16}
                fullWidth
                className="justify-start game-transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Help
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;