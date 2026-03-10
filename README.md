# E-GROOTS — Electronics & IoT Learning Platform



**E-GROOTS** is a **learning-first EdTech web application** focused on electronics and IoT education. It enables users to learn electronics through structured courses, practice concepts using an interactive electronic circuit simulator, and explore IoT and no-code workflows.

> **Tagline:** *"Learn Electronics. Simulate Visually. Build Confidently."*

---

## Core Features

### 1. 📚 Learning Dashboard
- A **course grid** displaying available electronics courses with difficulty levels (`beginner`, `intermediate`, `advanced`).
- Course progress tracking and detailed lesson content pages.
- Locked/unlocked course progression system.

### 2. ⚡ Electronic Circuit Simulator
The flagship feature — a **graph-based electrical simulation engine** that provides:
- **Drag-and-drop circuit building** on an SVG canvas with wire drawing.
- **Component palette** with real-world components: LEDs, resistors, buttons, Arduino UNO (16 pins), ESP32 (10 pins), breadboards (260+ terminals), buzzers, servos, etc.
- **Real-time simulation** with net building, circuit detection, voltage propagation, and component state evaluation.
- **Error detection system**: missing ground, missing power, short circuits, reverse polarity, missing resistors for LEDs.
- **Debug panel**: live display of detected circuits, net voltages, component states, and errors/warnings.

### 3. 🧩 No-Code Editor
A **visual no-code programming environment** for building IoT workflows:
- Block-based programming with a canvas, sidebar, and code generation.
- Node components with port connections.
- Automatic code generation from visual blocks.

### 4. 👤 User Management
- **Authentication system** with login/signup pages and protected routes.
- Auth context with session management.
- User profile page.

### 5. 📄 Additional Pages
- **About** page with platform information.
- **Help** page for user guidance.
- **404 Not Found** page.

---

## Tech Stack

