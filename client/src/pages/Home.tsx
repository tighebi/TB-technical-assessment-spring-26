/**
 * Home.tsx
 * ----------
 * Tea Education - IdeaCon Stand
 * - Top section: Welcome to the Tea Education showcase
 * - Bottom section: Interactive menu with tea highlights and types
 */
import { useEffect, useState, useRef } from 'react';
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
import { smoothScrollToElement } from '../utils/scroll';
import { createRipples, type Ripple } from '../utils/ripple';
import UsernameDisplay from '../components/UsernameDisplay';
import TeaCard from '../components/TeaCard';
import './Home.css';

/**
 * Tea highlights for the menu's front side (3 teas)
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
 * Tea types for the menu's back side (3 teas)
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


export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [username, setUsernameState] = useState(() => getUsername());
  const [showUsernameInput, setShowUsernameInput] = useState(!username);
  const standBoardRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

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
    if (isBack && isFlipping && flippingColumn === side) {
      const currentTeaIndex = side === 'left' ? position * 2 : position * 2 + 1;
      const targetIndex = flippingColumn === 'right' ? currentTeaIndex + 1 : currentTeaIndex - 1;
      if (targetIndex >= 0 && targetIndex < allTeas.length) {
        return allTeas[targetIndex];
      }
      return null;
    }
    // Front face: show normal page content
    const teaIndex = side === 'left' ? position * 2 : position * 2 + 1;
    return allTeas[teaIndex] || null;
  };
  
  const [flippingColumn, setFlippingColumn] = useState<'left' | 'right' | null>(null);
  
  const isColumnFlipped = (side: 'left' | 'right') => {
    return isFlipping && flippingColumn === side;
  };

  // Helper to check if underneath column should be visible
  const isUnderneathVisible = () => {
    return isFlipping && flippingColumn !== null;
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

  // Check if we should scroll to menu section on mount (e.g., when navigating from Tea page)
  useEffect(() => {
    if (window.location.hash === '#menu') {
      setTimeout(() => {
        const menuElement = document.getElementById('menu');
        if (menuElement) {
          smoothScrollToElement(menuElement, 800, () => {
            window.history.replaceState(null, '', window.location.pathname);
          });
        }
      }, 100);
    }
  }, []);

  // 3D Tilt Effect: Mouse tracking for premium tilt interaction
  useEffect(() => {
    const board = standBoardRef.current;
    if (!board) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Don't apply tilt when scrolling
      if (isScrolling) return;
      
      const rect = board.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6; // Max 6 degrees (reduced for subtlety)
      const rotateY = ((x - centerX) / centerX) * 6; // Max 6 degrees
      
      // Combine with base sway animation by using transform3d
      board.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    };

    const handleMouseLeave = () => {
      if (!isScrolling) {
        board.style.transform = '';
      }
    };

    board.addEventListener('mousemove', handleMouseMove);
    board.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      board.removeEventListener('mousemove', handleMouseMove);
      board.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isScrolling]);

  // Save currentPosition to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('menu-page-position', currentPosition.toString());
  }, [currentPosition]);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    // Don't create ripples when clicking on page flip buttons
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
    
    createRipples(
      e.pageX,
      e.pageY,
      (ripple) => setRipples(prev => [...prev, ripple]),
      (id) => setRipples(prev => prev.filter(ripple => ripple.id !== id)),
      2, // Create 2 ripples
      250, // Stagger by 250ms
      2000 // Duration 2000ms
    );
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

  const handleScrollToMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const menuElement = document.getElementById('menu');
    const standBoard = standBoardRef.current;
    if (!menuElement) return;

    // Smooth Transitions: Add lift effect to the signboard
    setIsScrolling(true);
    if (standBoard) {
      standBoard.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      standBoard.style.transform = 'perspective(1000px) translateY(-30px) scale(0.95)';
    }

    smoothScrollToElement(menuElement, 800, () => {
      // Reset lift effect after scroll completes
      setTimeout(() => {
        setIsScrolling(false);
        if (standBoard) {
          standBoard.style.transition = 'transform 0.4s ease-out';
          standBoard.style.transform = '';
          setTimeout(() => {
            if (standBoard) {
              standBoard.style.transition = '';
            }
          }, 400);
        }
      }, 200);
    });
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
        {/* Dynamic Background: Floating tea leaves */}
        <div className="tea-leaves-container">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="tea-leaf" />
          ))}
        </div>
        <div className="stand-greeting unselectable">Welcome to Hack4Impact IdeaCon</div>
        <div className="stand-frame">
          <div className="stand-board unselectable" ref={standBoardRef}>
            <p className="stand-pretitle">Showcase Spotlight</p>
            <h1 className="stand-title">The World of Tea</h1>
            <p className="stand-question">What makes each tea type unique?</p>
            <div className="stand-footer">
              <span>Your Tea Education Journey</span>
              <Box
                component="a"
                href="#menu"
                onClick={handleScrollToMenu}
                className="scroll-cta unselectable"
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
        className="discover-section unselectable"
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

      <section id="menu" className="menu-zone">
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
                <div className={`menu-page-column underneath ${isUnderneathVisible() ? 'visible' : 'hidden'}`}>
                  {(() => {
                    if (flippingColumn === 'right') {
                      const nextPos = currentPosition + 1;
                      if (nextPos >= 3) return null;
                      const content = allTeas[nextPos * 2];
                      return content ? <TeaCard content={content} /> : null;
                    } else if (flippingColumn === 'left') {
                      const prevPos = currentPosition - 1;
                      if (prevPos < 0) return null;
                      const content = allTeas[prevPos * 2];
                      return content ? <TeaCard content={content} /> : null;
                    }
                    return null;
                  })()}
                </div>

                <div className={`menu-page-column underneath ${isUnderneathVisible() ? 'visible' : 'hidden'}`}>
                  {(() => {
                    if (flippingColumn === 'right') {
                      const nextPos = currentPosition + 1;
                      if (nextPos >= 3) return null;
                      const content = allTeas[nextPos * 2 + 1];
                      return content ? <TeaCard content={content} /> : null;
                    } else if (flippingColumn === 'left') {
                      const prevPos = currentPosition - 1;
                      if (prevPos < 0) return null;
                      const content = allTeas[prevPos * 2 + 1];
                      return content ? <TeaCard content={content} /> : null;
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
                      return content ? (
                        <TeaCard 
                          content={content} 
                          showPageNumber={currentPosition * 2 + 1}
                        />
                      ) : null;
                    })()}
                  </div>
                  <div className="column-face column-back">
                    {(() => {
                      const content = getColumnContent(currentPosition, 'left', true);
                      return content ? <TeaCard content={content} /> : null;
                    })()}
                  </div>
                </div>

                <div className={`menu-page-column flip-column ${isColumnFlipped('right') ? 'flipped' : ''}`}>
                  <div className="column-face column-front">
                    {(() => {
                      const content = getColumnContent(currentPosition, 'right', false);
                      return content ? (
                        <TeaCard 
                          content={content} 
                          showPageNumber={currentPosition * 2 + 2}
                        />
                      ) : null;
                    })()}
                  </div>
                  <div className="column-face column-back">
                    {(() => {
                      const content = getColumnContent(currentPosition, 'right', true);
                      return content ? <TeaCard content={content} /> : null;
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
