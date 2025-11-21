/**
 * App.tsx
 * ----------
 * Tea Education Website - Routing
 */
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tea from './pages/Tea';
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tea/:teaType" element={<Tea />} />
      </Routes>
    </div>
  )
}

export default App
