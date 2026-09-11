import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Home, Search, ArrowRight, Store, ShoppingBag } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Subtle Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light border border-accent/20 text-accent-hover text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Error 404 — Coordinates Unresolved</span>
        </div>

        {/* Hero Number & Title */}
        <div className="space-y-3">
          <h1 className="font-serif text-7xl sm:text-8xl font-black text-primary tracking-tight">
            404
          </h1>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
            This Sanctuary Cannot Be Located
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
            The artisan atelier, curated collection, or page you are seeking might have been archived, relocated, or temporarily sequestered.
          </p>
        </div>

        {/* Quick Search Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto relative flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search our fine marketplace..."
            className="w-full text-xs sm:text-sm bg-surface rounded-xl border border-border pl-4 pr-12 py-3 shadow-subtle focus-ring"
          />
          <button
            type="submit"
            className="absolute right-2 p-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Action Options */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={Home}>
              Return to Marketplace
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" size="md" leftIcon={ShoppingBag}>
              Explore Catalog
            </Button>
          </Link>
          <Link to="/stores">
            <Button variant="outline" size="md" leftIcon={Store}>
              Browse Ateliers
            </Button>
          </Link>
        </div>

        {/* Helpful Popular Links */}
        <div className="pt-6 border-t border-border">
          <p className="text-xs text-text-muted mb-3 font-medium">Popular destinations:</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-accent">
            <Link to="/categories" className="hover:underline flex items-center gap-1">
              <span>All Departments</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link to="/support" className="hover:underline flex items-center gap-1">
              <span>Client Concierge</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link to="/orders/track" className="hover:underline flex items-center gap-1">
              <span>Track Order</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
