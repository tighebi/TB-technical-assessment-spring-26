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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button
} from '@mui/material';
import {
  CheckCircle
} from '@mui/icons-material';
import { getUsername, setUsername } from '../utils/username';
import UsernameDisplay from '../components/UsernameDisplay';
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

  // Combine all 6 teas into single array for easier page management
  // Normalize data structure: both arrays use 'title' and 'intro' properties
  const allTeas = [
    ...teaHighlights.map(t => ({ ...t, intro: t.copy })), // Front page teas (white, yellow, green)
    ...teaTypes.map(t => ({ title: t.heading, intro: t.body, link: t.link })) // Back page teas (oolong, black, pu-erh)
  ];

  // Initialize currentPosition from localStorage, default to 0
  const [currentPosition, setCurrentPosition] = useState(() => {
    const saved = localStorage.getItem('menu-page-position');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isFlipping, setIsFlipping] = useState(false);
  
  const getColumnContent = (position: number, side: 'left' | 'right', isBack: boolean) => {
    // When a column flips, the back face shows the NEXT sequential column's content
    // This creates the illusion of turning a real book page
    if (isBack && isFlipping && flippingColumn === side) {
      if (flippingColumn === 'right') {
        // Right column flipping forward: position 0 -> tea index 1, position 1 -> tea index 3, etc.
        const currentTeaIndex = position * 2 + 1; // Formula: right column = odd indices (1, 3, 5)
        const nextTeaIndex = currentTeaIndex + 1; // Next tea in sequence
        if (nextTeaIndex < allTeas.length) {
          return allTeas[nextTeaIndex];
        }
        return null;
      } else if (flippingColumn === 'left') {
        // Left column flipping backward: position 1 -> tea index 2, position 2 -> tea index 4, etc.
        const currentTeaIndex = position * 2; // Formula: left column = even indices (0, 2, 4)
        const prevTeaIndex = currentTeaIndex - 1; // Previous tea in sequence
        if (prevTeaIndex >= 0) {
          return allTeas[prevTeaIndex];
        }
        return null;
      }
    }
    // Front face: show normal page content
    // Left column uses even indices (0, 2, 4), right column uses odd indices (1, 3, 5)
    if (side === 'left') {
      return allTeas[position * 2]; // Even: 0, 2, 4
    } else {
      return allTeas[position * 2 + 1]; // Odd: 1, 3, 5
    }
  };
  
  const [flippingColumn, setFlippingColumn] = useState<'left' | 'right' | null>(null);
  
  const isColumnFlipped = (side: 'left' | 'right') => {
    return isFlipping && flippingColumn === side;
  };
  
  const flipColumn = (side: 'left' | 'right') => {
    // Prevent multiple simultaneous flips
    if (isFlipping) return;
    
    // Boundary checks: can't go past first or last page
    if (side === 'right' && currentPosition >= 2) return; // Already on page 3
    if (side === 'left' && currentPosition <= 0) return; // Already on page 1
    
    // Start animation
    setFlippingColumn(side);
    setIsFlipping(true);
    
    // After animation completes (1.2s matches CSS animation duration)
    setTimeout(() => {
      if (side === 'right') {
        // Moving forward: increment position, but cap at 2 (page 3)
        setCurrentPosition(prev => Math.min(prev + 1, 2));
      } else {
        // Moving backward: decrement position, but don't go below 0 (page 1)
        setCurrentPosition(prev => Math.max(prev - 1, 0));
      }
      
      // Reset animation state so column can flip again
      setIsFlipping(false);
      setFlippingColumn(null);
    }, 1200);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save currentPosition to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('menu-page-position', currentPosition.toString());
  }, [currentPosition]);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    // Don't create ripples when clicking on page flip buttons
    // Check both the clicked element and its parent elements (closest)
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
      return;
    }
    // Get click coordinates relative to document (not viewport)
    const x = e.pageX;
    const y = e.pageY;
    // Use timestamp as base ID to ensure uniqueness
    const baseId = Date.now();
    
    // Create 2 ripples with staggered timing for layered effect
    for (let i = 0; i < 2; i++) {
      const id = baseId + i; // Unique ID for each ripple
      // Stagger each ripple by 250ms (0ms, 250ms)
      setTimeout(() => {
        // Add ripple to state array (triggers CSS animation)
        setRipples(prev => [...prev, { x, y, id }]);
        
        // Remove ripple after animation completes (2 seconds)
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== id));
        }, 2000);
      }, i * 250);
    }
  };

  // Fade-in calculation: opacity increases as user scrolls
  // scrollY < 400: opacity = 0 (invisible)
  // scrollY = 400-800: opacity = 0 to 1 (fading in)
  // scrollY > 800: opacity = 1 (fully visible)
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

    // Get current scroll position (try multiple methods for browser compatibility)
    const startPosition = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
    // Get brochure's position relative to viewport (top of element to top of visible area)
    const elementRect = brochureElement.getBoundingClientRect();
    // Calculate absolute position on page: current scroll + distance from viewport top
    const targetPosition = startPosition + elementRect.top;
    // How many pixels we need to scroll
    const distance = targetPosition - startPosition;
    
    if (Math.abs(distance) < 1) return;

    const duration = 500;
    let animationFrameId: number | null = null;
    let isAnimating = true;

    const startAnimation = () => {
      const startTime = performance.now();

      const animate = (timestamp: number) => {
        if (!isAnimating) return;

        const elapsed = timestamp - startTime;
        // Calculate progress from 0 to 1 (clamped to prevent overshooting)
        let progress = Math.min(elapsed / duration, 1);
        
        // Cubic easing function: creates smooth acceleration/deceleration curve
        // First half: accelerates (4x^3), second half: decelerates (1 - (-2x+2)^3/2)
        // This makes the scroll feel natural, not linear
        const easeInOutCubic = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        // Apply easing to distance: start + (total distance * eased progress)
        const currentPosition = startPosition + (distance * easeInOutCubic);
        window.scrollTo({
          top: currentPosition,
          behavior: 'auto' // Use 'auto' to prevent browser's smooth scroll from interfering
        });

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
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

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }

    setTimeout(startAnimation, 150);
  };

  return (
    <main className="home-scene" onClick={handleBackgroundClick}>
      <Dialog 
        open={showUsernameInput} 
        onClose={() => {}}
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
      
      <UsernameDisplay />
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

      <section id="brochure" className="brochure-zone">
        <div className="menu-book-container">
          <div className="menu-book-border">
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

            <div className="menu-book-pages">
              <div className="menu-page base-layer">
                <div className={`menu-page-column underneath ${((isFlipping && flippingColumn === 'right') || (isFlipping && flippingColumn === 'left')) ? 'visible' : 'hidden'}`}>
                  {(() => {
                    if (flippingColumn === 'right') {
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

                <div className={`menu-page-column underneath ${((isFlipping && flippingColumn === 'right') || (isFlipping && flippingColumn === 'left')) ? 'visible' : 'hidden'}`}>
                  {(() => {
                    if (flippingColumn === 'right') {
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

              <div className="menu-page current-page">
                <div className={`menu-page-column flip-column ${isColumnFlipped('left') ? 'flipped' : ''}`}>
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

                <div className={`menu-page-column flip-column ${isColumnFlipped('right') ? 'flipped' : ''}`}>
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
