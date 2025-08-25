import React from 'react';
import LetterTile from './LetterTile';

const SquareGameBoard = ({ 
  usedLetters = [], 
  onLetterSelect, 
  disabled = false 
}) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'?.split('');
  
  // Arrange letters in alphabetical order in a 6x5 grid (26 letters)
  const createGrid = () => {
    const grid = [];
    let letterIndex = 0;
    
    // Create 5 rows of 6 columns, except last row has 2 letters
    for (let row = 0; row < 5; row++) {
      const currentRow = [];
      const lettersInRow = row === 4 ? 2 : 6; // Last row only has 2 letters (Y, Z)
      
      for (let col = 0; col < lettersInRow; col++) {
        if (letterIndex < letters?.length) {
          currentRow?.push(letters?.[letterIndex]);
          letterIndex++;
        }
      }
      grid?.push(currentRow);
    }
    
    return grid;
  };

  const letterGrid = createGrid();

  return (
    <div className="bg-card border-2 border-primary rounded-xl p-6 game-shadow-hover max-w-md mx-auto">
      <div className="space-y-3">
        {letterGrid?.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className={`flex gap-3 ${rowIndex === 4 ? 'justify-center' : 'justify-between'}`}
          >
            {row?.map((letter) => {
              const isUsed = usedLetters?.includes(letter);
              
              return (
                <LetterTile
                  key={letter}
                  letter={letter}
                  isUsed={isUsed}
                  disabled={disabled || isUsed}
                  onClick={() => onLetterSelect(letter)}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Game Board Title */}
      <div className="mt-4 text-center">
        <span className="text-sm font-medium text-text-secondary">
          Select a Letter
        </span>
      </div>
    </div>
  );
};

export default SquareGameBoard;