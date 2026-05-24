import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout-container">
      <header className="main-header">
        <nav className="nav-tabs">
          <NavLink 
            to="/view" 
            className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}
          >
            VIEW
          </NavLink>
          <NavLink 
            to="/write" 
            className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}
          >
            WRITE
          </NavLink>
        </nav>
      </header>
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
