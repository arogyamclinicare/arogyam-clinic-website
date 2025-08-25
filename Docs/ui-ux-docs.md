# UI/UX Documentation
## Arogyam Clinic - Homeopathic Healthcare Platform

### Design Philosophy
**Trust & Credibility**: Professional medical-grade design that instills confidence  
**Accessibility First**: WCAG 2.1 AA compliance for all users  
**Mobile-First**: Optimized for mobile devices with responsive desktop experience  
**Performance**: Fast, smooth interactions that enhance user experience

### Color System

#### Primary Colors
```css
/* Blue - Trust, Medical, Professional */
--primary-50: #eff6ff;   /* Light blue background */
--primary-100: #dbeafe;   /* Very light blue */
--primary-500: #3b82f6;   /* Main blue */
--primary-600: #2563eb;   /* Darker blue */
--primary-900: #1e3a8a;   /* Dark blue */
```

#### Secondary Colors
```css
/* Green - Health, Wellness, Success */
--secondary-50: #f0fdf4;   /* Light green background */
--secondary-100: #dcfce7;   /* Very light green */
--secondary-500: #22c55e;   /* Main green */
--secondary-600: #16a34a;   /* Darker green */
```

#### Neutral Colors
```css
/* Grays - Text, Borders, Backgrounds */
--neutral-50: #f9fafb;     /* Light background */
--neutral-100: #f3f4f6;    /* Light border */
--neutral-500: #6b7280;    /* Medium text */
--neutral-600: #4b5563;    /* Dark text */
--neutral-900: #111827;    /* Very dark text */
```

#### Semantic Colors
```css
/* Success, Warning, Error */
--success: #10b981;         /* Green for success */
--warning: #f59e0b;         /* Amber for warnings */
--error: #ef4444;           /* Red for errors */
--info: #3b82f6;            /* Blue for information */
```

### Typography

#### Font Family
```css
/* Primary Font */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

#### Font Sizes
```css
/* Heading Scale */
--text-xs: 0.75rem;        /* 12px - Small labels */
--text-sm: 0.875rem;       /* 14px - Body small */
--text-base: 1rem;          /* 16px - Body text */
--text-lg: 1.125rem;        /* 18px - Body large */
--text-xl: 1.25rem;         /* 20px - Subheadings */
--text-2xl: 1.5rem;         /* 24px - Section headings */
--text-3xl: 1.875rem;       /* 30px - Page headings */
--text-4xl: 2.25rem;        /* 36px - Hero headings */
```

#### Font Weights
```css
--font-light: 300;          /* Light text */
--font-normal: 400;         /* Regular text */
--font-medium: 500;         /* Medium emphasis */
--font-semibold: 600;       /* Semi-bold headings */
--font-bold: 700;           /* Bold headings */
--font-extrabold: 800;      /* Extra bold hero text */
```

### Component Library

#### Buttons

##### Primary Button
```tsx
<button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105">
  Primary Action
</button>
```

##### Secondary Button
```tsx
<button className="bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50 px-6 py-3 rounded-xl font-medium transition-all duration-300">
  Secondary Action
</button>
```

##### Ghost Button
```tsx
<button className="text-primary-500 hover:bg-primary-50 px-6 py-3 rounded-xl font-medium transition-all duration-300">
  Ghost Action
</button>
```

#### Form Elements

##### Input Field
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-neutral-700">
    Label
  </label>
  <input 
    type="text"
    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
    placeholder="Placeholder text"
  />
</div>
```

##### Select Dropdown
```tsx
<select className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

##### Checkbox
```tsx
<label className="flex items-center space-x-3 cursor-pointer">
  <input 
    type="checkbox"
    className="w-5 h-5 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
  />
  <span className="text-sm text-neutral-700">Checkbox label</span>
</label>
```

#### Cards

##### Basic Card
```tsx
<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
  <h3 className="text-xl font-semibold text-neutral-900 mb-2">Card Title</h3>
  <p className="text-neutral-600">Card content goes here</p>
</div>
```

##### Feature Card
```tsx
<div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 border border-primary-100 hover:shadow-lg transition-all duration-300">
  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
    <Icon className="w-6 h-6 text-white" />
  </div>
  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Feature Title</h3>
  <p className="text-neutral-600">Feature description</p>
