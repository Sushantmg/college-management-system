# College Management System

A full-stack College Management System for managing departments, teachers, students, courses, enrollments, and grades. Built with **React**, **Express**, **TypeScript**, **Prisma**, and **MongoDB**.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                           │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    React 19 + Vite 8                          │  │
│  │                                                               │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │  │
│  │  │   Auth   │  │  Admin   │  │ Teacher  │  │ Student  │     │  │
│  │  │  Pages   │  │Dashboard │  │Dashboard │  │Dashboard │     │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │  │
│  │       │              │              │              │           │  │
│  │  ┌────┴──────────────┴──────────────┴──────────────┴─────┐    │  │
│  │  │              React Router (Role-Based)                 │    │  │
│  │  └────────────────────┬──────────────────────────────────┘    │  │
│  │                       │                                        │  │
│  │  ┌────────────────────┴──────────────────────────────────┐    │  │
│  │  │                  API Layer (Axios)                     │    │  │
│  │  │          JWT Interceptor + Auto-Logout                 │    │  │
│  │  └────────────────────┬──────────────────────────────────┘    │  │
│  └───────────────────────┼───────────────────────────────────────┘  │
│                          │                                          │
└──────────────────────────┼──────────────────────────────────────────┘
                           │  HTTP (Port 4000 → 3005)
                           │  Proxy: /auth, /courses, /departments,
                           │         /students, /teachers, /enrollments
                           │
┌──────────────────────────┼──────────────────────────────────────────┐
│                     SERVER (Node.js)                                │
│                                                                     │
│  ┌────────────────────────┴──────────────────────────────────┐     │
│  │                    Express 5 Server                        │     │
│  │                                                            │     │
│  │  ┌─────────┐  ┌──────────┐  ┌────────────┐  ┌─────────┐ │     │
│  │  │ Helmet  │  │  Rate    │  │   Morgan   │  │  CORS   │ │     │
│  │  │ Headers │  │ Limiter  │  │  Logger    │  │         │ │     │
│  │  └─────────┘  └──────────┘  └────────────┘  └─────────┘ │     │
│  │                                                            │     │
│  │  ┌────────────────────────────────────────────────────┐   │     │
│  │  │              Middleware Pipeline                    │   │     │
│  │  │                                                    │   │     │
│  │  │  ┌──────────┐  ┌───────────┐  ┌───────────────┐  │   │     │
│  │  │  │   JWT    │  │   Role    │  │  Zod Schema   │  │   │     │
│  │  │  │   Auth   │→ │  Permit   │→ │  Validation   │  │   │     │
│  │  │  └──────────┘  └───────────┘  └───────────────┘  │   │     │
│  │  └────────────────────────────────────────────────────┘   │     │
│  │                                                            │     │
│  │  ┌────────────────────────────────────────────────────┐   │     │
│  │  │                   Route Handlers                   │   │     │
│  │  │                                                    │   │     │
│  │  │  /auth        ──→  Auth Controller                 │   │     │
│  │  │  /departments ──→  Department Controller           │   │     │
│  │  │  /teachers    ──→  Teacher Controller              │   │     │
│  │  │  /students    ──→  Student Controller              │   │     │
│  │  │  /courses     ──→  Course Controller               │   │     │
│  │  │  /enrollments ──→  Enrollment Controller           │   │     │
│  │  └──────────────────────┬─────────────────────────────┘   │     │
│  │                          │                                  │     │
│  │  ┌──────────────────────┴─────────────────────────────┐   │     │
│  │  │                  Service Layer                      │   │     │
│  │  │         (Business Logic + Data Access)              │   │     │
│  │  └──────────────────────┬─────────────────────────────┘   │     │
│  └─────────────────────────┼──────────────────────────────────┘     │
│                            │                                        │
│  ┌─────────────────────────┴──────────────────────────────────┐     │
│  │                   Prisma ORM (TypeSafe)                    │     │
│  └─────────────────────────┬──────────────────────────────────┘     │
│                            │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             │  MONGODB PROTOCOL
                             │
