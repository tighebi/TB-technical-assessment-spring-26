/**
 * Tea.tsx
 * ----------
 * Individual tea type page with information, quizzes, and comments
 */
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Box, SwipeableDrawer, Button, List, ListItem, ListItemButton, ListItemText, Typography, Divider } from '@mui/material';
import { ArrowBack, Menu } from '@mui/icons-material';
import Quiz from '../components/Quiz';
import Comments from '../components/Comments';
import TeaLayouts from './TeaLayouts';
import UsernameDisplay from '../components/UsernameDisplay';
import './Home.css';
import './Tea.css';

interface Ripple {
  x: number;
  y: number;
  id: number;
}

interface TeaData {
  name: string;
  subtitle: string;
  origin: string;
  flavorProfile: string;
  processing: string;
  healthBenefits: string[];
  brewingTips: string;
  funFacts: string[];
  quizzes: Array<{
    question: string;
    options: Array<{ text: string; isCorrect: boolean }>;
    explanation: string;
  }>;
}

const teaData: Record<string, TeaData> = {
  white: {
    name: 'White Tea',
    subtitle: 'The Most Delicate',
    origin: 'Fujian Province, China. White tea originated in the Fuding and Zhenghe counties during the Song Dynasty (960-1279 AD).',
    flavorProfile: 'Delicate, sweet, floral, and slightly fruity with subtle notes of honey and melon. Very light-bodied with minimal astringency.',
    processing: 'White tea undergoes minimal processing. The leaves are simply withered and dried, with no rolling, oxidation, or firing. This preserves the natural antioxidants and delicate flavors.',
    healthBenefits: [
      'Highest antioxidant content among all teas',
      'May help reduce risk of cardiovascular disease',
      'Contains L-theanine for calm focus',
      'Low in caffeine compared to other teas',
      'May support healthy skin'
    ],
    brewingTips: 'Use water at 175-185°F (80-85°C). Steep for 4-5 minutes. Use 2-3 grams per 8 oz cup. Can be steeped multiple times.',
    funFacts: [
      'Named for the white downy hairs on the young tea buds',
      'Traditionally made only from the youngest tea buds',
      'Silver Needle (Bai Hao Yin Zhen) is the most prized white tea',
      'Contains the most polyphenols of any tea type'
    ],
    quizzes: [
      {
        question: 'What makes white tea unique in terms of processing?',
        options: [
          { text: 'It undergoes full oxidation', isCorrect: false },
          { text: 'It has minimal processing - just withered and dried', isCorrect: true },
          { text: 'It is heavily roasted', isCorrect: false },
          { text: 'It is fermented like pu-erh', isCorrect: false }
        ],
        explanation: 'White tea undergoes minimal processing - the leaves are simply withered and dried without rolling, oxidation, or firing. This preserves the natural antioxidants and delicate flavors.'
      },
      {
        question: 'Where did white tea originate?',
        options: [
          { text: 'Japan', isCorrect: false },
          { text: 'India', isCorrect: false },
          { text: 'Fujian Province, China', isCorrect: true },
          { text: 'Sri Lanka', isCorrect: false }
        ],
        explanation: 'White tea originated in Fujian Province, China, specifically in Fuding and Zhenghe counties during the Song Dynasty.'
      }
    ]
  },
  yellow: {
    name: 'Yellow Tea',
    subtitle: 'The Rarest Tea',
    origin: 'Hunan, Sichuan, and Anhui Provinces, China. Yellow tea is one of the rarest tea types, with production dating back to the Tang Dynasty.',
    flavorProfile: 'Mellow, smooth, and sweet with a unique "yellow" character. Less grassy than green tea, with notes of chestnut and honey.',
    processing: 'Similar to green tea but with an additional "sealed yellowing" step. The leaves are wrapped and allowed to yellow slightly, which removes the grassy taste and creates a smoother flavor.',
    healthBenefits: [
      'Rich in antioxidants',
      'May aid digestion',
      'Contains amino acids for relaxation',
      'Lower caffeine than black tea',
      'May support immune function'
    ],
    brewingTips: 'Use water at 175-185°F (80-85°C). Steep for 2-3 minutes. Use 2-3 grams per 8 oz cup. Can be steeped 2-3 times.',
    funFacts: [
      'One of the rarest tea types in the world',
      'The "yellowing" process was discovered by accident',
      'Junshan Yinzhen is one of China\'s ten famous teas',
      'Traditionally reserved for Chinese emperors'
    ],
    quizzes: [
      {
        question: 'What makes yellow tea different from green tea?',
        options: [
          { text: 'It is fully oxidized', isCorrect: false },
          { text: 'It undergoes a "sealed yellowing" step', isCorrect: true },
          { text: 'It is fermented', isCorrect: false },
          { text: 'It is roasted longer', isCorrect: false }
        ],
        explanation: 'Yellow tea is processed like green tea but includes an additional "sealed yellowing" step where leaves are wrapped and allowed to yellow slightly, removing the grassy taste.'
      }
    ]
  },
  green: {
    name: 'Green Tea',
    subtitle: 'Fresh & Antioxidant-Rich',
    origin: 'China, with origins dating back 5,000 years. Japan developed its own unique green tea culture starting in the 12th century.',
    flavorProfile: 'Fresh, grassy, vegetal, and slightly astringent. Can range from sweet and floral (Chinese) to umami and seaweed-like (Japanese).',
    processing: 'The leaves are heated soon after picking to prevent oxidation. Chinese green teas are pan-fired or roasted, while Japanese green teas are steamed. This preserves the green color and fresh flavor.',
    healthBenefits: [
      'High in EGCG (epigallocatechin gallate) antioxidants',
      'May boost metabolism and aid weight loss',
      'Supports brain health and cognitive function',
      'May reduce risk of certain cancers',
      'Promotes heart health'
    ],
    brewingTips: 'Use water at 160-180°F (70-82°C). Steep for 1-3 minutes. Use 2-3 grams per 8 oz cup. Japanese green teas typically need lower temperatures.',
    funFacts: [
      'Contains the highest concentration of catechins',
      'Matcha is a powdered form of green tea',
      'Sencha is the most popular green tea in Japan',
      'Longjing (Dragon Well) is China\'s most famous green tea'
    ],
    quizzes: [
      {
        question: 'What is the key difference between Chinese and Japanese green tea processing?',
        options: [
          { text: 'Chinese teas are fermented', isCorrect: false },
          { text: 'Chinese teas are pan-fired, Japanese are steamed', isCorrect: true },
          { text: 'Japanese teas are oxidized', isCorrect: false },
          { text: 'There is no difference', isCorrect: false }
        ],
        explanation: 'Chinese green teas are typically pan-fired or roasted to stop oxidation, while Japanese green teas are steamed, which gives them a more vegetal, umami flavor.'
      },
      {
        question: 'What powerful antioxidant is green tea particularly rich in?',
        options: [
          { text: 'Vitamin C', isCorrect: false },
          { text: 'EGCG (epigallocatechin gallate)', isCorrect: true },
          { text: 'Caffeine', isCorrect: false },
          { text: 'Tannins', isCorrect: false }
        ],
        explanation: 'Green tea is particularly rich in EGCG (epigallocatechin gallate), a powerful antioxidant that has been studied for its potential health benefits.'
      }
    ]
  },
  oolong: {
    name: 'Oolong Tea',
    subtitle: 'The Perfect Balance',
    origin: 'Fujian and Guangdong Provinces, China, and Taiwan. Oolong means "black dragon" in Chinese.',
    flavorProfile: 'Complex and varied, ranging from light and floral (like green tea) to dark and toasty (like black tea). Can have notes of fruit, honey, orchid, or roasted nuts.',
    processing: 'Partially oxidized (10-80%). The leaves are withered, bruised to start oxidation, then fired to stop oxidation at the desired level. Some oolongs are rolled into tight balls.',
    healthBenefits: [
      'May aid in weight management',
      'Supports heart health',
      'Contains polyphenols for antioxidant benefits',
      'May improve mental alertness',
      'Can help with digestion'
    ],
    brewingTips: 'Use water at 185-205°F (85-96°C). Steep for 3-5 minutes. Use 3-4 grams per 8 oz cup. High-quality oolongs can be steeped 5-7 times.',
    funFacts: [
      'Oxidation level can range from 10% to 80%',
      'Tieguanyin (Iron Goddess) is one of the most famous oolongs',
      'Taiwan produces some of the world\'s finest oolongs',
      'The "gongfu" brewing method is traditional for oolong'
    ],
    quizzes: [
      {
        question: 'What does "oolong" mean in Chinese?',
        options: [
          { text: 'Green dragon', isCorrect: false },
          { text: 'Black dragon', isCorrect: true },
          { text: 'White dragon', isCorrect: false },
          { text: 'Golden dragon', isCorrect: false }
        ],
        explanation: 'Oolong means "black dragon" in Chinese, named for the dark, twisted appearance of the tea leaves.'
      },
      {
        question: 'What is the oxidation level range for oolong tea?',
        options: [
          { text: '0-10%', isCorrect: false },
          { text: '10-80%', isCorrect: true },
          { text: '80-100%', isCorrect: false },
          { text: '100%', isCorrect: false }
        ],
        explanation: 'Oolong tea is partially oxidized, with levels ranging from 10% (light oolong, closer to green tea) to 80% (dark oolong, closer to black tea).'
      }
    ]
  },
  black: {
    name: 'Black Tea',
    subtitle: 'Bold & Robust',
    origin: 'China, with origins in the 17th century. India, Sri Lanka, and Kenya are now major producers. Known as "red tea" in China.',
    flavorProfile: 'Bold, robust, and full-bodied. Can range from malty and sweet to brisk and astringent. Common notes include honey, caramel, citrus, and spices.',
    processing: 'Fully oxidized (100%). The leaves are withered, rolled to break cell walls, fully oxidized, then fired to stop oxidation. This creates the dark color and strong flavor.',
    healthBenefits: [
      'Contains theaflavins and thearubigins',
      'May support heart health',
      'Can improve mental alertness',
      'May help reduce stroke risk',
      'Contains fluoride for dental health'
    ],
    brewingTips: 'Use water at 200-212°F (93-100°C). Steep for 3-5 minutes. Use 2-3 grams per 8 oz cup. Can be steeped 2-3 times.',
    funFacts: [
      'Called "red tea" (hong cha) in China',
      'Assam, Darjeeling, and Ceylon are famous black tea regions',
      'English Breakfast is a blend of black teas',
      'Earl Grey is black tea flavored with bergamot oil'
    ],
    quizzes: [
      {
        question: 'What is the oxidation level of black tea?',
        options: [
          { text: '0% (no oxidation)', isCorrect: false },
          { text: '50% (partial oxidation)', isCorrect: false },
          { text: '100% (fully oxidized)', isCorrect: true },
          { text: 'It varies', isCorrect: false }
        ],
        explanation: 'Black tea is fully oxidized (100%), which gives it its dark color, bold flavor, and robust character.'
      },
      {
        question: 'What is black tea called in China?',
        options: [
          { text: 'Black tea', isCorrect: false },
          { text: 'Red tea (hong cha)', isCorrect: true },
          { text: 'Dark tea', isCorrect: false },
          { text: 'Bold tea', isCorrect: false }
        ],
        explanation: 'In China, black tea is called "red tea" (hong cha) because of the reddish color of the brewed tea liquor.'
      }
    ]
  },
  'pu-erh': {
    name: 'Pu-erh Tea',
    subtitle: 'Aged & Fermented',
    origin: 'Yunnan Province, China. Named after Pu\'er city. Has been produced for over 1,700 years.',
    flavorProfile: 'Earthy, woody, and complex. Can have notes of mushrooms, forest floor, leather, or dates. Mellow and smooth, with no bitterness when properly aged.',
    processing: 'Post-fermented tea. Can be raw (sheng) - naturally aged, or ripe (shou) - artificially fermented. The tea is compressed into cakes, bricks, or tuochas and aged.',
    healthBenefits: [
      'May aid in weight loss and digestion',
      'Contains unique probiotics from fermentation',
      'May help lower cholesterol',
      'Supports gut health',
      'May reduce blood sugar levels'
    ],
    brewingTips: 'Use water at 200-212°F (93-100°C). Rinse the tea first (quick steep and discard). Steep for 30 seconds to 2 minutes. Use 3-5 grams per 8 oz cup. Can be steeped 10+ times.',
    funFacts: [
      'The only tea that improves with age',
      'Can be aged for decades, even centuries',
      'Vintage pu-erh cakes can be worth thousands of dollars',
      'Traditionally compressed for easier transport on the Tea Horse Road'
    ],
    quizzes: [
      {
        question: 'What makes pu-erh tea unique?',
        options: [
          { text: 'It is the only tea that improves with age', isCorrect: true },
          { text: 'It is the most caffeinated tea', isCorrect: false },
          { text: 'It is always green in color', isCorrect: false },
          { text: 'It cannot be steeped multiple times', isCorrect: false }
        ],
        explanation: 'Pu-erh tea is unique because it is post-fermented and actually improves with age, developing more complex flavors over time, sometimes for decades or even centuries.'
      },
      {
        question: 'What are the two main types of pu-erh?',
        options: [
          { text: 'Light and dark', isCorrect: false },
          { text: 'Raw (sheng) and ripe (shou)', isCorrect: true },
          { text: 'Young and old', isCorrect: false },
          { text: 'Sweet and bitter', isCorrect: false }
        ],
        explanation: 'Pu-erh comes in two main types: raw (sheng) which is naturally aged, and ripe (shou) which is artificially fermented to speed up the aging process.'
      }
    ]
  }
};


