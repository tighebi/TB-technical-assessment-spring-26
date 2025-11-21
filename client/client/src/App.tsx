/**
 * App.tsx
 * ----------
 * Tea Education Website - Routing
 */
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Home from './pages/Home';
import Tea from './pages/Tea';
import './App.css'

// Custom Material UI theme matching tea aesthetic
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a5d3a', // Dark green
      light: '#6b7d4a',
      dark: '#3d4f2f',
      contrastText: '#f8e7cd',
    },
    secondary: {
      main: '#c9a570', // Tan/amber
      light: '#e2b985',
      dark: '#a86c39',
      contrastText: '#2c1b10',
    },
    background: {
      default: '#f5e3c8',
      paper: '#f8e7cd',
    },
    text: {
      primary: '#2c1b10',
      secondary: '#1f120a',
    },
  },
  typography: {
    fontFamily: "'Work Sans', 'Helvetica Neue', system-ui, sans-serif",
    h1: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tea/:teaType" element={<Tea />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
