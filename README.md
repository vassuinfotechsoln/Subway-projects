# AssetPro - Enterprise Asset Management System

AssetPro is a modern, full-stack SaaS solution for corporate asset tracking and maintenance management.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account/local instance

### 🛠️ Installation

1. **Clone the repository** (if applicable)
2. **Install Root Dependencies**
   ```bash
   npm install concurrently -D
   ```
3. **Setup Backend**
   - Navigate to `/backend`
   - Run `npm install`
   - Configure `.env` with your `MONGODB_URI` and `JWT_SECRET`
4. **Setup Frontend**
   - Navigate to `/frontend`
   - Run `npm install`

### 🏃 Running locally

From the root directory:

```bash
npm run dev
```

This will concurrently start:

- **Backend API**: http://localhost:4000
- **Frontend App**: http://localhost:5173

## ✨ Key Features

- **🛡️ Multi-role Auth**: Distinct portals for Admins and Employees.
- **📊 Real-time Dashboard**: Insights into asset distribution, status, and health.
- **📦 Inventory Lifecycle**: Complete CRUD for hardware and software assets.
- **🔧 Maintenance Hub**: Integrated incident reporting and resolution workflow.
- **🌑 Dark Mode Architecture**: Premium dark/light themes with persistence.
- **📱 Responsive by Design**: Fully functional on mobile and desktop.

## 🏗️ Architecture

### Backend (Node/Express/Mongoose)

- **MVC Pattern**: Scalable controller-route separation.
- **JWT Middleware**: Secure, stateless session management.
- **Auth Guards**: Role-based access control (RBAC).

### Frontend (React/Vite/Tailwind)

- **Context API**: Global state for Auth and Theme.
- **Tailwind Ecosystem**: Utilizing `clsx` and `tailwind-merge` for clean styling.
- **Recharts**: High-performance SVG charts.
- **Layout Persistence**: Smart dashboard wrappers for seamless navigation.

## 🔐 Security Standards

- Bcrypt password hashing
- Protected API endpoints
- Front-end route guards
- Environment variable protection
- CORS configuration
"# Subway-projects" 
