/**
 * App.tsx
 * ----------
 * Acts as the high-level shell for the stand/brochure experience.
 * Routing lives here so each child page can own its own immersive layout
 * without a persistent header/nav that would break the “booth” illusion.
 */
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lesson1 from './pages/Lesson1';
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson-1" element={<Lesson1 />} />
      </Routes>
    </div>
  )
}

export default App