┌────────────────────────────┼────────────────────────────────────────┐
│                     MongoDB Database                                │
│                                                                     │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐        │
│  │   User   │  │ Department │  │ Teacher  │  │ Student  │        │
│  │  (Auth)  │  │            │  │          │  │          │        │
│  └──────────┘  └────────────┘  └──────────┘  └──────────┘        │
│                                                                     │
│  ┌──────────┐  ┌────────────────┐                                  │
│  │  Course  │  │ StudentCourse  │                                  │
│  │          │  │   (Enrollment) │                                  │
│  └──────────┘  └────────────────┘                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## System Architecture Diagram

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser["Browser"]
        React["React 19 + Vite"]
        Router["React Router 7"]
        Axios["Axios HTTP Client"]
    end

    subgraph Server["Server Layer"]
        Express["Express 5"]
        
        subgraph Security["Security Middleware"]
            Helmet["Helmet<br/>Security Headers"]
            RateLimit["Rate Limiter<br/>100 req/15min"]
            AuthRateLimit["Auth Limiter<br/>20 req/15min"]
            Morgan["Morgan<br/>HTTP Logger"]
            CORS["CORS<br/>Cross-Origin"]
        end
        
        subgraph AuthMiddleware["Authentication"]
            JWT["JWT Verify<br/>Bearer Token"]
            Permit["Role Permit<br/>ADMIN/TEACHER/STUDENT"]
            Validate["Zod Validation<br/>Schema Check"]
        end
        
        subgraph Controllers["Controllers"]
            AuthCtrl["Auth"]
            DeptCtrl["Department"]
            TeacherCtrl["Teacher"]
            StudentCtrl["Student"]
            CourseCtrl["Course"]
            EnrollCtrl["Enrollment"]
        end
        
        subgraph Services["Services"]
            AuthService["Auth Service"]
            DeptService["Department Service"]
            TeacherService["Teacher Service"]
            StudentService["Student Service"]
            CourseService["Course Service"]
            EnrollService["Enrollment Service"]
        end
        
        Prisma["Prisma ORM"]
    end

    subgraph Database["Database"]
        MongoDB[("MongoDB")]
    end

    Browser --> React --> Router --> Axios
    Axios -->|HTTP| Express
    Express --> Helmet --> RateLimit --> AuthRateLimit --> Morgan --> CORS
    CORS --> JWT --> Permit --> Validate
    Validate --> AuthCtrl & DeptCtrl & TeacherCtrl & StudentCtrl & CourseCtrl & EnrollCtrl
    AuthCtrl --> AuthService
    DeptCtrl --> DeptService
    TeacherCtrl --> TeacherService
    StudentCtrl --> StudentService
    CourseCtrl --> CourseService
    EnrollCtrl --> EnrollService
    AuthService & DeptService & TeacherService & StudentService & CourseService & EnrollService --> Prisma
    Prisma --> MongoDB
