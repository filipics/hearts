import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryCard = ({ 
  category = "Loading...", 
  onRefresh, 
  disabled = false 
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 game-shadow mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-text-secondary mb-2">Current Category</h3>
          <p className="text-2xl font-bold text-text-primary">{category}</p>
        </div>
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={disabled}
            className={`
              ml-4 p-2 rounded-lg border border-border bg-background
              game-transition hover:bg-muted
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-label="Get new category"
          >
            <Icon name="RefreshCw" size={20} color="var(--color-text-secondary)" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;