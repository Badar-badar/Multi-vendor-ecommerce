import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,
  ArrowLeft,
  UploadCloud,
  X,
  Plus,
  Trash2,
  DollarSign,
  Boxes,
  Truck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Star,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { selectSellerProducts, selectSellerProfile } from '../../features/seller/sellerSelectors';
import { addProduct, updateProduct } from '../../features/seller/sellerSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';

const CATEGORY_OPTIONS = [
  {
    slug: 'clothing',
    name: 'Haute Couture & Tailoring',
    subcategories: ['Outerwear', 'Tailoring', 'Eveningwear', 'Knitwear', 'Silk Shirts'],
  },
  {
    slug: 'jewelry',
    name: 'Fine Jewelry & High Horology',
    subcategories: ['Solitaire Rings', 'Pave Necklaces', 'Timepieces', 'Bespoke Cufflinks', 'Earrings'],
  },
  {
    slug: 'accessories',
    name: 'Leather Goods & Objects',
    subcategories: ['Handbags', 'Weekenders', 'Belts', 'Wallets', 'Silk Scarves'],
  },
  {
    slug: 'living',
    name: 'Artisanal Ceramics & Living',
    subcategories: ['Porcelain', 'Tableware', 'Candles & Scents', 'Sculptural Vessels'],
  },
];

const PRESET_SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
];

