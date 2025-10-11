import React from 'react';
import Header from '../layout/header/header';
import Sidebar from '../layout/siderBar/sidebar';
import AppRoutes from './AppRoutes';
import { useSidebar } from '../hooks/useSidebar';
import { menuItems } from '../config/menuData';

const AppLayout: React.FC = () => {
  const { collapse, isMobile, toggleSidebar, getMainMargin } = useSidebar();

  return (
    <div className="app-wrapper">
      <Header 
        onToggleSidebar={toggleSidebar} 
        collapse={collapse} 
      />
      <Sidebar collapse={collapse} menuItems={menuItems} />
      <main 
        className="app-main"
        style={{ 
          marginLeft: getMainMargin(),
          marginTop: '60px',
          padding: isMobile ? '1rem 0.5rem' : '1.5rem',
          transition: 'margin-left 0.3s ease',
          minHeight: 'calc(100vh - 60px)',
          backgroundColor: '#f8f9fa'
        }}
      >
        <AppRoutes />
      </main>
    </div>
  );
};

export default AppLayout;