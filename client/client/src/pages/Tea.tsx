/**
 * Tea.tsx
 * ----------
 * Individual tea type page with information, quizzes, and comments
 */
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import Quiz from '../components/Quiz';
import Comments from '../components/Comments';
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

export default function Tea() {
  const { teaType } = useParams<{ teaType: string }>();
  const navigate = useNavigate();
  const tea = teaType ? teaData[teaType] : null;
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [firstQuizVisible, setFirstQuizVisible] = useState(false);
  const [secondQuizVisible, setSecondQuizVisible] = useState(false);
  const firstQuizRef = useRef<HTMLDivElement>(null);
  const secondQuizRef = useRef<HTMLDivElement>(null);

  // Use useLayoutEffect to scroll before paint, ensuring no visible scroll
  useLayoutEffect(() => {
    // Force scroll to top immediately, before any rendering - disable smooth scroll
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Restore original scroll behavior after a tick
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    });
  }, [teaType]);

  // Reset animation states when tea type changes
  useEffect(() => {
    setFirstQuizVisible(false);
    setSecondQuizVisible(false);
  }, [teaType]);

  // Intersection Observer for quiz animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === firstQuizRef.current) {
            setFirstQuizVisible(true);
          } else if (entry.target === secondQuizRef.current) {
            setSecondQuizVisible(true);
          }
        }
      });
    }, observerOptions);

    if (firstQuizRef.current) {
      observer.observe(firstQuizRef.current);
    }
    if (secondQuizRef.current) {
      observer.observe(secondQuizRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [tea]);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLElement>) => {
    // Create ripple at click position
    const x = e.clientX;
    const y = e.clientY;
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
        <button onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  return (
    <main className="home-scene" onClick={handleBackgroundClick}>
      {/* Fixed back button - always visible */}
      <button 
        onClick={() => navigate('/')}
        style={{
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
          gap: '0.5rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#3d4f2f';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#4a5d3a';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>←</span> Back to Main Menu
      </button>

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
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* First Information Block */}
          <div className="info-block" style={{ 
            background: '#f5e3c8', 
            borderRadius: '24px', 
            padding: '3rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: '2rem', 
              marginBottom: '2rem',
              color: 'var(--ink)',
              borderBottom: '2px solid rgba(201, 165, 112, 0.3)',
              paddingBottom: '1rem'
            }}>
              About {tea.name}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.4rem',
                  marginBottom: '0.75rem',
                  color: 'rgba(201, 165, 112, 0.9)'
                }}>
                  Origin
                </h3>
                <p style={{ color: 'var(--ink)', lineHeight: '1.8', margin: 0 }}>
                  {tea.origin}
                </p>
              </div>

              <div>
                <h3 style={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.4rem',
                  marginBottom: '0.75rem',
                  color: 'rgba(201, 165, 112, 0.9)'
                }}>
                  Flavor Profile
                </h3>
                <p style={{ color: 'var(--ink)', lineHeight: '1.8', margin: 0 }}>
                  {tea.flavorProfile}
                </p>
              </div>

              <div>
                <h3 style={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.4rem',
                  marginBottom: '0.75rem',
                  color: 'rgba(201, 165, 112, 0.9)'
                }}>
                  How It's Made
                </h3>
                <p style={{ color: 'var(--ink)', lineHeight: '1.8', margin: 0 }}>
                  {tea.processing}
                </p>
              </div>
            </div>
          </div>

          {/* First Quiz - slides from left */}
          {tea.quizzes.length > 0 && (
            <div 
              ref={firstQuizRef}
              className={`quiz-slide-left ${firstQuizVisible ? 'visible' : ''}`}
            >
              <Quiz
                question={tea.quizzes[0].question}
                options={tea.quizzes[0].options}
                explanation={tea.quizzes[0].explanation}
              />
            </div>
          )}

          {/* Second Information Block */}
          <div className="info-block" style={{ 
            background: '#f5e3c8', 
            borderRadius: '24px', 
            padding: '3rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.4rem',
                  marginBottom: '0.75rem',
                  color: 'rgba(201, 165, 112, 0.9)'
                }}>
                  Health Benefits
                </h3>
                <ul style={{ color: 'var(--ink)', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }}>
                  {tea.healthBenefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.4rem',
                  marginBottom: '0.75rem',
                  color: 'rgba(201, 165, 112, 0.9)'
                }}>
                  Brewing Tips
                </h3>
                <p style={{ color: 'var(--ink)', lineHeight: '1.8', margin: 0 }}>
                  {tea.brewingTips}
                </p>
              </div>

              <div>
                <h3 style={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.4rem',
                  marginBottom: '0.75rem',
                  color: 'rgba(201, 165, 112, 0.9)'
                }}>
                  Fun Facts
                </h3>
                <ul style={{ color: 'var(--ink)', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }}>
                  {tea.funFacts.map((fact, idx) => (
                    <li key={idx}>{fact}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Second Quiz - slides from right */}
          {tea.quizzes.length > 1 && (
            <div 
              ref={secondQuizRef}
              className={`quiz-slide-right ${secondQuizVisible ? 'visible' : ''}`}
            >
              <Quiz
                question={tea.quizzes[1].question}
                options={tea.quizzes[1].options}
                explanation={tea.quizzes[1].explanation}
              />
            </div>
          )}

          {/* Additional quizzes if there are more than 2 */}
          {tea.quizzes.length > 2 && tea.quizzes.slice(2).map((quiz, idx) => (
            <Quiz
              key={idx + 2}
              question={quiz.question}
              options={quiz.options}
              explanation={quiz.explanation}
            />
          ))}

          {/* Comments */}
          <Comments pageId={teaType || 'unknown'} />
        </div>
      </section>
    </main>
  );
}

