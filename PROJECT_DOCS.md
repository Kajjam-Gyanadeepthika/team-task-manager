# Team Task Manager - Project Documentation

## Project Overview

Team Task Manager is a full-stack web application that enables teams to collaborate on projects by creating, assigning, and tracking tasks. It features:

- **User Authentication**: Secure signup/login with JWT
- **Role-Based Access Control**: Admin and Member roles
- **Project Management**: Create and manage team projects
- **Task Management**: Create, assign, and track task progress
- **Dashboard**: View task statistics and project overview
- **Responsive UI**: Modern, user-friendly interface

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

### Frontend
- **Framework**: React 18
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Styling**: Custom CSS

### Deployment
- **Platform**: Railway
- **Database**: MongoDB Atlas
- **Static Hosting**: Railway (built-in with Express)

## Project Structure

```
team-task-manager/
├── backend/
│   ├── node_modules/
│   ├── index.js              # Main server file
│   ├── package.json
│   ├── package-lock.json
│   └── .env                  # Environment variables
│
├── frontend/
│   ├── node_modules/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Projects.js
│   │   │   ├── Tasks.js
│   │   │   └── Navbar.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   ├── build/                # Production build
│   └── package.json
│
├── package.json              # Root package.json
├── Procfile                  # Railway configuration
├── .env                      # Environment variables (not committed)
├── .gitignore
├── README.md                 # Getting started guide
├── DEPLOYMENT.md             # Deployment instructions
└── API_TESTING.md            # API documentation and testing
```

## Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "name": String,
  "email": String (unique),
  "password": String (hashed),
  "role": "Admin" | "Member",
  "createdAt": DateTime
}
```

### Projects Collection
```json
{
  "_id": ObjectId,
  "name": String,
  "description": String,
  "owner": ObjectId (ref: User),
  "members": [ObjectId (ref: User)],
  "createdAt": DateTime
}
```

### Tasks Collection
```json
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "status": "To Do" | "In Progress" | "Done",
  "assignedTo": ObjectId (ref: User),
  "project": ObjectId (ref: Project),
  "dueDate": DateTime,
  "createdAt": DateTime
}
```

## API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users
- `GET /api/users` - Get all users

### Dashboard
- `GET /api/dashboard` - Get user statistics

## Features Checklist

### ✅ Core Features Implemented
- [x] User signup with validation
- [x] User login with JWT
- [x] Project creation and management
- [x] Task creation and assignment
- [x] Task status tracking (To Do, In Progress, Done)
- [x] Role-based access control
- [x] Dashboard with statistics
- [x] User-friendly UI
- [x] Error handling and validation
- [x] Loading states

### ✅ Security Features
- [x] Password hashing with bcryptjs
- [x] JWT token authentication
- [x] Token expiration (7 days)
- [x] Role-based authorization checks
- [x] Input validation on backend
- [x] CORS enabled

### ✅ Deployment Features
- [x] Production build setup
- [x] Static file serving
- [x] Environment variables support
- [x] Railway-ready configuration
- [x] Procfile for deployment
- [x] Database connectivity

## Getting Started

### Local Development

1. **Clone and install**:
```bash
git clone <repository-url>
cd team-task-manager
npm install
npm run install-frontend
```

2. **Set up environment**:
```bash
# backend/.env
MONGO_URI=mongodb://localhost:27017/teamtaskmanager
JWT_SECRET=your-secret-key
PORT=5000
```

3. **Start development servers**:
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm start
```

4. **Access the application**:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Railway deployment instructions.

## Key Implementation Details

### Authentication Flow
1. User signs up with name, email, password, and role
2. Password is hashed using bcryptjs
3. User logs in with email and password
4. Server returns JWT token (valid for 7 days)
5. Token sent in Authorization header for protected routes

### Access Control
- **Owner Access**: Project owner can update/delete their projects
- **Member Access**: Team members can view/update tasks in shared projects
- **Admin Privileges**: Admins can manage any project or task

### Task Status Flow
```
To Do → In Progress → Done
```
Users can transition tasks between these states using the dropdown selector.

## Performance Considerations

### Frontend Optimization
- React lazy loading for components
- Efficient state management using hooks
- Binary search for large task lists
- CSS optimized with minification

### Backend Optimization
- MongoDB indexes on frequently queried fields
- Pagination-ready architecture (can be extended)
- JWT stateless authentication
- Efficient population of related documents

## Future Enhancements

1. **Advanced Features**:
   - Task comments and activity logs
   - File attachments
   - Team invitations via email
   - Calendar view for tasks

2. **Performance**:
   - Implement data pagination
   - Add caching with Redis
   - Optimize image/file uploads

3. **Security**:
   - Two-factor authentication
   - OAuth integration (Google, GitHub)
   - Rate limiting on API endpoints
   - HTTPS enforcement

4. **UI/UX**:
   - Dark mode support
   - Drag-and-drop task management
   - Notification system
   - Mobile app

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or connection string is correct
- Check IP whitelist in MongoDB Atlas (allow 0.0.0.0)
- Verify credentials in connection string

### Authentication Errors
- Clear browser localStorage and try logging in again
- Check JWT_SECRET is consistent
- Ensure token is sent with Bearer prefix

### Frontend Not Loading
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall
- Check that backend is running

### Port Already in Use
- Backend: Change PORT in .env or kill process on port 5000
- Frontend: React uses port 3000, if busy, it will prompt for another port

## Support

For issues or questions:
1. Check API_TESTING.md for endpoint details
2. Review error messages in browser console and server logs
3. Verify environment variables are set correctly
4. Check database connectivity

---

**Last Updated**: May 2024  
**Version**: 1.0.0
