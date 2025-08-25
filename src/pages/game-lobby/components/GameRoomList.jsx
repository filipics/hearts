import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const GameRoomList = ({ onJoinRoom }) => {
  const [joinCode, setJoinCode] = useState('');
  const [errors, setErrors] = useState({});

  // Mock available game rooms
  const availableRooms = [
    {
      id: 'room-001',
      hostName: 'Sarah Johnson',
      playerCount: 3,
      maxPlayers: 6,
      gameCode: 'WORD123',
      status: 'waiting',
      category: 'Animals',
      createdAt: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: 'room-002',
      hostName: 'Mike Chen',
      playerCount: 2,
      maxPlayers: 4,
      gameCode: 'RUSH456',
      status: 'waiting',
      category: 'Movies',
      createdAt: new Date(Date.now() - 600000) // 10 minutes ago
    },
    {
      id: 'room-003',
      hostName: 'Emma Davis',
      playerCount: 5,
      maxPlayers: 6,
      gameCode: 'PLAY789',
      status: 'waiting',
      category: 'Countries',
      createdAt: new Date(Date.now() - 120000) // 2 minutes ago
    }
  ];

  const handleJoinWithCode = () => {
    const trimmedCode = joinCode?.trim()?.toUpperCase();
    
    if (!trimmedCode) {
      setErrors({ joinCode: 'Please enter a game code' });
      return;
    }

    if (trimmedCode?.length !== 7) {
      setErrors({ joinCode: 'Game code must be 7 characters' });
      return;
    }

    const room = availableRooms?.find(room => room?.gameCode === trimmedCode);
    if (!room) {
      setErrors({ joinCode: 'Invalid game code' });
      return;
    }

    if (room?.playerCount >= room?.maxPlayers) {
      setErrors({ joinCode: 'Room is full' });
      return;
    }

    setErrors({});
    onJoinRoom(room);
  };

  const handleJoinRoom = (room) => {
    if (room?.playerCount >= room?.maxPlayers) {
      return;
    }
    onJoinRoom(room);
  };

  const getTimeAgo = (date) => {
    const minutes = Math.floor((Date.now() - date?.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Join with Code Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Hash" size={20} className="mr-2" />
          Join with Code
        </h3>
        
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter game code (e.g., WORD123)"
              value={joinCode}
              onChange={(e) => setJoinCode(e?.target?.value?.toUpperCase())}
              error={errors?.joinCode}
              maxLength={7}
            />
          </div>
          <Button
            variant="secondary"
            onClick={handleJoinWithCode}
            disabled={!joinCode?.trim()}
            iconName="LogIn"
            iconSize={16}
            className="px-4"
          >
            Join
          </Button>
        </div>
      </div>
      {/* Available Rooms Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Gamepad2" size={20} className="mr-2" />
          Available Rooms
        </h3>
        
        {availableRooms?.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <Icon name="Search" size={32} className="mx-auto mb-2 opacity-50" />
            <p>No available rooms found</p>
            <p className="text-sm mt-1">Create a new game or join with a code</p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableRooms?.map((room) => (
              <div
                key={room?.id}
                className="p-4 bg-card border border-border rounded-lg game-shadow hover:game-shadow-hover game-transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {room?.hostName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{room?.hostName}</p>
                      <p className="text-xs text-text-secondary">{getTimeAgo(room?.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-primary">
                      {room?.playerCount}/{room?.maxPlayers}
                    </p>
                    <p className="text-xs text-text-secondary">players</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="Tag" size={14} className="text-text-secondary" />
                      <span className="text-sm text-text-secondary">{room?.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Hash" size={14} className="text-text-secondary" />
                      <span className="text-sm font-mono text-text-secondary">{room?.gameCode}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-xs text-success capitalize">{room?.status}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => handleJoinRoom(room)}
                  disabled={room?.playerCount >= room?.maxPlayers}
                  iconName={room?.playerCount >= room?.maxPlayers ? "Lock" : "LogIn"}
                  iconPosition="left"
                  iconSize={14}
                  className="game-transition"
                >
                  {room?.playerCount >= room?.maxPlayers ? 'Room Full' : 'Join Room'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameRoomList;