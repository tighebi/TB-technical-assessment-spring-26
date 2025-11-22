/**
 * UsernameDisplay.tsx
 * ----------
 * Reusable username display component with edit functionality
 * Fixed position in top right corner with high contrast for readability
 */
import { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';
import { Person, Edit, CheckCircle } from '@mui/icons-material';
import { getUsername, setUsername } from '../utils/username';
import './UsernameDisplay.css';

export default function UsernameDisplay() {
  const [username, setUsernameState] = useState(() => getUsername());
  const [showUsernameInput, setShowUsernameInput] = useState(false);

  // Listen for localStorage changes to update username display
  useEffect(() => {
    const handleStorageChange = () => {
      const newUsername = getUsername();
      if (newUsername !== username) {
        setUsernameState(newUsername);
      }
    };

    // Check for changes periodically (when component is visible)
    const interval = setInterval(() => {
      handleStorageChange();
    }, 500);

    // Also listen for storage events (for cross-tab updates)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [username]);

  const handleEdit = () => {
    setShowUsernameInput(true);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setUsername(username.trim());
      setShowUsernameInput(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameState(e.target.value);
  };

  if (!username) {
    return null; // Don't show if no username is set
  }

  return (
    <>
      <Box className="username-display">
        <Person sx={{ color: 'var(--parchment)', fontSize: '1.5rem' }} />
        <Typography className="username-text">{username}</Typography>
        <IconButton
          size="small"
          onClick={handleEdit}
          aria-label="Change username"
          className="username-edit-btn"
        >
          <Edit fontSize="small" />
        </IconButton>
      </Box>

      {/* Username Edit Dialog */}
      <Dialog 
        open={showUsernameInput} 
        onClose={() => setShowUsernameInput(false)}
        PaperProps={{
          sx: {
            background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 0, 0, 0.015) 2px,
                rgba(0, 0, 0, 0.015) 4px
              ),
              radial-gradient(ellipse at 50% 50%, rgba(248, 231, 205, 0.12) 0%, transparent 70%),
              linear-gradient(145deg, rgba(245, 227, 200, 0.98), rgba(233, 209, 169, 0.98))
            `,
            borderRadius: '16px',
            padding: '1rem',
            border: '2px solid rgba(201, 165, 112, 0.25)'
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: 'var(--ink)' }}>
            Change Username
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3, color: 'var(--ink)' }}>
            Enter your new name:
          </Typography>
          <form onSubmit={handleUsernameSubmit}>
            <TextField
              fullWidth
              value={username}
              onChange={handleUsernameChange}
              placeholder="Your name"
              autoFocus
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover fieldset': {
                    borderColor: 'rgba(201, 165, 112, 0.5)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(201, 165, 112, 0.8)'
                  }
                }
              }}
            />
            <Button 
              type="submit" 
              fullWidth
              variant="contained"
              endIcon={<CheckCircle />}
              sx={{
                background: 'linear-gradient(135deg, #4a5d3a, #6b7d4a)',
                color: 'var(--parchment)',
                padding: '0.75rem',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #3d4f2f, #5a6b3a)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

