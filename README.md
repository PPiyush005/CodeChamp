# ⚡ CodeChamp — Developer Growth Platform

A full-stack, production-grade platform for developers 
to track DSA progress, follow structured learning 
roadmaps, and prepare for technical interviews.

![CodeChamp Dashboard](https://via.placeholder.com/1200x600?text=CodeChamp+Dashboard)

---

## 🚀 Live Demo

> Coming soon — deployment in progress

---

## ✨ Features

### DSA Practice
- 248+ curated DSA questions across 15 topics
- Filter by topic, difficulty, pattern, and search
- Mark questions as Solved, Revisit, or Unsolved
- Bookmark important questions
- Add personal notes to each question
- Built-in **Blind 75** FAANG question sheet

### Progress Tracking
- Personal dashboard with real-time stats
- Topic-wise progress with completion percentage
- GitHub-style activity heatmap
- Daily streak tracking system
- Revision list for weak areas

### Learning Roadmaps
- Structured learning paths (Web Dev, Java Full Stack, Android)
- Phase-wise progression (Beginner → Intermediate → Advanced)
- Step completion tracking with progress percentage

### Profile & Analytics
- Personal profile with achievement badges
- Difficulty-wise solved count (Easy/Medium/Hard)
- Topic mastery bars
- Recent activity feed

### Productivity
- Daily reminder notifications (browser push)
- Customizable reminder time
- Streak maintenance alerts

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot 3.5 | REST API framework |
| Spring Security | Authentication & authorization |
| JWT | Stateless token-based auth |
| Spring Data JPA | Database ORM |
| MySQL | Relational database |
| BCrypt | Password hashing |
| Maven | Build tool |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router | Client-side routing |
| Axios | HTTP client |
| Lucide React | Icon library |
| Vite | Build tool |

---

## 🏗️ Architecture
codechamp/
├── codechamp-backend/          # Spring Boot API
│   └── src/main/java/com/codechamp/
│       ├── auth/               # JWT authentication
│       ├── user/               # User management
│       ├── dsa/                # DSA module
│       │   ├── question/       # Question CRUD
│       │   ├── topic/          # Topic management
│       │   ├── pattern/        # Pattern management
│       │   └── progress/       # User progress tracking
│       ├── roadmap/            # Roadmap module
│       │   ├── track/          # Learning tracks
│       │   ├── step/           # Track steps
│       │   └── progress/       # User roadmap progress
│       ├── config/             # Security & CORS config
│       └── exception/          # Global error handling
│
└── codechamp-frontend/         # React application
└── src/
├── api/                # Axios API calls
├── components/         # Reusable components
├── context/            # Auth context
├── pages/              # Page components
└── utils/              # Constants & helpers

---

## 🗄️ Database Schema
users
topics
patterns
questions
user_question_progress
roadmap_tracks
roadmap_steps
user_roadmap_progress

---

## 🔐 API Endpoints

### Authentication
POST  /api/v1/auth/register
POST  /api/v1/auth/login
POST  /api/v1/auth/logout

### DSA
GET   /api/v1/questions
GET   /api/v1/questions?topic=Arrays
GET   /api/v1/questions?difficulty=HARD
GET   /api/v1/questions?pattern=Sliding+Window
GET   /api/v1/questions/blind75
GET   /api/v1/topics
GET   /api/v1/patterns

### Progress
GET   /api/v1/progress/dashboard
GET   /api/v1/progress/questions
PUT   /api/v1/progress/questions/{id}
PUT   /api/v1/progress/questions/{id}/bookmark
GET   /api/v1/progress/bookmarks
GET   /api/v1/progress/revision
GET   /api/v1/progress/heatmap

### Roadmap
GET   /api/v1/roadmap/tracks
GET   /api/v1/roadmap/tracks/{id}/steps
GET   /api/v1/roadmap/tracks/{id}/progress
GET   /api/v1/roadmap/my-progress
PUT   /api/v1/roadmap/steps/{id}/complete

### Profile
GET   /api/v1/profile

---

## ⚙️ Local Setup

### Prerequisites
Java 21+
MySQL 8+
Node.js 18+
Maven

### Backend Setup

**Step 1** — Clone the repository:
```bash
git clone https://github.com/PPiyush005/CodeChamp.git
cd CodeChamp/codechamp-backend
```

**Step 2** — Create MySQL database:
```sql
CREATE DATABASE codechamp_db;
```

**Step 3** — Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/codechamp_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

**Step 4** — Run the application:
```bash
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend Setup

**Step 1** — Navigate to frontend:
```bash
cd CodeChamp/codechamp-frontend
```

**Step 2** — Install dependencies:
```bash
npm install
```

**Step 3** — Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📊 Key Implementation Highlights

- **JWT Authentication** — Stateless auth with BCrypt password hashing and token-based session management
- **Streak Algorithm** — Calculates daily solving streaks by comparing last active date
- **Heatmap Data** — Aggregates solve counts by date for the last 365 days using JPQL group-by queries
- **Topic Filtering** — Case-insensitive custom JPQL queries for flexible question filtering
- **Progress Analytics** — Real-time completion percentages calculated server-side
- **Blind 75 Integration** — Industry-standard FAANG question list with personal progress tracking

---

## 👨‍💻 Author

**Piyush** — [@PPiyush005](https://github.com/PPiyush005)

---

## 📄 License

This project is licensed under the MIT License.
