import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* ──────────────────────────────────────────────
   Scoped CSS injected once
────────────────────────────────────────────── */
const LANDING_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

  .lp-root {
    --orange: #FF5C00;
    --orange-light: #FF7A2B;
    --orange-glow: rgba(255, 92, 0, 0.18);
    --lp-black: #0A0A0A;
    --lp-black-2: #131313;
    --lp-black-3: #1C1C1C;
    --lp-white: #FFFFFF;
    --white-dim: rgba(255,255,255,0.65);
    --white-faint: rgba(255,255,255,0.08);
    --lp-border: rgba(255,255,255,0.09);
    background: var(--lp-black);
    color: var(--lp-white);
    font-family: 'Outfit', sans-serif;
    overflow-x: hidden;
    cursor: default;
    min-height: 100vh;
  }

  /* Noise overlay */
  .lp-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.025;
    pointer-events: none;
    z-index: 9999;
  }

  .lp-root h1, .lp-root h2, .lp-root h3, .lp-root h4 {
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 1px;
  }

  /* ── NAV ── */
  .lp-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 200;
    padding: 22px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(10,10,10,0.7);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--lp-border);
  }

  .lp-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    cursor: pointer;
  }

  .lp-logo-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    font-weight: 400;
    color: var(--lp-white);
    letter-spacing: 1.5px;
    text-decoration: none;
  }

  .lp-logo-text span { color: var(--orange); }

  .lp-nav-links {
    display: flex;
    align-items: center;
    gap: 36px;
    list-style: none;
  }

  .lp-nav-links a {
    color: var(--white-dim);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s;
    letter-spacing: 0.3px;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
  }

  .lp-nav-links a:hover { color: var(--lp-white); }

  .lp-nav-cta {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .lp-btn-ghost {
    padding: 9px 22px;
    border: 1px solid var(--lp-border);
    border-radius: 8px;
    color: var(--white-dim);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    background: transparent;
    text-decoration: none;
    transition: all 0.2s;
    font-family: 'Outfit', sans-serif;
  }

  .lp-btn-ghost:hover {
    border-color: rgba(255,255,255,0.3);
    color: var(--lp-white);
  }

  .lp-btn-orange {
    padding: 9px 22px;
    background: var(--orange);
    border: 1px solid var(--orange);
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    font-family: 'Outfit', sans-serif;
    letter-spacing: 0.1px;
  }

  .lp-btn-orange:hover {
    background: var(--orange-light);
    border-color: var(--orange-light);
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(255,92,0,0.35);
  }

  /* ── HERO ── */
  .lp-hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 120px 40px 80px;
    position: relative;
    overflow: hidden;
  }

  .lp-hero::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -58%);
    width: 720px; height: 520px;
    background: radial-gradient(ellipse, rgba(255,92,0,0.14) 0%, transparent 70%);
    pointer-events: none;
  }

  .lp-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%);
  }

  .lp-hero h1 {
    font-size: clamp(46px, 7vw, 88px);
    font-weight: 800;
    line-height: 1.04;
    letter-spacing: 4px;
    max-width: 860px;
    position: relative;
    z-index: 2;
    animation: lp-fadeUp 0.8s 0.1s ease both;
  }

  .lp-hero h1 .accent { color: var(--orange); }

  .lp-hero-sub {
    font-size: 18px;
    color: var(--white-dim);
    max-width: 520px;
    line-height: 1.65;
    margin: 24px auto 44px;
    font-weight: 300;
    position: relative;
    z-index: 2;
    animation: lp-fadeUp 0.8s 0.2s ease both;
  }

  .lp-hero-actions {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
    z-index: 2;
    animation: lp-fadeUp 0.8s 0.3s ease both;
  }

  .lp-btn-hero {
    padding: 14px 32px;
    background: var(--orange);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 15.5px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    font-family: 'Outfit', sans-serif;
    transition: all 0.22s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .lp-btn-hero:hover {
    background: var(--orange-light);
    transform: translateY(-2px);
    box-shadow: 0 12px 36px rgba(255,92,0,0.4);
  }

  .lp-btn-hero-ghost {
    padding: 14px 32px;
    background: transparent;
    border: 1px solid var(--lp-border);
    border-radius: 10px;
    color: var(--white-dim);
    font-size: 15.5px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    font-family: 'Outfit', sans-serif;
    transition: all 0.22s;
  }

  .lp-btn-hero-ghost:hover {
    border-color: rgba(255,255,255,0.25);
    color: var(--lp-white);
  }

  @keyframes lp-fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── MARQUEE ── */
  .lp-marquee-section {
    border-top: 1px solid var(--lp-border);
    border-bottom: 1px solid var(--lp-border);
    padding: 18px 0;
    overflow: hidden;
    position: relative;
    background: var(--lp-black-2);
  }

  .lp-marquee-track {
    display: flex;
    gap: 48px;
    animation: lp-marquee 12s linear infinite;
    white-space: nowrap;
  }

  .lp-marquee-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--white-dim);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  .lp-marquee-dot { color: var(--orange); font-size: 18px; line-height: 1; }

  @keyframes lp-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  /* ── SECTION SHARED ── */
  .lp-section { padding: 100px 60px; }

  .lp-section-tag {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--orange);
    margin-bottom: 18px;
  }

  .lp-section-tag::before {
    content: '';
    display: block;
    width: 18px; height: 2px;
    background: var(--orange);
    border-radius: 2px;
  }

  .lp-section-title {
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 800;
    letter-spacing: -2px;
    line-height: 1.07;
  }

  .lp-section-sub {
    font-size: 16.5px;
    color: var(--white-dim);
    line-height: 1.7;
    font-weight: 300;
    max-width: 520px;
    margin-top: 14px;
  }

  /* ── FEATURES ── */
  .lp-features-section {
    background: var(--lp-black);
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 0;
  }

  .lp-features-wrapper { padding: 0 60px; }

  .lp-features-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    margin-top: 80px;
  }

  .lp-group-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
  }

  .lp-group-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }

  .lp-group-icon.influencer { background: rgba(255,92,0,0.15); }
  .lp-group-icon.brand { background: rgba(255,255,255,0.06); }

  .lp-group-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    font-weight: 400;
    letter-spacing: 1px;
  }

  .lp-feature-card {
    background: var(--lp-black-3);
    border: 1px solid var(--lp-border);
    border-radius: 16px;
    padding: 26px 28px;
    margin-bottom: 14px;
    display: flex;
    align-items: flex-start;
    gap: 18px;
    transition: all 0.22s;
    position: relative;
    overflow: hidden;
  }

  .lp-feature-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--orange-glow) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.22s;
  }

  .lp-feature-card:hover { border-color: rgba(255,92,0,0.3); transform: translateX(4px); }
  .lp-feature-card:hover::before { opacity: 1; }

  .lp-feature-icon-wrap {
    width: 40px; height: 40px;
    background: rgba(255,92,0,0.1);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 19px;
    flex-shrink: 0;
    position: relative; z-index: 1;
  }

  .lp-feature-icon-wrap.dark { background: rgba(255,255,255,0.06); }

  .lp-feature-text { position: relative; z-index: 1; }

  .lp-feature-name {
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 5px;
    letter-spacing: 0.1px;
  }

  .lp-feature-desc {
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px;
    color: var(--white-dim);
    line-height: 1.6;
    font-weight: 300;
  }

  /* ── HOW IT WORKS ── */
  .lp-how-section {
    background: var(--lp-black-2);
    border-top: 1px solid var(--lp-border);
    border-bottom: 1px solid var(--lp-border);
    padding: 100px 60px;
  }

  .lp-how-inner { max-width: 1200px; margin: 0 auto; }

  .lp-how-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 60px;
  }

  .lp-step-card {
    background: var(--lp-black-3);
    border: 1px solid var(--lp-border);
    border-radius: 20px;
    padding: 36px 32px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.22s;
  }

  .lp-step-card:hover { border-color: rgba(255,92,0,0.3); }

  .lp-step-num {
    font-family: 'Syne', sans-serif;
    font-size: 72px;
    font-weight: 800;
    color: rgba(255,92,0,0.08);
    line-height: 1;
    position: absolute;
    top: 18px; right: 24px;
    letter-spacing: -4px;
    user-select: none;
  }

  .lp-step-emoji {
    font-size: 28px;
    margin-bottom: 20px;
    display: block;
  }

  .lp-step-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    font-weight: 400;
    margin-bottom: 10px;
    letter-spacing: 1px;
  }

  .lp-step-desc {
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    color: var(--white-dim);
    line-height: 1.65;
    font-weight: 300;
  }

  /* ── CTA ── */
  .lp-cta-section {
    padding: 100px 60px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .lp-cta-box {
    background: var(--lp-black-3);
    border: 1px solid var(--lp-border);
    border-radius: 28px;
    padding: 80px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .lp-cta-box::before {
    content: '';
    position: absolute;
    top: -100px; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 300px;
    background: radial-gradient(ellipse, rgba(255,92,0,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .lp-cta-box h2 {
    font-size: clamp(36px, 5vw, 62px);
    font-weight: 800;
    letter-spacing: 4px;
    line-height: 1.05;
    margin-bottom: 18px;
    position: relative; z-index: 1;
  }

  .lp-cta-box h2 span { color: var(--orange); }

  .lp-cta-box p {
    font-family: 'Outfit', sans-serif;
    font-size: 17px;
    color: var(--white-dim);
    margin-bottom: 44px;
    font-weight: 300;
    line-height: 1.65;
    position: relative; z-index: 1;
  }

  .lp-cta-buttons {
    display: flex;
    gap: 14px;
    justify-content: center;
    position: relative; z-index: 1;
    flex-wrap: wrap;
  }

  .lp-btn-cta-alt {
    padding: 14px 32px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 10px;
    color: #fff;
    font-size: 15.5px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    font-family: 'Outfit', sans-serif;
    transition: all 0.22s;
    display: flex; align-items: center; gap: 8px;
  }

  .lp-btn-cta-alt:hover {
    background: rgba(255,255,255,0.15);
    transform: translateY(-2px);
  }

  /* ── FOOTER ── */
  .lp-footer {
    background: var(--lp-black-2);
    border-top: 1px solid var(--lp-border);
    padding: 64px 80px 0;
  }

  .lp-footer-top {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    padding-bottom: 52px;
  }

  .lp-footer-col-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--lp-white);
    margin-bottom: 22px;
  }

  .lp-footer-col-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .lp-footer-col-links a {
    color: var(--white-dim);
    text-decoration: none;
    font-family: 'Outfit', sans-serif;
    font-size: 14.5px;
    font-weight: 300;
    transition: color 0.2s;
    cursor: pointer;
  }

  .lp-footer-col-links a:hover { color: var(--lp-white); }

  .lp-footer-bottom {
    border-top: 1px solid var(--lp-border);
    padding: 22px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .lp-footer-copy {
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    font-weight: 300;
  }

  .lp-footer-contact a {
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    text-decoration: none;
    font-weight: 300;
    transition: color 0.2s;
  }

  .lp-footer-contact a:hover { color: var(--white-dim); }

  /* ── MODAL ── */
  .lp-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10,10,10,0.85);
    backdrop-filter: blur(10px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .lp-modal-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  .lp-modal {
    background: var(--lp-black-3);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 24px;
    padding: 52px;
    width: 100%;
    max-width: 460px;
    position: relative;
    transform: scale(0.96) translateY(12px);
    transition: transform 0.3s ease;
    box-shadow: 0 40px 80px rgba(0,0,0,0.6);
    margin: 16px;
  }

  .lp-modal-overlay.open .lp-modal {
    transform: scale(1) translateY(0);
  }

  .lp-modal-close {
    position: absolute;
    top: 20px; right: 22px;
    width: 32px; height: 32px;
    background: var(--white-faint);
    border: 1px solid var(--lp-border);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: var(--white-dim);
    font-size: 16px;
    transition: all 0.2s;
    line-height: 1;
  }

  .lp-modal-close:hover { background: rgba(255,255,255,0.12); color: var(--lp-white); }

  .lp-modal-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 32px;
  }

  .lp-modal h2 {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 6px;
  }

  .lp-modal-subtitle {
    font-size: 14px;
    color: var(--white-dim);
    margin-bottom: 32px;
    font-weight: 300;
  }

  .lp-form-tabs {
    display: flex;
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 28px;
    gap: 4px;
  }

  .lp-tab-btn {
    flex: 1;
    padding: 9px;
    border: none;
    border-radius: 7px;
    background: transparent;
    color: var(--white-dim);
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }

  .lp-tab-btn.active {
    background: var(--orange);
    color: #fff;
  }

  .lp-form-group { margin-bottom: 16px; }

  .lp-form-label {
    display: block;
    font-size: 12.5px;
    color: var(--white-dim);
    margin-bottom: 7px;
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .lp-form-input {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--lp-border);
    border-radius: 10px;
    color: var(--lp-white);
    font-size: 14.5px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }

  .lp-form-input::placeholder { color: rgba(255,255,255,0.25); }
  .lp-form-input:focus { border-color: var(--orange); }

  .lp-form-select {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--lp-border);
    border-radius: 10px;
    color: var(--lp-white);
    font-size: 14.5px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23FF5C00' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1.25em 1.25em;
    padding-right: 2.5rem;
  }

  .lp-form-select:focus { border-color: var(--orange); }
  .lp-form-select option { background: #1C1C1C; }

  .lp-btn-submit {
    width: 100%;
    padding: 13px;
    background: var(--orange);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.22s;
    margin-top: 8px;
  }

  .lp-btn-submit:hover {
    background: var(--orange-light);
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(255,92,0,0.4);
  }

  .lp-modal-footer {
    margin-top: 20px;
    text-align: center;
    font-size: 13px;
    color: var(--white-dim);
  }

  .lp-modal-footer a {
    color: var(--orange);
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .lp-nav { padding: 14px 20px; }
    .lp-nav-links { display: none; }
    .lp-nav-cta { gap: 8px; }
    .lp-btn-ghost {
      padding: 7px 14px;
      font-size: 12.5px;
      border-radius: 7px;
    }
    .lp-btn-orange {
      padding: 7px 14px;
      font-size: 12.5px;
      border-radius: 7px;
    }
    .lp-section { padding: 70px 24px; }
    .lp-features-wrapper { padding: 0 24px; }
    .lp-features-split { grid-template-columns: 1fr; gap: 48px; }
    .lp-how-section { padding: 70px 24px; }
    .lp-how-steps { grid-template-columns: 1fr; }
    .lp-cta-section { padding: 70px 24px; }
    .lp-cta-box { padding: 48px 28px; }
    .lp-cta-buttons { flex-direction: column; align-items: center; }
    .lp-footer { padding: 48px 24px 0; }
    .lp-footer-top { grid-template-columns: 1fr; gap: 36px; }
    .lp-footer-bottom { flex-direction: column; gap: 10px; text-align: center; }
    .lp-modal { padding: 36px 28px; }
    .lp-hero-actions {
      flex-direction: column;
      width: 100%;
      max-width: 300px;
      gap: 12px;
    }
    .lp-btn-hero,
    .lp-btn-hero-ghost {
      width: 100%;
      justify-content: center;
      text-align: center;
    }
  }
`;

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
  const styleRef = useRef(null);

  // Inject scoped styles once
  useEffect(() => {
    if (!document.getElementById('lp-styles')) {
      const el = document.createElement('style');
      el.id = 'lp-styles';
      el.textContent = LANDING_STYLES;
      document.head.appendChild(el);
      styleRef.current = el;
    }
    return () => {
      // cleanup on unmount if the element we created is still there
      const el = document.getElementById('lp-styles');
      if (el) el.remove();
    };
  }, []);

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