```

---

## Database Schema

```mermaid
erDiagram
    User {
        ObjectId id PK
        String name
        String email UK
        String password
        Role role
        DateTime createdAt
        DateTime updatedAt
    }

    Department {
        ObjectId id PK
        String name UK
        ObjectId headId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Teacher {
        ObjectId id PK
        ObjectId userId FK UK
        ObjectId departmentId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Student {
        ObjectId id PK
        ObjectId userId FK UK
        ObjectId departmentId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Course {
        ObjectId id PK
        String name
        String code UK
        String description
        ObjectId departmentId FK
        ObjectId teacherId FK
        DateTime createdAt
        DateTime updatedAt
    }

    StudentCourse {
        ObjectId id PK
        ObjectId studentId FK
        ObjectId courseId FK
        String grade
        DateTime createdAt
        DateTime updatedAt
    }

    Role {
        string ADMIN
        string TEACHER
        string STUDENT
        string STAFF
        string SUPERUSER
    }

    User ||--o| Teacher : "has profile"
    User ||--o| Student : "has profile"
    Department ||--o{ Teacher : "employs"
    Department ||--o{ Student : "enrolls"
    Department ||--o{ Course : "offers"
    Teacher ||--o{ Course : "teaches"
    Student ||--o{ StudentCourse : "enrolled in"
    Course ||--o{ StudentCourse : "has enrollments"
```

---

## Request Flow

```mermaid
sequenceDiagram
    participant C as Client (React)
    participant E as Express Server
    participant M as Middleware
    participant S as Service
    participant P as Prisma
    participant D as MongoDB

    Note over C,D: Authentication Flow
    C->>E: POST /auth/login {email, password}
    E->>M: Rate Limiter Check
    M->>E: Zod Validation
    E->>S: AuthService.login()
    S->>P: User.findUnique(email)
    P->>D:findOne({email})
    D-->>P: User document
    P-->>S: User
    S->>S: bcrypt.compare(password)
    S->>S: jwt.sign({userId, role})
    S-->>E: {token, user}
    E-->>C: 200 {token, user}

    Note over C,D: Authenticated Request
    C->>E: GET /courses?page=1&search=CS
    E->>M: JWT Verify (Bearer token)
    M->>M: Role Permit (ADMIN/TEACHER/STUDENT)
    M->>E: req.user = {userId, role}
    E->>S: CourseService.listCourses(1, 20, "CS")
    S->>P: Course.findMany({where, skip, take})
    P->>D: find + count
    D-->>P: Results
    P-->>S: {courses, total}
    S-->>E: {courses, pagination}
    E-->>C: 200 {courses, pagination}

    Note over C,D: Enrollment Flow
    C->>E: POST /enrollments {studentId, courseId}
    E->>M: JWT Verify + Role Permit(ADMIN, TEACHER)
    M->>E: req.user
    E->>E: Zod Validation (enrollSchema)
    E->>S: EnrollmentService.enroll()
    S->>P: StudentCourse.findFirst()
    P-->>S: null (not enrolled)
    S->>P: StudentCourse.create()
    P->>D: insert
    D-->>P: created
    P-->>S: enrollment
    S-->>E: enrollment
    E-->>C: 201 {enrollment}
```

---

## Role-Based Access Control

```mermaid
graph LR
    subgraph Roles["User Roles"]
        Admin["ADMIN"]
        Teacher["TEACHER"]
        Student["STUDENT"]
        Staff["STAFF"]
        SuperUser["SUPERUSER"]
    end

    subgraph Permissions["Permissions"]
        P1["Manage Users"]
        P2["Manage Departments"]
        P3["Manage Teachers"]
        P4["Manage Students"]
        P5["Manage Courses"]
        P6["Enroll/Unenroll"]
        P7["Assign Grades"]
        P8["View Own Profile"]
        P9["View Enrolled Courses"]
    end

    Admin --> P1
    Admin --> P2
    Admin --> P3
    Admin --> P4
    Admin --> P5
    Admin --> P6
    Admin --> P7

    Teacher --> P5
    Teacher --> P6
    Teacher --> P7
    Teacher --> P4
    Teacher --> P8

    Student --> P8
    Student --> P9
```

| Route | Admin | Teacher | Student |
|-------|-------|---------|---------|
| `GET /departments` | Read | Read | Read |
| `POST /departments` | Create | - | - |
| `PUT /departments/:id` | Update | - | - |
| `DELETE /departments/:id` | Delete | - | - |
| `GET /teachers` | Read | Read | - |
| `POST /teachers` | Create | - | - |
| `PUT /teachers/:id` | Update | - | - |
| `DELETE /teachers/:id` | Delete | - | - |
| `GET /students` | Read | Read | Own |
| `POST /students` | Create | - | - |
| `PUT /students/:id` | Update | Update | - |
| `DELETE /students/:id` | Delete | - | - |
| `GET /courses` | Read | Read | Read |
| `POST /courses` | Create | Create | - |
| `PUT /courses/:id` | Update | Update | - |
| `DELETE /courses/:id` | Delete | - | - |
| `POST /enrollments` | Enroll | Enroll | - |
| `DELETE /enrollments` | Unenroll | Unenroll | - |
| `PATCH /enrollments/:id/grade` | Grade | Grade | - |
| `GET /auth/users` | Read | - | - |
| `PUT /auth/users/:id` | Update | - | - |
| `DELETE /auth/users/:id` | Delete | - | - |

---

## Project Structure

```
college-management-system/
│
├── src/                          # Backend (Express + TypeScript)
│   ├── controllers/              # HTTP request handlers
│   │   ├── auth.controller.ts    # Login, register, user mgmt
│   │   ├── course.controller.ts  # Course CRUD
│   │   ├── department.controller.ts
│   │   ├── enrollment.controller.ts  # Enroll, unenroll, grades
│   │   ├── student.controller.ts
│   │   └── teacher.controller.ts
│   │
│   ├── services/                 # Business logic layer
│   │   ├── auth.service.ts       # JWT, bcrypt, user operations
│   │   ├── course.service.ts     # Course queries + pagination
│   │   ├── department.service.ts # Head lookup, cascade deletes
│   │   ├── enrollment.service.ts # Enrollment, grade management
│   │   ├── student.service.ts    # Student queries + pagination
│   │   └── teacher.service.ts    # Teacher queries + pagination
│   │
│   ├── routes/                   # Express routers
│   │   ├── auth.routes.ts
│   │   ├── course.routes.ts
│   │   ├── department.routes.ts
│   │   ├── enrollment.routes.ts
│   │   ├── student.routes.ts
│   │   └── teacher.routes.ts
│   │
│   ├── middleware/
│   │   ├── authMiddleware.ts     # JWT verify + role permit
│   │   └── validationMiddleware.ts  # Zod schema validation
│   │
│   ├── types/global-types.ts     # AuthPayload, RequestWithUser
│   ├── utils/schema.ts           # Zod schemas + inferred types
│   ├── prisma-config.ts          # PrismaClient singleton
│   ├── app.ts                    # Express app setup
│   └── server.ts                 # Entry point (in-memory DB fallback)
│
├── prisma/
│   ├── schema.prisma             # Database schema (6 models)
│   ├── seed.ts                   # Demo data seeder
│   └── prisma.config.ts          # Prisma configuration
│
├── frontend/                     # React (Vite + Tailwind CSS)
│   └── src/
│       ├── api/                  # Axios API client + endpoints
│       │   ├── client.ts         # Interceptors (JWT, auto-logout)
│       │   ├── auth.ts           # Auth API calls
│       │   ├── courses.ts
│       │   ├── departments.ts
│       │   ├── enrollments.ts
│       │   ├── students.ts
│       │   └── teachers.ts
│       │
│       ├── components/           # Reusable UI
│       │   ├── Layout.tsx        # Sidebar + header + content
│       │   ├── Modal.tsx         # Dialog component
│       │   └── StatsCard.tsx     # Statistics card
│       │
│       ├── context/
│       │   └── AuthContext.tsx   # Auth state + provider
│       │
│       ├── pages/
│       │   ├── Login.tsx         # Sign in page
│       │   ├── Register.tsx      # Sign up page
│       │   ├── Dashboard.tsx     # Admin overview
│       │   ├── admin/            # Admin CRUD pages
│       │   │   ├── Departments.tsx
│       │   │   ├── Teachers.tsx
│       │   │   ├── Students.tsx
│       │   │   ├── Courses.tsx
│       │   │   └── Users.tsx
│       │   ├── teacher/          # Teacher pages
│       │   │   ├── TeacherDashboard.tsx
│       │   │   ├── TeacherCourses.tsx
│       │   │   └── TeacherStudents.tsx
│       │   └── student/          # Student pages
│       │       ├── StudentDashboard.tsx
│       │       └── StudentCourses.tsx
│       │
│       ├── App.tsx               # Router + route guards
│       ├── main.tsx              # Entry point
│       └── index.css             # Tailwind CSS
│
├── .env.example                  # Environment template
├── .gitignore
├── package.json                  # Backend dependencies
├── tsconfig.json                 # TypeScript config
└── README.md
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 | UI framework |
| | TypeScript 6 | Type safety |
| | Vite 8 | Build tool + dev server |
| | Tailwind CSS 4 | Utility-first styling |
| | React Router 7 | Client-side routing |
| | Axios | HTTP client with interceptors |
| | Lucide React | Icon library |
| **Backend** | Express 5 | HTTP framework |
| | TypeScript 5.9 | Type safety |
| | Prisma 6 | Type-safe ORM |
| | Zod 4 | Request validation |
| | Helmet | Security headers |
| | express-rate-limit | Rate limiting |
| | Morgan | HTTP logging |
| | cors | Cross-origin requests |
| **Auth** | jsonwebtoken | JWT tokens (7-day expiry) |
| | bcryptjs | Password hashing (10 rounds) |
| **Database** | MongoDB | NoSQL document database |
| | mongodb-memory-server | In-memory dev database |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:Sushantmg/college-management-system.git
cd college-management-system

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Set up environment variables
cp .env.example .env
```

### Running

The backend auto-starts an **in-memory MongoDB** when no local MongoDB is detected.

```bash
# Terminal 1 — Backend (port 3005)
npm run dev

# Terminal 2 — Frontend (port 4000)
cd frontend && npm run dev
```

Open **http://localhost:4000**

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@college.edu` | `admin123` |
| Teacher | `sarah.johnson@college.edu` | `teacher123` |
| Student | `alex.thompson@student.college.edu` | `student123` |

### Database Seeding

```bash
# Seed with demo departments, courses, and enrollments
npm run seed
```

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | Public | Register new user |
| `POST` | `/auth/login` | Public | Login, returns JWT |
| `GET` | `/auth/me` | Any | Get current user profile |
| `POST` | `/auth/change-password` | Any | Change password |
| `GET` | `/auth/users` | Admin | List all users (paginated) |
| `PUT` | `/auth/users/:id` | Admin | Update user role/name/email |
| `DELETE` | `/auth/users/:id` | Admin | Delete user + related data |

### Departments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/departments` | Any | List departments (paginated) |
| `GET` | `/departments/all` | Any | List all departments (no pagination) |
| `GET` | `/departments/:id` | Any | Get department with teachers, courses, students |
| `POST` | `/departments` | Admin | Create department |
| `PUT` | `/departments/:id` | Admin | Update department |
| `DELETE` | `/departments/:id` | Admin | Delete department + cascade |

### Teachers

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/teachers` | Admin, Teacher | List teachers (paginated) |
| `GET` | `/teachers/:id` | Admin, Teacher | Get teacher with courses |
| `POST` | `/teachers` | Admin | Create teacher |
| `PUT` | `/teachers/:id` | Admin | Update teacher department |
| `DELETE` | `/teachers/:id` | Admin | Delete teacher |

### Students

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/students` | Admin, Teacher | List students (paginated) |
| `GET` | `/students/:id` | Any | Get student (students see own profile) |
| `POST` | `/students` | Admin | Create student |
| `PUT` | `/students/:id` | Admin, Teacher | Update student department |
| `DELETE` | `/students/:id` | Admin | Delete student + enrollments |

### Courses

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/courses` | Any | List courses (paginated) |
| `GET` | `/courses/:id` | Any | Get course with enrollments |
| `POST` | `/courses` | Admin, Teacher | Create course |
| `PUT` | `/courses/:id` | Admin, Teacher | Update course |
| `DELETE` | `/courses/:id` | Admin | Delete course + enrollments |

### Enrollments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/enrollments` | Admin | List all enrollments (paginated) |
| `POST` | `/enrollments` | Admin, Teacher | Enroll student in course |
| `DELETE` | `/enrollments` | Admin, Teacher | Unenroll student from course |
| `GET` | `/enrollments/student/:id` | Any | Get student's enrolled courses |
| `GET` | `/enrollments/course/:id` | Admin, Teacher | Get course's enrolled students |
| `PATCH` | `/enrollments/:id/grade` | Admin, Teacher | Update grade (A+ to F) |

---

## Deployment (Vercel)

### Prerequisites

1. **MongoDB Atlas** (free tier) — https://cloud.mongodb.com
2. **Vercel account** — https://vercel.com

### Step 1: Set Up MongoDB Atlas

1. Sign up at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click **"Build a Database"** → Choose **M0 Free** tier → Create Cluster
3. Go to **Database Access** → Add New Database User (save username/password)
4. Go to **Network Access** → Add IP → **Allow Access from Anywhere** (0.0.0.0/0)
5. Go to **Database** → Click **Connect** → Choose **Drivers** → Copy connection string
6. Replace `<password>` and add database name:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/college-management?retryWrites=true&w=majority
   ```

### Step 2: Deploy Backend (API)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `Sushantmg/college-management-system`
3. Configure:

| Setting | Value |
|---------|-------|
| Framework Preset | Other |
| Root Directory | `./` |
| Build Command | `npx prisma generate && npx tsc` |
| Output Directory | `api` |

4. Add Environment Variables:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `mongodb+srv://user:pass@cluster.mongodb.net/college-management?retryWrites=true&w=majority` |
| `JWT_SECRET` | Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `CORS_ORIGIN` | `http://localhost:4000` (update after frontend deploys) |

5. Deploy → Note your API URL (e.g., `https://college-api.vercel.app`)

### Step 3: Deploy Frontend

1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the **same repo** `Sushantmg/college-management-system`
3. Configure:

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Root Directory | `./frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. Add Environment Variable:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-backend-api.vercel.app` |

5. Deploy → Note your frontend URL

### Step 4: Update Backend CORS

Go back to your **backend** Vercel project → Settings → Environment Variables → Update:

| Name | Value |
|------|-------|
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` |

Redeploy the backend.

### Manual Production Build

```bash
# Build backend
npm run build

# Build frontend
cd frontend && npm run build

# Start production server
NODE_ENV=production node dist/server.js
```

### Environment Variables Reference

```env
# Database (MongoDB Atlas for production, in-memory for local dev)
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/college-management

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your-production-secret-key

# Frontend URL (for CORS)
CORS_ORIGIN=https://your-frontend.vercel.app

# Frontend only (Vite)
VITE_API_URL=https://your-backend-api.vercel.app
```

---

## License

MIT
