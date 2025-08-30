import { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  onClick?: () => void;
  theme?: 'light' | 'dark' | 'auto';
}

/**
 * Professional Logo Component for Arogyam Clinic
 * Features:
 * - Multiple size variants
 * - Fallback to text logo if image fails
 * - Optimized loading with LazyImage
 * - Accessible with proper alt text
 */
export function Logo({ 
  size = 'md', 
  variant = 'full', 
  className = '', 
  onClick,
  theme = 'auto'
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20'
  };

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl', 
    xl: 'text-4xl'
  };

  const getTextColorClasses = () => {
    switch (theme) {
      case 'dark':
        return 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-blue-300';
      case 'light':
        return 'text-neutral-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600';
      case 'auto':
      default:
        return 'text-neutral-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600';
    }
  };

  // Fallback component when logo image is not available
  const FallbackLogo = () => (
    <div className={`flex items-center space-x-3 group ${onClick ? 'cursor-pointer' : ''}`}>
      <div className="relative">
        <div className={`bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 animate-glow ${
          size === 'sm' ? 'w-8 h-8' :
          size === 'md' ? 'w-10 h-10' :
          size === 'lg' ? 'w-12 h-12' :
          'w-16 h-16'
        }`}>
          <div className={`bg-white rounded-md flex items-center justify-center ${
            size === 'sm' ? 'w-5 h-5' :
            size === 'md' ? 'w-6 h-6' :
            size === 'lg' ? 'w-7 h-7' :
            'w-9 h-9'
          }`}>
            <div className={`bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full ${
              size === 'sm' ? 'w-2 h-2' :
              size === 'md' ? 'w-3 h-3' :
              size === 'lg' ? 'w-4 h-4' :
              'w-5 h-5'
            }`}></div>
          </div>
        </div>
      </div>
      {variant !== 'icon' && (
        <div className={`${textSizeClasses[size]} font-display ${getTextColorClasses()} transition-colors duration-300`}>
          Arogyam
        </div>
      )}
    </div>
  );

  // Always try to load the logo first, fallback only on error
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    setHasError(true);
  };

  const handleImageLoad = () => {
    setHasError(false);
  };

  // Show fallback only if image fails to load
  if (hasError) {
    return (
      <div className={className} onClick={onClick}>
        <FallbackLogo />
      </div>
    );
  }

  // Render different variants
  if (variant === 'icon') {
    return (
      <div className={`${className} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
        <img
          src="/images/branding/arogyam-logo.png"
          alt="Arogyam Clinic Logo"
          className={`${sizeClasses[size]} w-auto object-contain transition-all duration-300 hover:scale-105`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="eager"
        />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`${className} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
        <div className={`${textSizeClasses[size]} font-display ${getTextColorClasses()} transition-colors duration-300`}>
          Arogyam
        </div>
      </div>
    );
  }

  // Full logo with image and text
  return (
    <div className={`${className} flex items-center space-x-3 group ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <div className="relative">
        <img
          src="/images/branding/arogyam-logo.png"
          alt="Arogyam Clinic Logo"
          className={`${sizeClasses[size]} w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
            theme === 'dark' ? 'brightness-0 invert' : ''
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="eager"
        />
        {/* Enhanced glow effect for dark theme */}
        {theme === 'dark' && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-300"></div>
        )}
      </div>
      <div className={`${textSizeClasses[size]} font-display font-bold ${getTextColorClasses()} transition-colors duration-300`}>
        Arogyam
      </div>
    </div>
  );
}
