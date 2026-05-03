import React from 'react';

const TabBar = ({ dsTabs, activeTab, onSwitchTab }) => {
  return (
    <div className="border-b border-gray-200 w-full overflow-x-auto">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {dsTabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => onSwitchTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${isActive 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-slate hover:text-navy hover:border-gray-300'
                }
              `}
            >
              {tab}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabBar;
