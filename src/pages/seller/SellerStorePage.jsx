import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Store,
  ShieldCheck,
  MapPin,
  Camera,
  Sparkles,
  ExternalLink,
  Phone,
  Mail,
  Edit2,
  Check,
  Save,
  Globe,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  selectSellerProfile,
  selectSellerProducts,
} from '../../features/seller/sellerSelectors';
import { updateStoreProfile } from '../../features/seller/sellerSlice';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';

const SAMPLE_BANNERS = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
];

export const SellerStorePage = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectSellerProfile) || {};
  const products = useSelector(selectSellerProducts) || [];

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    storeName: profile.storeName || 'Atelier Maison',
    ownerName: profile.ownerName || 'Jean-Luc Moreau',
    email: profile.email || 'jeanluc@ateliermaison.fr',
    phone: profile.phone || '+33 1 42 68 55 00',
    category: profile.category || 'Haute Couture & Fine Tailoring',
    description: profile.description || '',
    story: profile.story || '',
    address: profile.address || '28 Place Vendôme, Suite 4',
    city: profile.city || 'Paris',
    country: profile.country || 'France',
    logo: profile.logo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    banner: profile.banner || SAMPLE_BANNERS[0],
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch(updateStoreProfile(formData));
    setIsEditing(false);
    toast.success('Atelier Store profile updated successfully.');
  };

  const handleSelectBanner = (bannerUrl) => {
    setFormData((prev) => ({ ...prev, banner: bannerUrl }));
    dispatch(updateStoreProfile({ banner: bannerUrl }));
    toast.success('Store facade banner updated.');
  };

  return (
    <>
      <div className="space-y-8">
        {/* Top Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-main">
              Atelier Store Profile & Public Facade
            </h1>
            <p className="text-xs text-text-muted">
              Configure your public artisan identity, heritage philosophy, and contact details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/sellers"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-text-main hover:bg-surface-muted transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-accent" />
              <span>Preview Public Facade</span>
            </Link>

            <Button
              variant={isEditing ? 'outline' : 'primary'}
              size="sm"
              leftIcon={isEditing ? Check : Edit2}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        {/* Store Facade Showcase */}
        <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-subtle">
          {/* Banner Hero with overlay */}
          <div className="relative h-48 sm:h-64 bg-primary/20 group">
            <img
              src={formData.banner}
              alt={formData.storeName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            {/* Change Banner Quick Controls */}
            {isEditing && (
              <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                <span className="text-[11px] text-white font-medium bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  Change Facade:
                </span>
                {SAMPLE_BANNERS.map((bUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectBanner(bUrl)}
                    className="w-7 h-7 rounded-lg overflow-hidden border-2 border-white/80 hover:scale-105 transition-transform cursor-pointer shadow-xs"
                  >
                    <img src={bUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Identity Bar */}
          <div className="p-6 sm:p-8 -mt-12 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="relative group shrink-0">
                  <img
                    src={formData.logo}
                    alt={formData.storeName}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-surface shadow-md bg-surface"
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        const newLogo = prompt('Enter new Atelier logo image URL:', formData.logo);
                        if (newLogo) setFormData({ ...formData, logo: newLogo });
                      }}
                      className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
                    >
                      <Camera className="w-4 h-4 mr-1" /> Edit
                    </button>
                  )}
                </div>

                <div className="space-y-1 pb-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif font-bold text-2xl sm:text-3xl text-text-main">
                      {formData.storeName}
                    </h2>
                    {profile.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-accent-light text-accent px-2 py-0.5 rounded-full border border-accent/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified Sovereign Atelier
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted">
                    {formData.category} • {formData.city}, {formData.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-left sm:text-right">
                  <span className="font-bold text-accent text-sm block">
                    ★ {profile.rating || 4.95}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    ({profile.reviewCount || 84} verified reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form or Display View */}
        {isEditing ? (
          <form
            onSubmit={handleSaveProfile}
            className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-subtle animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-serif font-bold text-base text-text-main">
                Edit Atelier Information
              </h3>
              <span className="text-xs text-text-muted">Fields update public marketplace facade</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Atelier / Store Name"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                required
              />

              <Input
                label="Master Artisan / Owner Name"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                required
              />

              <Input
                label="Primary Business Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />

              <Input
                label="Contact Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <Input
                label="Workshop Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <Input
                label="Workshop Street Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />

              <Input
                label="Country of Origin"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-main block mb-1">
                  Tagline / Brief Summary
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-primary text-text-main"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-main block mb-1">
                  Comprehensive Heritage & Craftsmanship Philosophy
                </label>
                <textarea
                  rows={4}
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  className="w-full p-3 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-primary text-text-main leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" leftIcon={Save}>
                Save Store Profile
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Story & Philosophy (8 Cols) */}
            <div className="lg:col-span-8 bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-4 shadow-subtle">
              <h3 className="font-serif font-bold text-base text-text-main pb-2 border-b border-border">
                Heritage & Craftsmanship Story
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                {formData.story || formData.description}
              </p>

              <div className="pt-4 border-t border-border space-y-2 text-xs">
                <span className="font-bold text-text-main block">Active Creations</span>
                <p className="text-text-muted">
                  {products.length} sovereign masterpiece(s) registered under this atelier.
                </p>
              </div>
            </div>

            {/* Atelier Coordinates (4 Cols) */}
            <div className="lg:col-span-4 bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle text-xs">
              <h3 className="font-serif font-bold text-base text-text-main pb-2 border-b border-border">
                Atelier Coordinates
              </h3>

              <div className="space-y-3 text-text-muted">
                <div className="flex items-start gap-2.5">
                  <Building className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text-main block">Physical Workshop</span>
                    <span>{formData.address}</span>
                    <br />
                    <span>
                      {formData.city}, {formData.country}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <span>{formData.email}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-accent shrink-0" />
                  <span>{formData.phone}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerStorePage;
