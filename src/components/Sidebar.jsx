import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar-container">
      <div className="sidebar-logo-section">
        <div className="logo-placeholder">Logo</div>
        <div className="logo-placeholder">Logo</div>
      </div>
      
      <nav className="sidebar-menu">
        <NavLink to="/overview" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <span className="menu-text">Overview</span>
        </NavLink>

        <NavLink to="/monitor" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <span className="menu-text">Monitor</span>
        </NavLink>

        <NavLink to="/analyzed" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <span className="menu-text">Analyzed</span>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <span className="menu-text">Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;