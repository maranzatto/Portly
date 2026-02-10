import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="content-area">
        <header className="header">
          <h4 className="mb-0">
            <span className="d-none d-md-inline">Cadastro de Visitantes</span>
            <span className="d-md-none">Visitantes</span>
          </h4>
          <div className="d-flex align-items-center">
            <i className="bi bi-person-circle" style={{ fontSize: '32px' }}></i>
          </div>
        </header>
        <main className="main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
