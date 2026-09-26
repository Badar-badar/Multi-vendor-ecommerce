import { Eye, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useRecentlyViewed from '../../hooks/useRecentlyViewed';
import ProductCard from '../product/ProductCard';

export const RecentlyViewedSection = ({
  title = 'Recently Explored Curations',
  subtitle = 'Creations you have recently inspected from our artisan ateliers.',
  maxItems = 4,
  className = '',
}) => {
  const { items, clearHistory } = useRecentlyViewed();

  if (!items || items.length === 0) return null;

  const displayItems = items.slice(0, maxItems);

  return (
    <section className={`py-12 border-t border-border/80 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent uppercase tracking-wider mb-1">
            <Eye className="w-3.5 h-3.5" />
            <span>Browsing History</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-text-muted mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={clearHistory}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-rose-600 transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-rose-50"
            title="Clear recently viewed history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>

          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-xs font-bold text-text-main hover:text-accent transition-colors"
          >
            <span>View All Curations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid of recently viewed products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayItems.map((product, idx) => (
          <ProductCard key={product.id || product._id || idx} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
