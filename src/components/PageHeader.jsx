import React, { useState, useEffect } from 'react';
import './PageHeader.css';

function PageHeader() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page-header-container">
      <h1 className="page-title-text">Graduation Thesis</h1>
      <div className="page-clock-text">{time}</div>
    </div>
  );
}

export default PageHeader;