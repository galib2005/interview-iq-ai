# InterviewIQ AI - Production-Grade AI Mock Interview Platform

InterviewIQ AI is an intelligent interview preparation SaaS platform designed to simulate real-world technical, behavioral (HR), coding, and project viva mock interviews. Powered by advanced AI logic, Web Speech APIs, and sandbox code compilation, it offers candidates instant evaluations, granular metric feedback, and automated skill-mapping roadmaps to build confidence and communication.

---

## 🌟 Key Capabilities
InterviewIQ AI features a suite of advanced mock interview tools to simulate actual recruiter evaluations:

*   **Project Viva Mode:** Extracts projects, skills, and technologies from parsed resumes and generates targeted project viva questions across Beginner, Intermediate, and Advanced tiers.
*   **Company Interview Mode:** Simulates actual interview structures and questions for **TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, HCL, Tech Mahindra, and Amazon** (including specific DSA coding challenges and behavioral checks mapping to Amazon Leadership Principles).
*   **AI Interview Memory:** Tracks historically weak topics and adaptively feeds those concepts back into subsequent mock rounds to ensure candidates focus on topics needing review.
*   **Weak Topic Tracking System:** Persists topics with scores below 60% in a dedicated `WeakTopic` collection to track candidate improvement over time (e.g. *"DBMS improved from 45% to 72%"*).
*   **Career Readiness Score:** A comprehensive capability index calculated dynamically as:
    $$\text{Career Readiness} = 35\% \times \text{Mock Interview} + 30\% \times \text{Coding Arena} + 20\% \times \text{Resume ATS} + 15\% \times \text{Consistency Index}$$
*   **Interactive Coding Arena:** An integrated compiler playground supporting JavaScript execution in a safe vm container.
*   **Advanced Dashboard Widgets:** Opaque, responsive grids rendering Career Readiness dial charts, difficulty analysis accuracies (Easy, Medium, Hard), syllabus strong areas, and Project Viva scorecards.

---

## 🏗️ Project Architecture
The platform is built using a decoupled client-server architecture:

```
interviewiq-ai/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, MemoryStore fallback & raw roadmap data
│   │   ├── controllers/     # Authentication, Interview, Resume, Coding, and Dashboard logic
│   │   ├── models/          # User, Interview, Resume, and WeakTopic schemas
│   │   ├── middleware/      # JWT protection routes, global error handlers
│   │   ├── routes/          # Express route mappings
│   │   └── services/        # OpenAI API wrappers & Javascript sandbox runtime
│   └── index.ts             # Server entry point
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router (studio, dashboard, profile, feedback, etc.)
│   │   ├── components/      # Navbar, theme-toggles, custom widgets
│   │   ├── context/         # AuthContext and ToastContext state containers
│   │   └── lib/             # API connection handlers
│   └── globals.css          # Tailwind CSS v4 styling rules
└── README.md                # Main documentation
```

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js** (v18+)
*   **MongoDB** (Local instance running on `localhost:27017` or Atlas URI)
*   **OpenAI API Key** (Optional; the application falls back to a highly realistic mock intelligence engine automatically if left empty).

### 1. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/interviewiq
JWT_SECRET=supersecretjwtkey_interviewiq_123
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=http://localhost:3000
```

### 2. Backend Server Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the development server:
    ```bash
    npm run dev
    ```
    The server starts on port `5000`. If MongoDB is offline, the backend automatically transitions to a robust in-memory database fallback (`memoryStore.ts`) to ensure uninterrupted testing.

### 3. Frontend Client Setup
1.  Navigate to the frontend folder:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the development server:
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` to view the platform.

---

## 📡 REST API Documentation Summary

### Authentication (`/api/auth`)
*   `POST /api/auth/register` - Create a candidate account (validates password strength).
*   `POST /api/auth/login` - Authenticate email and password.
*   `POST /api/auth/google` - Instant mock Google OAuth access.
*   `GET /api/auth/me` - Retrieve current user session context.
*   `PUT /api/auth/update-profile` - Update user skills and profile details.

### Interview sessions (`/api/interviews`)
*   `POST /api/interviews/start` - Generate and save questions based on role, type, company, or viva level.
*   `POST /api/interviews/:id/submit` - Submit answers/code, calculate dynamic scoring, and update weak topics.
*   `GET /api/interviews/:id` - Fetch details of a completed mock interview.

### Dashboard & Analytics (`/api/dashboard`)
*   `GET /api/dashboard/summary` - Computes and lists widget analytics, timelines, weak/strong topics, company metrics, and Career Readiness.

### Resume Intelligence (`/api/resumes`)
*   `POST /api/resumes/upload` - Upload PDF resume, extract skill gaps, and parse project lists for Viva mode.

---

## 🖥️ Screen Layouts
*   **Unified Dashboard Overview:** Holds Career Readiness dials, syllabus progress trackers, and company comparison logs.
*   **AI Interview Studio:** Allows configuring Viva modes, difficulty parameters, and company-specific technical rounds.
*   **Coding assessment Arena:** Integrated code editors with runtime test-case consoles.

---

## 📦 Deployment Instructions

### Backend (Express)
1.  Compile TypeScript files to JavaScript:
    ```bash
    npm run build
    ```
2.  Start the compiled node app in production:
    ```bash
    npm start
    ```

### Frontend (Next.js)
1.  Build the optimized production static pages:
    ```bash
    npm run build
    ```
2.  Start the production server:
    ```bash
    npm start
    ```