export const SellerProductCreatePage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = useSelector(selectSellerProducts) || [];
  const profile = useSelector(selectSellerProfile) || {};

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: profile.storeName || 'Atelier Maison',
    category: 'clothing',
    subcategory: 'Outerwear',
    description: '',
    price: '',
    compareAtPrice: '',
    costPerItem: '',
    sku: '',
    stock: '10',
    lowStockThreshold: '3',
    status: 'Active', // 'Active' | 'Draft'
    images: [PRESET_SAMPLE_IMAGES[0]],
    enableVariants: false,
    variants: [
      { id: 'v-1', name: 'Size', options: ['S', 'M', 'L'] },
      { id: 'v-2', name: 'Color', options: ['Obsidian Black', 'Champagne Beige'] },
    ],
    specifications: [
      { name: 'Material', value: '100% Organic Mulberry Silk' },
      { name: 'Country of Origin', value: 'France' },
    ],
    shipping: {
      weight: '1.2',
      dimensions: '45 x 35 x 8 cm',
      handlingTime: '2',
    },
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [newOptionInput, setNewOptionInput] = useState({});
  const [errors, setErrors] = useState({});

  // Populate data on edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const existing = products.find((p) => p.id === id || p.slug === id);
      if (existing) {
        setFormData({
          name: existing.name || '',
          brand: existing.brand || profile.storeName || 'Atelier Maison',
          category: existing.category || 'clothing',
          subcategory: existing.subcategory || '',
          description: existing.description || '',
          price: existing.price?.toString() || '',
          compareAtPrice: existing.compareAtPrice?.toString() || '',
          costPerItem: existing.costPerItem?.toString() || '',
          sku: existing.sku || '',
          stock: existing.stock?.toString() || '0',
          lowStockThreshold: existing.lowStockThreshold?.toString() || '3',
          status: existing.status || 'Active',
          images: existing.images?.length > 0 ? existing.images : [PRESET_SAMPLE_IMAGES[0]],
          enableVariants: Boolean(existing.variants && existing.variants.length > 0),
          variants: existing.variants || [],
          specifications: existing.specifications || [],
          shipping: existing.shipping || {
            weight: '1.0',
            dimensions: '40 x 30 x 10 cm',
            handlingTime: '2',
          },
        });
      }
    }
  }, [isEditMode, id, products]);

  // Selected Category's subcategories
  const currentCategoryObj =
    CATEGORY_OPTIONS.find((c) => c.slug === formData.category) || CATEGORY_OPTIONS[0];

  // Calculated discount percentage
  const discountPercent =
    formData.compareAtPrice && Number(formData.compareAtPrice) > Number(formData.price)
      ? Math.round(
          ((Number(formData.compareAtPrice) - Number(formData.price)) /
            Number(formData.compareAtPrice)) *
            100
        )
      : null;

  // Image actions
  const handleAddImage = (urlToAdd) => {
    const url = urlToAdd || imageUrlInput.trim();
    if (!url) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetPrimaryImage = (index) => {
    setFormData((prev) => {
      const selected = prev.images[index];
      const rest = prev.images.filter((_, idx) => idx !== index);
      return { ...prev, images: [selected, ...rest] };
    });
    toast.success('Primary showcase image updated.');
  };

  // Specifications actions
  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { name: '', value: '' }],
    }));
  };

  const handleUpdateSpec = (index, field, value) => {
    setFormData((prev) => {
      const copy = [...prev.specifications];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, specifications: copy };
    });
  };

  const handleRemoveSpec = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, idx) => idx !== index),
    }));
  };

  // Variants actions
  const handleAddVariantGroup = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { id: `v-${Date.now()}`, name: 'Material', options: ['18k Gold', 'Platinum'] },
      ],
    }));
  };

  const handleRemoveVariantGroup = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddOptionToVariant = (groupIndex) => {
    const optVal = (newOptionInput[groupIndex] || '').trim();
    if (!optVal) return;

    setFormData((prev) => {
      const copy = [...prev.variants];
      if (!copy[groupIndex].options.includes(optVal)) {
        copy[groupIndex] = {
          ...copy[groupIndex],
          options: [...copy[groupIndex].options, optVal],
        };
      }
      return { ...prev, variants: copy };
    });

    setNewOptionInput((prev) => ({ ...prev, [groupIndex]: '' }));
  };

  const handleRemoveOptionFromVariant = (groupIndex, optToRemove) => {
    setFormData((prev) => {
      const copy = [...prev.variants];
      copy[groupIndex] = {
        ...copy[groupIndex],
        options: copy[groupIndex].options.filter((o) => o !== optToRemove),
      };
      return { ...prev, variants: copy };
    });
  };

  // Validation
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Creation title is required.';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Valid retail price is required.';
    if (!formData.sku.trim()) errs.sku = 'SKU is required for inventory tracking.';
    if (formData.images.length === 0) errs.images = 'At least one showcase image is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please resolve highlighted form fields.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      brand: formData.brand.trim() || profile.storeName,
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description.trim(),
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
      costPerItem: formData.costPerItem ? Number(formData.costPerItem) : null,
      sku: formData.sku.trim(),
      stock: Number(formData.stock),
      lowStockThreshold: Number(formData.lowStockThreshold),
      status: formData.status,
      images: formData.images,
      variants: formData.enableVariants ? formData.variants : [],
      specifications: formData.specifications.filter((s) => s.name && s.value),
      shipping: formData.shipping,
    };

    if (isEditMode) {
      dispatch(updateProduct({ id, updates: payload }));
      toast.success(`"${formData.name}" listing updated successfully.`);
    } else {
      dispatch(addProduct(payload));
      toast.success(`"${formData.name}" added to your sovereign catalog.`);
    }

    navigate('/seller/products');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Header & Save Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Link
              to="/seller/products"
              className="p-2 rounded-xl bg-surface border border-border text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-main">
                {isEditMode ? 'Edit Creation Listing' : 'Publish New Sovereign Creation'}
              </h1>
              <p className="text-xs text-text-muted">
                {isEditMode
                  ? `Modifying SKU: ${formData.sku || id}`
                  : 'Register a certified artisan masterpiece on the global Zareen marketplace.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/seller/products">
              <Button type="button" variant="outline" size="sm">
                Discard
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="sm">
              {isEditMode ? 'Save Modifications' : 'Publish to Catalog'}
            </Button>
          </div>
        </div>

        {/* 2-Column Multi-Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 Cols): Basic Info, Media, Variants, Specifications */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. BASIC INFORMATION */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <FileText className="w-4 h-4 text-accent" />
                <h2 className="font-serif font-bold text-sm text-text-main">
                  1. Basic Information
                </h2>
              </div>

              <div className="space-y-4">
                <Input
                  label="Creation Title"
                  placeholder="e.g. Hand-Woven Silk Trench Coat"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="text-xs font-semibold text-text-main block mb-1">
                      Artisan Discipline (Category)
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        const catObj = CATEGORY_OPTIONS.find((c) => c.slug === newCat);
                        setFormData({
                          ...formData,
                          category: newCat,
                          subcategory: catObj?.subcategories[0] || '',
                        });
                      }}
                      className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-primary text-text-main cursor-pointer"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory */}
                  <div>
                    <label className="text-xs font-semibold text-text-main block mb-1">
                      Specialization (Subcategory)
                    </label>
                    <select
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-primary text-text-main cursor-pointer"
                    >
                      {currentCategoryObj.subcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description & Story */}
                <div>
                  <label className="text-xs font-semibold text-text-main block mb-1">
                    Artisan Story & Provenance Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the generational technique, raw material origins, hand-finishing hallmarks, and fit details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-primary text-text-main placeholder:text-text-muted leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 2. MEDIA & GALLERY */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-accent" />
                  <h2 className="font-serif font-bold text-sm text-text-main">
                    2. Media & Visual Portfolio
                  </h2>
                </div>
                <span className="text-[11px] text-text-muted">
                  {formData.images.length} photos staged
                </span>
              </div>

              {errors.images && (
                <p className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.images}</span>
                </p>
              )}

              {/* Upload Input & Sample Selector */}
              <div className="p-4 bg-surface-muted rounded-xl border border-dashed border-border space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="url"
                    placeholder="Enter image URL (https://...)"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 w-full px-3 py-2 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-primary text-text-main"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImage()}
                    className="w-full sm:w-auto px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors cursor-pointer shrink-0"
                  >
                    Add Image
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 text-xs text-text-muted flex-wrap">
                  <span className="text-[11px]">Quick Samples:</span>
                  {PRESET_SAMPLE_IMAGES.map((sampleUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddImage(sampleUrl)}
                      className="text-[11px] px-2 py-0.5 rounded bg-surface border border-border hover:border-primary text-text-main cursor-pointer"
                    >
                      Preset #{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Previews Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all bg-surface-muted ${
                      idx === 0 ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />

                    {/* Primary Badge */}
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-primary text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                        Primary Cover
                      </span>
                    )}

                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/40 transition-colors text-[10px] font-bold"
                          title="Make Primary Cover"
                        >
                          Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. VARIANTS & SIZING */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-accent" />
                  <h2 className="font-serif font-bold text-sm text-text-main">
                    3. Dynamic Variants (Sizes, Colors, Finishes)
                  </h2>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-main">
                  <input
                    type="checkbox"
                    checked={formData.enableVariants}
                    onChange={(e) => setFormData({ ...formData, enableVariants: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                  <span>Enable Variants</span>
                </label>
              </div>

              {formData.enableVariants ? (
                <div className="space-y-4">
                  {formData.variants.map((group, gIdx) => (
                    <div
                      key={group.id || gIdx}
                      className="p-4 bg-surface-muted rounded-xl border border-border space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-text-main uppercase tracking-wider">
                          Variant Option #{gIdx + 1}: {group.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantGroup(gIdx)}
                          className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Remove Group
                        </button>
                      </div>

                      {/* Options Chips */}
                      <div className="flex flex-wrap items-center gap-2">
                        {group.options.map((opt) => (
                          <span
                            key={opt}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-medium text-text-main"
                          >
                            <span>{opt}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveOptionFromVariant(gIdx, opt)}
                              className="text-text-muted hover:text-rose-600 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add Option Input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder={`Add option value for ${group.name} (e.g. XL, Cognac)...`}
                          value={newOptionInput[gIdx] || ''}
                          onChange={(e) =>
                            setNewOptionInput({ ...newOptionInput, [gIdx]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddOptionToVariant(gIdx);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 text-xs bg-surface border border-border rounded-lg focus:outline-none focus:border-primary text-text-main"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddOptionToVariant(gIdx)}
                          className="px-3 py-1.5 bg-surface-muted hover:bg-surface-hover border border-border rounded-lg text-xs font-semibold text-text-main cursor-pointer"
                        >
                          Add Value
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddVariantGroup}
                    className="w-full py-2.5 rounded-xl border border-dashed border-border hover:border-primary text-xs font-semibold text-text-muted hover:text-text-main transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Variant Option Group
                  </button>
                </div>
              ) : (
                <p className="text-xs text-text-muted">
                  This creation will be listed as a single, sovereign edition piece without size or color selector dropdowns.
                </p>
              )}
            </div>

            {/* 4. SPECIFICATIONS & HALLMARKS */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <h2 className="font-serif font-bold text-sm text-text-main">
                    4. Technical Specifications & Material Hallmarks
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Attribute
                </button>
              </div>

              <div className="space-y-3">
                {formData.specifications.map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Attribute (e.g. Material, Purity, Origin)"
                      value={spec.name}
                      onChange={(e) => handleUpdateSpec(sIdx, 'name', e.target.value)}
                      className="w-1/3 px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-primary text-text-main"
                    />
                    <input
                      type="text"
                      placeholder="Specification Value (e.g. 18k Fairmined Yellow Gold)"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpec(sIdx, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-primary text-text-main"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(sIdx)}
                      className="p-2 text-text-muted hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Remove row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 Cols): Pricing, Inventory, Shipping, Status */}
          <div className="lg:col-span-4 space-y-6">
            {/* PRICING */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <DollarSign className="w-4 h-4 text-accent" />
                <h2 className="font-serif font-bold text-sm text-text-main">Pricing & Margin</h2>
              </div>

              <div className="space-y-3">
                <Input
                  label="Retail Price (USD)"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="840.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  error={errors.price}
                  required
                />

                <Input
                  label="Compare-at Strikethrough Price (USD)"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="950.00"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                />

                {discountPercent && (
                  <div className="p-2.5 bg-accent-light rounded-xl border border-accent/20 text-xs text-accent flex items-center justify-between">
                    <span className="font-medium">Calculated Buyer Discount:</span>
                    <span className="font-bold">{discountPercent}% Off</span>
                  </div>
                )}

                <Input
                  label="Cost per Item (Private Artisan Internal)"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="320.00"
                  value={formData.costPerItem}
                  onChange={(e) => setFormData({ ...formData, costPerItem: e.target.value })}
                />
              </div>
            </div>

            {/* INVENTORY */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Boxes className="w-4 h-4 text-accent" />
                <h2 className="font-serif font-bold text-sm text-text-main">Inventory Allocation</h2>
              </div>

              <div className="space-y-3">
                <Input
                  label="SKU (Stock Keeping Unit)"
                  placeholder="e.g. AM-TR-001"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                  error={errors.sku}
                  required
                />

                <Input
                  label="Initial Stock Quantity in Atelier"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />

                <Input
                  label="Low Stock Alert Limit"
                  type="number"
                  min="1"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* SHIPPING & PACKAGING */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Truck className="w-4 h-4 text-accent" />
                <h2 className="font-serif font-bold text-sm text-text-main">Shipping & Transit</h2>
              </div>

              <div className="space-y-3">
                <Input
                  label="Packaged Weight (kg)"
                  placeholder="1.2"
                  value={formData.shipping.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shipping: { ...formData.shipping, weight: e.target.value },
                    })
                  }
                />

                <Input
                  label="Package Dimensions (LxWxH)"
                  placeholder="45 x 35 x 8 cm"
                  value={formData.shipping.dimensions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shipping: { ...formData.shipping, dimensions: e.target.value },
                    })
                  }
                />

                <Input
                  label="Atelier Preparation Time (Days)"
                  placeholder="2"
                  value={formData.shipping.handlingTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shipping: { ...formData.shipping, handlingTime: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            {/* PUBLICATION STATUS */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
              <h2 className="font-serif font-bold text-sm text-text-main pb-2 border-b border-border">
                Publication Status
              </h2>

              <div className="space-y-2">
                {[
                  {
                    value: 'Active',
                    label: 'Active on Marketplace',
                    desc: 'Instantly visible to global luxury clientele.',
                  },
                  {
                    value: 'Draft',
                    label: 'Saved as Draft',
                    desc: 'Hidden from public searches and discovery.',
                  },
                ].map((s) => (
                  <label
                    key={s.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                      formData.status === s.value
                        ? 'bg-primary/5 border-primary text-text-main'
                        : 'border-border text-text-muted hover:bg-surface-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="publicationStatus"
                      value={s.value}
                      checked={formData.status === s.value}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="mt-0.5 text-primary focus:ring-primary cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-xs text-text-main block">{s.label}</span>
                      <span className="text-[11px] text-text-muted">{s.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="lg" fullWidth>
                  {isEditMode ? 'Update Creation' : 'Publish Creation'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SellerProductCreatePage;
