# Team Task Manager 🚀

A full-stack web application for managing team projects and tasks with role-based access control.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-latest-green?logo=mongodb)
![Express](https://img.shields.io/badge/Express-5-black?logo=express)

## Features ✨

- **User Authentication**: Secure signup/login with JWT tokens
- **Project Management**: Create, organize, and manage team projects
- **Task Assignment**: Assign tasks to team members with due dates
- **Status Tracking**: Track task progress through To Do → In Progress → Done
- **Dashboard**: View task statistics and project overview
- **Role-Based Access**: Admin and Member roles with different permissions
- **Real-time Updates**: Responsive UI with error handling and loading states
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack 💻

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI framework
- **Axios** - HTTP client
- **React Router** - Navigation
- **CSS3** - Styling

### Deployment
- **Railway** - Cloud platform
- **MongoDB Atlas** - Cloud database

## Quick Start 🏁

### Prerequisites
- Node.js 18+
- Git
- MongoDB (local or Atlas)

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd team-task-manager
```

2. **Install dependencies**
```bash
npm install
npm run install-frontend
```

3. **Configure environment variables**
```bash
# Create backend/.env
echo "MONGO_URI=mongodb://localhost:27017/teamtaskmanager" > backend/.env
echo "JWT_SECRET=your-secret-key-here" >> backend/.env
echo "PORT=5000" >> backend/.env
```

4. **Start the application**
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd frontend
npm start
```

5. **Access the application**
- Open http://localhost:3000 in your browser
- Sign up with test credentials
- Create projects and tasks

## Directory Structure 📁

```
team-task-manager/
├── backend/
│   ├── index.js              # Express server & routes
│   ├── package.json
│   └── .env                  # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.js
│   │   └── App.css
│   ├── public/
│   └── build/                # Production build
├── README.md
├── DEPLOYMENT.md
├── API_TESTING.md
└── PROJECT_DOCS.md
```

## API Endpoints 🔌

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task status
- `DELETE /api/tasks/:id` - Delete task

### Dashboard
- `GET /api/dashboard` - Get user statistics

### Users
- `GET /api/users` - Get all users (for task assignment)

See [API_TESTING.md](API_TESTING.md) for detailed endpoint documentation.

## Usage Guide 📖

### 1. Sign Up
- Click "Sign Up" on the login page
- Enter your details (name, email, password)
- Choose role (Member or Admin)
- Click "Create Account"

### 2. Create a Project
- Log in to your account
- Go to "Projects" from the navigation
- Fill in project details
- Add team members (optional)
- Click "Create Project"

### 3. Create and Assign Tasks
- Go to "Tasks"
- Enter task details
- Select a project
- Assign to team member
- Set due date
- Click "Create Task"

### 4. Track Progress
- View tasks with current status
- Update status via dropdown (To Do → In Progress → Done)
- Delete completed or unnecessary tasks
- Check Dashboard for overview

## Deployment 🚀

### Deploy to Railway

1. **Prepare repository**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository
   - Railway will auto-detect and build

3. **Configure environment variables in Railway**
   - Add `MONGO_URI` (MongoDB Atlas connection string)
   - Add `JWT_SECRET` (random secure string)
   - Add `NODE_ENV=production`

4. **Your app is live!**
   - Railway will provide a public URL
   - Share with your team

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Configuration ⚙️

### Environment Variables (backend/.env)

```env
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/teamtaskmanager

# Security
JWT_SECRET=your-very-secure-random-secret-key

# Server
PORT=5000
NODE_ENV=development
```

## Features in Detail 🎯

### Authentication
- Secure password hashing with bcryptjs
- JWT tokens with 7-day expiration
- Validation on signup (email, password length)
- Protected routes requiring authentication

### Projects
- Create projects with team members
- View all projects you own or are member of
- Update project details
- Delete projects (owner/admin only)

### Tasks
- Create tasks within projects
- Assign to team members
- Set due dates
- Track status (To Do, In Progress, Done)
- Update status quickly with dropdown
- Delete completed tasks

### Dashboard
- View total assigned tasks
- See completed tasks count
- Check overdue tasks
- View projects involvement

### Role-Based Access
- **Member**: Can create tasks, update own tasks
- **Admin**: Can manage any project/task, manage team

## Validation & Error Handling ✔️

- Input validation on all forms
- Clear error messages on failures
- Loading states during API calls
- Success notifications for actions
- Proper HTTP status codes
- Database constraint checks

## Security Features 🔒

- Password hashing (bcryptjs)
- JWT authentication
- Protected API endpoints
- Role-based authorization
- Input validation
- CORS enabled
- Environment variable protection

## Development Tips 💡

### Testing API Endpoints
Use the provided cURL examples in [API_TESTING.md](API_TESTING.md):
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123","role":"Member"}'
```

### Debugging
- Check browser console for frontend errors
- Check terminal for backend logs
- Verify environment variables are set
- Check MongoDB connection
- Use network tab in DevTools

### Database
- MongoDB runs locally: `mongosh` to connect
- Atlas: Check connection string is correct
- Create indexes for performance

## Troubleshooting 🔧

### Backend won't start
- Check Node.js version: `node --version` (should be 18+)
- Port 5000 in use: Change PORT in .env
- MongoDB not running: Start MongoDB service

### Frontend won't build
- Clear cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

### Can't login
- Check email and password are correct
- Clear browser localStorage
- Verify backend is running

### Database errors
- Check MONGO_URI is correct
- Verify MongoDB is running
- Check Atlas whitelist includes your IP

## Contributing 🤝

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open a Pull Request

## Documentation 📚

- [PROJECT_DOCS.md](PROJECT_DOCS.md) - Detailed project documentation
- [API_TESTING.md](API_TESTING.md) - API endpoints and testing
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions

## Future Enhancements 🔮

- [ ] Task comments and activity logs
- [ ] File attachments
- [ ] Email notifications
- [ ] Calendar view
- [ ] Advanced filtering
- [ ] Data export (CSV/PDF)
- [ ] Team collaboration features
- [ ] Mobile app
- [ ] Dark mode

## License 📄

This project is open source and available under the MIT License.

## Support 💬

For issues or questions:
1. Check the documentation files
2. Review API_TESTING.md for endpoint details
3. Check browser console for errors
4. Verify environment setup

## Live Demo 🌐

[Your deployed app URL will appear here after Railway deployment]

---

**Made with ❤️ for team collaboration**

Last Updated: May 2024 | Version: 1.0.0