import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RefreshCw,
  Award,
  Mail,
  ArrowRight,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { footerNavigation } from '../../data/navigation';
import Logo from '../common/Logo';

// Inline SVGs for social networks
const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.82 0-1.618.211-1.95.544-.33.332-.423.864-.423 1.98v1.455h3.816l-.507 3.667h-3.309v7.98h-4.708z" />
  </svg>
);

const LinkedInIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.67c-.89 0-1.61.72-1.61 1.61s.72 1.61 1.61 1.61a1.61 1.61 0 0 0 1.61-1.61c0-.89-.72-1.61-1.61-1.61z" />
  </svg>
);

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please provide a valid email address.');
      return;
    }
    setSubscribed(true);
    toast.success('Welcome to The Zareen Gazette. Check your inbox for your welcome privilege.');
    setEmail('');
  };

  return (
    <footer className="bg-surface border-t border-border mt-20 transition-colors">
      {/* Value Propositions / Trust Bar */}
      <div className="border-b border-border bg-surface-muted/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-surface/80 border border-border/60 shadow-subtle">
              <div className="p-2.5 bg-primary/5 rounded-lg text-primary shrink-0">
                <ShieldCheck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">
                  Verified Master Artisans
                </h4>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                  Every atelier is rigorously vetted for provenance & authenticity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-surface/80 border border-border/60 shadow-subtle">
              <div className="p-2.5 bg-primary/5 rounded-lg text-primary shrink-0">
                <Truck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">
                  Global Insured Transit
                </h4>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                  White-glove, carbon-neutral delivery across 80+ countries.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-surface/80 border border-border/60 shadow-subtle">
              <div className="p-2.5 bg-primary/5 rounded-lg text-primary shrink-0">
                <RefreshCw className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">
                  30-Day Effortless Returns
                </h4>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                  Complimentary return shipping and full buyer protection guarantee.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-surface/80 border border-border/60 shadow-subtle">
              <div className="p-2.5 bg-primary/5 rounded-lg text-primary shrink-0">
                <Award className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">
                  Heirloom Grade Standard
                </h4>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                  Crafted with enduring materials meant to last generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand & Newsletter Column (5 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Logo size="lg" />

            <p className="text-xs text-text-muted leading-relaxed max-w-sm">
              Zareen connects discerning global patrons with sovereign master craftspeople, independent luxury ateliers, and rare heritage workshops.
            </p>

            {/* Newsletter Subscription */}
            <div className="p-4 rounded-2xl bg-surface-muted border border-border space-y-3">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-text-main">
                  The Zareen Gazette
                </h5>
                <p className="text-xs text-text-muted mt-0.5">
                  Private previews, artisan spotlights, and seasonal collections.
                </p>
              </div>

              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 bg-success-light border border-emerald-200 rounded-lg text-success-dark text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>You are subscribed to the private registry.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email..."
                      className="w-full pl-8 pr-3 py-2 text-xs bg-surface border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                    <Mail className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-primary text-white hover:bg-primary-hover rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-subtle cursor-pointer"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-medium text-text-muted mr-1">Follow Us:</span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-surface-muted text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors border border-border"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-surface-muted text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors border border-border"
                aria-label="Twitter / X"
              >
                <TwitterIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-surface-muted text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors border border-border"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-surface-muted text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors border border-border"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Navigation Link Columns (8 cols total, 4 sub-columns) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Column 1: Shop & Collections */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-text-main mb-4">
                Collections
              </h5>
              <ul className="space-y-2.5">
                {footerNavigation.shop.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-xs text-text-muted hover:text-text-main transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Customer Care / Concierge */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-text-main mb-4">
                Concierge
              </h5>
              <ul className="space-y-2.5">
                {footerNavigation.support.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-xs text-text-muted hover:text-text-main transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: About Zareen */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-text-main mb-4">
                About Zareen
              </h5>
              <ul className="space-y-2.5">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-xs text-text-muted hover:text-text-main transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Seller & Partners */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-text-main mb-4">
                Sellers & Partners
              </h5>
              <ul className="space-y-2.5">
                {footerNavigation.partners.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-xs text-text-muted hover:text-text-main transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/seller/guidelines"
                    className="text-xs text-text-muted hover:text-text-main transition-colors"
                  >
                    Artisan Standards
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Payment Bar */}
        <div className="border-t border-border mt-14 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-text-muted gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-accent" />
            <p>© {new Date().getFullYear()} Zareen Artisanal Marketplace, Inc. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy" className="hover:text-text-main transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-text-main transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-text-main transition-colors">
              Cookie Preferences
            </Link>
            <Link to="/security" className="hover:text-text-main transition-colors">
              Trust & Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
