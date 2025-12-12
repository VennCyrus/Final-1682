import React from 'react'

const Tabs = ({tabs, activeTab, onChange}) => {
  return (
    <div className='w-full my-2 '>
      <div className='flex flex-col bg-violet-50 p-1 rounded-2xl border border-violet-100'>
        {tabs.map((tab) => (
          <button 
            key={tab.label || tab.labe} 
            className={`relative flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold rounded-xl transition-all
            ${activeTab === (tab.label || tab.labe) ? 'bg-violet-100 text-violet-700' : 'text-gray-600 hover:bg-violet-50'}`}
            onClick={() => onChange(tab.label || tab.labe)}
          >
            <span className='relative z-10'>
              {tab.label || tab.labe}
              {activeTab === (tab.label || tab.labe) && (
                <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl'></div>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
