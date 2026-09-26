import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Truck,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  Send,
  Sparkles,
  FileText,
  Lock,
  Cookie,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export const SupportPage = () => {
  const location = useLocation();

  const getActiveTabFromPath = () => {
    if (location.pathname.includes('terms')) return 'terms';
    if (location.pathname.includes('privacy')) return 'privacy';
    if (location.pathname.includes('shipping')) return 'shipping';
    if (location.pathname.includes('returns')) return 'returns';
    if (location.pathname.includes('cookies') || location.pathname.includes('security')) return 'security';
    return 'faq';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    subject: '',
    message: '',
  });

  const faqs = [
    {
      category: 'orders',
      question: 'How are luxury creations packaged and dispatched?',
      answer:
        'All acquisitions on Zareen are individually authenticated and packaged in temperature-controlled, shock-resistant bespoke presentation boxes sealed with security tamper indicators. High-value jewelry and horology ship with Ferrari Armored Express or Brinks Global Logistics.',
    },
    {
      category: 'orders',
      question: 'Can I request bespoke personalization or custom sizing?',
      answer:
        'Yes. Many accredited ateliers offer bespoke engraving, sizing adjustments, and custom gem setting. You can specify custom requirements in order notes or contact our private concierge before placement.',
    },
    {
      category: 'shipping',
      question: 'What is the complimentary shipping policy?',
      answer:
        'Zareen provides complimentary fully insured white-glove shipping on all purchases exceeding $200. Orders below $200 incur a standard flat carrier fee of $15.00.',
    },
    {
      category: 'payments',
      question: 'How does Zareen Escrow Protection work?',
      answer:
        'When you place an order, your payment is held securely in Zareen Multi-Sig Escrow. Funds are only disbursed to the artisan atelier after delivery inspection and the expiration of our 14-day return window.',
    },
    {
      category: 'returns',
      question: 'What is the return and refund policy?',
      answer:
        'You have 14 days from delivery to initiate a complimentary return. Items must be in pristine, unworn condition with original security seals and certificates intact.',
    },
    {
      category: 'authenticity',
      question: 'How do you verify independent ateliers and raw materials?',
      answer:
        'Each atelier undergoes exhaustive physical and legal accreditation. Precious metals must carry Swiss Bureau de Contrôle or British Assay hallmarks, and gemstones must comply with the Kimberley Protocol.',
    },
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Inquiry received. A Zareen Concierge will reply within 2 hours.');
    setFormData({
      name: '',
      email: '',
      orderNumber: '',
      subject: '',
      message: '',
    });
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-12 sm:space-y-16">
      {/* Hero with High-Resolution Backdrop */}
      <section className="relative bg-slate-950 text-white py-16 sm:py-24 border-b border-border/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000&auto=format&fit=crop"
            alt="Private Client Concierge Hub"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-accent-light text-xs font-semibold backdrop-blur-md border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Private Concierge & Legal Charter</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            How May We Assist You?
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
            Review governance protocols, white-glove transit policies, multi-sig escrow protection, and frequently answered inquiries.
          </p>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-surface p-2 rounded-2xl border border-border shadow-modal flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'faq', label: 'FAQs & Inquiries', icon: HelpCircle, path: '/faq' },
            { id: 'shipping', label: 'Shipping & Delivery', icon: Truck, path: '/shipping-policy' },
            { id: 'returns', label: 'Returns & Exchanges', icon: RotateCcw, path: '/returns' },
            { id: 'terms', label: 'Terms of Service', icon: FileText, path: '/terms' },
            { id: 'privacy', label: 'Privacy Policy', icon: Lock, path: '/privacy' },
            { id: 'security', label: 'Cookies & Security', icon: Cookie, path: '/cookies' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-muted hover:text-text-main hover:bg-surface-muted'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* TAB 1: FAQ & CONTACT INQUIRIES */}
      {activeTab === 'faq' && (
        <div className="space-y-12">
          {/* Quick Category Guides */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { id: 'orders', label: 'Orders & Tracking', icon: Truck, desc: 'Dispatch & armored delivery' },
                { id: 'payments', label: 'Payments & Escrow', icon: CreditCard, desc: 'Multi-currency & protection' },
                { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw, desc: '14-day inspection window' },
                { id: 'authenticity', label: 'Authenticity Charter', icon: ShieldCheck, desc: 'Museum provenance guarantee' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSearchQuery(item.label.split(' ')[0])}
                    className="bg-surface p-4 sm:p-5 rounded-2xl border border-border shadow-subtle hover:border-accent/40 hover:shadow-card transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface-muted group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center text-accent">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-text-main group-hover:text-accent transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-[11px] text-text-muted mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FAQs & Contact Form Grid */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* FAQ Accordion (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
                      Frequent Inquiries
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-text-main">
                      Frequently Asked Questions
                    </h2>
                  </div>

                  <div className="w-full sm:w-64">
                    <Input
                      placeholder="Search questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      leftIcon={Search}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredFaqs.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div
                        key={idx}
                        className="bg-surface rounded-2xl border border-border shadow-subtle overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <span className="font-bold text-xs sm:text-sm text-text-main">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 text-xs text-text-muted leading-relaxed border-t border-border/50 pt-3">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact Support Form (5 cols) */}
              <div className="lg:col-span-5 bg-surface p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
                    Direct Inquiry
                  </span>
                  <h3 className="font-serif text-xl font-bold text-text-main">
                    Contact Private Concierge
                  </h3>
                  <p className="text-xs text-text-muted mt-1">
                    Our support team is available 24/7 for order consultations, returns, and valuation inquiries.
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-text-main mb-1">Your Full Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Lady Vivienne Sterling"
                      size="sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-text-main mb-1">Email Address *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="v.sterling@mayfair.co.uk"
                      size="sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-text-main mb-1">Order Number (Optional)</label>
                    <Input
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="e.g. ZRN-2026-9821"
                      size="sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-text-main mb-1">Subject</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Custom Sizing / Gemstone Advisory"
                      size="sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-text-main mb-1">Message *</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your inquiry with specificity..."
                      className="w-full p-3 bg-surface border border-border rounded-xl text-text-main focus:outline-none focus:border-text-main leading-relaxed resize-none"
                      required
                    />
                  </div>

                  <Button variant="primary" size="md" type="submit" className="w-full" rightIcon={Send}>
                    Transmit Concierge Inquiry
                  </Button>
                </form>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: SHIPPING & DELIVERY */}
      {activeTab === 'shipping' && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Armored White-Glove Transit
            </span>
            <h2 className="font-serif text-3xl font-bold text-text-main">
              Shipping, Valuation & Customs Policy
            </h2>
          </div>

          <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 space-y-6 text-sm text-text-muted leading-relaxed shadow-subtle">
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg text-text-main">1. Complimentary Insured Global Transit</h3>
              <p>
                All acquisitions exceeding $200 USD automatically receive complimentary worldwide courier dispatch via authorized high-security carriers (Ferrari Armored, Brinks Global, or DHL Express Private).
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg text-text-main">2. Transit Insurance & Adult Signature Verification</h3>
              <p>
                Every package is insured up to $500,000 against loss or damage in transit. Delivery requires government-issued photographic identification and direct signature from the named recipient.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg text-text-main">3. Customs, Duties & VAT Exemption</h3>
              <p>
                For international dispatches, applicable import duties and VAT are calculated upfront at checkout (DDP terms) with no hidden courier brokerage fees upon arrival.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: RETURNS & EXCHANGES */}
      {activeTab === 'returns' && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              14-Day Inspection Window
            </span>
            <h2 className="font-serif text-3xl font-bold text-text-main">
              Effortless Returns & Escrow Guarantees
            </h2>
          </div>

          <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 space-y-6 text-sm text-text-muted leading-relaxed shadow-subtle">
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg text-text-main">1. 14-Day Complimentary Return Window</h3>
              <p>
                You may initiate a return within 14 calendar days of receiving your acquisition. Items must remain in pristine, unworn condition with all certificates and security tamper tags intact.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg text-text-main">2. Multi-Sig Escrow Protection</h3>
              <p>
                Your acquisition funds remain securely held in Zareen multi-sig escrow throughout the 14-day inspection period. In the event of a verified return, funds are immediately credited back to your original payment method.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg text-text-main">3. Return Courier Dispatch</h3>
              <p>
                Zareen coordinates complimentary insured courier pick-up directly from your residence or office.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: TERMS OF SERVICE */}
      {activeTab === 'terms' && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Patron Governance Charter
            </span>
            <h2 className="font-serif text-3xl font-bold text-text-main">
              Terms of Service & Atelier Compact
            </h2>
            <p className="text-xs text-text-muted">Last updated: Autumn 2026</p>
          </div>

          <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 space-y-6 text-sm text-text-muted leading-relaxed shadow-subtle">
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-lg text-text-main">1. Acceptance of Terms</h3>
              <p>
                By registering an account, placing an acquisition, or commissioning bespoke works through Zareen Luxury Marketplace, you agree to be bound by these Terms of Service.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-lg text-text-main">2. Sovereign Artisan Direct Contract</h3>
              <p>
                Each sale is concluded directly between the purchasing patron and the independent accredited atelier. Zareen acts as the sovereign curatorial platform and escrow guarantor.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-lg text-text-main">3. Intellectual Property & Bespoke Designs</h3>
              <p>
                All jewelry molds, tailoring patterns, and horological complication designs remain the exclusive intellectual property of the originating master craftsperson.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-lg text-text-main">4. Governing Law & Arbitration</h3>
              <p>
                Any unresolved disputes shall be adjudicated under the Swiss Chamber of Commercial Mediation (Geneva) or the LCIA (London).
              </p>
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: PRIVACY POLICY */}
      {activeTab === 'privacy' && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Zero-Knowledge Privacy
            </span>
            <h2 className="font-serif text-3xl font-bold text-text-main">
              Privacy Policy & Patron Data Protocol
            </h2>
            <p className="text-xs text-text-muted">GDPR, Swiss FADP, and CCPA Compliant</p>
          </div>

          <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 space-y-6 text-sm text-text-muted leading-relaxed shadow-subtle">
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-lg text-text-main">1. Minimalist Data Collection</h3>
              <p>
                We only collect data strictly necessary to fulfill delivery, verify authenticity, and comply with tax and anti-money-laundering regulations. We never monetize, sell, or profile your private collection history.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-lg text-text-main">2. End-to-End Encryption</h3>
              <p>
                All communications between patrons and master ateliers are encrypted in transit with TLS 1.3 and stored at rest on sovereign European cloud infrastructure.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-lg text-text-main">3. Right to Erasure</h3>
              <p>
                You may request complete account deactivation and registry purging directly from your account settings at any time.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* TAB 6: COOKIES & SECURITY */}
      {activeTab === 'security' && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Sentinel Architecture
            </span>
            <h2 className="font-serif text-3xl font-bold text-text-main">
              Cookies & Platform Security Charter
            </h2>
          </div>

          <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 space-y-6 text-sm text-text-muted leading-relaxed shadow-subtle">
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-lg text-text-main">1. Essential Session Cookies Only</h3>
              <p>
                Zareen utilizes strictly essential cookies to maintain secure authenticated logins, protect shopping carts, and preserve localized currency preferences.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-lg text-text-main">2. Sentinel Fraud & Anti-Spam Screening</h3>
              <p>
                Automated heuristic screening protects collectors and sellers from phishing attempts and unauthorized account takeovers.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SupportPage;
