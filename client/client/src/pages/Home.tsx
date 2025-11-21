/**
 * Home.tsx
 * ----------
 * Tea Education - IdeaCon Stand
 * - Top section: Welcome to the Tea Education showcase
 * - Bottom section: Interactive brochure with tea highlights and types
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [username, setUsernameState] = useState(() => getUsername());
  const [showUsernameInput, setShowUsernameInput] = useState(!username);

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

  return (
    <main className="home-scene" onClick={handleBackgroundClick}>
      {/* Username input section */}
      {showUsernameInput && (
        <div className="username-modal">
          <div className="username-modal-content">
            <h3>Welcome to Tea Education!</h3>
            <p>Please enter your name to get started:</p>
            <form onSubmit={handleUsernameSubmit} className="username-form">
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Your name"
                className="username-input"
                autoFocus
              />
              <button type="submit" className="username-submit">
                Continue
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Display username if set */}
      {!showUsernameInput && username && (
        <div className="username-display">
          <svg 
            className="username-icon person-icon"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="12" cy="8" r="4"/>
            <rect x="6" y="16" width="12" height="8" rx="2"/>
          </svg>
          <span className="username-text">{username}</span>
          <button 
            onClick={() => {
              setShowUsernameInput(true);
              setUsernameState('');
            }}
            className="username-edit-btn"
            aria-label="Change username"
          >
            <svg 
              className="username-icon pencil-icon"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
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
              <a className="scroll-cta" href="#brochure">
                Explore Tea Types
                <span aria-hidden="true">↓</span>
              </a>
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
      </section>

      {/* Brochure with flip interaction */}
      <section id="brochure" className="brochure-zone">
        <div className="brochure-container">
          <div className={`brochure ${isFlipped ? 'flipped' : ''}`}>
            <div className="brochure-side front">
              <button
                className="page-flip-corner flip-right"
                onClick={() => setIsFlipped(true)}
                aria-label="Flip to explore tea types"
              >
                <span className="corner-arrow">←</span>
              </button>
              <header className="brochure-header">
                <p>Featured Types</p>
                <h2>Featured Types</h2>
                <span className="header-note">Click any card to learn more</span>
              </header>
              <div className="brochure-grid">
                {teaHighlights.map(({ title, copy, link }) => (
                  <article 
                    key={title} 
                    className="brochure-card"
                    onClick={() => {
                      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                      navigate(link);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <h3>{title}</h3>
                    <p>{copy}</p>
                    <span className="card-placeholder">Learn More →</span>
                  </article>
                ))}
              </div>
            </div>

            <div className="brochure-side back">
              <button
                className="page-flip-corner flip-left"
                onClick={() => setIsFlipped(false)}
                aria-label="Flip back to highlights"
              >
                <span className="corner-arrow">→</span>
              </button>
              <header className="brochure-header">
                <p>Featured Types</p>
                <h2>Featured Types</h2>
                <span className="header-note">Click any card to learn more</span>
              </header>
              <div className="brochure-grid">
                {teaTypes.map(({ heading, body, link }) => (
                  <article 
                    key={heading} 
                    className="brochure-card"
                    onClick={() => {
                      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                      navigate(link);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <h3>{heading}</h3>
                    <p>{body}</p>
                    <span className="card-placeholder">Learn More →</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
