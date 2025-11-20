/**
 * Home.tsx
 * ----------
 * Builds the “IdeaCon stand” illusion:
 * - Top section mimics a wooden sign you “walk up” to.
 * - Bottom section is a three-panel brochure that flips to reveal a deep dive.
 * This file owns the placeholder content so the user can swap in a real topic later.
 */
import { useEffect, useState } from 'react';
import api from '../api';
import './Home.css';

/**
 * Placeholder highlight cards for the brochure’s front side.
 * Real content can drop in later without touching layout logic.
 */
const funFacts = [
  {
    title: 'Super fun fact',
    copy: 'Information goes here. Once I pick a topic I guess.'
  },
  {
    title: 'another fun fact',
    copy: 'More information goes here. I guess.'
  },
  {
    title: 'even more fun facts',
    copy: 'Another thing I thought was cool, probably.'
  },
];

/**
 * Placeholder deep dive cards for the brochure’s back side.
 * Mirrors the count of the highlight side so the flipping animation feels balanced.
 */
const deepDive = [
  {
    heading: 'Crazy Information',
    body: 'Some stuff about whatever topic I end up picking. Maybe a cool story or explanation.'
  },
  {
    heading: 'Key Takeaway',
    body: 'This is a key takeaway, I guess. Something important to remember probably.'
  },
  {
    heading: 'Next Steps',
    body: 'Probably more stuff about the topic.'
  },
];

export default function Home() {
  /**
   * Controls which face of the brochure is visible.
   * When true → show deep dive; false → show highlights.
   */
  const [isFlipped, setIsFlipped] = useState(false);

  /**
   * Keeps the sample API call for connectivity testing.
   * Replace or remove once a real backend interaction exists.
   */
  useEffect(() => {
    api.get('/api/test')
      .then(response => {
        console.log('API connection successful:', response.data);
      })
      .catch(error => {
        console.error('API connection failed:', error.message);
        // Silently fail for now since this is just a connectivity test
      });
  }, []);

  return (
    <main className="home-scene">
      {/* Stand / marquee hero */}
      <section id="stand" className="stand-stage">
        <div className="stand-greeting">Welcome to the IdeaCon floor</div>
        <div className="stand-frame">
          <div className="stand-board">
            <p className="stand-pretitle">Showcase Spotlight</p>
            <h1 className="stand-title">Some Topic</h1>
            <p className="stand-question">A question about it maybe?</p>
            <div className="stand-footer">
              <span>Some Title</span>
              <a className="scroll-cta" href="#brochure">
                Scroll to the brochure
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <div className="stand-post left" />
          <div className="stand-post right" />
        </div>
      </section>

      {/* Brochure with flip interaction */}
      <section id="brochure" className="brochure-zone">
        <div className="brochure-container">
          <div className={`brochure ${isFlipped ? 'flipped' : ''}`}>
            <div className="brochure-side front">
              <button
                className="page-flip-corner flip-right"
                onClick={() => setIsFlipped(true)}
                aria-label="Flip to deep dive"
              >
                <span className="corner-arrow">←</span>
              </button>
              <header className="brochure-header">
                <p>Highlights</p>
                <h2>Some Topic</h2>
                <span className="header-note">I'll add real content later probably.</span>
              </header>
              <div className="brochure-grid">
                {funFacts.map(({ title, copy }) => (
                  <article key={title} className="brochure-card">
                    <h3>{title}</h3>
                    <p>{copy}</p>
                    <span className="card-placeholder">A question maybe?</span>
                  </article>
                ))}
              </div>
            </div>

            <div className="brochure-side back">
              <button
                className="page-flip-corner flip-left"
                onClick={() => setIsFlipped(false)}
                aria-label="Flip to highlights"
              >
                <span className="corner-arrow">→</span>
              </button>
              <header className="brochure-header">
                <p>Deep Dive</p>
                <h2>Some Insights</h2>
                <span className="header-note">Lesson stuff goes here eventually.</span>
              </header>
              <div className="deep-dive-grid">
                {deepDive.map(({ heading, body }) => (
                  <article key={heading} className="deep-dive-card">
                    <h3>{heading}</h3>
                    <p>{body}</p>
                    <span className="card-placeholder">Some Title</span>
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
