function AppHeader({ title }) {
  return (
    <header className="app-header">
      <h1>{title || 'HomeStay Dorm'}</h1>
    </header>
  );
}

export default AppHeader;
