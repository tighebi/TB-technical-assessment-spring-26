/**
 * Home.tsx
 * ----------
 * Tea Education - IdeaCon Stand
 * - Top section: Welcome to the Tea Education showcase
 * - Bottom section: Interactive brochure with tea highlights and types
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button
} from '@mui/material';
import {
  Person,
  Edit,
  CheckCircle
} from '@mui/icons-material';
import api from '../api';
import { getUsername, setUsername } from '../utils/username';
import './Home.css';

/**
 * Tea highlights for the brochure's front side (3 teas)
 */
const teaHighlights = [
  {
    title: 'White Tea',
    copy: 'The most delicate tea with subtle, sweet flavors. Minimal processing preserves natural antioxidants.',
    link: '/tea/white'
  },
  {
    title: 'Yellow Tea',
    copy: 'The rarest tea type with a mellow, smooth flavor. Unique "sealed yellowing" process creates its distinctive character.',
    link: '/tea/yellow'
  },
  {
    title: 'Green Tea',
    copy: 'Fresh, grassy, and vegetal. Known for high antioxidant content and numerous health benefits.',
    link: '/tea/green'
  },
];

/**
 * Tea types for the brochure's back side (3 teas)
 */
const teaTypes = [
  {
    heading: 'Oolong Tea',
    body: 'Partially oxidized, offering a complex range from floral to toasty. The perfect balance between green and black.',
    link: '/tea/oolong'
  },
  {
    heading: 'Black Tea',
    body: 'Bold, robust, and full-bodied. Fully oxidized for a strong flavor with notes of honey, caramel, and spices.',
    link: '/tea/black'
  },
  {
    heading: 'Pu-erh Tea',
    body: 'Aged and fermented tea that improves with time. Earthy, woody, and complex with unique health benefits.',
    link: '/tea/pu-erh'
  },
];

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export default function Home() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [username, setUsernameState] = useState(() => getUsername());
  const [showUsernameInput, setShowUsernameInput] = useState(!username);

  // Combine all teas and organize into pages (2 teas per page)
  const allTeas = [
    ...teaHighlights.map(t => ({ ...t, intro: t.copy })),
    ...teaTypes.map(t => ({ title: t.heading, intro: t.body, link: t.link }))
  ];

  // Current visible position (0, 1, or 2) - represents which page/spread we're viewing
  const [currentPosition, setCurrentPosition] = useState(0);
  
  // Track if a flip animation is in progress
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Get the content for a column at a given position and side
  const getColumnContent = (position: number, side: 'left' | 'right', isBack: boolean) => {
    // If back face of the flipping column, show the next column that appears
    if (isBack) {
      if (flippingColumn === 'right' && side === 'right') {
        // Right column flipping forward - back face shows left column of next page (column 5 when going from page 2 to 3)
        const nextPos = currentPosition + 1;
        return nextPos < 3 ? allTeas[nextPos * 2] : null; // Show left column of next page
      } else if (flippingColumn === 'left' && side === 'left') {
        // Left column flipping backward - back face shows right column of previous page
        const prevPos = currentPosition - 1;
        return prevPos >= 0 ? allTeas[prevPos * 2 + 1] : null; // Show right column of previous page
      }
      // If back face but not the flipping column, return null
      return null;
    }
    // Front face shows current page content
    if (side === 'left') {
      return allTeas[position * 2];
    } else {
      return allTeas[position * 2 + 1];
    }
  };
  
  // Track which column is currently flipping
  const [flippingColumn, setFlippingColumn] = useState<'left' | 'right' | null>(null);
  
  // Check if a column should be flipped (for animation state)
  const isColumnFlipped = (side: 'left' | 'right') => {
    // Only show flipped state during animation and only for the column being flipped
    return isFlipping && flippingColumn === side;
  };
  
  const flipColumn = (side: 'left' | 'right') => {
    // Prevent multiple flips at once
    if (isFlipping) return;
    
    // Check if we can flip in this direction
    if (side === 'right' && currentPosition >= 2) return; // Can't go forward from page 3
    if (side === 'left' && currentPosition <= 0) return; // Can't go backward from page 1
    
    // Set which column is flipping
    setFlippingColumn(side);
    
    // Start flip animation
    setIsFlipping(true);
    
    // After animation completes, change page and reset immediately (no extra animations)
    setTimeout(() => {
      // Update position
      if (side === 'right') {
        // Moving forward - right column flips, revealing next page
        setCurrentPosition(prev => Math.min(prev + 1, 2));
      } else {
        // Moving backward - left column flips, revealing previous page
        setCurrentPosition(prev => Math.max(prev - 1, 0));
      }
      
      // Reset flip state immediately (no extra delay or transitions)
      setIsFlipping(false);
      setFlippingColumn(null);
    }, 1200); // Wait for full animation to complete
  };

  useEffect(() => {
    api.get('/api/test')
      .then(response => {
        console.log('API connection successful:', response.data);
      })
      .catch(error => {
        console.error('API connection failed:', error.message);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLElement>) => {
    // Check if click is on flip button or arrow - don't create ripple
    const target = e.target as HTMLElement;
    if (
      target.closest('.page-flip-corner') ||
      target.closest('.corner-arrow') ||
      target.closest('.menu-page-flip') ||
      target.closest('.menu-flip-arrow') ||
      target.classList.contains('page-flip-corner') ||
      target.classList.contains('corner-arrow') ||
      target.classList.contains('menu-page-flip') ||
      target.classList.contains('menu-flip-arrow')
    ) {
      return; // Don't create ripple for flip button clicks
    }

    // Create multiple ripples at click position
    const x = e.clientX;
    const y = e.clientY;
    const baseId = Date.now();
    
    // Create 2 ripples with staggered delays
    for (let i = 0; i < 2; i++) {
      const id = baseId + i;
      setTimeout(() => {
        setRipples(prev => [...prev, { x, y, id }]);
        
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== id));
        }, 2000); // Match the animation duration
      }, i * 250); // Stagger each ripple by 250ms
    }
  };

  // Calculate opacity for fade-in effect
  // Starts fading in when scrollY is around 400px, fully visible around 800px
  const discoverOpacity = Math.min(1, Math.max(0, (scrollY - 400) / 400));

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

  const handleScrollToBrochure = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const brochureElement = document.getElementById('brochure');
    if (!brochureElement) return;

    // Get precise positions
    const startPosition = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
    const elementRect = brochureElement.getBoundingClientRect();
    const targetPosition = startPosition + elementRect.top;
    const distance = targetPosition - startPosition;
    
    // If already at target, do nothing
    if (Math.abs(distance) < 1) return;

    const duration = 500; // 0.5 seconds
    let animationFrameId: number | null = null;
    let isAnimating = true;

    const startAnimation = () => {
      const startTime = performance.now();

      const animate = (timestamp: number) => {
        if (!isAnimating) return;

        const elapsed = timestamp - startTime;
        let progress = Math.min(elapsed / duration, 1);
        
        // Ease-in-out cubic for natural scrolling feel
        // Starts slow, speeds up in middle, slows down at end
        const easeInOutCubic = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        // Calculate current scroll position with easing
        const currentPosition = startPosition + (distance * easeInOutCubic);
        
        // Scroll to calculated position
        window.scrollTo({
          top: currentPosition,
          behavior: 'auto' // Use 'auto' to prevent browser's smooth scroll from interfering
        });

        // Continue animation if not complete
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          // Final scroll to ensure exact position
          window.scrollTo({
            top: targetPosition,
            behavior: 'auto'
          });
          isAnimating = false;
          animationFrameId = null;
        }
      };

      // Start animation
      animationFrameId = requestAnimationFrame(animate);
    };

    // Cancel any existing scroll animation
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }

    // Add slight delay before starting animation (150ms)
    setTimeout(startAnimation, 150);
  };

  return (
    <main className="home-scene" onClick={handleBackgroundClick}>
      {/* Username input section */}
      <Dialog 
        open={showUsernameInput} 
        onClose={() => {}}
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #f5e3c8, #e9d1a9)',
            borderRadius: '16px',
            padding: '1rem',
            border: '2px solid rgba(201, 165, 112, 0.3)'
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: 'var(--ink)' }}>
            Welcome to Tea Education! 🍵
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3, color: 'var(--ink)' }}>
            Please enter your name to get started:
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
                  background: 'rgba(255, 255, 255, 0.6)',
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
              Continue
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Display username if set */}
      {!showUsernameInput && username && (
        <Box
          sx={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            padding: '0.75rem 1.25rem',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Person sx={{ color: 'var(--parchment)', fontSize: '1.5rem' }} />
          <Typography sx={{ color: 'var(--parchment)', fontWeight: 600 }}>
            {username}
          </Typography>
          <IconButton
            size="small"
            onClick={() => {
              setShowUsernameInput(true);
              setUsernameState('');
            }}
            aria-label="Change username"
            sx={{
              color: 'var(--parchment)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Box>
      )}
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="ripple-effect"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`
          }}
        />
      ))}
      
      {/* Stand / marquee hero */}
      <section id="stand" className="stand-stage">
        <div className="stand-greeting">Welcome to Hack4Impact IdeaCon</div>
        <div className="stand-frame">
          <div className="stand-board">
            <p className="stand-pretitle">Showcase Spotlight</p>
            <h1 className="stand-title">The World of Tea</h1>
            <p className="stand-question">What makes each tea type unique?</p>
            <div className="stand-footer">
              <span>Your Tea Education Journey</span>
              <Box
                component="a"
                href="#brochure"
                onClick={handleScrollToBrochure}
                className="scroll-cta"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'var(--parchment)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    opacity: 0.9
                  }
                }}
              >
                Explore Tea Types
                <span aria-hidden="true">↓</span>
              </Box>
            </div>
          </div>
          <div className="stand-post left" />
          <div className="stand-post right" />
        </div>
      </section>

      {/* Discover Tea fade-in section */}
      <section 
        className="discover-section"
        style={{ 
          opacity: discoverOpacity,
          transform: `translateY(${discoverOpacity < 1 ? 20 : 0}px)`,
          transition: 'opacity 0.3s ease, transform 0.3s ease'
        }}
      >
        <h2 className="discover-title">Discover Tea</h2>
        <Typography 
          variant="body1"
          sx={{ 
            textAlign: 'center',
            color: 'rgba(44, 27, 16, 0.7)',
            mt: 1,
            fontSize: '1.1rem'
          }}
        >
          Click a page to learn more
        </Typography>
      </section>

      {/* Menu-style Brochure with book-like column flipping */}
      <section id="brochure" className="brochure-zone">
        <div className="menu-book-container">
          {/* Static outer border */}
          <div className="menu-book-border">
            {/* Flip buttons - only show when navigation is possible */}
            {currentPosition > 0 && (
              <button
                className="menu-page-flip menu-flip-left"
                onClick={(e) => {
                  e.stopPropagation();
                  flipColumn('left');
                }}
                aria-label="Previous page"
              >
                <span className="menu-flip-arrow">←</span>
              </button>
            )}
            {currentPosition < 2 && (
              <button
                className="menu-page-flip menu-flip-right"
                onClick={(e) => {
                  e.stopPropagation();
                  flipColumn('right');
                }}
                aria-label="Next page"
              >
                <span className="menu-flip-arrow">→</span>
              </button>
            )}

            {/* Book pages container - columns can flip independently */}
            <div className="menu-book-pages">
              {/* Base layer - underneath content */}
              <div className="menu-page base-layer">
                {/* Left underneath column - visible when right column flips left (going forward) OR left column flips right (going backward) */}
                <div className={`menu-page-column underneath ${((isFlipping && flippingColumn === 'right') || (isFlipping && flippingColumn === 'left')) ? 'visible' : 'hidden'}`}>
                  {(() => {
                    if (flippingColumn === 'right') {
                      // Going forward - show next page left column underneath
                      const nextPos = currentPosition + 1;
                      if (nextPos >= 3) return null;
                      const content = allTeas[nextPos * 2];
                      if (!content) return null;
                    return (
                      <Box
                        component="button"
                        onClick={() => {
                          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                          navigate(content.link);
                        }}
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
                      </Box>
                    );
                    } else if (flippingColumn === 'left') {
                      // Going backward - show previous page left column underneath
                      const prevPos = currentPosition - 1;
                      if (prevPos < 0) return null;
                      const content = allTeas[prevPos * 2];
                      if (!content) return null;
                      return (
                        <Box
                          component="button"
                          onClick={() => {
                            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                            navigate(content.link);
                          }}
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
                        </Box>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* Right underneath column - visible when right column flips left (going forward) OR left column flips right (going backward) */}
                <div className={`menu-page-column underneath ${((isFlipping && flippingColumn === 'right') || (isFlipping && flippingColumn === 'left')) ? 'visible' : 'hidden'}`}>
                  {(() => {
                    if (flippingColumn === 'right') {
                      // Going forward - show next page right column underneath
                      const nextPos = currentPosition + 1;
                      if (nextPos >= 3) return null;
                      const content = allTeas[nextPos * 2 + 1];
                      if (!content) return null;
                      return (
                        <Box
                          component="button"
                          onClick={() => {
                            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                            navigate(content.link);
                          }}
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
                        </Box>
                      );
                    } else if (flippingColumn === 'left') {
                      // Going backward - show previous page right column underneath
                      const prevPos = currentPosition - 1;
                      if (prevPos < 0) return null;
                      const content = allTeas[prevPos * 2 + 1];
                      if (!content) return null;
                      return (
                      <Box
                        component="button"
                        onClick={() => {
                          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                          navigate(content.link);
                        }}
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
                      </Box>
                    );
                    }
                    return null;
                  })()}
                </div>
              </div>

              {/* Current visible page with flippable columns */}
              <div className="menu-page current-page">
                {/* Left column - flippable */}
                <div className={`menu-page-column flip-column ${isColumnFlipped('left') ? 'flipped' : ''}`}>
                  {/* Front face */}
                  <div className="column-face column-front">
                    {(() => {
                      const content = getColumnContent(currentPosition, 'left', false);
                      if (!content) return null;
                      return (
                        <Box
                          component="button"
                          onClick={() => {
                            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                            navigate(content.link);
                          }}
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
                            {currentPosition * 2 + 1}
                          </Typography>
                        </Box>
                      );
                    })()}
                  </div>
                  {/* Back face */}
                  <div className="column-face column-back">
                    {(() => {
                      const content = getColumnContent(currentPosition, 'left', true);
                      if (!content) return null;
                      return (
                        <Box
                          component="button"
                          onClick={() => {
                            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                            navigate(content.link);
                          }}
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
                        </Box>
                      );
                    })()}
                  </div>
                </div>

                {/* Right column - flippable */}
                <div className={`menu-page-column flip-column ${isColumnFlipped('right') ? 'flipped' : ''}`}>
                  {/* Front face */}
                  <div className="column-face column-front">
                    {(() => {
                      const content = getColumnContent(currentPosition, 'right', false);
                      if (!content) return null;
                      return (
                        <Box
                          component="button"
                          onClick={() => {
                            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                            navigate(content.link);
                          }}
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
                            {currentPosition * 2 + 2}
                          </Typography>
                        </Box>
                      );
                    })()}
                  </div>
                  {/* Back face */}
                  <div className="column-face column-back">
                    {(() => {
                      const content = getColumnContent(currentPosition, 'right', true);
                      if (!content) return null;
                      return (
                        <Box
                          component="button"
                          onClick={() => {
                            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                            navigate(content.link);
                          }}
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
                        </Box>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
