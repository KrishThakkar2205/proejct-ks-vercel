import React, { useEffect, useState } from 'react';

const C = {
  orange:   '#E8500A',
  bg:       '#0E0E0E',
  card:     '#121212',
  cardAlt:  '#161616',
  text:     '#F5F0EB',
  muted:    'rgba(245,240,235,0.5)',
  faint:    'rgba(245,240,235,0.06)',
  yellow:   '#FFD166',
  border:   '1px solid rgba(255,255,255,0.06)',
};

const DotSep = () => (
  <span style={{ color: 'rgba(255,255,255,0.45)', padding: '0 8px' }}>✦</span>
);

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="nav-bar"
      style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(14, 14, 14, 0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.5)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <span
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 800,
          fontSize: '18px',
          color: '#FFFFFF',
          letterSpacing: '-0.5px',
        }}
      >
        INFLU<span style={{ color: C.orange }}>RUNNER</span>
      </span>
      <div
        className="nav-links"
        style={{
          display: 'flex',
          gap: '28px',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
        }}
      >
        <a href="#portfolio" style={{ color: C.muted, textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link-item">Portfolio</a>
        <a href="#features" style={{ color: C.muted, textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link-item">For Brands</a>
        <a href="#pricing" style={{ color: C.muted, textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link-item">Pricing</a>
      </div>
      <button
        style={{
          background: C.orange,
          color: '#FFFFFF',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 600,
          fontSize: '13px',
          padding: '8px 20px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(232, 80, 10, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        Claim your profile →
      </button>
    </nav>
  );
};

const Ticker = () => {
  const TickerBlock = () => (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span className="ticker-text">Your media kit is a Google Doc</span>
      <DotSep />
      <span className="ticker-text">Brands DM asking for 'rates' with zero context</span>
      <DotSep />
      <span className="ticker-text">Your analytics are locked in Instagram insights</span>
      <DotSep />
      <span className="ticker-text">Collab emails disappear for weeks</span>
      <DotSep />
      <span className="ticker-text">You send the same intro 50 times a month</span>
      <DotSep />
    </div>
  );

  return (
    <div
      style={{
        background: C.orange,
        padding: '8px 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          animation: 'ticker 22s linear infinite',
        }}
      >
        <TickerBlock />
        <TickerBlock />
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <section
      style={{
        padding: '72px 32px 80px',
        maxWidth: '860px',
        margin: '0 auto',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(232, 80, 10, 0.12)',
          border: '1px solid rgba(232, 80, 10, 0.3)',
          color: C.orange,
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 600,
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          padding: '6px 14px',
          borderRadius: '100px',
          marginBottom: '28px',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: C.orange,
            animation: 'pulse 2s infinite',
          }}
        />
        Creator infrastructure · Ahmedabad & beyond
      </div>
      <h1
        className="hero-h1"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 800,
          fontSize: '72px',
          lineHeight: 1.0,
          letterSpacing: '-2px',
          marginBottom: '28px',
          color: '#F5F0EB',
        }}
      >
        Stop running your
        <br />
        creator career from
        <br />
        <span style={{ color: C.orange }}>your Notes app.</span>
      </h1>
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '17px',
          lineHeight: 1.65,
          color: 'rgba(245, 240, 235, 0.6)',
          maxWidth: '520px',
          marginBottom: '40px',
        }}
      >
        InfluRunner gives you a{' '}
        <strong style={{ color: '#F5F0EB', fontWeight: 600 }}>live portfolio</strong>
        , a{' '}
        <strong style={{ color: '#F5F0EB', fontWeight: 600 }}>shoot calendar</strong>
        , and a{' '}
        <strong style={{ color: '#F5F0EB', fontWeight: 600 }}>brand-ready profile</strong>{' '}
        — all in one place. Built so creators spend less time managing and more time creating.
      </p>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <button
          className="btn-primary"
          style={{
            background: C.orange,
            color: '#FFFFFF',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '15px',
            padding: '14px 28px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(232, 80, 10, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Get your free profile →
        </button>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid rgba(245, 240, 235, 0.2)',
            color: 'rgba(245, 240, 235, 0.65)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 500,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '14px 0',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#F5F0EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(245, 240, 235, 0.65)';
          }}
        >
          See a live portfolio ↗
        </button>
      </div>
      <div
        style={{
          marginTop: '48px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: C.orange,
              border: '2px solid #0E0E0E',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 4,
            }}
          >
            KT
          </div>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: '#1a1a1a',
              border: '2px solid #0E0E0E',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '-8px',
              zIndex: 3,
            }}
          >
            RV
          </div>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: C.yellow,
              border: '2px solid #0E0E0E',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '-8px',
              zIndex: 2,
            }}
          >
            SM
          </div>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: '#333333',
              border: '2px solid #0E0E0E',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '10px',
              color: 'rgba(245, 240, 235, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '-8px',
              zIndex: 1,
            }}
          >
            +
          </div>
        </div>
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: C.muted,
          }}
        >
          <strong style={{ color: '#F5F0EB', fontWeight: 600 }}>200+ creators</strong> already running the show
        </span>
      </div>
    </section>
  );
};

