import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav className="nav-links">
        <Link to="/visitors" className="active">
          <i className="bi bi-people-fill"></i>
          <span>Visitantes</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
