import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';

/* ──────────────────────────────────────────────
   Data
────────────────────────────────────────────── */

const MARQUEE_ITEMS = [
  'Calendar Management', 'Influencer Discovery', 'Portfolio Builder',
  'Direct Negotiation', 'Payment Tracking', 'Brand Campaigns',
  'Verified Reviews', 'Seamless Contact',
];

const INFLUENCER_FEATURES = [
  { icon: '📅', name: 'Calendar Management', desc: 'Manage all your brand collabs, deadlines, and deliverables in one clean calendar. Never miss a posting date again.' },
  { icon: '🖼️', name: 'Shareable Portfolio', desc: 'Build a stunning portfolio page that showcases your niche, stats, past work, and rates — shareable with one link.' },
  { icon: '⭐', name: 'Reviews & Reputation', desc: 'Brands leave reviews after collaborations. Build your credibility and let your track record speak for itself.' },
  { icon: '💸', name: 'Payment Tracking', desc: 'Track invoices, pending payments, and completed payouts. Know exactly where your money stands, always.' },
];

const BRAND_FEATURES = [
  { icon: '🔍', name: 'Smart Influencer Search', desc: 'Filter by niche, location, follower count, platform, engagement rate, and more. Finding the right fit is finally easy.' },
  { icon: '✨', name: 'Vibe Matching', desc: "Go beyond metrics. Discover influencers whose content, tone, and audience genuinely align with your brand identity." },
  { icon: '💬', name: 'Seamless Contact', desc: 'Reach out to influencers directly from their profile. No DM hunting, no middlemen — just a clean conversation.' },
  { icon: '🤝', name: 'Direct Negotiation', desc: 'Negotiate rates, deliverables, and timelines in-platform. Agree on terms and kick off the collab — all in one place.' },
  { icon: '⭐', name: 'Post-Work Reviews', desc: 'Rate and review influencers after each campaign. Build a trusted network of go-to collaborators over time.' },
];

const STEPS = [
  { num: '01', emoji: '📝', title: 'Create Your Profile', desc: 'Sign up as an influencer or brand. Build your profile, set your preferences, and show the world what you\'re about.' },
  { num: '02', emoji: '🔗', title: 'Brands Discover You', desc: 'Brands search and filter influencers by niche, location, platform, and vibe. The right brand finds you — no cold pitching needed.' },
  { num: '03', emoji: '🚀', title: 'Collab & Get Paid', desc: 'Negotiate, agree, deliver, and get paid — all tracked inside Influrunner. Leave reviews and come back for more.' },
];

const INFLUENCER_NICHES = ['Fashion & Lifestyle', 'Tech & Gadgets', 'Food & Cooking', 'Fitness & Health', 'Travel', 'Beauty & Skincare', 'Finance', 'Gaming', 'Education', 'Other'];
const BRAND_INDUSTRIES = ['Fashion & Apparel', 'Food & Beverage', 'Tech & Electronics', 'Beauty & Cosmetics', 'Health & Wellness', 'Finance & Fintech', 'Travel & Hospitality', 'Gaming', 'Education', 'Other'];