</div>
```

#### Modals

##### Basic Modal
```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-2xl p-6 max-w-md w-full">
    <h2 className="text-xl font-semibold mb-4">Modal Title</h2>
    <p className="text-neutral-600 mb-6">Modal content</p>
    <div className="flex space-x-3">
      <button className="flex-1 bg-primary-500 text-white py-2 rounded-xl">Confirm</button>
      <button className="flex-1 border border-neutral-300 py-2 rounded-xl">Cancel</button>
    </div>
  </div>
</div>
```

### Layout System

#### Container Sizes
```css
/* Responsive containers */
.container-sm: max-width: 640px;    /* Small screens */
.container-md: max-width: 768px;    /* Medium screens */
.container-lg: max-width: 1024px;   /* Large screens */
.container-xl: max-width: 1280px;   /* Extra large screens */
```

#### Spacing Scale
```css
/* Consistent spacing using Tailwind scale */
--space-1: 0.25rem;        /* 4px */
--space-2: 0.5rem;         /* 8px */
--space-3: 0.75rem;        /* 12px */
--space-4: 1rem;           /* 16px */
--space-6: 1.5rem;         /* 24px */
--space-8: 2rem;           /* 32px */
--space-12: 3rem;          /* 48px */
--space-16: 4rem;          /* 64px */
```

#### Grid System
```css
/* Responsive grid columns */
.grid-cols-1: 1 column;           /* Mobile */
.grid-cols-2: 2 columns;          /* Tablet */
.grid-cols-3: 3 columns;          /* Desktop */
.grid-cols-4: 4 columns;          /* Large desktop */
```

### Responsive Design

#### Breakpoints
```css
/* Mobile-first approach */
sm: 640px;    /* Small tablets */
md: 768px;    /* Tablets */
lg: 1024px;   /* Laptops */
xl: 1280px;   /* Desktops */
2xl: 1536px;  /* Large desktops */
```

#### Mobile-First Classes
```css
/* Example responsive classes */
.text-base md:text-lg lg:text-xl;           /* Responsive text */
p-4 md:p-6 lg:p-8;                         /* Responsive padding */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3; /* Responsive grid */
```

### Accessibility Guidelines

#### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Focus Indicators**: Clear focus states for keyboard navigation
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Alt Text**: Descriptive alt text for all images
- **Keyboard Navigation**: Full functionality via keyboard

#### Touch Targets
```css
/* Minimum touch target size */
min-height: 44px;    /* iOS Human Interface Guidelines */
min-width: 44px;     /* Ensure easy touch interaction */
```

#### Screen Reader Support
```tsx
// Proper ARIA labels
<button aria-label="Close consultation modal">
  <X className="w-6 h-6" />
</button>

// Semantic HTML structure
<main role="main">
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">Welcome to Arogyam Clinic</h1>
  </section>
</main>
```

### Animation & Transitions

#### Micro-interactions
```css
/* Hover effects */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Button interactions */
.btn-interactive {
  transition: all 0.3s ease;
}

.btn-interactive:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
```

#### Page Transitions
```css
/* Smooth page transitions */
.page-transition {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
}
```

### Performance Guidelines

#### Image Optimization
- Use WebP format with fallbacks
- Implement lazy loading for images
- Optimize image sizes for different screen densities
- Use appropriate compression ratios

#### CSS Optimization
- Minimize CSS bundle size
- Use CSS-in-JS sparingly
- Implement critical CSS for above-the-fold content
- Use CSS custom properties for theming

#### JavaScript Performance
- Implement code splitting
- Use React.memo for expensive components
- Optimize re-renders with useMemo and useCallback
- Lazy load non-critical components

### Design Tokens

#### Spacing Tokens
```css
:root {
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 3rem;      /* 48px */
}
```

#### Border Radius Tokens
```css
:root {
  --radius-sm: 0.375rem;    /* 6px */
  --radius-md: 0.5rem;      /* 8px */
  --radius-lg: 0.75rem;     /* 12px */
  --radius-xl: 1rem;        /* 16px */
  --radius-2xl: 1.5rem;     /* 24px */
}
```

#### Shadow Tokens
```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
}
```

### Implementation Notes

#### CSS Custom Properties
- Use CSS custom properties for theming
- Implement dark mode support
- Ensure consistent spacing and sizing

#### Component Variants
- Create consistent component variants
- Use compound variants for complex states
- Maintain design system consistency

#### Testing
- Test across different devices and browsers
- Verify accessibility compliance
- Performance testing on various network conditions
