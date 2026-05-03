import { Outlet } from 'react-router-dom';
import AppHeader from '../common/AppHeader';

function MainLayout() {
  return (
    <div className="main-layout">
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
