import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RefreshCw,
  Award,
  Headphones,
  Star,
  Clock,
  Zap,
  CheckCircle2,
  Compass,
  Store,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
  selectFeaturedProducts,
  selectNewArrivals,
  selectBestSellers,
  selectFlashDeals,
} from '../../features/products/productSelectors';
import { fetchProducts } from '../../features/products/productThunk';
import { categories as staticCategories } from '../../data/categories';
import { brands } from '../../data/brands';
import { testimonials } from '../../data/testimonials';
import { valueProps } from '../../data/valueProps';
import { categoryApi } from '../../api';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

// Map icon strings to Lucide components
const iconMap = {
  ShieldCheck,
  Truck,
  RefreshCw,
  Award,
  Headphones,
};

export const HomePage = () => {
  const dispatch = useDispatch();
  const featuredProducts = useSelector(selectFeaturedProducts);
  const newArrivals = useSelector(selectNewArrivals);
  const bestSellers = useSelector(selectBestSellers);
  const flashDeals = useSelector(selectFlashDeals);
  const [categoriesList, setCategoriesList] = useState(staticCategories);

  useEffect(() => {
    dispatch(fetchProducts());
    const fetchCats = async () => {
      try {
        const res = await categoryApi.getCategories();
        const cList = res?.categories || res?.data?.categories || (Array.isArray(res) ? res : []);
        if (cList && cList.length > 0) {
          setCategoriesList(cList);
        }
      } catch (err) {
        // Safe fallback to static categories
      }
    };
    fetchCats();
  }, [dispatch]);

  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Flash deal countdown timer (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setNewsletterSubscribed(true);
    toast.success('Welcome to The Zareen Gazette. Check your inbox for your private client welcome.');
    setNewsletterEmail('');
  };

  // Filter featured products by tab
  const filteredFeatured =
    activeCategoryTab === 'all'
      ? featuredProducts
      : featuredProducts.filter((p) => p.category?.slug === activeCategoryTab);

  // Hero banner slides
  const heroSlides = [
    {
      id: 'jewelry',
      tag: 'Fine Jewelry & High Horology',
      title: 'Where Handcrafted Distinction Meets Modern Luxury.',
      subtitle: 'Discover bespoke apparel, rare fine jewelry, sculptural ceramics, and full-grain leather goods curated directly from independent master craftspeople worldwide.',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop',
      badge: 'Solstice Diamonds',
      ctaText: 'Explore Collections',
      ctaLink: '/products?category=jewelry-watches',
    },
    {
      id: 'horology',
      tag: 'Swiss Haute Horlogerie',
      title: 'Generational Watchmaking & Precision Calibers.',
      subtitle: 'Independently regulated mechanical movements, hand-beveled bridges, and grand feu enamel dials from Swiss Vallée de Joux ateliers.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2000&auto=format&fit=crop',
      badge: 'Certified Chronometry',
      ctaText: 'Discover Timepieces',
      ctaLink: '/products?category=jewelry-watches',
    },
    {
      id: 'couture',
      tag: 'Bespoke Haute Tailoring',
      title: 'Artisanal Silks, Pure Cashmere & Bespoke Suiting.',
      subtitle: 'Hand-sewn Milanese buttonholes, unconstructed Neapolitan tailoring, and sustainably harvested silk woven on vintage looms.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop',
      badge: 'Atelier Tailored',
      ctaText: 'View Haute Couture',
      ctaLink: '/products?category=apparel',
    },
    {
      id: 'leather',
      tag: 'Tuscan Leather Craft',
      title: 'Saddle-Stitched Vegetable Tanned Leather Goods.',
      subtitle: 'Full-grain saddle hides, hand-burnished edges, and solid brass hardware built to develop rich generational patinas.',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2000&auto=format&fit=crop',
      badge: 'Full Grain Mastery',
      ctaText: 'Explore Leathercraft',
      ctaLink: '/products?category=leather-goods',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance hero slides every 7 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION - CRYSTAL CLEAR LUXURY BANNER */}
      <section className="relative overflow-hidden bg-slate-950 text-white border-b border-border/70 min-h-[560px] lg:min-h-[640px] flex items-center">
        {/* Background Banner Slides with Transitions */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 ease-out"
            />
            {/* Cinematic Gradient Overlays for Razor-Sharp Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
          </div>
        ))}

        {/* Subtle Luxury Pattern Layer */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-1" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-accent-light border border-white/15 text-xs font-semibold backdrop-blur-md shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>{heroSlides[currentSlide].tag}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.12] text-white">
                {heroSlides[currentSlide].title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {heroSlides[currentSlide].subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to={heroSlides[currentSlide].ctaLink}>
                  <Button variant="accent" size="lg" rightIcon={ArrowRight} className="shadow-lg hover:shadow-accent/20">
                    {heroSlides[currentSlide].ctaText}
                  </Button>
                </Link>
                <Link to="/sellers">
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={Compass}
                    className="border-white/20 hover:bg-white/10 hover:border-white text-white backdrop-blur-xs"
                  >
                    Meet Master Artisans
                  </Button>
                </Link>
              </div>

              {/* Slide Selector Indicators & Pillar Stats */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-white/15 max-w-xl mx-auto lg:mx-0">
                {/* Slide Nav Dots */}
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentSlide
                          ? 'w-8 bg-accent'
                          : 'w-2 bg-white/30 hover:bg-white/60'
                      }`}
                      aria-label={`Go to slide ${idx + 1}: ${slide.tag}`}
                    />
                  ))}
                  <span className="text-[11px] font-semibold text-slate-400 ml-2">
                    0{currentSlide + 1} / 0{heroSlides.length}
                  </span>
                </div>

                {/* Pillar Micro Stats */}
                <div className="flex items-center justify-center lg:justify-start gap-5">
                  <div>
                    <span className="font-serif text-lg font-bold text-accent">500+</span>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ateliers</span>
                  </div>
                  <div className="w-px h-6 bg-white/15" />
                  <div>
                    <span className="font-serif text-lg font-bold text-white">100%</span>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ethical</span>
                  </div>
                  <div className="w-px h-6 bg-white/15" />
                  <div>
                    <span className="font-serif text-lg font-bold text-accent">80+</span>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Insured</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Spotlight Showcase (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 shadow-2xl group">
                  <img
                    src={heroSlides[currentSlide].image}
                    alt={heroSlides[currentSlide].title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Spotlight Floating Badge Card */}
                  <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md text-white border border-white/15 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                          <Sparkles className="w-3 h-3" /> Curator’s Spotlight
                        </span>
                        <h4 className="font-serif text-sm font-bold text-white line-clamp-1">
                          {featuredProducts[0]?.name || '18k Solstice Diamond Collar'}
                        </h4>
                        <p className="text-[11px] text-slate-300">
                          By {featuredProducts[0]?.brand || featuredProducts[0]?.seller?.storeName || 'Aurelia Goldsmiths • Florence'}
                        </p>
                      </div>
                      <Link to={featuredProducts[0] ? `/products/${featuredProducts[0].slug || featuredProducts[0].id || featuredProducts[0]._id}` : '/products'}>
                        <Button variant="accent" size="sm" className="shrink-0 shadow-xs">
                          Acquire
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-border/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-1">
              Curated Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-main">
              Explore by Discipline
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs font-semibold text-text-main hover:text-accent flex items-center gap-1 transition-colors"
          >
            All Departments <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {categoriesList.map((cat) => (
            <Link
              key={cat.id || cat._id}
              to={`/products?category=${cat.slug}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-surface-muted flex flex-col justify-end p-5 border border-border hover:shadow-card-hover transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent transition-opacity group-hover:opacity-90" />
              <div className="relative z-10 text-white space-y-1">
                <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-accent-light px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs">
                  {cat.itemCount || 24} Creations
                </span>
                <h3 className="text-base font-serif font-bold text-white group-hover:text-accent-light transition-colors leading-snug">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FLASH DEALS / LIMITED CURATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                <Zap className="w-6 h-6 fill-accent" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-text-main">
                    Artisan Flash Vault
                  </h2>
                  <Badge variant="accent" size="xs">
                    Limited Allocation
                  </Badge>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Exclusive seasonal privileges direct from premier workshops.
                </p>
              </div>
            </div>

            {/* Countdown UI */}
            <div className="flex items-center gap-2 self-start md:self-auto bg-surface-muted px-4 py-2 rounded-xl border border-border">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-text-muted">Vault Closes In:</span>
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-text-main">
                <span className="bg-primary text-white px-2 py-1 rounded">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-primary text-white px-2 py-1 rounded">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-primary text-white px-2 py-1 rounded">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          {/* Flash Deals Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS (WITH CATEGORY TABS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-border/80 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-1">
              Handpicked Spotlight
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-main">
              Featured Masterpieces
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setActiveCategoryTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeCategoryTab === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-muted hover:bg-surface-hover text-text-muted'
              }`}
            >
              All Pieces
            </button>
            {categoriesList.map((cat) => (
              <button
                key={cat._id || cat.id || cat.slug}
                onClick={() => setActiveCategoryTab(cat.slug || cat.name?.toLowerCase())}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeCategoryTab === (cat.slug || cat.name?.toLowerCase())
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-muted hover:bg-surface-hover text-text-muted'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFeatured.length > 0 ? (
            filteredFeatured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-text-muted text-sm">
              No creations currently matching this category filter.
            </div>
          )}
        </div>
      </section>

      {/* 5. POPULAR BRANDS / MASTER ATELIERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-border/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-1">
              Sovereign Ateliers
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-main">
              Featured Artisan Houses
            </h2>
          </div>
          <Link
            to="/sellers"
            className="text-xs font-semibold text-text-main hover:text-accent flex items-center gap-1 transition-colors"
          >
            All Ateliers <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/products?brand=${brand.slug}`}
              className="bg-surface rounded-xl border border-border p-5 hover:shadow-card hover:border-border-dark transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-full overflow-hidden mb-4 border border-border group-hover:scale-105 transition-transform">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-serif text-base font-bold text-text-main group-hover:text-accent transition-colors">
                  {brand.name}
                </h4>
                <p className="text-[11px] font-semibold text-text-subtle uppercase tracking-wider mt-0.5">
                  {brand.origin}
                </p>
                <p className="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed">
                  {brand.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-text-main group-hover:text-accent">
                <span>Explore Atelier</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-border/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-1">
              Fresh From The Benches
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-main">
              Latest Arrivals
            </h2>
          </div>
          <Link
            to="/products?sort=newest"
            className="text-xs font-semibold text-text-main hover:text-accent flex items-center gap-1 transition-colors"
          >
            View All New <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-border/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-1">
              Patron Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-main">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/products?sort=popular"
            className="text-xs font-semibold text-text-main hover:text-accent flex items-center gap-1 transition-colors"
          >
            Explore Best Sellers <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. EDITORIAL PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-8 sm:p-14 lg:p-16 border border-white/10 shadow-2xl">
          {/* High-Resolution Atelier Workshop Banner Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=2000&auto=format&fit=crop"
              alt="Master Artisan Atelier Bench"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent-light border border-accent/30 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-accent" />
              The Sovereign Manifesto
            </span>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight text-white">
              Honoring Heritage Craft In An Era of Mass Production.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-light">
              Every item featured on Zareen is conceived, crafted, and signed by independent artisans who refuse industrial shortcuts. When you acquire a piece, you directly sustain master generational trades.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/products">
                <Button variant="accent" size="md">
                  Shop Verified Goods
                </Button>
              </Link>
              <Link to="/seller/register">
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={Store}
                  className="text-white border-white/25 hover:bg-white/10 backdrop-blur-xs"
                >
                  Join as an Artisan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. WHY SHOP WITH ZAREEN (5 PILLARS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-1">
            The Zareen Commitment
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-main">
            Why Discerning Patrons Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {valueProps.map((prop) => {
            const Icon = iconMap[prop.icon] || ShieldCheck;
            return (
              <div
                key={prop.id}
                className="bg-surface rounded-xl border border-border p-6 text-center flex flex-col items-center shadow-subtle hover:shadow-card transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-muted text-accent flex items-center justify-center mb-4 border border-border">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h4 className="font-serif text-sm font-bold text-text-main mb-2">
                  {prop.title}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-1">
            Verified Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-main">
            Words From Global Patrons
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-surface rounded-2xl border border-border p-6 sm:p-8 flex flex-col justify-between shadow-subtle hover:shadow-card transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <h4 className="font-serif text-base font-bold text-text-main">
                  "{test.title}"
                </h4>

                <p className="text-xs text-text-muted leading-relaxed italic">
                  "{test.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-border/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={test.avatar}
                    alt={test.author}
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-text-main">{test.author}</h5>
                    <p className="text-[11px] text-text-muted">{test.location}</p>
                  </div>
                </div>

                {test.verified && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-success bg-success-light px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. HOMEPAGE GAZETTE / NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-muted rounded-2xl border border-border p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-subtle space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-surface border border-border text-accent shadow-xs">
            <Mail className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
              Join The Zareen Private Registry
            </h3>
            <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto leading-relaxed">
              Receive private invitations to seasonal atelier drops, master artisan profiles, and complimentary insured transit on your premiere commission.
            </p>
          </div>

          {newsletterSubscribed ? (
            <div className="p-4 rounded-xl bg-success-light border border-emerald-200 text-success-dark text-xs font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>You are inscribed in the private registry. Welcome.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your personal email..."
                className="flex-1 px-4 py-3 text-xs bg-surface border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                required
              />
              <Button type="submit" variant="primary" size="md">
                Inscribe
              </Button>
            </form>
          )}

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-text-muted pt-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Private Curations
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Zero Spam Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Unsubscribe Anytime
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
