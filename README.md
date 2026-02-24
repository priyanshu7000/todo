# To-Do Application

A production-ready To-Do application built with modern best practices, featuring a React + Vite frontend, Express Node.js backend, and PostgreSQL database.

## Features

✅ **User Authentication**
- Signup and Login
- JWT-based authentication (access + refresh tokens)
- Secure password hashing with bcrypt
- Protected routes

✅ **Todo Management**
- Create, Read, Update, Delete todos
- Mark todos as pending or completed
- Add descriptions and due dates
- Filter by status

✅ **API Documentation**
- Swagger/OpenAPI 3.0 documentation
- Available at `/api-docs`

✅ **Production Ready**
- Clean architecture
- TypeScript strict mode
- Input validation with Zod
- Error handling
- Rate limiting
- Security headers with Helmet
- Request logging with Winston
- PostgreSQL with optimized functions and indexes

## Tech Stack

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router v6
- Axios
- React Hook Form
- Zod
- Zustand (State Management)

### Backend
- Node.js (LTS)
- Express
- TypeScript
- PostgreSQL 15
- JWT (jsonwebtoken)
- bcrypt
- Winston (Logging)
- Swagger/OpenAPI
- Helmet
- CORS
- Express Rate Limit

### Database
- PostgreSQL 15
- UUID-based IDs
- Optimized indexes
- PostgreSQL functions for CRUD operations
- Migrations system

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Database access layer
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── migrations/     # Database migrations
│   │   ├── seeders/        # Database seeders
│   │   ├── swagger/        # Swagger configuration
│   │   ├── utils/          # Utilities (validation, errors, etc.)
│   │   ├── app.ts          # Express app
│   │   └── server.ts       # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/            # API client and endpoints
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utilities (stores, validation)
│   │   ├── App.tsx         # Main app component
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env
│
├── run.sh                   # Setup script (Linux/Mac)
├── run.ps1                  # Setup script (Windows)
├── README.md
└── .gitignore

```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### Todos Table
```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) CHECK (status IN ('pending', 'completed')) DEFAULT 'pending',
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_user_status ON todos(user_id, status);
```

### PostgreSQL Functions
- `fn_create_user(p_name, p_email, p_password)` - Create user
- `fn_get_user_by_email(p_email)` - Get user by email
- `fn_create_todo(p_user_id, p_title, p_description, p_due_date)` - Create todo
- `fn_get_todos_by_user(p_user_id)` - Get user's todos
- `fn_update_todo(p_todo_id, p_title, p_description, p_status, p_due_date)` - Update todo
- `fn_delete_todo(p_todo_id)` - Delete todo

## Setup Instructions

### Prerequisites
- Node.js 18+ (LTS)
- PostgreSQL 15+ running locally
- Git

### Automatic Setup (Recommended)

#### Windows
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\run.ps1
```

#### Mac/Linux
```bash
chmod +x run.sh
./run.sh
```

### Manual Setup

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

3. **Configure Environment Variables**

Backend (`.env`):
```bash
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=todo
JWT_SECRET=supersecret
JWT_REFRESH_SECRET=superrefreshsecret
NODE_ENV=development
LOG_LEVEL=debug
```

Frontend (`.env`):
```bash
VITE_API_URL=http://localhost:5000/api
```

4. **Run Database Migration**
```bash
cd backend
npm run migrate
```

5. **Seed Database**
```bash
npm run seed
```

6. **Start Backend**
```bash
npm run dev
# Backend runs on http://localhost:5000
```

7. **Start Frontend** (in a new terminal)
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

## Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with demo data
- `npm run lint` - Lint TypeScript files
- `npm run typecheck` - Check TypeScript types

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint files

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Todos
- `GET /api/todos` - Get all user todos (requires auth)
- `GET /api/todos/:id` - Get specific todo (requires auth)
- `POST /api/todos` - Create new todo (requires auth)
- `PUT /api/todos/:id` - Update todo (requires auth)
- `DELETE /api/todos/:id` - Delete todo (requires auth)

## API Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

## Demo Credentials

Once the application is set up and seeded, you can login with:

- **Email**: `demo@example.com`
- **Password**: `password123`

The demo user comes with 3 sample todos.

## Swagger Documentation

Once the backend is running, visit:
```
http://localhost:5000/api-docs
```

## Security Features

✅ Helmet - Security headers
✅ CORS - Cross-origin resource sharing
✅ Rate Limiting - Prevent abuse (100 requests per 15 minutes)
✅ JWT Tokens - Secure authentication
✅ Password Hashing - bcrypt with salt rounds
✅ Input Validation - Zod schema validation
✅ Parameterized Queries - SQL injection prevention
✅ Protected Routes - Frontend route protection

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Backend server port | 5000 |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_USER | PostgreSQL user | postgres |
| DB_PASSWORD | PostgreSQL password | postgres |
| DB_NAME | Database name | todo |
| JWT_SECRET | JWT secret key | supersecret |
| JWT_REFRESH_SECRET | JWT refresh secret | superrefreshsecret |
| NODE_ENV | Environment | development |
| LOG_LEVEL | Winston log level | debug |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## Error Handling

All API errors follow the standard format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Deployment

### Backend (Production)

1. Build the TypeScript:
```bash
npm run build
```

2. Set environment variables on your production server

3. Run migrations on production database:
```bash
npm run migrate
```

4. Start the server:
```bash
npm start
```

### Frontend (Production)

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider (Vercel, Netlify, AWS, etc.)

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running: `psql -U postgres`
- Check `.env` file has correct credentials
- Verify database name matches `DB_NAME`

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Change port in `vite.config.ts`

### Migration Fails
- Ensure PostgreSQL user has permission to create databases
- Check PostgreSQL logs for detailed errors
- Try running with a superuser account

### Frontend Cannot Connect to Backend
- Ensure backend is running on `http://localhost:5000`
- Check `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors

## Performance Optimizations

✅ UUID-based IDs for better horizontal scaling
✅ Indexed columns for faster queries
✅ Composite indexes for complex queries
✅ PostgreSQL functions for optimized operations
✅ React lazy loading for code splitting
✅ Vite for fast development and optimized builds
✅ Zustand for lightweight state management

## Code Quality

- **TypeScript** - Full type safety
- **Strict Mode** - Catches errors at compile time
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Clean Architecture** - Separation of concerns

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Support

For issues and questions, please open an issue on the GitHub repository.

## Author

Created by Priyanshu Sharma

---

**Happy coding! 🚀**
