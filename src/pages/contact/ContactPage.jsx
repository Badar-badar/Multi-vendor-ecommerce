import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Send,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import Textarea from '../../components/forms/Textarea';
import Select from '../../components/forms/Select';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Advisory & Sizing',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Your private concierge dispatch has been transmitted.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Order Advisory & Sizing',
        message: '',
      });
    }, 600);
  };

  const salons = [
    { city: 'Geneva Salon', address: 'Rue du Rhône 12, 1204 Genève', phone: '+41 22 819 9000' },
    { city: 'Paris Atelier', address: 'Place Vendôme 8, 75001 Paris', phone: '+33 1 42 68 55 00' },
    { city: 'London Mayfair', address: '14 Mayfair Gardens, London W1K', phone: '+44 20 7946 0912' },
  ];

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-16">
      {/* Header Banner with High-Resolution Backdrop */}
      <section className="relative bg-slate-950 text-white py-16 sm:py-24 border-b border-border/80 overflow-hidden">
        {/* High-Resolution Showroom Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000&auto=format&fit=crop"
            alt="Private Client Concierge Salon"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-accent-light text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Private Client Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Dialogue with Our Concierge
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
            Our private advisors assist with bespoke commissions, fine jewelry sizing, and white-glove courier logistics worldwide.
          </p>
        </div>
      </section>

      {/* Main Form & Coordinates Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-subtle space-y-6">
            <div>
              <h2 className="font-serif font-bold text-xl text-text-main">
                Transmit a Concierge Inquiry
              </h2>
              <p className="text-xs text-text-muted mt-1">
                Typical response time: Under 2 hours during European market hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Full Name *"
                  placeholder="e.g. Lady Vivienne Sterling"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Email Coordinates *"
                  type="email"
                  placeholder="v.sterling@estate.co.uk"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Telephone Coordinates"
                  placeholder="+44 20 7946 0912"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Select
                  label="Inquiry Category *"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  options={[
                    { value: 'Order Advisory & Sizing', label: 'Order Advisory & Sizing' },
                    { value: 'Bespoke Custom Commission', label: 'Bespoke Custom Commission' },
                    { value: 'Artisan Application Vetting', label: 'Artisan Application Vetting' },
                    { value: 'Private VIP Salon Booking', label: 'Private VIP Salon Booking' },
                  ]}
                />
              </div>

              <Textarea
                label="Your Message or Commission Details *"
                rows={5}
                placeholder="Please describe your piece requirements, sizing, or logistics questions..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  leftIcon={Send}
                  isLoading={isSubmitting}
                  fullWidth
                >
                  Transmit Message to Concierge
                </Button>
              </div>
            </form>
          </div>

          {/* Salons & Support Coordinates (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface rounded-3xl border border-border p-6 shadow-subtle space-y-4">
              <h3 className="font-serif font-bold text-base text-text-main flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" /> Private Salon Salons
              </h3>

              <div className="space-y-4 divide-y divide-border text-xs">
                {salons.map((s, idx) => (
                  <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
                    <h4 className="font-bold text-text-main">{s.city}</h4>
                    <p className="text-text-muted mt-0.5">{s.address}</p>
                    <p className="text-accent font-semibold mt-1 font-mono">{s.phone}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-muted border border-border text-xs text-text-muted space-y-2">
              <div className="flex items-center gap-2 font-semibold text-text-main">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>Encrypted Concierge Dispatch</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                All inquiries are processed with end-to-end privacy and confidentiality standard for private acquisitions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