// List of all tea types for navigation
const allTeaTypes = [
  { key: 'white', name: 'White Tea', link: '/tea/white' },
  { key: 'yellow', name: 'Yellow Tea', link: '/tea/yellow' },
  { key: 'green', name: 'Green Tea', link: '/tea/green' },
  { key: 'oolong', name: 'Oolong Tea', link: '/tea/oolong' },
  { key: 'black', name: 'Black Tea', link: '/tea/black' },
  { key: 'pu-erh', name: 'Pu-erh Tea', link: '/tea/pu-erh' },
];

// iOS detection for swipeable drawer
const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export default function Tea() {
  const { teaType } = useParams<{ teaType: string }>();
  const navigate = useNavigate();
  const tea = teaType ? teaData[teaType] : null;
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [firstQuizVisible, setFirstQuizVisible] = useState(false);
  const [secondQuizVisible, setSecondQuizVisible] = useState(false);
  const firstQuizRef = useRef<HTMLDivElement>(null);
  const secondQuizRef = useRef<HTMLDivElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useLayoutEffect(() => {
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    });
  }, [teaType]);

  useEffect(() => {
    setFirstQuizVisible(false);
    setSecondQuizVisible(false);
  }, [teaType]);

  useEffect(() => {
    // Intersection Observer watches when elements enter/leave viewport
    // More efficient than constantly checking scroll position
    const observerOptions = {
      threshold: 0.2, // Trigger when 20% of element is visible
      rootMargin: '0px' // No margin around viewport
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Element is now visible - trigger slide-in animation
          if (entry.target === firstQuizRef.current) {
            setFirstQuizVisible(true);
          } else if (entry.target === secondQuizRef.current) {
            setSecondQuizVisible(true);
          }
        } else {
          // Element is no longer visible - trigger slide-out animation
          if (entry.target === firstQuizRef.current) {
            setFirstQuizVisible(false);
          } else if (entry.target === secondQuizRef.current) {
            setSecondQuizVisible(false);
          }
        }
      });
    }, observerOptions);

    // Start watching the quiz elements (only if refs are attached)
    if (firstQuizRef.current) {
      observer.observe(firstQuizRef.current);
    }
    if (secondQuizRef.current) {
      observer.observe(secondQuizRef.current);
    }

    // Cleanup: stop observing when component unmounts or tea changes
    return () => {
      observer.disconnect();
    };
  }, [tea]); // Re-run when tea data changes

  const handleBackgroundClick = (e: React.MouseEvent<HTMLElement>) => {
    const x = e.pageX;
    const y = e.pageY;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 1000);
  };

  if (!tea) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Tea Type Not Found</h1>
        <button onClick={() => {
          navigate('/#brochure');
          setTimeout(() => {
            const brochureElement = document.getElementById('brochure');
            if (brochureElement) {
              brochureElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }}>Return Home</button>
      </div>
    );
  }

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleTeaClick = (link: string) => {
    navigate(link);
    setDrawerOpen(false);
  };

  return (
    <main className="home-scene" onClick={handleBackgroundClick}>
      <Box
        component="button"
        onClick={() => {
          navigate('/#brochure');
          // Small delay to ensure navigation completes before scrolling
          setTimeout(() => {
            const brochureElement = document.getElementById('brochure');
            if (brochureElement) {
              brochureElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }}
        sx={{
          position: 'fixed',
          top: '1.5rem',
          left: '1.5rem',
          padding: '0.75rem 1.5rem',
          background: '#4a5d3a',
          color: 'var(--parchment)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: '1rem',
          fontWeight: '600',
          letterSpacing: '0.05em',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          '&:hover': {
            background: '#3d4f2f',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)'
          }
        }}
      >
        <ArrowBack /> Back to Main Menu
      </Box>

      {/* Open Menu Button - shows when drawer is closed */}
      {!drawerOpen && (
        <Button
          onClick={toggleDrawer(true)}
          sx={{
            position: 'fixed',
            bottom: '1rem',
            left: '1rem',
            padding: '0.75rem 1.5rem',
            background: '#4a5d3a',
            color: 'var(--parchment)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            zIndex: 1000,
            fontSize: '0.95rem',
            fontWeight: '600',
            letterSpacing: '0.05em',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textTransform: 'none',
            '&:hover': {
              background: '#3d4f2f',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)'
            }
          }}
        >
          <Menu /> Open Menu
        </Button>
      )}

      {/* Swipeable Drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        PaperProps={{
          sx: {
            width: { xs: 280, sm: 320 },
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
            borderTop: '2px solid rgba(201, 165, 112, 0.25)',
            boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.3)',
            maxHeight: '70vh',
          }
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
          role="presentation"
          onKeyDown={toggleDrawer(false)}
        >
          {/* Header */}
          <Box
            sx={{
              padding: '1.5rem 1.5rem 1rem',
              background: 'linear-gradient(180deg, rgba(74, 93, 58, 0.95), rgba(61, 79, 47, 0.95))',
              color: 'var(--parchment)',
              borderBottom: '2px solid rgba(201, 165, 112, 0.3)',
              flexShrink: 0
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: '1.4rem',
                mb: 0.5
              }}
            >
              Tea Menu
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.85rem',
                opacity: 0.9,
                letterSpacing: '0.05em'
              }}
            >
              Select a tea to explore
            </Typography>
          </Box>

          {/* Tea List */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem 0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}
          >
            <List sx={{ padding: 0 }}>
              {allTeaTypes.map((teaItem, index) => {
                const isCurrentTea = teaItem.key === teaType;
                return (
                  <Box key={teaItem.key}>
                    <ListItem
                      disablePadding
                      sx={{
                        opacity: isCurrentTea ? 0.6 : 1,
                        pointerEvents: isCurrentTea ? 'none' : 'auto',
                      }}
                    >
                      <ListItemButton
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isCurrentTea) {
                            handleTeaClick(teaItem.link);
                          }
                        }}
                        disabled={isCurrentTea}
                        sx={{
                          padding: '1rem 1.5rem',
                          '&:hover': {
                            background: isCurrentTea 
                              ? 'transparent' 
                              : 'rgba(201, 165, 112, 0.2)',
                          },
                          '&.Mui-disabled': {
                            opacity: 0.6
                          }
                        }}
                      >
                        <ListItemText
                          primary={teaItem.name}
                          primaryTypographyProps={{
                            sx: {
                              fontFamily: "'Playfair Display', serif",
                              fontWeight: isCurrentTea ? 700 : 600,
                              fontSize: '1.1rem',
                              color: isCurrentTea 
                                ? 'rgba(74, 93, 58, 0.8)' 
                                : 'var(--ink)',
                            }
                          }}
                          secondary={isCurrentTea ? 'Currently viewing' : undefined}
                          secondaryTypographyProps={{
                            sx: {
                              fontSize: '0.75rem',
                              color: 'rgba(74, 93, 58, 0.7)',
                              fontStyle: 'italic'
                            }
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                    {index < allTeaTypes.length - 1 && (
                      <Divider sx={{ margin: '0 1rem', borderColor: 'rgba(201, 165, 112, 0.2)' }} />
                    )}
                  </Box>
                );
              })}
            </List>
          </Box>
        </Box>
      </SwipeableDrawer>

      {/* Username Display in top right */}
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
      
      <section className="stand-stage" style={{ minHeight: 'auto', padding: '4rem 2rem', background: 'transparent' }}>
        <div className="stand-frame" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="stand-board" style={{ minHeight: 'auto' }}>
            <p className="stand-pretitle">{tea.subtitle}</p>
            <h1 className="stand-title" style={{ fontSize: '2.5rem' }}>{tea.name}</h1>
            <p className="stand-question">Discover the unique characteristics of {tea.name.toLowerCase()}</p>
          </div>
        </div>
      </section>

      <section className="brochure-zone" style={{ padding: '4rem 2rem', background: 'transparent' }}>
        <TeaLayouts
          tea={tea}
          teaType={teaType || 'unknown'}
          firstQuizRef={firstQuizRef}
          secondQuizRef={secondQuizRef}
          firstQuizVisible={firstQuizVisible}
          secondQuizVisible={secondQuizVisible}
          QuizComponent={Quiz}
          CommentsComponent={Comments}
        />
      </section>
    </main>
  );
}

