# 🛡️ ProofPocket

> **Track warranties, monitor service schedules, and log repair history — all in one place.**

ProofPocket is a secure full-stack MERN web application that helps you manage your household products and appliances. Never lose track of a warranty expiry or forget when your appliance was last serviced.

---

## 📸 Features

- **User Authentication** — Secure signup, login, and JWT-authenticated sessions with `bcryptjs` password hashing
- **User-Scoped Vault** — Strict data isolation; users access and modify only their own products and repair records
- **Dashboard Summary Cards** — Live metrics for Total Products, Active Warranties, Warranties Expiring Soon (30d), and Upcoming Services (with overdue indicators)
- **Product Management** — Add, view, edit, and delete products with full details and image/category badges
- **Warranty Tracking & Reminders** — Color-coded status badges plus automated 7-day alert banner
- **Repair History** — Log individual repair records per product with issue, work done, and cost
- **Total Ownership Cost** — Dynamic calculation factoring initial price plus repair expenses
- **Search & Filter** — Real-time search by name/brand + category filter pills + pagination
- **Responsive UI** — Works seamlessly across desktop, tablet, and mobile with Light and Dark modes

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router v7, Vite 8 |
| **Backend** | Node.js, Express 5, jsonwebtoken, bcryptjs |
| **Database** | MongoDB Atlas (Mongoose 9) |
| **Styling** | Vanilla CSS with custom properties & design system (Light/Dark mode) |
| **Deployment** | Frontend → Vercel · Backend → Render |

---

## 📁 Project Structure

```
proofpocket/
├── backend/
│   ├── middleware/
│   │   └── auth.js             # JWT Bearer token authentication middleware
│   ├── models/
│   │   ├── User.js             # User schema with bcrypt pre-save hash & compare
│   │   └── product.js          # Product schema with user ownership reference
│   ├── routes/
│   │   ├── authRoutes.js       # Signup, login, and me session routes
│   │   └── productRoutes.js    # Protected REST API routes (user-scoped CRUD)
│   ├── scripts/
│   │   └── claimLegacyProducts.js # Safe migration script with pre-migration backup
│   ├── server.js               # Express server + MongoDB connection
│   ├── .env.example            # Backend environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js         # Auth API service (signup, login, getMe)
│   │   │   └── products.js     # Products API service with Bearer token injection
│   │   ├── components/
│   │   │   ├── DashboardStats.jsx  # 4 summary metrics cards
│   │   │   ├── Navbar.jsx          # Responsive navbar with user profile & theme toggle
│   │   │   ├── ProductCard.jsx     # Card with warranty badge + delete
│   │   │   ├── ProductList.jsx     # Grid with search/filter + pagination + reminders
│   │   │   ├── ProductForm.jsx     # Controlled product form (add/edit)
│   │   │   ├── ProtectedRoute.jsx  # Auth route guard
│   │   │   ├── RepairForm.jsx      # Log repair record form
│   │   │   └── Toast.jsx           # Notification toast
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state provider and useAuth hook
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Dashboard page
│   │   │   ├── LoginPage.jsx       # Sign in page
│   │   │   ├── SignupPage.jsx      # Create account page
│   │   │   ├── AddProductPage.jsx  # New product form page
│   │   │   ├── EditProductPage.jsx # Edit product page
│   │   │   └── ProductDetailPage.jsx # Product detail + repair history
│   │   ├── App.jsx             # React Router with AuthProvider and ProtectedRoute
│   │   └── index.css           # Global design system & theme variables
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

Edit `backend/.env` with your values:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
PORT=5001
JWT_SECRET=your_strong_random_jwt_secret_here
```

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

---

## 🌐 REST API Reference

Base URL: `http://localhost:5001/api`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register new account (`name`, `email`, `password`) |
| `POST` | `/auth/login` | Sign in with credentials (`email`, `password`) |
| `GET` | `/auth/me` | Fetch authenticated user profile (`Bearer <token>`) |

### Products & Repairs (Requires `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | List authenticated user's products (newest first) |
| `GET` | `/products/:id` | Get specific product owned by user |
| `POST` | `/products` | Create product (assigned to authenticated user) |
| `PUT` | `/products/:id` | Update owned product |
| `DELETE` | `/products/:id` | Delete owned product |
| `POST` | `/products/:id/repairs` | Add repair record to owned product |
| `DELETE` | `/products/:id/repairs/:repairId` | Remove repair record from owned product |

---

## 🔒 Legacy Data Migration Utility

If your database contains products created before authentication was introduced, they remain safely isolated (unassigned products are never exposed to new users).

To safely assign unassigned legacy products to your account:

1. Create/register your user account (e.g., `user@example.com`).
2. Run preview mode:
   ```bash
   node backend/scripts/claimLegacyProducts.js user@example.com
   ```
3. Run with explicit confirmation:
   ```bash
   node backend/scripts/claimLegacyProducts.js user@example.com --confirm
   ```
   > An automated timestamped JSON backup is saved to `backend/backups/` before any database changes are made.

---

## ☁️ Deployment

### Backend → Render
1. Push code to GitHub.
2. Create Web Service on [render.com](https://render.com).
3. Set **Root Directory** to `backend`.
4. Set **Build Command**: `npm install`.
5. Set **Start Command**: `node server.js`.
6. Add Environment Variables:
   - `MONGODB_URI` = your Atlas connection string
   - `JWT_SECRET` = strong random secret
7. Deploy!

### Frontend → Vercel
1. Import GitHub repository on [vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable:
   - `VITE_API_URL` = your deployed Render backend URL (no trailing slash)
4. Deploy!

---

## 🧾 Assignment Requirements Checklist

- [x] **HTML** — Semantic HTML5 (`main`, `nav`, `section`, `dl`, `ul`)
- [x] **CSS** — Vanilla CSS design system with custom properties, responsive grid, light/dark themes
- [x] **JavaScript** — ES Modules throughout frontend and backend
- [x] **ReactJS** — Context API, custom hooks, React Router, protected routes
- [x] **NodeJS** — Express.js REST API with modular routers and middleware
- [x] **Authentication** — `bcryptjs` password hashing, JWT bearer tokens, ownership verification
- [x] **MongoDB** — Mongoose models with validation, sub-document repairs, and user references
- [x] **REST API Integration** — Centralized API service with Bearer token header injection
- [x] **Responsive UI** — Mobile-first CSS grid, responsive navbar, responsive auth forms
- [x] **GitHub & Deployment Ready** — Root `.gitignore` protecting secrets, `.env.example` templates
- [x] **README Documentation** — Complete documentation of features, setup, and APIs
