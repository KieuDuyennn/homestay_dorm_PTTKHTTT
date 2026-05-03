import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #EBF4FF 0%, #FDF2F8 50%, #F0FDF4 100%)' }}>
      <Sidebar />
      <main className="flex-1 ml-[240px] py-10 px-12">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
