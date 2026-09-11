import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Gem, Clock, ArrowLeft } from 'lucide-react';
import Logo from '../common/Logo';

export const AuthLayout = ({
  children,
  title,
  subtitle,
  quote = '“Perfection in craftsmanship is the only sovereign currency.”',
  quoteAuthor = 'Maître Horloger Pierre Laurent, Geneva',
  showBackButton = true,
  backTo = '/',
  backLabel = 'Return to Marketplace',
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* LEFT COLUMN: Sovereign Brand Showcase (Desktop only) */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative text-white flex-col justify-between p-12 overflow-hidden border-r border-border bg-black">
        {/* Full-Visibility Editorial Fashion / Atelier Photography */}
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1400&auto=format&fit=crop"
          alt="Zareen Artisanal Luxury Collection"
          className="absolute inset-0 w-full h-full object-cover object-center scale-100"
        />

        {/* Subtle, crystal clear gradient overlay for text readability without obscuring photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/50 pointer-events-none" />

        {/* Top Header with official luxury logo emblem */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img
              src="/zareen-logo.jpg"
              alt="Zareen Logo"
              className="w-10 h-10 object-cover object-center rounded-xl shadow-lg border border-white/30 group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                Zareen
              </span>
              <span className="text-[10px] uppercase tracking-widest text-white/80 font-semibold">
                Sovereign Registry
              </span>
            </div>
          </Link>
        </div>

        {/* Center Editorial Manifesto & Trust Pillars */}
        <div className="relative z-10 my-auto py-12 space-y-8 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary-light" />
            <span>Curated Sanctuary of Haute Craftsmanship</span>
          </div>

          <div className="space-y-4">
            <h1 className="font-serif text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight drop-shadow-sm">
              {title || 'The Private Salon of Global Artisanship'}
            </h1>
            <p className="text-sm text-white/90 leading-relaxed font-normal drop-shadow-xs">
              {subtitle ||
                'Access your curated acquisitions, commission bespoke timepieces, and interact with master ateliers across the globe.'}
            </p>
          </div>

          {/* Luxury Pillars Checklist */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-white/95">
              <div className="w-6 h-6 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
              <span>Zero-knowledge client privacy with encrypted sessions</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/95">
              <div className="w-6 h-6 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 backdrop-blur-xs">
                <Gem className="w-3.5 h-3.5 text-white" />
              </div>
              <span>100% verified provenance from accredited European ateliers</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/95">
              <div className="w-6 h-6 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 backdrop-blur-xs">
                <Clock className="w-3.5 h-3.5 text-white" />
              </div>
              <span>Insured white-glove concierge dispatch worldwide</span>
            </div>
          </div>

          {/* Curated Testimonial Quote */}
          {quote && (
            <div className="pt-6 border-t border-white/20">
              <p className="font-serif italic text-sm text-white/90 leading-relaxed">
                {quote}
              </p>
              {quoteAuthor && (
                <p className="text-[11px] text-white/75 font-semibold tracking-wide uppercase mt-2">
                  — {quoteAuthor}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom Sovereign Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white/80 border-t border-white/20 pt-6">
          <span>&copy; {new Date().getFullYear()} Zareen Sovereign Maison</span>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Shield
            </Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              Maison Terms
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication Form Area */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 xl:p-16 overflow-y-auto">
        {/* Mobile Top Brand Bar & Return Link */}
        <div className="flex items-center justify-between pb-6 sm:pb-8 w-full max-w-md mx-auto lg:max-w-none">
          <div className="lg:hidden">
            <Logo size="sm" />
          </div>

          {showBackButton && (
            <Link
              to={backTo}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-main transition-colors ml-auto group py-1 px-2.5 rounded-lg hover:bg-surface-muted"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>{backLabel}</span>
            </Link>
          )}
        </div>

        {/* Center Form Wrapper */}
        <div className="w-full max-w-md mx-auto my-auto py-4 sm:py-6">
          {children}
        </div>

        {/* Mobile Footer */}
        <div className="lg:hidden text-center text-xs text-text-subtle pt-6 border-t border-border mt-auto">
          <span>&copy; {new Date().getFullYear()} Zareen Sovereign Maison. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