const ProblemGrid = () => {
  const problemCards = [
    {
      emoji: '📎',
      h3: 'Your portfolio is embarrassing you',
      p: "A Google Doc with outdated stats isn't a media kit. Brands notice.",
      fix: 'Live portfolio with real-time Instagram data',
    },
    {
      emoji: '🗓️',
      h3: 'You miss shoot deadlines constantly',
      p: 'Managing 3 brand deals across WhatsApp, DMs, and email is a full-time job you\'re doing for free.',
      fix: 'Shoot & upload calendar built for creators',
    },
    {
      emoji: '👻',
      h3: "Brands ghost you after 'let's collab'",
      p: 'No paper trail, no deliverables agreed, no follow-up — you lose the deal before it starts.',
      fix: 'Collaboration workflow from intro to invoice',
    },
    {
      emoji: '📊',
      h3: "You can't prove your value",
      p: 'Brands want engagement rate, reach, and audience data. You have screenshots.',
      fix: 'Live analytics brands can see on your profile',
    },
  ];

  return (
    <section
      style={{
        padding: '72px 32px',
        maxWidth: '860px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'rgba(245, 240, 235, 0.3)',
          marginBottom: '32px',
        }}
      >
        THE REAL PROBLEM
      </div>
      <div
        className="problem-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: C.border,
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {problemCards.map((card, i) => (
          <div
            key={i}
            style={{
              background: C.card,
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '22px', marginBottom: '12px' }}>{card.emoji}</div>
              <h3
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: '#F5F0EB',
                  marginBottom: '6px',
                }}
              >
                {card.h3}
              </h3>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  lineHeight: 1.55,
                  color: 'rgba(245, 240, 235, 0.45)',
                }}
              >
                {card.p}
              </p>
            </div>
            <div
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                color: C.orange,
                marginTop: '20px',
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
              }}
            >
              <span style={{ color: C.yellow }}>✦</span>
              {card.fix}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Features = () => {
  const featuresData = [
    {
      icon: '🔗',
      title: 'Shareable creator portfolio',
      desc: 'One link. Your niche, your stats, your best work — automatically updated from Instagram. Send it to brands instead of a screengrab.',
      tag: 'Live',
    },
    {
      icon: '📅',
      title: 'Shoot & upload calendar',
      desc: 'Log your content deadlines, get reminders before a shoot day, and actually post on time. Consistency is a system, not a personality trait.',
      tag: 'Live',
    },
    {
      icon: '📈',
      title: 'Live Instagram analytics',
      desc: 'Follower count, engagement rate, reach, and post performance — all pulled directly from Instagram and shown on your public profile.',
      tag: 'Live',
    },
    {
      icon: '🤝',
      title: 'Brand collaboration workspace',
      desc: 'Manage brand reviews, log deliverables, and keep every collab in one place. No more "which DM was that in?"',
      tag: 'Coming soon',
    },
    {
      icon: '🤖',
      title: 'AI-powered creator tools',
      desc: 'Caption suggestions, best-time-to-post insights, and brand pitch templates — trained on what actually works for Indian creators.',
      tag: 'Coming soon',
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: '72px 32px',
        maxWidth: '860px',
        margin: '0 auto',
      }}
    >
      <h2
        className="features-h2"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 800,
          fontSize: '44px',
          letterSpacing: '-1.5px',
          lineHeight: 1.1,
          color: '#F5F0EB',
          marginBottom: '12px',
        }}
      >
        Everything you need.
        <br />
        Nothing you don't.
      </h2>
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          color: C.muted,
          maxWidth: '480px',
          marginBottom: '48px',
        }}
      >
        Two sides, one platform. Built to make influencer marketing feel less like work and more like flow.
      </p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        {featuresData.map((feat, i) => (
          <div key={i} className="feature-row">
            <div
              style={{
                width: '44px',
                height: '44px',
                background: 'rgba(232, 80, 10, 0.12)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              {feat.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: '#F5F0EB',
                  marginBottom: '4px',
                }}
              >
                {feat.title}
              </h3>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  lineHeight: 1.55,
                  color: C.muted,
                }}
              >
                {feat.desc}
              </p>
            </div>
            <div
              style={{
                borderRadius: '100px',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '11px',
                padding: '4px 10px',
                whiteSpace: 'nowrap',
                background: feat.tag === 'Live' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(232, 80, 10, 0.12)',
                color: feat.tag === 'Live' ? '#4ade80' : C.orange,
              }}
            >
              {feat.tag}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const StatsStrip = () => {
  const stats = [
    ['200+', 'Creators onboarded'],
    ['0 ₹', 'To get started'],
    ['1 link', 'To replace your media kit'],
  ];

  return (
    <div
      style={{
        background: C.orange,
        padding: '40px 32px',
        width: '100%',
      }}
    >
      <div
        className="stats-grid"
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="stat-col"
            style={{
              textAlign: 'center',
              padding: '0 24px',
              borderRight: i === stats.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 800,
                fontSize: '40px',
                letterSpacing: '-2px',
                lineHeight: 1,
                color: '#FFFFFF',
                marginBottom: '4px',
              }}
            >
              {stat[0]}
            </div>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.65)',
                fontWeight: 500,
              }}
            >
              {stat[1]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PortfolioMockup = () => {
  const stats = [
    ['12.4K', 'Followers'],
    ['6.2%', 'Eng. Rate'],
    ['48K', 'Avg. Reach'],
    ['Live ✦', 'Instagram sync'],
  ];

  const posts = [
    { e: '🏍️', type: 'Reel', likes: '4.2K ♥' },
    { e: '💼', type: 'Carousel', likes: '2.8K ♥' },
    { e: '📱', type: 'Reel', likes: '6.1K ♥' },
  ];

  return (
    <section
      id="portfolio"
      style={{
        padding: '80px 32px',
        maxWidth: '860px',
        margin: '0 auto',
      }}
    >
      <h2
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 800,
          fontSize: '44px',
          letterSpacing: '-1.5px',
          lineHeight: 1.1,
          color: '#F5F0EB',
          marginBottom: '10px',
        }}
      >
        Your profile, <span style={{ color: C.orange }}>actually impressive.</span>
      </h2>
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          color: C.muted,
          marginBottom: '40px',
        }}
      >
        Here's what a brand sees when you drop your InfluRunner link.
      </p>

      <div
        style={{
          background: C.cardAlt,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '28px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '28px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E8500A, #FFD166)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800,
              fontSize: '18px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            KT
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '17px',
                color: '#F5F0EB',
                marginBottom: '2px',
              }}
            >
              Krish Thakkar
            </div>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: C.muted,
              }}
            >
              @_kthakkar.22_ · Lifestyle & Tech · Ahmedabad
            </div>
          </div>
          <div
            className="mockup-url-pill"
            style={{
              marginLeft: 'auto',
              background: 'rgba(232, 80, 10, 0.12)',
              border: '1px solid rgba(232, 80, 10, 0.25)',
              borderRadius: '6px',
              padding: '6px 12px',
            }}
          >
            <span
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '11px',
                color: C.orange,
              }}
            >
              influrunner.com/portfolio/krish
            </span>
          </div>
        </div>

        <div
          className="portfolio-stats"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                background: '#1a1a1a',
                borderRadius: '8px',
                padding: '14px 12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: '19px',
                  color: i === stats.length - 1 ? C.orange : '#F5F0EB',
                  marginBottom: '2px',
                }}
              >
                {stat[0]}
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(245, 240, 235, 0.35)',
                }}
              >
                {stat[1]}
              </div>
            </div>
          ))}
        </div>

        <div
          className="portfolio-posts"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
          }}
        >
          {posts.map((post, i) => (
            <div
              key={i}
              style={{
                aspectRatio: 1,
                borderRadius: '8px',
                background: '#1e1e1e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: '28px' }}>{post.e}</span>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(0, 0, 0, 0.55)',
                  padding: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <span>{post.type}</span>
                <span>{post.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonialsData = [
    {
      quote: 'Finally stopped sending <strong>screenshots of my Insights</strong> to brands. My InfluRunner link does all the talking now.',
      name: 'Priya Sharma',
      tag: 'Food creator · 8K followers',
      initials: 'PS',
      avatarBg: '#E8500A',
    },
    {
      quote: 'The calendar actually <strong>keeps me consistent</strong>. I\'ve posted more in the last month than the whole previous quarter.',
      name: 'Rahul Mehta',
      tag: 'Fitness creator · 22K followers',
      initials: 'RM',
      avatarBg: '#FFD166',
      avatarColor: '#1a1a1a',
    },
  ];

  return (
    <section
      style={{
        padding: '0 32px 80px',
        maxWidth: '860px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'rgba(245, 240, 235, 0.3)',
          marginBottom: '24px',
        }}
      >
        WHAT CREATORS SAY
      </div>
      <div
        className="testi-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}
      >
        {testimonialsData.map((testi, i) => (
          <div
            key={i}
            style={{
              background: C.card,
              border: C.border,
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <p
              className="testi-quote"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(245, 240, 235, 0.7)',
                marginBottom: '16px',
              }}
              dangerouslySetInnerHTML={{ __html: testi.quote }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: testi.avatarBg,
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: '12px',
                  color: testi.avatarColor || '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {testi.initials}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: '13px',
                    color: '#F5F0EB',
                    marginBottom: '1px',
                  }}
                >
                  {testi.name}
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(245, 240, 235, 0.35)',
                  }}
                >
                  {testi.tag}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const FinalCTA = () => {
  return (
    <section
      style={{
        background: '#111111',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '80px 32px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          transform: 'rotate(-2deg)',
          marginBottom: '24px',
          background: C.yellow,
          color: '#1A1A1A',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 800,
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          padding: '5px 12px',
          borderRadius: '100px',
        }}
      >
        Free to join · No credit card
      </div>
      <h2
        className="final-h2"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 800,
          fontSize: '52px',
          letterSpacing: '-2px',
          lineHeight: 1.05,
          color: '#F5F0EB',
          marginBottom: '14px',
        }}
      >
        You make the content.
        <br />
        Let <span style={{ color: C.orange }}>InfluRunner</span> run the rest.
      </h2>
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          color: C.muted,
          marginBottom: '36px',
        }}
      >
        Takes 2 minutes to set up. Your first brand-ready portfolio link, free forever.
      </p>
      <button
        style={{
          background: C.orange,
          color: '#FFFFFF',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: '16px',
          padding: '16px 36px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(232, 80, 10, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        Claim your free profile →
      </button>
    </section>
  );
};

const Footer = () => {
  return (
    <footer
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '24px 32px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <div
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: '14px',
          color: 'rgba(245, 240, 235, 0.4)',
        }}
      >
        INFLU<span style={{ color: C.orange }}>RUNNER</span>
      </div>
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          color: 'rgba(245, 240, 235, 0.25)',
          textAlign: 'right',
        }}
      >
        Where creators run the show. · Built in Ahmedabad 🇮🇳
      </div>
    </footer>
  );
};

const globalStyles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background: #0E0E0E;
}

