import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Phone, Calendar, MapPin, Sparkles, Check, ArrowRight, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { selectCurrentUser } from '../../features/auth/authSelectors';
import { updateUserProfile } from '../../features/auth/authSlice';
import Input from '../../components/forms/Input';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';

const CURATED_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
];

const PREFERRED_DEPARTMENTS = [
  'Haute Horology',
  'Fine Jewelry',
  'Bespoke Tailoring',
  'Artisanal Ceramics',
  'Niche Fragrance',
  'Luxury Leather',
];

export const CustomerOnboardingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    avatar: user?.avatar || CURATED_AVATARS[0],
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || 'United States',
    postalCode: user?.postalCode || '',
    interests: user?.interests || ['Haute Horology', 'Fine Jewelry'],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleInterest = (dept) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(dept)
        ? prev.interests.filter((i) => i !== dept)
        : [...prev.interests, dept],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((res) => setTimeout(res, 500));

      dispatch(
        updateUserProfile({
          name: formData.name,
          phone: formData.phone,
          dob: formData.dob,
          avatar: formData.avatar,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          interests: formData.interests,
        })
      );

      toast.success('Your sovereign profile has been completed.');
      navigate('/account');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <Logo size="md" className="justify-center" />
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-accent block">
              Step 2 of 2 — Personalization
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
              Personalize Your Patron Profile
            </h1>
            <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
              Help our concierge curate tailored acquisitions, private exhibition invitations, and priority atelier allocations.
            </p>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 shadow-subtle">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-text-main block">
                Choose Sovereign Avatar
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {CURATED_AVATARS.map((avUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: avUrl })}
                    className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      formData.avatar === avUrl
                        ? 'border-accent ring-2 ring-accent/30 scale-105'
                        : 'border-border hover:border-text-muted opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={avUrl}
                      alt={`Avatar option ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {formData.avatar === avUrl && (
                      <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white drop-shadow-sm" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="onboarding-name"
                label="Full Name"
                placeholder="Eleanor Vance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={User}
                required
              />

              <Input
                id="onboarding-phone"
                type="tel"
                label="Concierge Phone (Optional)"
                placeholder="+1 (555) 234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                icon={Phone}
                helperText="Used only for insured delivery updates"
              />
            </div>

            <Input
              id="onboarding-dob"
              type="date"
              label="Date of Birth (Optional)"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              icon={Calendar}
              helperText="For celebratory anniversary tokens & bespoke salon privileges"
            />

            {/* Address */}
            <div className="space-y-4 pt-2 border-t border-border">
              <h3 className="font-serif font-bold text-sm text-text-main flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Primary Delivery Sanctum (Optional)</span>
              </h3>

              <Input
                id="onboarding-address"
                label="Street Address"
                placeholder="740 Park Avenue, Penthouse B"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  id="onboarding-city"
                  label="City"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />

                <Input
                  id="onboarding-postal"
                  label="Postal / ZIP"
                  placeholder="10021"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />

                <Input
                  id="onboarding-country"
                  label="Country"
                  placeholder="United States"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>

            {/* Department Interests */}
            <div className="space-y-3 pt-2 border-t border-border">
              <label className="text-xs font-semibold text-text-main flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Curated Department Interests</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PREFERRED_DEPARTMENTS.map((dept) => {
                  const selected = formData.interests.includes(dept);
                  return (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => toggleInterest(dept)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        selected
                          ? 'bg-accent text-white border-accent shadow-xs'
                          : 'bg-surface-muted border-border text-text-main hover:bg-surface-hover'
                      }`}
                    >
                      {dept}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                to="/account"
                className="text-xs font-semibold text-text-muted hover:text-text-main order-2 sm:order-1"
              >
                Skip for Now
              </Link>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                rightIcon={ArrowRight}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                Save & Enter Zareen
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerOnboardingPage;
