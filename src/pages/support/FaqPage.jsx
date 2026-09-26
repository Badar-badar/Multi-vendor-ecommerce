import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Truck,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  Send,
  MessageSquare,
  Gem,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export const FaqPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');

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
      category: 'shipping',
      question: 'Do you deliver internationally and handle import duties?',
      answer:
        'Yes, Zareen ships to over 80 countries worldwide. All international dispatches are sent Delivered Duty Paid (DDP), meaning all local taxes, VAT, and customs duties are calculated and settled at checkout with zero hidden arrival charges.',
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
    {
      category: 'authenticity',
      question: 'Do pieces come with physical and digital certificates?',
      answer:
        'Every acquisition is accompanied by a physical certificate of authenticity on deckle-edged archival paper signed by the master artisan, along with an immutable cryptographic registry entry.',
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

  const filteredFaqs = faqs.filter((f) => {
    const matchesQuery =
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-16">
      {/* Hero Header */}
      <section className="relative bg-slate-950 text-white py-20 sm:py-28 border-b border-border/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000&auto=format&fit=crop"
            alt="Support & Concierge Knowledge Base"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-accent-light text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Knowledge Base & Assistance
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
            Search comprehensive answers regarding bespoke creations, multi-sig escrow, white-glove shipping, and atelier guarantees.
          </p>
        </div>
      </section>

      {/* Quick Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { id: 'orders', label: 'Orders & Bespoke', icon: Truck, desc: 'Packaging & custom requests' },
            { id: 'payments', label: 'Payments & Escrow', icon: CreditCard, desc: 'Multi-currency & release' },
            { id: 'returns', label: 'Returns & Exchanges', icon: RotateCcw, desc: '14-day inspection window' },
            { id: 'authenticity', label: 'Authenticity & Proof', icon: ShieldCheck, desc: 'Hallmarks & certifications' },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeCategory === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveCategory(isSelected ? 'all' : item.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-2 group shadow-subtle ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-modal'
                    : 'bg-surface border-border hover:border-accent/40'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-surface-muted text-accent group-hover:bg-primary group-hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-text-main'}`}>
                    {item.label}
                  </h4>
                  <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-text-muted'}`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQs & Direct Inquiry Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* FAQ Accordion List (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent block">
                  Curated Solutions
                </span>
                <h2 className="font-serif text-2xl font-bold text-text-main">
                  {activeCategory === 'all' ? 'All Inquiries' : `${activeCategory.toUpperCase()} Inquiries`}
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
              {filteredFaqs.length === 0 ? (
                <div className="bg-surface rounded-2xl border border-border p-8 text-center text-xs text-text-muted">
                  No questions match your query. Feel free to contact our concierge team directly.
                </div>
              ) : (
                filteredFaqs.map((faq, idx) => {
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
                })
              )}
            </div>
          </div>

          {/* Contact Concierge Form (5 cols) */}
          <div className="lg:col-span-5 bg-surface p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
                Direct Assistance
              </span>
              <h3 className="font-serif text-xl font-bold text-text-main">
                Have an Unlisted Question?
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Our support concierge responds within 2 hours with detailed advisory and guidance.
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
                <label className="block font-bold text-text-main mb-1">Email Coordinates *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="v.sterling@estate.co.uk"
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
                  placeholder="Custom sizing / Bespoke request"
                  size="sm"
                />
              </div>

              <div>
                <label className="block font-bold text-text-main mb-1">Message *</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry..."
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
  );
};

export default FaqPage;
