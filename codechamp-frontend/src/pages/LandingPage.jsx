import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import {
  Code2, BarChart2, Map, RefreshCw,
  CheckCircle, ChevronRight, Zap
} from 'lucide-react';
import './LandingPage.css';
import DarkModeToggle from '../components/common/DarkModeToggle';

const QUOTES = [
  { text: "In order to be irreplaceable, one must always be different.", author: "COCO CHANEL" },
  { text: "The only way to do great work is to love what you do.", author: "STEVE JOBS" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "CONFUCIUS" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "WINSTON CHURCHILL" },
  { text: "The secret of getting ahead is getting started.", author: "MARK TWAIN" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "SAM LEVENSON" },
  { text: "Believe you can and you're halfway there.", author: "THEODORE ROOSEVELT" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "CORY HOUSE" },
  { text: "First, solve the problem. Then, write the code.", author: "JOHN JOHNSON" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "OSCAR WILDE" }
];

const FEATURES = [
  {
    icon: Code2,
    title: "Curated Problem Sets",
    description: "248+ hand-picked questions sourced directly from technical interviews at top-tier tech companies. No fluff, just the concepts that matter.",
    tags: ["ARRAY", "GRAPH", "DP"],
    highlight: "// Company: FAANG\nclass Solution {\n  public int solve(int[] nums) {\n    // ...\n  }\n}"
  },
  {
    icon: BarChart2,
    title: "Deep Analytics",
    description: "Track your streak, proficiency by topic, and difficulty distribution with granular data visualization.",
    tags: [],
    highlight: "mastery"
  },
  {
    icon: Map,
    title: "Guided Roadmaps",
    description: "Step-by-step paths for learning complex algorithms from scratch to advanced mastery.",
    tags: [],
    highlight: "roadmap"
  },
  {
    icon: RefreshCw,
    title: "Revision List",
    description: "Automatically bookmark problems to revisit later based on your solve time and error rates.",
    tags: [],
    highlight: "revision"
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quoteIdx, setQuoteIdx] = useState(0);

  /*useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user]);*/

  useEffect(() => {
    const today = new Date().getDay();
    setQuoteIdx(today % QUOTES.length);
  }, []);

  const quote = QUOTES[quoteIdx];

  return (
    <div className="landing">

      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <div className="landing-logo-box">
            <Zap size={16} strokeWidth={2.5} />
          </div>
          <span className="landing-brand-name">
            CodeChamp
          </span>
        </div>
       <div className="landing-nav-actions">
  <DarkModeToggle />
  <button
    className="landing-nav-login"
    onClick={() => navigate('/login')}>
    Log In
  </button>
  <button
    className="landing-nav-signup"
    onClick={() => navigate('/register')}>
    Sign Up
  </button>
</div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-left">
          <div className="landing-badges">
            <span className="landing-badge">
              <CheckCircle size={12} strokeWidth={2} />
              TECHNICAL EXCELLENCE IN PRACTICE
            </span>
            <span className="landing-badge outline">
              <CheckCircle size={12} strokeWidth={2} />
              BASIC PREVIEW · FULL VERSION COMING SOON
            </span>
          </div>
          <h1 className="landing-hero-title">
            Master Data Structures
            and Algorithms with{' '}
            <span className="landing-hero-highlight">
              CodeChamp
            </span>
          </h1>
          <p className="landing-hero-desc">
            Practice hundreds of problems, track your
            progress with accurate analytics, and follow
            guided roadmaps to technical excellence.
          </p>
          <button
            className="landing-cta-btn"
            onClick={() => navigate('/register')}>
            Get Started for Free
          </button>
        </div>

        <div className="landing-hero-right">
          <div className="landing-app-preview">
            <div className="preview-topbar">
              <span className="preview-dot red"></span>
              <span className="preview-dot yellow"></span>
              <span className="preview-dot green"></span>
            </div>
            <div className="preview-content">
              <div className="preview-sidebar">
                {['Dashboard', 'Practice', 'Roadmap', 'Profile'].map(item => (
                  <div key={item} className={`preview-nav-item ${item === 'Practice' ? 'active' : ''}`}>
                    {item}
                  </div>
                ))}
              </div>
              <div className="preview-main">
                <div className="preview-stats">
                  {['248', '42', '15', '07'].map((n, i) => (
                    <div key={i} className="preview-stat">
                      <span className="preview-stat-num">{n}</span>
                      <span className="preview-stat-label">
                        {['Questions','Solved','Topics','Streak'][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="preview-progress">
                  <div className="preview-bar">
                    <div className="preview-fill"
                      style={{width:'35%'}}></div>
                  </div>
                  <div className="preview-bar">
                    <div className="preview-fill"
                      style={{width:'60%'}}></div>
                  </div>
                  <div className="preview-bar">
                    <div className="preview-fill"
                      style={{width:'20%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <h2 className="landing-section-title">
          Built for Competitive Engineers
        </h2>
        <div className="landing-section-underline"></div>

        <div className="landing-features-grid">

          {/* Feature 1 — Code */}
          <div className="feature-card large">
            <div className="feature-icon-box">
              <Code2 size={20} strokeWidth={1.75}
                color="var(--primary)" />
            </div>
            <h3>Curated Problem Sets</h3>
            <p>
              Hand-picked questions sourced directly
              from technical interviews at top-tier tech
              companies. No fluff, just the concepts
              that matter.
            </p>
            <div className="feature-tags">
              <span>ARRAY</span>
              <span>GRAPH</span>
              <span>DP</span>
            </div>
            <div className="feature-code-preview">
              <span className="code-comment">
                // Company: FAANG
              </span>
              <span className="code-line">
                <span className="code-keyword">class</span>
                {' '}Solution {'{'}
              </span>
              <span className="code-line indent">
                <span className="code-keyword">public int</span>
                {' '}solve(
                <span className="code-keyword">int</span>[] nums) {'{'}
              </span>
              <span className="code-line indent2">
                {'// ...'}
              </span>
              <span className="code-line indent">{'}'}</span>
              <span className="code-line">{'}'}</span>
            </div>
          </div>

          {/* Feature 2 — Analytics */}
          <div className="feature-card">
            <div className="feature-icon-box">
              <BarChart2 size={20} strokeWidth={1.75}
                color="var(--primary)" />
            </div>
            <h3>Deep Analytics</h3>
            <p>
              Track your streak, proficiency by topic,
              and difficulty distribution with granular
              data visualization.
            </p>
            <div className="feature-analytics">
              <div className="analytics-row">
                <span>Mastery</span>
                <span className="analytics-pct">82%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill"
                  style={{width:'82%'}}></div>
              </div>
              <div className="analytics-row"
                style={{marginTop:'0.5rem'}}>
                <span>Streak</span>
                <span className="analytics-pct">7 days</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill"
                  style={{width:'70%'}}></div>
              </div>
            </div>
          </div>

          {/* Feature 3 — Roadmap */}
          <div className="feature-card">
            <div className="feature-icon-box">
              <Map size={20} strokeWidth={1.75}
                color="var(--primary)" />
            </div>
            <h3>Guided Roadmaps</h3>
            <p>
              Step-by-step paths for learning complex
              algorithms from scratch to advanced mastery.
            </p>
            <div className="feature-roadmap">
              {['Bit Manipulation', 'Sliding Window',
                'Dynamic Programming'].map((step, i) => (
                <div key={i} className="roadmap-step-preview">
                  <span className="step-num-preview">
                    {String(i+1).padStart(2,'0')}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 4 — Revision */}
          <div className="feature-card">
            <div className="feature-icon-box">
              <RefreshCw size={20} strokeWidth={1.75}
                color="var(--primary)" />
            </div>
            <h3>Revision List</h3>
            <p>
              Automatically bookmark problems to
              revisit later based on your solve time
              and error rates.
            </p>
            <div className="feature-revision">
              <div className="revision-item-preview soon">
                <span className="revision-tag">
                  REVISIT SOON
                </span>
                <span>Binary Tree Level Order Traversal</span>
              </div>
              <div className="revision-item-preview practice">
                <span className="revision-tag practice">
                  NEEDS PRACTICE
                </span>
                <span>Median of Two Sorted Arrays</span>
              </div>
            </div>
          </div>
        </div>
      </section>

              {/* Coming Soon */}
        <section className="landing-coming-soon">
          <div className="coming-soon-inner">
            <div className="coming-soon-header">
              <span className="coming-soon-tag">ROADMAP</span>
              <h2>What's Coming Next</h2>
              <p>
                CodeChamp is actively growing. Here's
                what we're building for you.
              </p>
            </div>

            <div className="coming-soon-grid">
              <div className="cs-card">
                <div className="cs-card-top">
                  <span className="cs-number">01</span>
                  <span className="cs-status soon">
                    Coming Soon
                  </span>
                </div>
                <h3>1000+ Questions</h3>
                <p>
                  Expanding from 248 to 1000+ curated
                  DSA questions with company-wise tagging
                  for Amazon, Google, Microsoft and more.
                </p>
                <div className="cs-progress">
                  <div className="cs-progress-bar">
                    <div className="cs-progress-fill"
                      style={{width:'25%'}}></div>
                  </div>
                  <span>25% complete</span>
                </div>
              </div>

              <div className="cs-card">
                <div className="cs-card-top">
                  <span className="cs-number">02</span>
                  <span className="cs-status soon">
                    Coming Soon
                  </span>
                </div>
                <h3>Company-wise Filter</h3>
                <p>
                  Filter questions by top companies.
                  See exactly which questions Amazon,
                  Google, Microsoft and Meta ask most.
                </p>
                <div className="cs-tags">
                  <span>Amazon</span>
                  <span>Google</span>
                  <span>Microsoft</span>
                  <span>Meta</span>
                  <span>Apple</span>
                </div>
              </div>

              <div className="cs-card">
                <div className="cs-card-top">
                  <span className="cs-number">03</span>
                  <span className="cs-status planned">
                    Planned
                  </span>
                </div>
                <h3>Interview Mode</h3>
                <p>
                  Simulate real interviews with a countdown
                  timer, random questions by difficulty,
                  and instant performance feedback.
                </p>
                <div className="cs-feature-list">
                  <span>⏱ Timed sessions</span>
                  <span>🎯 Random questions</span>
                  <span>📊 Performance report</span>
                </div>
              </div>

              <div className="cs-card">
                <div className="cs-card-top">
                  <span className="cs-number">04</span>
                  <span className="cs-status planned">
                    Planned
                  </span>
                </div>
                <h3>Spaced Repetition</h3>
                <p>
                  Smart revision scheduling using spaced
                  repetition algorithm. Questions appear
                  exactly when you need to review them.
                </p>
                <div className="cs-feature-list">
                  <span>🧠 Smart scheduling</span>
                  <span>📅 Review reminders</span>
                  <span>📈 Retention tracking</span>
                </div>
              </div>

              <div className="cs-card">
                <div className="cs-card-top">
                  <span className="cs-number">05</span>
                  <span className="cs-status planned">
                    Planned
                  </span>
                </div>
                <h3>AI Hint System</h3>
                <p>
                  Stuck on a problem? Get intelligent hints
                  that guide your thinking without giving
                  away the complete solution.
                </p>
                <div className="cs-feature-list">
                  <span>💡 Progressive hints</span>
                  <span>🤖 AI powered</span>
                  <span>📝 Approach guide</span>
                </div>
              </div>

              <div className="cs-card">
                <div className="cs-card-top">
                  <span className="cs-number">06</span>
                  <span className="cs-status planned">
                    Planned
                  </span>
                </div>
                <h3>Leaderboard</h3>
                <p>
                  Compete with other developers globally.
                  Weekly contests, streak rankings, and
                  badges to showcase your achievements.
                </p>
                <div className="cs-feature-list">
                  <span>🏆 Weekly contests</span>
                  <span>🌍 Global rankings</span>
                  <span>🎖 Achievement badges</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <h2>Ready to level up your<br/>engineering skills?</h2>
        <p>
          Master the logic behind the code. Precision
          practice for the world's most ambitious engineers.
        </p>
        <button
          className="landing-cta-main-btn"
          onClick={() => navigate('/register')}>
          Join CodeChamp Today
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
        <div className="landing-cta-checks">
          <span>
            <CheckCircle size={14} strokeWidth={2} />
            No credit card required
          </span>
          <span>
            <CheckCircle size={14} strokeWidth={2} />
            Unlimited basic access
          </span>
        </div>
      </section>

      {/* Quote Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-logo">
          <div className="landing-logo-box small">
            <Zap size={12} strokeWidth={2.5} />
          </div>
        </div>
        <blockquote className="landing-quote">
          "{quote.text}"
        </blockquote>
        <p className="landing-quote-author">
          — {quote.author}
        </p>
      </footer>

    </div>
  );
};

export default LandingPage;