# FlowForge Authentication Setup Guide

## What Was Implemented

A complete authentication system with user accounts, login/signup modal, and per-user workflow storage.

### Features
- Email/password registration and login
- Google OAuth (placeholder - needs credentials)
- Apple OAuth (placeholder - needs credentials)
- JWT-based authentication
- User-specific workflow storage
- Logout functionality

## Installation & Setup

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Environment variables are already set in `.env`:**
   - `PORT=4000`
   - `MONGO_URI=<your-mongodb-uri>`
   - `JWT_SECRET=flowforge_secret_key_change_in_production`

3. **Start the server:**
```bash
npm run server
```

### Frontend Setup

1. **Create `.env.local` file in frontend directory:**
```bash
VITE_API_URL=http://localhost:4000/api
```

2. **Install dependencies (if not already done):**
```bash
cd frontend
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

## Testing the Authentication

### Create an Account
1. Open the app - you'll see the login modal
2. Click "Don't have an account? Sign up"
3. Enter name, email, and password
4. Click "Create Account"
5. You'll be logged in and can create workflows

### Login
1. Enter your email and password
2. Click "Sign In"
3. Your workflows will load

### Logout
1. Click the logout icon (arrow) in the top-right of the sidebar
2. You'll be returned to the login modal

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth (needs setup)
- `POST /api/auth/apple` - Apple OAuth (needs setup)

### Workflows (All require Authorization header)
- `GET /api/workflows` - Get user's workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows/:id` - Get specific workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow
- `POST /api/workflows/:id/execute` - Execute workflow
- `GET /api/workflows/:id/logs` - Get execution logs

## Important Notes

### Security
- Passwords are hashed with bcryptjs
- JWT tokens expire after 7 days
- Tokens stored in localStorage (consider using httpOnly cookies for production)
- All workflow endpoints require valid JWT token

### OAuth Setup (Optional)
To enable Google and Apple login:

1. **Google OAuth:**
   - Create credentials at https://console.cloud.google.com
   - Add redirect URI: `http://localhost:3000/auth/google/callback`
   - Update LoginModal.jsx with actual Google OAuth implementation

2. **Apple OAuth:**
   - Register at https://developer.apple.com
   - Configure Sign in with Apple
   - Update LoginModal.jsx with actual Apple OAuth implementation

### Database
- User collection stores email, hashed password, name, OAuth IDs
- Workflow collection now includes userId field
- Workflows are filtered by userId on all queries

## Troubleshooting

### "Unauthorized" errors
- Make sure you're logged in
- Check that token is being sent in Authorization header
- Verify JWT_SECRET matches between frontend and backend

### Workflows not loading
- Check browser console for errors
- Verify backend is running on port 4000
- Check that VITE_API_URL is correct in frontend

### Can't create account
- Check MongoDB connection
- Verify email isn't already registered
- Check backend console for errors

## File Structure

```
backend/
├── models/
│   ├── User.js (NEW)
│   └── Workflow.js (UPDATED)
├── routes/
│   ├── auth.js (NEW)
│   └── workflows.js (UPDATED)
├── middleware/
│   └── auth.js (NEW)
└── server.js (UPDATED)

frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx (NEW)
│   ├── components/
│   │   ├── LoginModal.jsx (NEW)
│   │   ├── Sidebar.jsx (UPDATED)
│   │   └── Canvas.jsx (UPDATED)
│   ├── lib/
│   │   └── api.js (NEW)
│   ├── App.jsx (UPDATED)
│   └── main.jsx (UPDATED)
```
