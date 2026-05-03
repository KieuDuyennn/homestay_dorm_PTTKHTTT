function TabBar({ tabs = [], activeTab, onTabChange }) {
  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={activeTab === tab.value ? 'active' : ''}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default TabBar;
