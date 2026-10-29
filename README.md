# 🛡️ ProofPocket

> **Track warranties, monitor service schedules, and log repair history — all in one place.**

ProofPocket is a full-stack MERN web application that helps you manage your household products and appliances. Never lose track of a warranty expiry or forget when your appliance was last serviced.

---

## 📸 Features

- **Product Management** — Add, view, edit, and delete products with full details
- **Warranty Tracking** — Color-coded status badges (Active / Expiring Soon / Expired)
- **Repair History** — Log individual repair records per product with issue, work done, and cost
- **Search & Filter** — Real-time search by name/brand + category filter pills
- **Responsive UI** — Works on desktop and mobile with a premium dark-mode design

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router v6, Vite 8 |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas (Mongoose 9) |
| **Styling** | Vanilla CSS with CSS custom properties (dark mode) |
| **Deployment** | Frontend → Vercel · Backend → Render |

---

## 📁 Project Structure

```
proofpocket/
├── backend/
│   ├── models/
│   │   └── product.js          # Mongoose schema (Product + Repair sub-doc)
│   ├── routes/
│   │   └── productRoutes.js    # REST API routes (CRUD + repair sub-routes)
│   ├── server.js               # Express app + MongoDB connection
│   ├── .env.example            # Environment variable template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── products.js     # Centralized API service layer
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Sticky glassmorphism navbar
│   │   │   ├── ProductCard.jsx # Card with warranty badge + delete
│   │   │   ├── ProductList.jsx # Grid with search/filter + states
│   │   │   ├── ProductForm.jsx # Reusable controlled form (add/edit)
│   │   │   ├── RepairForm.jsx  # Add repair record form
│   │   │   └── Toast.jsx       # Auto-dismiss notification
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Hero + product grid
│   │   │   ├── AddProductPage.jsx  # New product form page
│   │   │   ├── EditProductPage.jsx # Edit existing product
│   │   │   └── ProductDetailPage.jsx # Full detail + repair history
│   │   ├── App.jsx             # React Router setup
│   │   └── index.css           # Design system (tokens, utilities)
│   ├── index.html
│   ├── vite.config.js          # Dev proxy → backend
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- npm
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/proofpocket.git
cd proofpocket
```

### 2. Configure the backend
```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/proofpocket
PORT=5001
```

> **Atlas IP Whitelist:** In Atlas → Network Access, add your IP (or `0.0.0.0/0` for dev).

### 3. Install & run the backend
```bash
cd backend
npm install
npm run dev
# → API running at http://localhost:5001
```

### 4. Install & run the frontend
```bash
cd frontend
npm install
npm run dev
# → App running at http://localhost:5173
```

> The Vite dev server proxies all `/api` requests to the backend automatically — no CORS config needed.

---

## 🌐 REST API Reference

Base URL: `http://localhost:5001/api`

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | Get all products (sorted newest first) |
| `GET` | `/products/:id` | Get one product by ID |
| `POST` | `/products` | Create a new product |
| `PUT` | `/products/:id` | Update a product |
| `DELETE` | `/products/:id` | Delete a product |

### Repairs (sub-documents)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/products/:id/repairs` | Add a repair record |
| `DELETE` | `/products/:id/repairs/:repairId` | Remove a repair record |

### Product Schema
```json
{
  "name": "Samsung Galaxy S24",
  "brand": "Samsung",
  "category": "Electronics",
  "purchaseDate": "2024-01-15",
  "purchasePrice": 79999,
  "warrantyExpiry": "2026-01-15",
  "nextServiceDate": "2025-06-01",
  "notes": "Serial: SN123456",
  "repairs": [
    {
      "date": "2024-08-10",
      "issue": "Screen cracked",
      "workPerformed": "Screen replacement",
      "cost": 3500
    }
  ]
}
```

---

## ☁️ Deployment

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variable: `MONGODB_URI` = your Atlas URI
6. Deploy — copy the Render URL (e.g. `https://proofpocket-api.onrender.com`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
4. Add Environment Variable: `VITE_API_URL` = your Render backend URL
5. Deploy!

---

## 📦 MongoDB Atlas Setup

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user (Database Access)
3. Whitelist IPs (Network Access → Add IP → `0.0.0.0/0`)
4. Get connection string: Connect → Drivers → Copy URI
5. Replace `<password>` with your database user's password

---

## 🧾 Assignment Requirements Checklist

- [x] **HTML** — Semantic HTML5 (`main`, `nav`, `section`, `dl`, `ul`)
- [x] **CSS** — Vanilla CSS with custom properties, dark mode, responsive grid
- [x] **JavaScript** — ES Modules throughout frontend and backend
- [x] **ReactJS** — Functional components, hooks (useState, useEffect, useCallback), React Router
- [x] **NodeJS** — Express.js REST API server
- [x] **ExpressJS** — Full CRUD routes with validation and error handling
- [x] **MongoDB** — Mongoose models with all CRUD operations + sub-document repairs
- [x] **REST API Integration** — Frontend fetches from backend via centralized API service
- [x] **Responsive UI** — Mobile-first CSS grid, responsive navbar, card layout
- [x] **GitHub Repository** — Hosted at github.com/YOUR_USERNAME/proofpocket
- [x] **Vercel Deployment** — Frontend deployed to Vercel
- [x] **README Documentation** — This file

---

## 👨‍💻 Author

Built as a full-stack web development assignment.
