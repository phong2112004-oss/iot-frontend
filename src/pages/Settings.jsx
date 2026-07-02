import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../config/firebaseConfig';
import PageHeader from '../components/PageHeader';
import './Settings.css';

function Settings({ data }) {
  const [settingsForm, setSettingsForm] = useState({
    TEC_On_Threshold: 0,
    Tec_off: 0,
    Set_Frequency_Level1: 0,
    Set_Frequency_Level2: 0,
    Set_Frequency_Level3: 0
  });

  const isSystemOn = data && data.buttons && data.buttons.START === 1;

  useEffect(() => {
    if (data && data.temp) {
      setSettingsForm({
        TEC_On_Threshold: data.temp.TEC_On_Threshold ?? 0,
        Tec_off: data.temp.Tec_off ?? 0,
        Set_Frequency_Level1: data.temp.Set_Frequency_Level1 ?? 0,
        Set_Frequency_Level2: data.temp.Set_Frequency_Level2 ?? 0,
        Set_Frequency_Level3: data.temp.Set_Frequency_Level3 ?? 0
      });
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setSettingsForm(prev => ({
      ...prev,
      [field]: value === '' ? '' : Number(value)
    }));
  };

const handleSaveSettings = async (e) => {
    e.preventDefault();

    if (!isSystemOn) {
      alert('System is OFF. Please turn it ON to update settings.');
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsForm),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
      } else {
        alert('Update failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error connecting to API:', error);
      alert('Cannot connect to Backend server!');
    }
  };

  return (
    <div className="settings-page-layout">
        <PageHeader />
        {!isSystemOn ? (
            <div className="system-disabled-warning">
            <div className="warning-box">
                <span className="warning-icon">⚠️</span>
                <h2>System Disabled</h2>
                <p>The system is currently disabled. You cannot modify configuration parameters at this time.</p>
                <p className="warning-hint">Please turn on the <b>START</b> button on the monitor panel to activate the system.</p>
            </div>
            </div>
        ) : (
        <form onSubmit={handleSaveSettings} className="settings-form-wrapper">
            <div className="settings-grid">
          
            <div className="settings-card threshold-panel">
                <h2 className="panel-title text-orange">Threshold Control</h2>
                <div className="panel-divider"></div>
                
                <div className="input-group">
                <label>
                    <span className="icon-badge bg-orange">⚡</span>
                    ON Tec Threshold (°C)
                </label>
                <input
                    type="number"
                    step="0.1"
                    value={settingsForm.TEC_On_Threshold}
                    onChange={(e) => handleInputChange('TEC_On_Threshold', e.target.value)}
                    placeholder="Enter ON threshold..."
                />
                </div>

                <div className="input-group">
                <label>
                    <span className="icon-badge bg-red">❄️</span>
                    OFF Tec Threshold (°C)
                </label>
                <input
                    type="number"
                    step="0.1"
                    value={settingsForm.Tec_off}
                    onChange={(e) => handleInputChange('Tec_off', e.target.value)}
                    placeholder="Enter OFF threshold..."
                />
                </div>
            </div>

            <div className="settings-card inverter-panel">
                <h2 className="panel-title text-blue">Inverter Set Level Fequency (Hz)</h2>
                <div className="panel-divider"></div>

                <div className="input-group">
                <label>
                    <span className="icon-badge bg-green">1️⃣</span>
                    Frequency Level 1
                </label>
                <input
                    type="number"
                    value={settingsForm.Set_Frequency_Level1}
                    onChange={(e) => handleInputChange('Set_Frequency_Level1', e.target.value)}
                    placeholder="Frequency Level 1..."
                />
                </div>

                <div className="input-group">
                <label>
                    <span className="icon-badge bg-blue">2️⃣</span>
                    Frequency Level 2
                </label>
                <input
                    type="number"
                    value={settingsForm.Set_Frequency_Level2}
                    onChange={(e) => handleInputChange('Set_Frequency_Level2', e.target.value)}
                    placeholder="Frequency Level 2..."
                />
                </div>

                <div className="input-group">
                <label>
                    <span className="icon-badge bg-purple">3️⃣</span>
                    Frequency Level 3
                </label>
                <input
                    type="number"
                    value={settingsForm.Set_Frequency_Level3}
                    onChange={(e) => handleInputChange('Set_Frequency_Level3', e.target.value)}
                    placeholder="Frequency Level 3..."
                />
                </div>
            </div>

            </div>

            <div className="form-action-section">
            <button type="submit" className="btn-save-settings">
                💾 Save
            </button>
            </div>
        </form>
        )}
    </div>
  );
}

export default Settings;