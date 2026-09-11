import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Store,
  Building,
  Image as ImageIcon,
  User,
  X,
  Upload,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  Phone,
  Camera,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { setSellerProfile } from '../../features/seller/sellerSlice';
import Input from '../../components/forms/Input';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/common/Button';

const SELLER_CATEGORIES = [
  'Haute Couture & Fine Tailoring',
  'Fine Jewelry & High Horology',
  'Bespoke Leather Goods & Accessories',
  'Artisanal Ceramics & Living',
  'Niche Fragrance & Beauty Formulations',
];

export const SellerRegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    // Account Information
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',

    // Business Information
    storeName: '',
    category: SELLER_CATEGORIES[0],
    businessDescription: '',
    businessPhone: '',
    businessEmail: '',

    // Store Branding & Photos
    storeLogo: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=300&auto=format&fit=crop',
    businessPhoto: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop',
    storeBanner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
    storeDescription: '',

    // Physical Atelier Address
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'France',

    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload handler with size and type validation
  const handlePhotoUpload = (field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      toast.error('Only JPG, PNG, and WEBP image formats are supported.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file size must be 5MB or smaller.');
      return;
    }

    // Create a local object URL for preview
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, [field]: previewUrl }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    toast.success(`${field === 'businessPhoto' ? 'Workshop' : 'Store'} photo uploaded for review.`);
  };

  const validate = () => {
    const errs = {};

    // 1. Account
    if (!formData.ownerName.trim()) errs.ownerName = 'Master Artisan / Owner name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Account email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid account email.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    if (!formData.phone.trim()) errs.phone = 'Personal contact phone is required.';

    // 2. Business Information
    if (!formData.storeName.trim()) errs.storeName = 'Store / Atelier name is required.';
    if (!formData.businessEmail.trim()) {
      errs.businessEmail = 'Business email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail.trim())) {
      errs.businessEmail = 'Please provide a valid business email.';
    }
    if (!formData.businessPhone.trim()) errs.businessPhone = 'Business phone is required.';
    if (!formData.businessDescription.trim()) {
      errs.businessDescription = 'Business description is required.';
    }

    // 3. Store Visuals
    if (!formData.businessPhoto) {
      errs.businessPhoto = 'Workshop / Business physical photo is required for authenticity.';
    }

    // 4. Address
    if (!formData.address.trim()) errs.address = 'Physical address is required.';
    if (!formData.city.trim()) errs.city = 'City is required.';
    if (!formData.province.trim()) errs.province = 'Province / State is required.';
    if (!formData.postalCode.trim()) errs.postalCode = 'Postal / ZIP code is required.';

    // 5. Terms
    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must accept the Sovereign Seller Terms.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please complete all required application fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 800));

      const applicationPayload = {
        storeName: formData.storeName,
        category: formData.category,
        businessDescription: formData.businessDescription,
        businessPhone: formData.businessPhone,
        businessEmail: formData.businessEmail,
        storeLogo: formData.storeLogo,
        businessPhoto: formData.businessPhoto,
        storeBanner: formData.storeBanner,
        storeDescription: formData.storeDescription || formData.businessDescription,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        country: formData.country,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        status: 'Submitted',
        submittedAt: new Date().toISOString(),
      };

      dispatch(setSellerProfile(applicationPayload));
      toast.success('Your seller dossier has been registered and submitted for concierge audit.');
      navigate('/seller/application');
    } catch {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto font-serif font-bold text-xl shadow-xs">
            Z
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-accent block">
              Atelier Accreditation Protocol
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-main">
              Apply to Sell on Zareen
            </h1>
            <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto leading-relaxed">
              Showcase your bespoke craftsmanship, fine horology, and high jewelry to a distinguished global circle of collectors.
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 shadow-subtle">
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* 1. MASTER ARTISAN / OWNER ACCOUNT */}
            <div className="space-y-4">
              <h2 className="font-serif font-bold text-base text-text-main pb-2 border-b border-border flex items-center gap-2">
                <User className="w-4 h-4 text-accent" />
                <span>1. Master Artisan / Owner Account</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="seller-ownerName"
                  label="Master Artisan / Owner Full Name"
                  placeholder="Jean-Luc Moreau"
                  value={formData.ownerName}
                  onChange={(e) => {
                    setFormData({ ...formData, ownerName: e.target.value });
                    if (errors.ownerName) setErrors((prev) => ({ ...prev, ownerName: null }));
                  }}
                  error={errors.ownerName}
                  required
                />

                <Input
                  id="seller-email"
                  type="email"
                  label="Account Email Address"
                  placeholder="jeanluc@ateliermaison.fr"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  error={errors.email}
                  required
                />

                <Input
                  id="seller-phone"
                  type="tel"
                  label="Personal Contact Phone"
                  placeholder="+33 6 12 34 56 78"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                  }}
                  error={errors.phone}
                  required
                />

                <Input
                  id="seller-password"
                  type="password"
                  label="Portal Password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  error={errors.password}
                  required
                />

                <div className="sm:col-span-2">
                  <Input
                    id="seller-confirmPassword"
                    type="password"
                    label="Confirm Portal Password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                    }}
                    error={errors.confirmPassword}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. BUSINESS INFORMATION */}
            <div className="space-y-4">
              <h2 className="font-serif font-bold text-base text-text-main pb-2 border-b border-border flex items-center gap-2">
                <Store className="w-4 h-4 text-accent" />
                <span>2. Business Information & Craft Ethos</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="seller-storeName"
                  label="Store / Atelier Trade Name"
                  placeholder="Atelier Maison"
                  value={formData.storeName}
                  onChange={(e) => {
                    setFormData({ ...formData, storeName: e.target.value });
                    if (errors.storeName) setErrors((prev) => ({ ...prev, storeName: null }));
                  }}
                  error={errors.storeName}
                  required
                />

                <div>
                  <label className="text-xs font-semibold text-text-main block mb-1">
                    Primary Craft Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-text-main font-medium cursor-pointer"
                  >
                    {SELLER_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  id="seller-businessEmail"
                  type="email"
                  label="Business Inquiry Email"
                  placeholder="concierge@ateliermaison.fr"
                  value={formData.businessEmail}
                  onChange={(e) => {
                    setFormData({ ...formData, businessEmail: e.target.value });
                    if (errors.businessEmail) setErrors((prev) => ({ ...prev, businessEmail: null }));
                  }}
                  error={errors.businessEmail}
                  required
                />

                <Input
                  id="seller-businessPhone"
                  type="tel"
                  label="Business Telephone"
                  placeholder="+33 1 42 68 55 00"
                  value={formData.businessPhone}
                  onChange={(e) => {
                    setFormData({ ...formData, businessPhone: e.target.value });
                    if (errors.businessPhone) setErrors((prev) => ({ ...prev, businessPhone: null }));
                  }}
                  error={errors.businessPhone}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-main block mb-1">
                  Business & Craft Ethos Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your heritage, materials used, artisanal background, and bespoke production techniques..."
                  value={formData.businessDescription}
                  onChange={(e) => {
                    setFormData({ ...formData, businessDescription: e.target.value });
                    if (errors.businessDescription) setErrors((prev) => ({ ...prev, businessDescription: null }));
                  }}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border rounded-lg focus:outline-none focus:border-text-main text-text-main resize-none ${
                    errors.businessDescription ? 'border-error' : 'border-border'
                  }`}
                />
                {errors.businessDescription && (
                  <p className="text-[11px] text-error mt-1">{errors.businessDescription}</p>
                )}
              </div>
            </div>

            {/* 3. STORE BRANDING & REQUIRED BUSINESS PHOTO */}
            <div className="space-y-4">
              <h2 className="font-serif font-bold text-base text-text-main pb-2 border-b border-border flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-accent" />
                <span>3. Store Branding & Workshop Verification Photo</span>
              </h2>

              {/* Mandatory Workshop / Business Photo Upload */}
              <div className="space-y-2 p-4 bg-surface-muted rounded-2xl border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-accent" />
                    <label className="text-xs font-bold text-text-main block">
                      Physical Workshop / Studio Photo (Mandatory Verification)
                    </label>
                  </div>
                  <span className="text-[10px] text-accent font-semibold bg-accent-light px-2 py-0.5 rounded">
                    Required for Accreditation
                  </span>
                </div>
                <p className="text-[11px] text-text-muted">
                  Upload a clear photograph of your physical atelier, workbench, or studio workspace to verify authentic non-mass-production standards.
                </p>

                {formData.businessPhoto ? (
                  <div className="relative aspect-video max-h-48 rounded-xl overflow-hidden border border-border group bg-black/5">
                    <img
                      src={formData.businessPhoto}
                      alt="Workshop Photo Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-white/90 text-text-main text-xs font-semibold hover:bg-white cursor-pointer transition-colors">
                        <span>Replace Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload('businessPhoto', e)}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, businessPhoto: '' })}
                        className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                        title="Remove Photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border-2 border-dashed border-border rounded-xl text-center space-y-3 bg-surface">
                    <Upload className="w-7 h-7 text-text-muted mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-text-main">
                        Drag & drop workshop photo or click to browse
                      </p>
                      <p className="text-[10px] text-text-muted">
                        JPG, PNG, or WEBP • Maximum 5MB
                      </p>
                    </div>
                    <label className="inline-block px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover cursor-pointer transition-colors shadow-2xs">
                      <span>Choose Workshop Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload('businessPhoto', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
                {errors.businessPhoto && (
                  <p className="text-[11px] text-error mt-1">{errors.businessPhoto}</p>
                )}
              </div>

              {/* Logo and Banner Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Store Logo */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-main block">Store Logo</label>
                  {formData.storeLogo ? (
                    <div className="p-3 bg-surface-muted rounded-xl border border-border flex items-center gap-3">
                      <img
                        src={formData.storeLogo}
                        alt="Logo"
                        className="w-12 h-12 rounded-lg object-cover border border-border"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-text-main block truncate">
                          logo-asset.png
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium">Ready</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, storeLogo: '' })}
                        className="p-1 rounded-md text-text-muted hover:text-error cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="p-3 border border-dashed border-border rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-surface-muted text-xs text-text-muted">
                      <Upload className="w-4 h-4" />
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload('storeLogo', e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Store Banner */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-main block">Store Banner</label>
                  {formData.storeBanner ? (
                    <div className="relative h-18 rounded-xl overflow-hidden border border-border group">
                      <img
                        src={formData.storeBanner}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-between p-2">
                        <span className="text-[11px] text-white font-medium">Facade Banner</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, storeBanner: '' })}
                          className="p-1 rounded-md bg-black/60 text-white hover:bg-rose-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="p-3 border border-dashed border-border rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-surface-muted text-xs text-text-muted">
                      <Upload className="w-4 h-4" />
                      <span>Upload Banner</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload('storeBanner', e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* 4. WORKSHOP ADDRESS */}
            <div className="space-y-4">
              <h2 className="font-serif font-bold text-base text-text-main pb-2 border-b border-border flex items-center gap-2">
                <Building className="w-4 h-4 text-accent" />
                <span>4. Physical Workshop / Studio Address</span>
              </h2>

              <Input
                id="seller-address"
                label="Street Address"
                placeholder="28 Place Vendôme, Suite 4"
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (errors.address) setErrors((prev) => ({ ...prev, address: null }));
                }}
                error={errors.address}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  id="seller-city"
                  label="City"
                  placeholder="Paris"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (errors.city) setErrors((prev) => ({ ...prev, city: null }));
                  }}
                  error={errors.city}
                  required
                />

                <Input
                  id="seller-province"
                  label="Province / State"
                  placeholder="Île-de-France"
                  value={formData.province}
                  onChange={(e) => {
                    setFormData({ ...formData, province: e.target.value });
                    if (errors.province) setErrors((prev) => ({ ...prev, province: null }));
                  }}
                  error={errors.province}
                  required
                />

                <Input
                  id="seller-postalCode"
                  label="Postal Code"
                  placeholder="75001"
                  value={formData.postalCode}
                  onChange={(e) => {
                    setFormData({ ...formData, postalCode: e.target.value });
                    if (errors.postalCode) setErrors((prev) => ({ ...prev, postalCode: null }));
                  }}
                  error={errors.postalCode}
                  required
                />
              </div>
            </div>

            {/* 5. TERMS & SUBMISSION */}
            <div className="space-y-4 pt-4 border-t border-border">
              <Checkbox
                id="seller-agreeTerms"
                checked={formData.agreeTerms}
                onChange={(e) => {
                  setFormData({ ...formData, agreeTerms: e.target.checked });
                  if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: null }));
                }}
                label="I certify all listed pieces will be 100% authentic, hand-inspected, and comply with Zareen Sovereign Provenance standards."
                error={errors.agreeTerms}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                rightIcon={ArrowRight}
                fullWidth
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application for Review'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerRegisterPage;
