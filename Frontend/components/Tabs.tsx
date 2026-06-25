import React, { useState, ReactNode } from 'react';

interface TabItem {
  title: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultIndex?: number;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultIndex = 0 }) => {
  const [selected, setSelected] = useState(defaultIndex);

  return (
    <div className="w-full">
      {/* Tab List */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-700 mb-4">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className={`px-4 py-2 -mb-px text-sm font-medium transition-colors rounded-t-lg focus:outline-none ${
              selected === idx
                ? 'border-b-2 border-teal-500 text-teal-600'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="pt-2">{tabs[selected].content}</div>
    </div>
  );
};