@keyframes ticker {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.ticker-text {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #FFFFFF;
  padding: 0 12px;
}

.feature-row {
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 20px;
  align-items: start;
  padding: 24px;
  background: #121212;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.feature-row:hover {
  background: #161616;
}

.testi-quote strong {
  color: #F5F0EB;
  font-weight: 600;
}

.nav-link-item:hover {
  color: #F5F0EB !important;
}

@media (max-width: 600px) {
  .problem-grid { grid-template-columns: 1fr !important; }
  .stats-grid   { grid-template-columns: 1fr !important; }
  .testi-grid   { grid-template-columns: 1fr !important; }
  .portfolio-stats { grid-template-columns: repeat(2,1fr) !important; }
  .portfolio-posts { grid-template-columns: repeat(3,1fr) !important; }
  .hero-h1      { font-size: 38px !important; letter-spacing: -1px !important; }
  .features-h2  { font-size: 28px !important; }
  .final-h2     { font-size: 28px !important; }
  .nav-links    { display: none !important; }
  .mockup-url-pill { margin-left: 0 !important; margin-top: 10px !important; }
}
`;

export default function InfluRunnerLanding() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=Inter:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: 'Inter, sans-serif',
        background: '#0E0E0E',
        color: '#F5F0EB',
        overflowX: 'hidden',
      }}
    >
      <style>{globalStyles}</style>
      <NavBar />
      <Ticker />
      <Hero />
      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }} />
      <ProblemGrid />
      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }} />
      <Features />
      <StatsStrip />
      <PortfolioMockup />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}
