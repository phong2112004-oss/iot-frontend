import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import facultyLogo from '../image/faculty_logo.png';
import universityLogo from '../image/university_logo.png';

function Sidebar() {
  return (
    <div className="sidebar-container">
      <div className="sidebar-logos-container">
        <img src={universityLogo} alt="University Logo" className="sidebar-logo-item" />
        <img src={facultyLogo} alt="FAE Logo" className="sidebar-logo-item" />
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