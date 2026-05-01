# Railway Deployment Guide

## Prerequisites

1. GitHub account with the repository pushed
2. Railway account (sign up at railway.app)
3. MongoDB Atlas account for managed database or use Railway's PostgreSQL/MongoDB

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your .gitignore is set up correctly:
```
node_modules/
build/
.env
.env.local
*.log
```

Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Team Task Manager"
git branch -M main
git remote add origin <your-github-url>
git push -u origin main
```

### 2. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Authorize GitHub and select your repository
5. Railway will auto-detect your project type

### 3. Configure Environment Variables

In Railway Dashboard:
1. Go to Variables tab
2. Add these variables:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/teamtaskmanager?retryWrites=true&w=majority
JWT_SECRET=your-very-secure-random-secret-key-here
NODE_ENV=production
```

#### MongoDB Setup Options:

**Option A: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Replace `<username>:<password>` and `<cluster>` in MONGO_URI

**Option B: Railway's PostgreSQL (Alternative)**
Railway also provides PostgreSQL - you can modify the backend to use that instead

### 4. Configure Build Settings

Railway usually auto-detects, but verify:
- **Build Command**: `npm run build`
- **Start Command**: `npm start` (runs from root package.json → backend)
- **Root Path**: `/` (if Railway detects correctly)

### 5. Deploy

1. Click "Deploy" button
2. Railway will build the project
3. Once deployed, you'll get a public URL like: `https://your-app.railway.app`

### 6. Verify Deployment

Test the application:
```bash
# Test signup
curl -X POST https://your-app.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123","role":"Member"}'

# Test login
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Visit https://your-app.railway.app in browser
```

## Troubleshooting

### Build Fails
- Check package.json scripts
- Ensure all dependencies are in package.json (not just package-lock.json)
- Check build logs in Railway dashboard

### App Not Running
- Check environment variables are set
- Verify MongoDB connection string is correct
- Check application logs in Railway dashboard

### Database Connection Issues
- Whitelist 0.0.0.0/0 in MongoDB Atlas IP access
- Check MONGO_URI format
- Verify credentials are correct

### Frontend Not Loading
- Ensure `npm run build` completes successfully
- Check that build folder is served by Express
- Verify static file middleware in index.js

## Monitoring

In Railway Dashboard:
1. **Deployments**: View deployment history
2. **Logs**: Real-time application logs
3. **Metrics**: CPU, memory, request count
4. **Environment**: Manage variables
5. **Domains**: Configure custom domains

## Custom Domain (Optional)

1. Go to Settings tab
2. Add custom domain
3. Update DNS records at your domain provider
4. Wait for DNS propagation (~24 hours)

## Useful Railway Commands

```bash
# View logs
railway logs

# Set variables locally for testing
railway up --no-preflight
```

## Additional Configuration

### Enable Auto-Restart on Crash
In Railway settings, enables automatic restart on application crash (usually enabled by default).

### Scaling
Railway automatically scales based on resource usage. No configuration needed for initial deployment.

### Backups
MongoDB Atlas provides automatic backups for paid tiers. For free tier, consider manual backups.
