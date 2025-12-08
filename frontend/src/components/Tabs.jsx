import React from 'react'

const Tabs = ({tabs, activeTab, setActiveTab}) => {
  return (
    <div classname='w-full my-2 '>
      <div className='flex lflex-col bg-violet-50 p-1 rounded-2xl border border-violet-100'>
        {tabs.map((tab) => (
          <button key={tab.label} className={`relative flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold rounded-xl transition-all
          ${activeTab === tab.label ? 'bg-violet-100 text-violet-700' : 'text-gray-600 hover:bg-violet-50'}`}
          onClick={() => setActiveTab(tab.label)}>
            <span className='relative z-10'>
              {tab.label}
              {activeTab === tab.label && (
                <div className='absolute inset-0 bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-xl'></div>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