| Layer              | Technologies                                             |
| ------------------ | -------------------------------------------------------- |
| **Frontend**       | React 18, TypeScript, TailwindCSS, Vite                  |
| **UI Components**  | Shadcn/ui (47 components), Radix UI primitives, Lucide Icons |
| **State / Data**   | TanStack Query, React Hook Form, Zod validation          |
| **Routing**        | Wouter                                                   |
| **Animations**     | Framer Motion                                            |
| **Charts**         | Recharts                                                 |
| **Backend**        | Express.js (Node.js), TypeScript (TSX)                   |
| **Database**       | PostgreSQL (Drizzle ORM), with in-memory storage for dev |
| **Shared**         | Drizzle-Zod schemas (`shared/schema.ts`)                 |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client (Vite + React)         │
│  ┌───────────┐  ┌──────────────┐  ┌──────────┐ │
│  │ Dashboard  │  │  Simulation  │  │ No-Code  │ │
│  │ (Courses)  │  │  (Circuits)  │  │ Editor   │ │
│  └───────────┘  └──────────────┘  └──────────┘ │
│  ┌───────────┐  ┌──────────────┐  ┌──────────┐ │
│  │  Auth      │  │   Profile    │  │  Help/   │ │
│  │ (Login/    │  │              │  │  About   │ │
│  │  Signup)   │  │              │  │          │ │
│  └───────────┘  └──────────────┘  └──────────┘ │
│          ↕ TanStack Query (REST API)            │
├─────────────────────────────────────────────────┤
│              Server (Express.js)                │
│  Routes: /api/courses, /api/components          │
│  Storage: In-memory (mock) / PostgreSQL         │
├─────────────────────────────────────────────────┤
│           Shared (schema.ts - Drizzle/Zod)      │
└─────────────────────────────────────────────────┘
```

---

## Project Structure

### Frontend (`client/src/`)

```
client/src/
├── components/
│   ├── layout/
│   │   ├── header.tsx              # Global header with logo, search, profile
│   │   └── tool-sidebar.tsx        # Left navigation for tools
│   ├── dashboard/
│   │   └── course-card.tsx         # Course card component
│   ├── simulation/
│   │   ├── component-palette.tsx   # Component selection panel
│   │   ├── circuit-canvas.tsx      # SVG-based circuit builder
│   │   ├── control-panel.tsx       # Simulation controls & status
│   │   └── debug-panel.tsx         # Debug info panel (nets, voltages)
│   ├── no-code-editor/
│   │   ├── block-renderer.tsx      # Visual block rendering
│   │   ├── no-code-canvas.tsx      # Node-based visual canvas
│   │   ├── no-code-panel.tsx       # Editor panel
│   │   ├── no-code-sidebar.tsx     # Block palette sidebar
│   │   ├── node-component.tsx      # Individual node components
│   │   └── port-dot.tsx            # Connection port dots
│   └── ui/                         # 47 Shadcn UI components
├── pages/
│   ├── dashboard.tsx               # Main learning dashboard
│   ├── electronic-simulation.tsx   # Simulation workspace
│   ├── course-detail.tsx           # Course content viewer
│   ├── no-code-editor.tsx          # No-code editor workspace
│   ├── login.tsx                   # Login page
│   ├── signup.tsx                  # Signup page
│   ├── profile.tsx                 # User profile page
│   ├── about.tsx                   # About page
│   ├── help.tsx                    # Help page
│   └── not-found.tsx               # 404 page
├── lib/
│   ├── simulation-engine.ts        # Graph-based electrical simulation (~30KB)
│   ├── circuit-types.tsx           # Component metadata and terminals
│   ├── component-metadata.tsx      # Detailed component definitions
│   ├── connection-validator.tsx     # Circuit connection validation
│   ├── code-generator.ts           # Code generation utilities
│   ├── no-code-generator.ts        # No-code to code converter
│   ├── no-code-generator.tsx        # No-code generator (JSX)
│   ├── auth-context.tsx            # Authentication context provider
│   ├── mock-data.ts                # Mock data for courses & components
│   ├── queryClient.ts              # TanStack Query config
│   └── utils.ts                    # Utility functions
├── hooks/                          # Custom React hooks
├── App.tsx                         # Main app with routing
├── main.tsx                        # Entry point
└── index.css                       # Global styles
```

### Backend (`server/`)

```
server/
├── index.ts          # Express server entry point
├── routes.ts         # API endpoint definitions
├── storage.ts        # In-memory storage with mock data
├── static.ts         # Static file serving
└── vite.ts           # Vite dev server integration
```

### Shared (`shared/`)

```
shared/
└── schema.ts         # TypeScript types & Drizzle schemas
```

---

## API Endpoints

| Method  | Endpoint                     | Description              |
| ------- | ---------------------------- | ------------------------ |
| `GET`   | `/api/courses`               | List all courses         |
| `GET`   | `/api/courses/:id`           | Get course details       |
| `PATCH` | `/api/courses/:id/progress`  | Update course progress   |
| `GET`   | `/api/components`            | List electronic components |
| `GET`   | `/api/components/:id`        | Get component details    |

---

## Data Models

### User
- `id` (UUID), `username`, `password`

### Course
- `id`, `title`, `description`, `difficulty` (beginner/intermediate/advanced), `progress`, `lessons[]`, `isLocked`

### Lesson
- `id`, `title`, `content`, `diagramPlaceholder`

### Electronic Component
- `id`, `name`, `category` (base/power/boards/structure), `icon`, `description`

### Circuit State
- `placedComponents[]`, `wires[]`, `isRunning`, `ledState`, `errorMessage`

---

## Key Highlights

1. **Custom Simulation Engine** — A sophisticated graph-based electrical simulation engine with net building, voltage propagation, and real-time error detection — the most complex and unique part of the project (~30KB of simulation logic).

2. **Rich Component Library** — Detailed terminal definitions for real-world components (Arduino UNO, ESP32, breadboards) with accurate pin layouts.

3. **No-Code Visual Programming** — A node-based visual editor with automatic code generation capabilities for IoT workflows.

4. **Full-Stack TypeScript** — End-to-end type safety from shared schemas through the backend to the frontend.

5. **Professional Design** — Light theme with a professional SaaS aesthetic, smooth animations via Framer Motion, and a clean learning-focused design.

---

## Running the Project

### Prerequisites
- Node.js 20+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server (frontend + backend on port 5000)
npm run dev

# Type check
npm run check

# Build for production
npm run build

# Start production server
npm start
```

### Access
Navigate to `http://localhost:5000` after starting the dev server.

---

## Design Philosophy
- **Light theme** with professional SaaS aesthetic
- **Minimal animations** — calm, smooth, purposeful
- **Clean, learning-focused design**
- Built with **47 reusable Shadcn/ui components**

---

*Last updated: February 2026*
