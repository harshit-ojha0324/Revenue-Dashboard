# 📊 Sales Dashboard

A full-stack sales analytics dashboard built with **React**, **Express**, and **MongoDB**. Track revenue, monitor sales performance across regions and categories, and visualize trends through interactive charts — all behind a secure authentication layer.

![Dashboard Overview](/docs/screenshots/dashboard.png)

---

## ✨ Features

- **Interactive Charts** — Monthly trends, category distribution, regional comparisons, cumulative growth, and more (powered by Recharts)
- **KPI Cards** — At-a-glance metrics for total revenue, sales count, averages, and growth
- **Advanced Filtering** — Filter data by date range, region, category, and other dimensions
- **Tab Navigation** — Switch between chart views and a detailed data table
- **Authentication** — JWT-based login/registration with secure httpOnly cookies
- **Role-Based Access** — Protected routes with authorization middleware
- **Responsive Design** — Tailwind CSS layout that works on desktop and mobile
- **Redux State Management** — Centralized state with Redux Toolkit slices for auth, sales, and UI
- **REST API** — Full CRUD endpoints for sales and user management
- **Docker Support** — Containerized deployment with Docker Compose

---

## 📸 Screenshots

| Login | Dashboard |
|:-----:|:---------:|
| ![Login](/docs/screenshots/login.png) | ![Dashboard](/docs/screenshots/Dashboard-1.png) |

| Charts | Dashboard Detail |
|:------:|:----------------:|
| ![Charts](/docs/screenshots/charts.png) | ![Dashboard Detail](/docs/screenshots/Dashboard-2.png) |

> **Note:** To add your own screenshots, save images to `docs/screenshots/` using the filenames above.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 16
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sales-dashboard.git
cd sales-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/sales-dashboard
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CORS_ORIGIN=http://localhost:3000
```

> ⚠️ **Never commit production credentials.** Use a secrets manager or CI/CD secret store for deployments.

### 4. Start the Application

**Terminal 1 — Backend:**
```bash
npm run server          # Express API on http://localhost:5001
```

**Terminal 2 — Frontend:**
```bash
npm start               # React dev server on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker

Run the full stack with Docker Compose:

```bash
docker-compose up --build
```

This spins up the React frontend, Express API, and a MongoDB instance.

---

## 🏗️ Project Structure

```
sales-dashboard/
├── public/                     # Static assets & HTML template
├── server/
│   ├── config/                 # DB connection & default settings
│   ├── controllers/            # Route handlers (auth, sales, users)
│   ├── middleware/              # Auth guard & error handling
│   ├── models/                 # Mongoose schemas (Sale, User)
│   ├── routes/                 # Express route definitions
│   └── index.js                # Server entry point
├── src/
│   ├── components/
│   │   ├── Auth/               # Login, Register, ProtectedRoute
│   │   ├── Charts/             # All chart components
│   │   ├── Dashboard/          # Main dashboard layout
│   │   ├── Filters/            # Data filtering controls
│   │   ├── Header/ & Footer/   # Layout components
│   │   ├── KPICards/           # Key metric cards
│   │   ├── TabNavigation/      # View switching tabs
│   │   └── UI/                 # Shared UI (Spinner, Notification)
│   ├── data/                   # Seed/initial data
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Page-level components
│   ├── redux/                  # Store, slices (auth, sales, UI)
│   └── utils/                  # API config, formatters, chart helpers
├── docker-compose.yml
├── Dockerfile
├── tailwind.config.js
└── package.json
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & receive JWT |
| `GET` | `/api/auth/me` | Get current user |
| `GET` | `/api/auth/logout` | Logout & clear cookie |

### Sales
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/sales` | Get all sales (with filters) |
| `POST` | `/api/sales` | Create a sale |
| `PUT` | `/api/sales/:id` | Update a sale |
| `DELETE` | `/api/sales/:id` | Delete a sale |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List all users (admin) |
| `PUT` | `/api/users/:id` | Update a user |
| `DELETE` | `/api/users/:id` | Delete a user |

> All sales and user endpoints require a valid JWT (passed as a cookie or `Authorization: Bearer <token>` header).

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Redux Toolkit, Tailwind CSS, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JSON Web Tokens (JWT), bcrypt |
| DevOps | Docker, Docker Compose, GitHub Actions CI |
| Testing | Jest, React Testing Library |

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

Tests are located alongside their components in `__tests__/` directories.

---

## 🔒 Security Notes

- **Passwords** are hashed with bcrypt via Mongoose pre-save hooks.
- **JWT tokens** are stored in secure, httpOnly cookies — avoid using localStorage for auth tokens.
- **CORS** is restricted to the origin defined in `CORS_ORIGIN`.
- **Auth middleware** verifies the token and confirms the user still exists before granting access.
- Rotate `JWT_SECRET` immediately if it is ever exposed.
- Use environment variables (or a secrets manager) for all sensitive configuration.

---

## 📝 Recent Fixes & Improvements

- Fixed `User` pre-save hook to correctly short-circuit and handle errors during password hashing
- `updateUser` now loads the document and calls `.save()` to ensure pre-save hooks run on password changes
- Hardened `protect` middleware to verify the user still exists after token validation
- `sendTokenResponse` sets a secure cookie (`token`) alongside the JSON response
- Replaced deprecated `.remove()` calls with `findByIdAndDelete`
- Removed hardcoded DB credentials from config — all secrets are now environment-driven
- Tightened default CORS configuration
- Simplified frontend 401 handling to rely on HTTP status codes

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
