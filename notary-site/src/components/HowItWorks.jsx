'use client'

import { useState, useEffect, memo, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { useTranslation } from '../hooks/useTranslation';
import { trackCTAToForm, trackCTAToFormOnService } from '../utils/gtm';

// ANALYTICS DIFFÉRÉS - Plausible + Segment (GA4)
let trackCTAClick = null;

// Charger Analytics (Plausible + Segment) de manière non-bloquante
const loadAnalytics = () => {
  if (trackCTAClick) return;
  import('../utils/analytics').then((analytics) => {
    trackCTAClick = analytics.trackCTAClick;
  }).catch(() => {});
};

// Helper pour tracker de manière non-bloquante
const safeTrack = (fn, ...args) => {
  if (fn) {
    try { fn(...args); } catch { /* ignore */ }
  }
};

// Précharger après 2s
if (typeof window !== 'undefined') {
  setTimeout(loadAnalytics, 2000);
}

// SVG Icons inline pour éviter @iconify/react (300ms de latence)
const IconUpload = memo(({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
));
const IconPeople = memo(({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
));
const IconCreditCard = memo(({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
    <path d="M9 16l2-2 2 2 4-4-1.41-1.41L12 14.17l-1.59-1.59L9 14z" fill="currentColor"/>
  </svg>
));
const IconIdentityCard = memo(({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 6h16v2H4V6zm0 12v-8h16v8H4zm2-6h4v1H6v-1zm0 2h4v1H6v-1zm6-2h6v1h-6v-1zm0 2h4v1h-4v-1z"/>
  </svg>
));
const IconCheck = memo(({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
));
const IconAccountCheck = memo(({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.1 12.5l1.4 1.41-6.53 6.59L12.5 17l1.4-1.41 2.07 2.08 5.13-5.17M10 17l3 3H3v-2c0-2.21 3.58-4 8-4l1.89.11L10 17m1-13a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z"/>
  </svg>
));
const IconVideoCall = memo(({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
));
const IconOpenNew = memo(({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
));

// Map des icônes par nom
const STEP_ICONS = {
  'line-md:uploading-loop': IconUpload,
  'formkit:people': IconPeople,
  'mynaui:credit-card-check-solid': IconCreditCard,
  'hugeicons:identity-card': IconIdentityCard,
  'stash:check-solid': IconCheck,
  'mdi:account-check': IconAccountCheck,
  'mdi:video': IconVideoCall,
};

const STEP_ANIMATION_STYLES = `
.hiw-anim-screen {
  width: 100%;
  aspect-ratio: 16 / 10;
  background: linear-gradient(180deg, #f6f7fb 0%, #eef1f6 100%);
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.10);
  padding: 18px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.hiw-anim-topbar {
  height: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding-left: 2px;
}
.hiw-anim-dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
}
.hiw-anim-body {
  position: relative;
  flex: 1;
  margin-top: 0;
  background: linear-gradient(180deg, #f8f9fb 0%, #e9edf3 100%);
  border-radius: 14px;
  padding: 0;
  overflow: hidden;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
}
.hiw-anim-text-sm {
  font-size: 12px;
  color: #0f172a;
  font-weight: 600;
}
.hiw-anim-text-xs {
  font-size: 11px;
  color: #475569;
  font-weight: 500;
}
.hiw-anim-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #0f172a;
  font-weight: 700;
  font-size: 12px;
  box-shadow: 0 4px 14px rgba(15,23,42,0.08);
}
.hiw-anim-pill.blue {
  background: #e0f2fe;
  color: #0ea5e9;
}
.hiw-anim-pill.green {
  background: #ecfdf3;
  color: #15803d;
}
.hiw-anim-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 11px;
  font-weight: 700;
}
.hiw-anim-body::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.14), transparent 35%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.14), transparent 40%);
  pointer-events: none;
  mix-blend-mode: screen;
}
.hiw-anim-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  gap: 10px;
  height: 100%;
}
.hiw-anim-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 4px 16px rgba(15, 23, 42, 0.06);
  position: relative;
  overflow: hidden;
}
.hiw-anim-card.hot {
  animation: hiw-zoom 5s infinite ease-in-out;
}
.hiw-anim-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 9999px;
  background: #eef2ff;
  color: #4338ca;
  font-weight: 600;
  font-size: 12px;
}
.hiw-anim-line {
  height: 8px;
  border-radius: 9999px;
  background: linear-gradient(90deg, #e2e8f0, #cbd5e1);
}
.hiw-anim-line.dark {
  background: linear-gradient(90deg, #1f2937, #334155);
}
.hiw-anim-bubble {
  border-radius: 14px;
  background: #e2e8f0;
}
.hiw-anim-accent {
  background: linear-gradient(90deg, #a855f7, #6366f1);
}
.hiw-anim-pointer {
  position: absolute;
  width: 34px;
  height: 34px;
  background-image: url('data:image/svg+xml;utf8,<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30.5 9c-2.2 0-4 1.8-4 4v19.5l-2.9-3.6c-1.5-1.8-4.2-2-5.9-0.4-1.6 1.5-1.7 4.1-0.2 5.7l9.3 10.2 2.2 10c0.4 1.8 2 3.1 3.8 3.1h7.8c1.8 0 3.3-1.2 3.8-2.9l4-13.3c0.1-0.3 0.1-0.6 0.1-0.9V19c0-2.2-1.8-4-4-4-0.9 0-1.8 0.3-2.5 0.8-0.7-1.2-2-2-3.5-2-0.9 0-1.8 0.3-2.5 0.8C35.6 11.3 33.3 9 30.5 9Z" fill="%230f172a" stroke="%230f172a" stroke-width="2" stroke-linejoin="round"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  left: var(--p-start-x);
  top: var(--p-start-y);
  transform: translate(-10%, -10%);
  animation: hiw-pointer-move 5s infinite ease-in-out;
  filter: drop-shadow(0 6px 8px rgba(15, 23, 42, 0.25));
  z-index: 5;
}
.hiw-anim-click {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  border: 2px solid #0f172a;
  left: var(--click-x);
  top: var(--click-y);
  transform: translate(-50%, -50%);
  animation: hiw-click 5s infinite ease-in-out;
  opacity: 0;
  z-index: 4;
}
.hiw-col-3 { grid-column: span 3 / span 3; }
.hiw-col-4 { grid-column: span 4 / span 4; }
.hiw-col-5 { grid-column: span 5 / span 5; }
.hiw-col-6 { grid-column: span 6 / span 6; }
.hiw-col-7 { grid-column: span 7 / span 7; }
.hiw-col-8 { grid-column: span 8 / span 8; }
.hiw-col-9 { grid-column: span 9 / span 9; }
.hiw-row-2 { grid-row: span 2 / span 2; }
.hiw-row-3 { grid-row: span 3 / span 3; }
.hiw-row-4 { grid-row: span 4 / span 4; }
.hiw-row-5 { grid-row: span 5 / span 5; }
.hiw-anim-chip {
  background: #e5e7eb;
  border-radius: 10px;
  height: 18px;
}
.hiw-anim-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  background: #ecfeff;
  color: #0ea5e9;
  font-weight: 700;
  font-size: 11px;
}
.hiw-anim-avatar {
  width: 32px;
  height: 32px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
}
.hiw-anim-progress {
  width: 100%;
  height: 10px;
  border-radius: 9999px;
  background: #e2e8f0;
  position: relative;
  overflow: hidden;
}
.hiw-anim-progress::after {
  content: '';
  position: absolute;
  inset: 0;
  width: 65%;
  background: linear-gradient(90deg, #22d3ee, #6366f1);
  border-radius: 9999px;
  animation: hiw-progress 5s infinite ease-in-out;
}
.hiw-anim-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  background: linear-gradient(90deg, #16a34a, #22c55e);
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.35);
  animation: hiw-cta 5s infinite ease-in-out;
}
.hiw-anim-cta.secondary {
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
}
.hiw-anim-playbar {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 10px;
  height: 6px;
  border-radius: 9999px;
  background: rgba(255,255,255,0.55);
  overflow: hidden;
  box-shadow: inset 0 1px 1px rgba(0,0,0,0.06);
}
.hiw-anim-playhead {
  position: absolute;
  top: -4px;
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  background: #0ea5e9;
  box-shadow: 0 6px 18px rgba(14,165,233,0.3);
  animation: hiw-play 5s infinite ease-in-out;
}
.hiw-anim-playfill {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(14,165,233,0.25), rgba(99,102,241,0.3));
  animation: hiw-fill 5s infinite ease-in-out;
}
.hiw-anim-window {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 12px 36px rgba(15,23,42,0.10);
  overflow: hidden;
}
.hiw-anim-window video {
  border-radius: 12px;
}
.hiw-anim-window .hiw-anim-topbar {
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
}
.hiw-anim-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 4px 10px;
}
.hiw-anim-h1 {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}
.hiw-anim-sub {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}
.hiw-anim-card-soft {
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
  background: #f8fafc;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #0f172a;
  gap: 6px;
  padding: 20px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
}
.hiw-anim-tabrow {
  display: flex;
  gap: 10px;
  padding: 8px 12px;
  border-bottom: 1px solid #eef2f7;
}
.hiw-anim-tab {
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 10px;
  font-weight: 700;
  font-size: 12px;
  color: #0f172a;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
}
.hiw-anim-tab.active {
  background: linear-gradient(90deg, #e0f2fe, #eef2ff);
  color: #1d4ed8;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 18px rgba(59,130,246,0.18);
}
.hiw-anim-floating {
  animation: hiw-float 6s infinite ease-in-out;
}
.hiw-anim-breath {
  animation: hiw-breath 5s infinite ease-in-out;
}
.hiw-anim-badge.glow {
  box-shadow: 0 0 0 10px rgba(14, 165, 233, 0.08);
}
.hiw-anim-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 9999px;
  background: #ecfdf3;
  color: #15803d;
  font-weight: 700;
  font-size: 11px;
}
.hiw-anim-video {
  background: linear-gradient(135deg, #0f172a, #1f2937);
  color: #e2e8f0;
}
.hiw-anim-dot-green { background: #34d399; }
.hiw-anim-dot-yellow { background: #fbbf24; }
.hiw-anim-dot-red { background: #f97316; }
@keyframes hiw-zoom {
  0%, 100% { transform: scale(1); box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 6px 24px rgba(99, 102, 241, 0.18); }
  45% { transform: scale(1.03); box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 10px 30px rgba(79, 70, 229, 0.25); }
}
@keyframes hiw-pointer-move {
  0%, 100% { left: var(--p-start-x); top: var(--p-start-y); transform: translate(-10%, -10%) scale(1); }
  40% { left: var(--p-mid-x); top: var(--p-mid-y); transform: translate(-10%, -10%) scale(1.05); }
  70% { left: var(--p-end-x); top: var(--p-end-y); transform: translate(-10%, -10%) scale(1); }
}
@keyframes hiw-click {
  0%, 32%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
  40% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.6); }
  55% { opacity: 0; transform: translate(-50%, -50%) scale(2.3); }
}
@keyframes hiw-progress {
  0%, 100% { width: 50%; }
  40% { width: 85%; }
  70% { width: 70%; }
}
@keyframes hiw-cta {
  0%, 100% { transform: translateY(0) scale(1); }
  45% { transform: translateY(-2px) scale(1.02); }
}
  @keyframes hiw-play {
    0%, 100% { left: 0%; }
    50% { left: 72%; }
  }
  @keyframes hiw-fill {
    0%, 100% { width: 20%; }
    50% { width: 80%; }
  }
@keyframes hiw-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
@keyframes hiw-breath {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 1; }
}
@media (max-width: 640px) {
  .hiw-anim-screen {
    padding: 12px;
    border-radius: 14px;
  }
  .hiw-anim-body {
    padding: 0;
  }
  .hiw-anim-window {
    border-radius: 12px;
  }
  .hiw-anim-window video {
    border-radius: 12px;
  }
}
`;

function StepAnimation({ step }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const baseUrl = 'https://jlizwheftlnhoifbqeex.supabase.co/storage/v1/object/public/assets/how-it-work';
  const videoSrc = `${baseUrl}/step-${step}.mp4`;

  // Lazy load video when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Pour les étapes 1, 2, 3, 4 et 5, utiliser un mockup simplifié adapté au ratio de l'image
  const stepImages = {
    1: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/85d45789-02dc-4348-52df-29e59d5c1b00/public',
    3: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/fb0fc312-6e68-4ae3-034b-6920c1e4f200/public',
    4: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/84ecd9c9-6cee-4d05-46d2-f5a75cd5d900/public',
    5: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/451be27c-b409-4593-0bfc-128e5a17c000/public',
    6: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/2c9ff509-7aec-4530-da59-351a2df18500/public',
  };

  if (stepImages[step]) {
    return (
      <div 
        ref={containerRef}
        className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100 shadow-lg"
      >
        <div className="flex items-center gap-1.5 px-4 py-3 bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200">
          <span className="w-3 h-3 rounded-full bg-orange-400"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="w-3 h-3 rounded-full bg-green-400"></span>
        </div>
        {isVisible && (
          <img
            src={stepImages[step]}
            alt={`Step ${step}`}
            className="w-full h-auto block"
          />
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="hiw-anim-screen" data-step={step}>
      <div className="hiw-anim-topbar">
        <span className="hiw-anim-dot hiw-anim-dot-red"></span>
        <span className="hiw-anim-dot hiw-anim-dot-yellow"></span>
        <span className="hiw-anim-dot hiw-anim-dot-green"></span>
      </div>
      <div className="hiw-anim-body">
        <div className="hiw-anim-window" style={{ height: '100%' }}>
          {isVisible && (
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="w-full h-full object-cover rounded-xl pointer-events-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}

const HowItWorks = memo(() => {
  const pathname = usePathname();
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  // Extraire le serviceId depuis l'URL (pas d'appel API pour éviter CLS)
  const currentServiceId = useMemo(() => {
    const path = pathname || '';
    const serviceMatch = path.match(/^\/services\/([^/]+)/);
    return serviceMatch ? decodeURIComponent(serviceMatch[1]) : null;
  }, [pathname]);

  const steps = useMemo(() => [
    {
      icon: 'line-md:uploading-loop',
      title: t('howItWorks.step1.title'),
      subtitle: t('howItWorks.step1.subtitle'),
      description: t('howItWorks.step1.description'),
      videoStep: 1,
    },
    {
      icon: 'mynaui:credit-card-check-solid',
      title: t('howItWorks.step2.title'),
      subtitle: t('howItWorks.step2.subtitle'),
      description: t('howItWorks.step2.description'),
      videoStep: 3,
    },
    {
      icon: 'hugeicons:identity-card',
      title: t('howItWorks.step3.title'),
      subtitle: t('howItWorks.step3.subtitle'),
      description: t('howItWorks.step3.description'),
      videoStep: 4,
    },
    {
      icon: 'mdi:account-check',
      title: t('howItWorks.step4.title'),
      subtitle: t('howItWorks.step4.subtitle'),
      description: t('howItWorks.step4.description'),
      videoStep: 5,
    },
    {
      icon: 'mdi:video',
      title: t('howItWorks.step5.title'),
      subtitle: t('howItWorks.step5.subtitle'),
      description: t('howItWorks.step5.description'),
      videoStep: 6,
    }
  ], [t]);

  // Observer pour détecter l'étape active pendant le scroll
  useEffect(() => {
    const observers = [];
    const options = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0
    };

    stepRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStep(index);
            }
          });
        }, options);
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [steps.length]);

  return (
    <section id="how-it-works" className="pt-16 pb-10 md:pt-24 md:pb-26 lg:pt-32 px-2 md:px-6 bg-gray-50 relative" style={{ minHeight: '100vh' }}>
      <style>{STEP_ANIMATION_STYLES}</style>
      <div className="max-w-[1300px] mx-auto">
        {/* Mobile Header */}
        <div className="text-center mb-8 md:hidden px-2">
          <div className="inline-block px-3 py-1.5 bg-black text-white rounded-full text-sm font-semibold mb-3 scroll-fade-in">
            {t('howItWorks.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 scroll-slide-up">
            {t('howItWorks.heading').split(' ').slice(0, -1).join(' ')} <span>{t('howItWorks.heading').split(' ').slice(-1)[0]}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto scroll-slide-up">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Desktop Layout: Sticky Title/Subtitle Left + Steps Right */}
        <div className="hidden md:grid md:grid-cols-[1fr_2fr] md:gap-8 lg:gap-14">
          {/* Sticky Left Column - Title & Subtitle */}
          <div className="hiw-sticky-left">
            <div className="mb-6">
              <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-6 scroll-fade-in">
                {t('howItWorks.badge')}
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 scroll-slide-up leading-tight">
              {t('howItWorks.heading').split(' ').slice(0, -1).join(' ')} <span>{t('howItWorks.heading').split(' ').slice(-1)[0]}</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 scroll-slide-up leading-relaxed mb-8">
              {t('howItWorks.subtitle')}
            </p>
            
            {/* Liste des étapes avec indicateur actif */}
            <nav className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-sm lg:text-base transition-all duration-300 cursor-pointer ${
                    activeStep === index 
                      ? 'text-blue-600 font-semibold' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  onClick={() => {
                    stepRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                >
                  <span className={`transition-all duration-300 ${activeStep === index ? 'opacity-100' : 'opacity-0'}`}>
                    →
                  </span>
                  <span className={`transition-all duration-300 ${activeStep === index ? 'translate-x-0' : '-translate-x-4'}`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </nav>
          </div>

          {/* Right Column - Steps List */}
          <div className="relative">
            <div className="space-y-20">
              {steps.map((step, index) => (
                <div
                  key={index}
                  ref={(el) => (stepRefs.current[index] = el)}
                  className="scroll-slide-up"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Animated Illustration */}
                  <div className="mb-[10px] w-full">
                    <StepAnimation step={step.videoStep} />
                  </div>
                  
                  {/* Text Block - Below Illustration */}
                <div className="grid grid-cols-[auto,1fr] gap-3 items-center">
                    {(() => { const StepIcon = STEP_ICONS[step.icon]; return StepIcon ? <StepIcon className="w-4 h-4 lg:w-5 lg:h-5 text-gray-900 flex-shrink-0 mt-0.5" /> : null; })()}
                  <div className="flex items-center">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 leading-tight">
                        {step.title}
                        {step.subtitle && (
                          <span className="text-xs lg:text-sm text-gray-500 font-normal ml-2">
                            {step.subtitle}
                          </span>
                        )}
                      </h3>
                    </div>
                    <p className="col-span-2 text-sm lg:text-base text-gray-600 leading-relaxed">
                      {step.videoStep === 6 ? (
                        <>
                          {step.description.split('My Notary dashboard')[0]}
                          <a href="https://app.mynotary.io/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">My Notary dashboard</a>
                          {step.description.split('My Notary dashboard')[1]}
                        </>
                      ) : step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Steps */}
        <div className="md:hidden relative px-4">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className="scroll-slide-up"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="mb-5">
                  <StepAnimation step={step.videoStep} />
                </div>
                <div className="space-y-3">
                  <span className="text-gray-400 text-sm font-medium">
                    {index + 1}/{steps.length}
                  </span>
                  <div className="flex items-center gap-3">
                    {(() => { const StepIcon = STEP_ICONS[step.icon]; return StepIcon ? <StepIcon className="w-5 h-5 text-gray-900 flex-shrink-0" /> : null; })()}
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      {step.title}
                    </h3>
                  </div>
                  {step.subtitle && (
                    <p className="text-gray-500 text-sm">{step.subtitle}</p>
                  )}
                  <p className="text-gray-600 text-base leading-relaxed pt-1">
                    {step.videoStep === 6 ? (
                      <>
                        {step.description.split('My Notary dashboard')[0]}
                        <a href="https://app.mynotary.io/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">My Notary dashboard</a>
                        {step.description.split('My Notary dashboard')[1]}
                      </>
                    ) : step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom CTA - Full Width avec fond gris et vagues */}
      <div 
        className="py-16 md:py-24 animate-fade-in animation-delay-1000 mt-16 md:mt-32 relative overflow-hidden"
        style={{ 
          backgroundColor: '#f3f4f6',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          width: '100vw',
          maxWidth: '100vw'
        }}
      >
        {/* Vagues décoratives */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none" viewBox="0 0 1440 560">
          <path d="M0,160 C320,220 420,100 720,160 C1020,220 1120,100 1440,160 L1440,0 L0,0 Z" fill="none" stroke="#9ca3af" strokeWidth="1.5"/>
          <path d="M0,240 C320,300 420,180 720,240 C1020,300 1120,180 1440,240" fill="none" stroke="#9ca3af" strokeWidth="1.5"/>
          <path d="M0,320 C320,380 420,260 720,320 C1020,380 1120,260 1440,320" fill="none" stroke="#9ca3af" strokeWidth="1.5"/>
          <path d="M0,400 C320,460 420,340 720,400 C1020,460 1120,340 1440,400" fill="none" stroke="#9ca3af" strokeWidth="1.5"/>
          <path d="M0,480 C320,540 420,420 720,480 C1020,540 1120,420 1440,480 L1440,560 L0,560 Z" fill="none" stroke="#9ca3af" strokeWidth="1.5"/>
        </svg>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 leading-tight">
            {t('howItWorks.ctaTitle')}
          </h3>
          <p className="text-lg md:text-xl text-gray-800 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('howItWorks.ctaDescription')}
          </p>
          <a
            href={getFormUrl(currency, currentServiceId)}
            className="text-sm md:text-lg inline-flex items-center gap-3 px-6 py-3 rounded-lg font-medium bg-black text-white hover:bg-gray-800 whitespace-nowrap justify-center transition-colors duration-200"
            onClick={() => {
              loadAnalytics();
              safeTrack(trackCTAClick, 'how_it_works', currentServiceId, pathname, {
                ctaText: t('nav.notarizeNow'),
                destination: getFormUrl(currency, currentServiceId),
                elementId: 'how_it_works_cta'
              });
              // Track GTM event (uniquement sur pages non-services)
              trackCTAToForm('how_it_works', pathname, t('nav.notarizeNow'), getFormUrl(currency, currentServiceId), 'how_it_works_cta', currentServiceId, currency);
              // Track GTM event (uniquement sur pages services)
              trackCTAToFormOnService('how_it_works', pathname, t('nav.notarizeNow'), getFormUrl(currency, currentServiceId), 'how_it_works_cta', currentServiceId, currency);
            }}
          >
            <IconOpenNew className="w-5 h-5" />
            <span className="btn-text inline-block">
              {t('nav.notarizeNow')}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
});

HowItWorks.displayName = 'HowItWorks';

export default HowItWorks;
