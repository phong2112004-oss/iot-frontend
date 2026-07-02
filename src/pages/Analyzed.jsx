import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Analyzed.css';
import PageHeader from '../components/PageHeader';

function Analyzed({ data }) {
  const [chartData, setChartData] = useState([]);
  const [alertLogs, setAlertLogs] = useState([]);
  
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const THRESHOLDS = {
    Temp1_air_intake: 40,
    Temp2_EF: 40,
    Temp3_Motor3P: 40,
    Temp4_Indoor: 40,
    CO2: 1000
  };

  useEffect(() => {
    const sampleInterval = setInterval(() => {
      const currentFirebaseData = dataRef.current;
      if (!currentFirebaseData || !currentFirebaseData.temp) return;

      const { temp } = currentFirebaseData;
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const newSample = {
        time: timestamp,
        'Air Intake': temp.Temp1_air_intake ?? 0,
        'EF Temp': temp.Temp2_EF ?? 0,
        'Motor 3P': temp.Temp3_Motor3P ?? 0,
        'Indoor': temp.Temp4_Indoor ?? 0,
        'CO2': temp.CO2 ?? 0
      };

      setChartData(prevData => {
        const updated = [...prevData, newSample];
        if (updated.length > 10) {
          return updated.slice(updated.length - 10);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(sampleInterval);
  }, []);

  useEffect(() => {
    const alertInterval = setInterval(() => {
      if (!data || !data.temp) return;

      const { temp } = data;
      const currentTime = new Date().toLocaleTimeString();
      let newAlerts = [];

      if (temp.Temp1_air_intake > THRESHOLDS.Temp1_air_intake) {
        newAlerts.push({ name: "High Temperature (Air Intake)", level: "High", value: `${temp.Temp1_air_intake} °C`, time: currentTime });
      }
      if (temp.Temp2_EF > THRESHOLDS.Temp2_EF) {
        newAlerts.push({ name: "High Temperature (EF)", level: "High", value: `${temp.Temp2_EF} °C`, time: currentTime });
      }
      if (temp.Temp3_Motor3P > THRESHOLDS.Temp3_Motor3P) {
        newAlerts.push({ name: "High Temperature (Motor 3P)", level: "High", value: `${temp.Temp3_Motor3P} °C`, time: currentTime });
      }
      if (temp.Temp4_Indoor > THRESHOLDS.Temp4_Indoor) {
        newAlerts.push({ name: "High Temperature (Indoor)", level: "High", value: `${temp.Temp4_Indoor} °C`, time: currentTime });
      }
      if (temp.CO2 > THRESHOLDS.CO2) {
        newAlerts.push({ name: "High Concentration (CO2)", level: "High", value: `${temp.CO2} ppm`, time: currentTime });
      }

      if (newAlerts.length > 0) {
        setAlertLogs(prevLogs => {
          const updatedLogs = [...newAlerts, ...prevLogs];
          return updatedLogs.slice(0, 10);
        });
      }
    }, 1000);

    return () => clearInterval(alertInterval);
  }, [data]);

  if (!data) return <div className="loading-state">Loading analyzed charts...</div>;

  return (
    <div className="analyzed-layout">
      <PageHeader />
      <div className="charts-grid">
        
        <div className="chart-card">
          <h3 className="chart-title">Temperature Chart</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 'auto']} />
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', pt: 10 }} />
                <Line type="monotone" dataKey="Air Intake" stroke="#ff7300" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="EF Temp" stroke="#387908" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Motor 3P" stroke="#f44336" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Indoor" stroke="#2196f3" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">CO2 Chart</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 'auto']} />
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="CO2" stroke="#009688" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="warning-section">
        <h3 className="section-title">Alerts and Notifications</h3>
        <div className="analyzed-table-wrapper">
          <table className="analyzed-realtime-table">
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
                    <td className="m-param-name">{log.name}</td>
                    <td>
                      <span className={`m-level-badge ${log.level.toLowerCase()}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="m-param-val">{log.value}</td>
                    <td className="m-param-time">{log.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="m-no-data-row">no data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analyzed;