/* ──────────────────────────────────────────────
   LandingPage — main component
────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const allMarquee = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]; // double for seamless loop

  return (
    <div className="lp-root">
      {/* ── NAV ── */}
      <nav className="lp-nav">
        <a className="lp-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="lp-logo-text">Influ<span>runner</span></span>
        </a>
        <ul className="lp-nav-links">
          <li><a onClick={() => scrollTo('lp-features')}>Features</a></li>
          <li><a onClick={() => scrollTo('lp-how')}>How It Works</a></li>
          <li><a href="https://portfolio.influrunner.com/work" target="_blank" rel="noopener noreferrer">View Our Work</a></li>
        </ul>
        <div className="lp-nav-cta">
          <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Log In</button>
          <button className="lp-btn-orange" onClick={() => navigate('/signup')}>Sign Up Free →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-grid" />
        <h1>Where <span className="accent">Influence</span><br />Meets Opportunity</h1>
        <p className="lp-hero-sub">
          The all-in-one platform that connects influencers with the brands that match their vibe — and gives both sides the tools to make magic happen.
        </p>
        <div className="lp-hero-actions">
          <button className="lp-btn-hero" onClick={() => navigate('/signup')}>
            Get Started Free <span>→</span>
          </button>
          <button className="lp-btn-hero-ghost" onClick={() => scrollTo('lp-features')}>
            See How It Works
          </button>
          <a
            href="https://portfolio.influrunner.com/work"
            target="_blank"
            rel="noopener noreferrer"
            className="lp-btn-hero-ghost"
          >
            View Our Work ↗
          </a>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="lp-marquee-section">
        <div className="lp-marquee-track">
          {allMarquee.map((item, i) => (
            <div className="lp-marquee-item" key={i}>
              <span className="lp-marquee-dot">◆</span> {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div id="lp-features" style={{ background: 'var(--lp-black)' }}>
        <div className="lp-features-section">
          <div className="lp-features-wrapper">
            <div className="lp-section-tag">Platform Features</div>
            <h2 className="lp-section-title">Everything you need.<br />Nothing you don't.</h2>
            <p className="lp-section-sub">Two sides, one platform. Built to make influencer marketing feel less like work and more like flow.</p>

            <div className="lp-features-split">
              {/* Influencers */}
              <div>
                <div className="lp-group-header">
                  <div className="lp-group-icon influencer">🎯</div>
                  <div className="lp-group-label">For Influencers</div>
                </div>
                {INFLUENCER_FEATURES.map(f => (
                  <div className="lp-feature-card" key={f.name}>
                    <div className="lp-feature-icon-wrap">{f.icon}</div>
                    <div className="lp-feature-text">
                      <div className="lp-feature-name">{f.name}</div>
                      <div className="lp-feature-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Brands */}
              <div id="lp-brands">
                <div className="lp-group-header">
                  <div className="lp-group-icon brand">🏷️</div>
                  <div className="lp-group-label">For Brands</div>
                </div>
                {BRAND_FEATURES.map(f => (
                  <div className="lp-feature-card" key={f.name}>
                    <div className="lp-feature-icon-wrap dark">{f.icon}</div>
                    <div className="lp-feature-text">
                      <div className="lp-feature-name">{f.name}</div>
                      <div className="lp-feature-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="lp-how-section" id="lp-how">
        <div className="lp-how-inner">
          <div className="lp-section-tag">How It Works</div>
          <h2 className="lp-section-title">Go live in 3 steps.</h2>
          <p className="lp-section-sub">Whether you're an influencer or a brand, getting started takes less than 5 minutes.</p>
          <div className="lp-how-steps">
            {STEPS.map(s => (
              <div className="lp-step-card" key={s.num}>
                <div className="lp-step-num">{s.num}</div>
                <span className="lp-step-emoji">{s.emoji}</span>
                <div className="lp-step-title">{s.title}</div>
                <div className="lp-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="lp-cta-section">
        <div className="lp-cta-box">
          <h2>Ready to run<br />with <span>influence?</span></h2>
          <p>Join thousands of creators and brands already building<br />partnerships that actually work.</p>
          <div className="lp-cta-buttons">
            <button className="lp-btn-hero" onClick={() => navigate('/signup')}>Sign Up as Influencer →</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-top">
          <div>
            <div className="lp-footer-col-title">Quick Links</div>
            <ul className="lp-footer-col-links">
              <li><a onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</a></li>
              <li><a onClick={() => navigate('/login')}>Log In</a></li>
              <li><a onClick={() => navigate('/signup')}>Get Started</a></li>
            </ul>
          </div>
          <div>
            <div className="lp-footer-col-title">Legal</div>
            <ul className="lp-footer-col-links">
              <li><Link to="/privacy-policy" style={{ color: 'var(--white-dim)', textDecoration: 'none', fontWeight: 300, fontSize: '14.5px' }}>Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" style={{ color: 'var(--white-dim)', textDecoration: 'none', fontWeight: 300, fontSize: '14.5px' }}>Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <span className="lp-footer-copy">© 2026 InfluRunner Technologies LLP. All rights reserved.</span>
          <div className="lp-footer-contact"><a href="mailto:hello@influrunner.com">Contact Us</a></div>
        </div>
      </footer>
    </div>
  );
}
