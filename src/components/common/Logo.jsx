import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({
  variant = 'default', // 'default' | 'seller' | 'admin' | 'icon' | 'badge'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  to = '/',
  href,
  className = '',
  showSubtitle = true,
  useImage = true,
}) => {
  const sizeConfig = {
    sm: {
      iconSize: 'w-7 h-7 rounded-lg',
      textSize: 'text-lg',
      subSize: 'text-[8px]',
      gap: 'gap-2',
    },
    md: {
      iconSize: 'w-10 h-10 rounded-xl',
      textSize: 'text-xl sm:text-2xl',
      subSize: 'text-[9px]',
      gap: 'gap-2.5',
    },
    lg: {
      iconSize: 'w-12 h-12 rounded-2xl',
      textSize: 'text-2xl sm:text-3xl',
      subSize: 'text-[10px]',
      gap: 'gap-3',
    },
    xl: {
      iconSize: 'w-16 h-16 rounded-2xl',
      textSize: 'text-4xl',
      subSize: 'text-xs',
      gap: 'gap-4',
    },
  };

  const { iconSize, textSize, subSize, gap } = sizeConfig[size] || sizeConfig.md;

  // Render Luxury Gold Monogram Emblem Image
  const renderEmblem = () => {
    return (
      <img
        src="/zareen-logo.jpg"
        alt="Zareen Luxury Logo"
        className={`${iconSize} object-cover object-center rounded-xl shadow-md border border-primary/30 shrink-0 group-hover:scale-105 transition-transform duration-300`}
      />
    );
  };

  const subtitles = {
    default: 'Artisanal Luxury',
    seller: 'Artisan Studio Portal',
    admin: 'Executive Governance',
  };

  const currentSubtitle = subtitles[variant] || 'Artisanal Luxury';

  const content = (
    <div className={`inline-flex items-center ${gap} group select-none ${className}`}>
      {renderEmblem()}

      {variant !== 'icon' && (
        <div className="flex flex-col leading-tight min-w-0 text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif font-bold tracking-tight text-text-main group-hover:text-primary transition-colors ${textSize}`}
            >
              Zareen
            </span>
            {variant === 'admin' && (
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-primary-light text-primary uppercase tracking-wider border border-primary/20">
                HQ
              </span>
            )}
          </div>
          {showSubtitle && (
            <span
              className={`uppercase tracking-[0.2em] text-text-subtle font-semibold -mt-0.5 truncate block ${subSize}`}
            >
              {currentSubtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="no-underline">
        {content}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className="no-underline">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
