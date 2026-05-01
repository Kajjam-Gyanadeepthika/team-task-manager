import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [projectsRes, usersRes] = await Promise.all([
        axios.get('/api/projects', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/projects', { name, description, members }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName('');
      setDescription('');
      setMembers([]);
      setSuccess('Project created successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Project deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  if (loading) return <div className="container"><p>Loading projects...</p></div>;

  return (
    <div className="container">
      <h2>Projects</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        <select multiple value={members} onChange={(e) => setMembers(Array.from(e.target.selectedOptions, option => option.value))}>
          <option value="">Select Members</option>
          {users.map(user => <option key={user._id} value={user._id}>{user.name} ({user.email})</option>)}
        </select>
        <button type="submit">Create Project</button>
      </form>
      <ul>
        {projects.map(project => (
          <li key={project._id}>
            <div className="item-header">
              <h3>{project.name}</h3>
              <button className="delete-btn" onClick={() => handleDeleteProject(project._id)}>Delete</button>
            </div>
            <p>{project.description}</p>
            <p>Members: {project.members?.map(m => m.name).join(', ') || 'No members'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;