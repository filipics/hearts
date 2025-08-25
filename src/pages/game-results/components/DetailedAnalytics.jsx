import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DetailedAnalytics = ({ analytics }) => {
  const [activeTab, setActiveTab] = useState('performance');

  const tabs = [
    { id: 'performance', label: 'Performance', icon: 'TrendingUp' },
    { id: 'categories', label: 'Categories', icon: 'Tag' },
    { id: 'letters', label: 'Letters', icon: 'Type' },
    { id: 'timeline', label: 'Timeline', icon: 'Clock' }
  ];

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
            <Icon name="Zap" size={16} className="mr-2" />
            Response Times
          </h4>
          <div className="space-y-2">
            {analytics?.responseTimesByPlayer?.map((player, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-blue-700">{player?.name}</span>
                <span className="font-medium text-blue-800">{player?.avgTime}s</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center">
            <Icon name="Target" size={16} className="mr-2" />
            Success Rates
          </h4>
          <div className="space-y-2">
            {analytics?.successRatesByPlayer?.map((player, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-green-700">{player?.name}</span>
                <span className="font-medium text-green-800">{player?.successRate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Performance Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{analytics?.insights?.fastestResponse}</div>
            <div className="text-sm text-gray-600">Fastest Response</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{analytics?.insights?.mostCreative}</div>
            <div className="text-sm text-gray-600">Most Creative</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{analytics?.insights?.mostConsistent}</div>
            <div className="text-sm text-gray-600">Most Consistent</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategoriesTab = () => (
    <div className="space-y-4">
      {analytics?.categoryBreakdown?.map((category, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-800">{category?.name}</h4>
            <span className="text-sm text-gray-600">{category?.totalWords} words</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className="bg-primary h-2 rounded-full game-transition"
              style={{ width: `${category?.completionRate}%` }}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {category?.topContributors?.map((contributor, idx) => (
              <div key={idx} className="text-xs text-center p-2 bg-gray-100 rounded">
                <div className="font-medium">{contributor?.name}</div>
                <div className="text-gray-600">{contributor?.words} words</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderLettersTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Most Used Letters</h4>
          <div className="space-y-2">
            {analytics?.letterUsage?.mostUsed?.map((letter, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="font-mono text-lg font-bold text-green-800">{letter?.letter}</span>
                <span className="text-sm text-green-700">{letter?.count} times</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Unused Letters</h4>
          <div className="flex flex-wrap gap-2">
            {analytics?.letterUsage?.unused?.map((letter, index) => (
              <div key={index} className="w-10 h-10 bg-red-100 border border-red-200 rounded flex items-center justify-center">
                <span className="font-mono font-bold text-red-800">{letter}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Letter Difficulty Analysis</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analytics?.letterDifficulty?.map((item, index) => (
            <div key={index} className="text-center">
              <div className="font-mono text-xl font-bold text-primary">{item?.letter}</div>
              <div className="text-sm text-gray-600">{item?.difficulty}</div>
              <div className="text-xs text-gray-500">{item?.avgTime}s avg</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimelineTab = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Game Timeline</h4>
        <div className="space-y-3">
          {analytics?.timeline?.map((event, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 bg-white rounded border">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{event?.action}</div>
                <div className="text-xs text-gray-600">{event?.player} • {event?.time}</div>
              </div>
              {event?.category && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{event?.category}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'performance':
        return renderPerformanceTab();
      case 'categories':
        return renderCategoriesTab();
      case 'letters':
        return renderLettersTab();
      case 'timeline':
        return renderTimelineTab();
      default:
        return renderPerformanceTab();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 game-shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Icon name="BarChart3" size={24} className="mr-2" />
          Detailed Analytics
        </h2>
        <p className="text-gray-600 mt-1">Comprehensive game performance breakdown</p>
      </div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm game-transition ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DetailedAnalytics;