import React from 'react';
import PageHeader from '../components/PageHeader';
import './Monitor.css';
import modelImg from '../image/model.jpg';

function Monitor({ data }) {
  const temp = data?.temp || {};
  const lamps = data?.lamps || {};
  const buttons = data?.buttons || {};

  const isSystemOn = buttons.START === 1;
  const isAutoMode = buttons.AUTO === 1;

  const baseUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';

  const sendButtonUpdate = async (updatedFields) => {
    try {
      const response = await fetch(`${baseUrl}/api/monitor/buttons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields), 
      });
      const result = await response.json();
      if (!result.success) {
        console.error("Error while updating button states:", result.message);
      }
    } catch (error) {
      console.error("Failed to connect to Backend API:", error);
    }
  };

  
  const handleToggleStart = () => {
    const nextStartStatus = buttons.START === 1 ? 0 : 1;
    if (nextStartStatus === 0) {
        sendButtonUpdate({
        'buttons/START': nextStartStatus,
        'buttons/E_Stop_HMI': nextStartStatus,
        'buttons/SF': 0,
        'buttons/EF': 0,
        'buttons/Wheel': 0,
        'buttons/TEC': 0,
        'lamps/SF_LAMP': 0,
        'lamps/EF_LAMP': 0,
        'lamps/WHEELER_LAMP': 0,
        'lamps/TEC_LAMP': 0
      });
    } else {
      sendButtonUpdate({
        'buttons/START': nextStartStatus,
        'buttons/E_Stop_HMI': nextStartStatus
      });
    }
  };

  const handleEmergencyStop = () => {
    if (buttons.E_Stop_HMI === 0) return; 
    sendButtonUpdate({
      'buttons/START': 0,
      'buttons/E_Stop_HMI': 0,
      'buttons/SF': 0,
      'buttons/EF': 0,
      'buttons/Wheel': 0,
      'buttons/TEC': 0,
      'lamps/SF_LAMP': 0, 
      'lamps/EF_LAMP': 0,
      'lamps/WHEELER_LAMP': 0,
      'lamps/TEC_LAMP': 0
    });
  };

  const handleToggleMode = () => {
    if (!isSystemOn) return;
    if (isAutoMode) {
      sendButtonUpdate({ 'buttons/AUTO': 0, 'buttons/MAN': 1 });
    } else {
      sendButtonUpdate({ 'buttons/AUTO': 1, 'buttons/MAN': 0 });
    }
  };

  const handleToggleDevice = (fieldName) => {
    if (!isSystemOn || isAutoMode) return;
    const currentValue = buttons[fieldName] || 0;
    const nextValue = currentValue === 1 ? 0 : 1;

    let lampFieldName = "";
    if (fieldName === 'SF') lampFieldName = 'SF_LAMP';
    else if (fieldName === 'EF') lampFieldName = 'EF_LAMP';
    else if (fieldName === 'Wheel') lampFieldName = 'WHEELER_LAMP';
    else if (fieldName === 'TEC') lampFieldName = 'TEC_LAMP';

    sendButtonUpdate({
      [`buttons/${fieldName}`]: nextValue,
      [`lamps/${lampFieldName}`]: nextValue
    });
  };

  return (
    <div className="monitor-page-layout">
      <PageHeader />

      <div className="monitor-main-content">
        
        <div className="monitor-left-panel">
          <div className="in-room-container">
            <h4 className="container-label">🏠 In Room Monitor</h4>
            <div className="in-room-grid">
              <div className="sub-sensor">
                <span>Temperature</span>
                <strong>{temp.Temp4_Indoor ?? 0} °C</strong>
              </div>
              <div className="sub-sensor">
                <span>CO2 Density</span>
                <strong className="text-orange">{temp.CO2 ?? 0} ppm</strong>
              </div>
            </div>
          </div>

          <div className="sensor-card">
            <h3>💨 Air Intake Temperature</h3>
            <div className="sensor-value text-blue">{temp.Temp1_air_intake ?? 0} °C</div>
          </div>

          <div className="sensor-card">
            <h3>🌀 Exhaust Fan Temperature</h3>
            <div className="sensor-value text-teal">{temp.Temp2_EF ?? 0} °C</div>
          </div>

          <div className="sensor-card">
            <h3>⚙️ Motor 3-Phase Temp</h3>
            <div className="sensor-value text-purple">{temp.Temp3_Motor3P ?? 0} °C</div>
          </div>

          <div className="sf-details-container">
            <h4 className="container-label">⚡ Supply Fan Status Details</h4>
            <div className="sf-details-grid">
              <div className="detail-item"><span>Speed:</span> <span>{temp.SF_Speed ?? 0} RPM</span></div>
              <div className="detail-item"><span>Voltage:</span> <span>{temp.SF_Voltage ?? 0} V</span></div>
              <div className="detail-item"><span>Current:</span> <span>{temp.SF_Current ?? 0} A</span></div>
              <div className="detail-item"><span>Frequency:</span> <span>{temp.SF_Frequency ?? 0} Hz</span></div>
            </div>
          </div>
        </div>

        <div className="monitor-center-panel">
          <div className="model-box-wrapper">
            <span className="box-title-tag">SYSTEM MODEL</span>
                
              <div className={`image-svg-container ${!isSystemOn ? 'block-gray-out' : ''}`} 
                   style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.3s ease' }}>
              
                <img 
                  src={modelImg} 
                  alt="Packaged System Model" 
                  style={{ 
                    maxHeight: '400px', 
                    width: 'auto', 
                    maxWidth: '100%', 
                    display: 'block',
                    zIndex: 1
                  }} 
                />

              <svg 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 2
                }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 2 L 5 5 L 0 8 z" fill="#ef4444" />
                  </marker>
                </defs>

                <path 
                  d="M 0,10 L 25,40 L 25,62 L 38,62" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="0.8" 
                  strokeDasharray="2,2" 
                  markerEnd="url(#arrow)"
                />

                <path 
                  d="M 0,35 L 35,35 L 35,45 L 38,45" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="0.8" 
                  strokeDasharray="2,2" 
                  markerEnd="url(#arrow)"
                />


                <path 
                  d="M 0,60 L 15,65 L 15,92 L 58,92 L 58,78" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="0.8" 
                  strokeDasharray="2,2" 
                  markerEnd="url(#arrow)"
                />
              </svg>
            </div>

            <div className="hardware-feedback-lamps">
              <div className="lamp-item">
              <div className={`lamp-circle ${lamps.SF_LAMP === 1 ? 'green' : 'red'}`}></div>
              <span className="lamp-name">SF</span>
            </div>
            <div className="lamp-item">
              <div className={`lamp-circle ${lamps.EF_LAMP === 1 ? 'green' : 'red'}`}></div>
              <span className="lamp-name">EF</span>
            </div>
            <div className="lamp-item">
              <div className={`lamp-circle ${lamps.WHEELER_LAMP === 1 ? 'green' : 'red'}`}></div>
              <span className="lamp-name">WHEEL</span>
            </div>
            <div className="lamp-item">
              <div className={`lamp-circle ${lamps.TEC_LAMP === 1 ? 'green' : 'red'}`}></div>
              <span className="lamp-name">TEC</span>
            </div>
            </div>
          </div>
        </div>

        <div className="monitor-right-panel">
          
          <div className="control-card power-phase-container">
            <h3>⚡ Power Supply Phase</h3>
            <div className="phase-lamp-row">
              <div className={`phase-circle ${lamps.R === 1 ? 'phase-r-on' : 'phase-off'}`}>R</div>
              <div className={`phase-circle ${lamps.S === 1 ? 'phase-s-on' : 'phase-off'}`}>S</div>
              <div className={`phase-circle ${lamps.T === 1 ? 'phase-t-on' : 'phase-off'}`}>T</div>
            </div>
          </div>

          <div className="control-card system-dynamics-card">
            
            <div className="control-row">
              <label className="toggle-label">🌐 System Activation (START)</label>
              <div className="switch-wrapper">
                <input 
                  type="checkbox" 
                  id="start-toggle" 
                  checked={isSystemOn} 
                  onChange={handleToggleStart}
                />
                <label htmlFor="start-toggle" className="slider-button"></label>
              </div>
            </div>

            <div className="control-row mt-3">
              <label className="toggle-label">🚨 Emergency Stop Button</label>
              <button 
                type="button"
                className={`btn-emergency-stop ${buttons.E_Stop_HMI === 1 ? 'estop-ready' : 'estop-disabled'}`}
                onClick={handleEmergencyStop}
                disabled={buttons.E_Stop_HMI === 0}
              >
                {buttons.E_Stop_HMI === 1 ? "🛑 PRESS E-STOP" : "🔒 LOCKED"}
              </button>
            </div>

            <div className="control-row mt-4 line-separator">
              <label className="toggle-label">🎯 Mode: {isAutoMode ? '⚡ AUTO' : '🔧 MANUAL'}</label>
              <div className={`switch-wrapper ${!isSystemOn ? 'disabled-opacity' : ''}`}>
                <input 
                  type="checkbox" 
                  id="mode-toggle" 
                  checked={isAutoMode}
                  disabled={!isSystemOn}
                  onChange={handleToggleMode}
                />
                <label htmlFor="mode-toggle" className="slider-button mode-slider"></label>
              </div>
            </div>
          </div>

          <div className={`control-card device-actuators-card ${(!isSystemOn || isAutoMode) ? 'block-gray-out' : ''}`}>
            <h3>🛠️ Manual Device Actuators</h3>
            <p className="card-hint-text">*Only available in MANUAL mode</p>
            
            {['SF', 'EF', 'Wheel', 'TEC'].map((device) => {
              const isChecked = buttons[device] === 1;
              return (
                <div className="control-row sub-device-row" key={device}>
                  <span className="device-name-tag">⚙️ Device {device}</span>
                  <div className="switch-wrapper">
                    <input 
                      type="checkbox" 
                      id={`toggle-${device}`} 
                      checked={isChecked}
                      disabled={!isSystemOn || isAutoMode}
                      onChange={() => handleToggleDevice(device)}
                    />
                    <label htmlFor={`toggle-${device}`} className="slider-button sub-slider"></label>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}

export default Monitor;