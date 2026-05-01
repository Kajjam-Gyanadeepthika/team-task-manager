import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="container"><p>Loading dashboard...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <div className="stats">
        <div className="stat-card">
          <h3>{data.totalTasks}</h3>
          <p>Total Tasks</p>
        </div>
        <div className="stat-card">
          <h3>{data.completedTasks}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h3>{data.overdueTasks}</h3>
          <p>Overdue</p>
        </div>
        <div className="stat-card">
          <h3>{data.projects}</h3>
          <p>Projects</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;