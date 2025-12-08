// Reusable tea card component for menu pages
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { scrollToTop } from '../utils/scroll';

interface TeaCardProps {
  content: {
    title: string;
    intro: string;
    link: string;
  };
  showPageNumber?: number; // Optional page number to display
  onNavigate?: () => void; // Optional callback before navigation
}

export default function TeaCard({ content, showPageNumber, onNavigate }: TeaCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    scrollToTop();
    if (onNavigate) {
      onNavigate();
    }
    navigate(content.link);
  };

  return (
    <Box
      component="button"
      onClick={handleClick}
      sx={{
        width: '100%',
        height: '100%',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateX(4px)'
        }
      }}
    >
      <Box>
        <Typography 
          variant="h2"
          sx={{ 
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.2rem',
            fontWeight: 700,
            color: 'var(--ink)',
            mb: 2,
            borderBottom: '3px solid rgba(201, 165, 112, 0.5)',
            paddingBottom: '0.75rem',
            '&:hover': {
              color: 'rgba(201, 165, 112, 0.9)'
            }
          }}
        >
          {content.title}
        </Typography>
        <Typography 
          variant="body1"
          sx={{ 
            color: 'var(--ink)',
            lineHeight: 1.8,
            fontSize: '1.05rem'
          }}
        >
          {content.intro}
        </Typography>
      </Box>
      {showPageNumber !== undefined && (
        <Typography 
          variant="h4"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem',
            fontWeight: 700,
            color: 'rgba(201, 165, 112, 0.7)',
            border: '3px solid rgba(201, 165, 112, 0.4)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.6)',
            alignSelf: 'center',
            mt: 2
          }}
        >
          {showPageNumber}
        </Typography>
      )}
    </Box>
  );
}

