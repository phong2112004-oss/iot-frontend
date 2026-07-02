import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from './config/firebaseConfig';

import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

import Overview from './pages/Overview';
import Monitor from './pages/Monitor';
import Analyzed from './pages/Analyzed';
import Settings from './pages/Settings';

import './App.css';

function App() {
  const [firebaseData, setFirebaseData] = useState(null);

  useEffect(() => {
    console.log("Đang thiết lập kết nối Firebase...");
    const dashboardRef = ref(database, '/');
    
    const unsubscribe = onValue(dashboardRef, (snapshot) => {
      console.log("Dữ liệu mới nhận từ Firebase:", snapshot.val());
      setFirebaseData(snapshot.val());
    }, (error) => {
      console.error("Lỗi kết nối Firebase:", error);
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        
        <MainContent>
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            
            <Route path="/overview" element={<Overview data={firebaseData} />} />
            <Route path="/monitor" element={<Monitor data={firebaseData} />} />
            <Route path="/analyzed" element={<Analyzed data={firebaseData} />} />
            <Route path="/settings" element={<Settings data={firebaseData} />} />
          </Routes>
        </MainContent>
      </div>
    </Router>
  );
}

export default App;