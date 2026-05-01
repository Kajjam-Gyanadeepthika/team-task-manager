const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/teamtaskmanager')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Project Schema
const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Routes

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: role || 'Member' });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ _id: user._id.toString(), role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Users Route
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find().select('_id name email role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Project Routes
app.get('/api/projects', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ $or: [{ owner: req.user._id }, { members: req.user._id }] }).populate('owner members', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/projects', verifyToken, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    
    const project = new Project({ name, description, owner: req.user._id, members: members || [] });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.put('/api/projects/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.owner.toString() !== req.user._id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('owner members', 'name email');
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.delete('/api/projects/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.owner.toString() !== req.user._id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Task Routes
app.get('/api/tasks', verifyToken, async (req, res) => {
  try {
    const userProjects = await Project.find({ $or: [{ owner: req.user._id }, { members: req.user._id }] }).select('_id');
    const projectIds = userProjects.map(p => p._id);
    
    const tasks = await Task.find({
      $or: [
        { assignedTo: req.user._id },
        { project: { $in: projectIds } }
      ]
    }).populate('assignedTo', 'name email').populate('project', 'name');
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/tasks', verifyToken, async (req, res) => {
  try {
    const { title, description, status, assignedTo, project, dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }
    
    if (!project) {
      return res.status(400).json({ message: 'Project is required' });
    }
    
    // Check if user has access to the project
    const projectDoc = await Project.findById(project);
    if (!projectDoc || (projectDoc.owner.toString() !== req.user._id && !projectDoc.members.includes(req.user._id) && req.user.role !== 'Admin')) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }
    
    const task = new Task({ title, description, status: status || 'To Do', assignedTo, project, dueDate });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.put('/api/tasks/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user can update task
    const project = await Project.findById(task.project);
    if (task.assignedTo.toString() !== req.user._id && project.owner.toString() !== req.user._id && !project.members.includes(req.user._id) && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignedTo', 'name email').populate('project', 'name');
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.delete('/api/tasks/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const project = await Project.findById(task.project);
    if (project.owner.toString() !== req.user._id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Dashboard Route
app.get('/api/dashboard', verifyToken, async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ assignedTo: req.user._id });
    const completedTasks = await Task.countDocuments({ assignedTo: req.user._id, status: 'Done' });
    const overdueTasks = await Task.countDocuments({ assignedTo: req.user._id, dueDate: { $lt: new Date() }, status: { $ne: 'Done' } });
    const projects = await Project.countDocuments({ $or: [{ owner: req.user._id }, { members: req.user._id }] });
    res.json({ totalTasks, completedTasks, overdueTasks, projects });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Catch all handler: send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));