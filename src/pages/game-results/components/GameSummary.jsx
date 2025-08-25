import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const GameSummary = ({ wordsByCategory, gameStats }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 game-shadow mb-6">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Icon name="BookOpen" size={24} className="mr-2" />
          Game Summary
        </h2>
        <p className="text-gray-600 mt-1">Complete word list organized by category</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <Icon name="Clock" size={24} color="#1E40AF" className="mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">{gameStats?.totalDuration}</div>
            <div className="text-sm text-blue-600">Total Duration</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Icon name="CheckCircle" size={24} color="#059669" className="mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{gameStats?.totalWords}</div>
            <div className="text-sm text-green-600">Words Found</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <Icon name="AlertCircle" size={24} color="#D97706" className="mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-800">{gameStats?.unusedLetters}</div>
            <div className="text-sm text-orange-600">Unused Letters</div>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(wordsByCategory)?.map(([category, data]) => (
            <div key={category} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 game-transition"
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={data?.challenging ? "Zap" : "Tag"} 
                    size={20} 
                    color={data?.challenging ? "#DC2626" : "#6B7280"} 
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{category}</h3>
                    <p className="text-sm text-gray-600">
                      {data?.words?.length} words • {data?.challenging ? "Challenging" : "Standard"}
                    </p>
                  </div>
                </div>
                <Icon 
                  name={expandedCategory === category ? "ChevronUp" : "ChevronDown"} 
                  size={20} 
                  color="#6B7280" 
                />
              </button>
              
              {expandedCategory === category && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-3">
                    {data?.words?.map((wordData, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-sm text-center ${
                          wordData?.creative 
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="font-medium">{wordData?.word}</div>
                        <div className="text-xs opacity-75">by {wordData?.player}</div>
                        {wordData?.creative && (
                          <div className="text-xs mt-1 flex items-center justify-center">
                            <Icon name="Star" size={12} color="#D97706" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSummary;