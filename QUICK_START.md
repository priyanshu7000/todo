# Quick Start Guide

## 🚀 Start the Application in 3 Steps

### Windows Users
```powershell
# Open PowerShell and run:
.\run.ps1
```

### Mac/Linux Users
```bash
chmod +x run.sh
./run.sh
```

## ✅ After Setup

Once the script completes successfully:

1. **Frontend**: Open http://localhost:5173 in your browser
2. **Backend API**: http://localhost:5000
3. **Swagger Docs**: http://localhost:5000/api-docs
4. **Login with**:
   - Email: `demo@example.com`
   - Password: `password123`

## 📁 What's Included

### Backend
- ✅ Express API with TypeScript
- ✅ PostgreSQL database with migrations
- ✅ JWT authentication with access & refresh tokens
- ✅ Todo CRUD operations
- ✅ Swagger API documentation
- ✅ Winston logging
- ✅ Rate limiting & security headers

### Frontend
- ✅ React 18 + Vite
- ✅ TypeScript with strict mode
- ✅ Tailwind CSS styling
- ✅ React Router protected routes
- ✅ Zod form validation
- ✅ Zustand state management
- ✅ Axios with JWT interceptor
- ✅ Toast notifications

### Database
- ✅ PostgreSQL 15 with UUID support
- ✅ Optimized indexes
- ✅ PostgreSQL functions for CRUD
- ✅ Automatic migrations
- ✅ Seed data included

## 🔧 Troubleshooting

### PostgreSQL Not Running?
**Windows**: Open Services and start "PostgreSQL"

**Mac/Linux**:
```bash
brew services start postgresql
# or
sudo systemctl start postgresql
```

### Port Already in Use?

**Backend (Port 5000)**:
Edit `backend/.env`:
```
PORT=5001
```

**Frontend (Port 5173)**:
Edit `frontend/vite.config.ts`:
```ts
server: {
  port: 5174,
  host: true,
}
```

### Database Issues?

Reset everything:
```bash
# Windows PowerShell
# Manually delete the database and re-run setup

# Mac/Linux
dropdb -U postgres todo
./run.sh
```

## 📚 Key Endpoints

### Authentication
```
POST   /api/auth/signup        - Register
POST   /api/auth/login         - Login
POST   /api/auth/refresh       - Refresh token
```

### Todos
```
GET    /api/todos              - List all todos
POST   /api/todos              - Create todo
GET    /api/todos/:id          - Get todo
PUT    /api/todos/:id          - Update todo
DELETE /api/todos/:id          - Delete todo
```

## 🎯 Next Steps

1. **Explore the API**: Visit http://localhost:5000/api-docs
2. **Create Todos**: Log in and start managing your tasks
3. **Customize**: Modify colors, add features, deploy to production
4. **Read Docs**: See main README.md for detailed documentation

## 🔒 Security Features

✅ Password hashing with bcrypt
✅ JWT tokens (access + refresh)
✅ Protected API routes
✅ Rate limiting
✅ CORS enabled
✅ Security headers (Helmet)
✅ Input validation (Zod schemas)

## 🚀 Ready to Deploy?

See comprehensive deployment instructions in the main README.md

---

**Need help?** Check the README.md or create an issue.
