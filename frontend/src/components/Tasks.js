import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [assignedTo, setAssignedTo] = useState('');
  const [project, setProject] = useState('');
  const [dueDate, setDueDate] = useState('');
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
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        axios.get('/api/tasks', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/projects', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/tasks', { title, description, status, assignedTo, project, dueDate }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle('');
      setDescription('');
      setStatus('To Do');
      setAssignedTo('');
      setProject('');
      setDueDate('');
      setSuccess('Task created successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/tasks/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Task updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Task deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  if (loading) return <div className="container"><p>Loading tasks...</p></div>;

  return (
    <div className="container">
      <h2>Tasks</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          <option value="">Assign To (Optional)</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
        <select value={project} onChange={(e) => setProject(e.target.value)} required>
          <option value="">Select Project</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button type="submit">Create Task</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <div className="item-header">
              <h3>{task.title}</h3>
              <div className="task-actions">
                <select value={task.status} onChange={(e) => handleUpdateTask(task._id, e.target.value)} className="status-select">
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                <button className="delete-btn" onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </div>
            </div>
            <p>{task.description}</p>
            <p className="meta">Assigned to: {task.assignedTo?.name || 'Unassigned'} | Project: {task.project?.name}</p>
            <p className="meta">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;