import { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Truck,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';

export const SupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const [activeCategory, setActiveCategory] = useState('orders');

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
    <div className="min-h-screen bg-background text-text-main pb-20">
      {/* Hero */}
      <section className="bg-primary text-white py-14 lg:py-20 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-accent-light text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Private Concierge & Support Hub</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            How May We Assist You?
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Search our knowledge base for answers on orders, insured courier transit, escrow security, and bespoke atelier requests.
          </p>

          <div className="max-w-md mx-auto pt-2">
            <Input
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={Search}
              size="md"
              className="bg-white/95 text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Quick Category Guides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FAQ Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
                Frequent Inquiries
              </span>
              <h2 className="font-serif text-2xl font-bold text-text-main">
                Frequently Asked Questions
              </h2>
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
                <label className="block font-bold text-text-main mb-1">Inquiry Subject</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Custom sizing / Transit question..."
                  size="sm"
                />
              </div>

              <div>
                <label className="block font-bold text-text-main mb-1">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our concierge assist your acquisition?"
                  className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary h-24"
                  required
                />
              </div>

              <div className="pt-2">
                <Button variant="primary" size="md" fullWidth rightIcon={Send} type="submit">
                  Send to Concierge
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
