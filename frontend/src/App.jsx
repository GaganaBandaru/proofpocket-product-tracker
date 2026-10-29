import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AddProductPage from './pages/AddProductPage'
import EditProductPage from './pages/EditProductPage'
import ProductDetailPage from './pages/ProductDetailPage'

function NotFoundPage() {
  return (
    <main className="page">
      <div className="container">
        <div className="state-box">
          <div className="state-icon">🔍</div>
          <h1>404 — Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <a href="/" className="btn btn-primary">← Go Home</a>
        </div>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                     element={<HomePage />} />
        <Route path="/products/new"         element={<AddProductPage />} />
        <Route path="/products/:id"         element={<ProductDetailPage />} />
        <Route path="/products/:id/edit"    element={<EditProductPage />} />
        <Route path="*"                     element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
