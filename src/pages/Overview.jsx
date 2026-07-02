import React, { useState, useEffect } from 'react';
import './Overview.css';
import PageHeader from '../components/PageHeader';

function Overview({ data }) {
  const [alertLogs, setAlertLogs] = useState([]);

  const THRESHOLDS = {
    Temp1_air_intake: 40,
    Temp2_EF: 40,
    Temp3_Motor3P: 40,
    Temp4_Indoor: 40,
    CO2: 1000
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!data || !data.temp) return;

      const { temp } = data;
      const currentTime = new Date().toLocaleTimeString();
      let newAlerts = [];

      if (temp.Temp1_air_intake > THRESHOLDS.Temp1_air_intake) {
        newAlerts.push({
          name: "High Temperature (Air Intake)",
          level: "High",
          value: `${temp.Temp1_air_intake} °C`,
          time: currentTime
        });
      }

      if (temp.Temp2_EF > THRESHOLDS.Temp2_EF) {
        newAlerts.push({
          name: "High Temperature (EF)",
          level: "High",
          value: `${temp.Temp2_EF} °C`,
          time: currentTime
        });
      }

      if (temp.Temp3_Motor3P > THRESHOLDS.Temp3_Motor3P) {
        newAlerts.push({
          name: "High Temperature (Motor 3P)",
          level: "High",
          value: `${temp.Temp3_Motor3P} °C`,
          time: currentTime
        });
      }

      if (temp.Temp4_Indoor > THRESHOLDS.Temp4_Indoor) {
        newAlerts.push({
          name: "High Temperature (Indoor)",
          level: "High",
          value: `${temp.Temp4_Indoor} °C`,
          time: currentTime
        });
      }

      if (temp.CO2 > THRESHOLDS.CO2) {
        newAlerts.push({
          name: "High Concentration (CO2)",
          level: "High",
          value: `${temp.CO2} ppm`,
          time: currentTime
        });
      }

      if (newAlerts.length > 0) {
        setAlertLogs(prevLogs => {
          const updatedLogs = [...newAlerts, ...prevLogs];
          return updatedLogs.slice(0, 10);
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [data]);

  if (!data) return <div className="loading-state">Connecting to data source...</div>;

  const { lamps = {} } = data;

  return (
    <div className="overview-layout">
      <PageHeader />
      <div className="content-grid">
        
        <div className="left-column">
          <div className="image-box">
            <div className="model-placeholder">
              <span className="inner-text">Model</span>
            </div>
          </div>

          <div className="lamps-control-panel">
            <div className="lamp-item">
              <div className={`lamp-circle ${lamps.SF_LAMP === 1 ? 'green' : 'red'}`}></div>
              <span className="lamp-name">SF_LAMP</span>
            </div>
            <div className="lamp-item">
              <div className={`lamp-circle ${lamps.EF_LAMP === 1 ? 'green' : 'red'}`}></div>
              <span className="lamp-name">EF_LAMP</span>
            </div>
            <div className="lamp-item">
              <div className={`lamp-circle ${lamps.WHEELER_LAMP === 1 ? 'green' : 'red'}`}></div>
              <span className="lamp-name">WHEELER_LAMP</span>
            </div>
            <div className="lamp-item">
              <div className={`lamp-circle ${lamps.TEC_LAMP === 1 ? 'green' : 'red'}`}></div>
              <span className="lamp-name">TEC_LAMP</span>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="component-wrapper">
            <span className="box-tag">Realtime Map</span>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.479507314275!2d106.77242427592476!3d10.851432489301918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f5035f3b%3A0x92cb2e1e07b81966!2zMSBWw7UgVsSDbiBOZ8G6biwgTGluaCBDaGnhu4MstyleLCBUaOG7pyDEkOG7qWMsIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1719840000000!5m2!1sen!2s" 
              width="100%" 
              height="220" 
              style={{ border: 0, borderRadius: '4px' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="component-wrapper">
            <span className="box-tag">Warning Summary</span>
            <table className="realtime-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Level</th>
                  <th>Value</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {alertLogs.length > 0 ? (
                  alertLogs.map((log, index) => (
                    <tr key={index}>
                      <td className="param-name">{log.name}</td>
                      <td>
                        <span className={`level-badge ${log.level.toLowerCase()}`}>
                          {log.level}
                        </span>
                      </td>
                      <td className="param-val">{log.value}</td>
                      <td className="param-time">{log.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data-row">no data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Overview;