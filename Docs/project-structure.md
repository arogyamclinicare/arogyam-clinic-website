# Project Structure
## Arogyam Clinic - Homeopathic Healthcare Platform

### Root Directory Structure
```
loveyoucursur/
├── .cursor/                    # Cursor IDE configuration
│   └── rules/                 # Context Engineering rules
│       ├── generate.mdc       # Generation rules
│       └── workflow.mdc       # Workflow rules
├── Docs/                      # Project documentation
│   ├── PRD.md                # Project Requirements Document
│   ├── implementation-plan.md # Implementation timeline
│   ├── project-structure.md   # This file
│   ├── ui-ux-docs.md         # Design system documentation
│   └── bug-tracking.md       # Issue tracking and solutions
├── public/                    # Static assets
│   ├── images/               # Image files
│   ├── icons/                # Icon files
│   └── favicon.ico           # Site favicon
├── src/                       # Source code
│   ├── components/           # React components
│   ├── pages/                # Page components
│   ├── hooks/                # Custom React hooks
│   ├── context/              # React Context providers
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── styles/               # CSS and styling files
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── .eslintrc.js              # ESLint configuration
├── .prettierrc               # Prettier configuration
└── README.md                 # Project documentation
```

### Source Code Organization

#### Components Directory (`src/components/`)
```
components/
├── ui/                       # Reusable UI components
│   ├── Button.tsx           # Button component
│   ├── Input.tsx            # Input field component
│   ├── Modal.tsx            # Modal component
│   └── Logo.tsx             # Logo component
├── layout/                   # Layout components
│   ├── Header.tsx           # Site header
│   ├── Footer.tsx           # Site footer
│   ├── Navigation.tsx       # Navigation menu
│   └── Layout.tsx           # Main layout wrapper
├── sections/                 # Page sections
│   ├── HeroSection.tsx      # Hero section
│   ├── AboutUs.tsx          # About us section
│   ├── TreatmentsSection.tsx # Treatments section
│   ├── HealthPlans.tsx      # Health plans section
│   └── FAQs.tsx             # FAQ section
├── modals/                   # Modal components
│   ├── ConsultationBooking.tsx # Consultation booking modal
│   └── AuthModal.tsx        # Authentication modal
├── forms/                    # Form components
│   ├── ConsultationForm.tsx # Consultation form
│   ├── PatientForm.tsx      # Patient registration form
│   └── AdminForm.tsx        # Admin form components
└── admin/                    # Admin panel components
    ├── Dashboard.tsx         # Admin dashboard
    ├── PatientManagement.tsx # Patient management
    ├── AppointmentManagement.tsx # Appointment management
    └── UserManagement.tsx    # User management
```

#### Pages Directory (`src/pages/`)
```
pages/
├── HomePage.tsx              # Homepage
├── AboutPage.tsx             # About page
├── TreatmentsPage.tsx        # Treatments page
├── HealthPlansPage.tsx       # Health plans page
├── PatientPortal.tsx         # Patient portal
├── AdminPanel.tsx            # Admin panel
├── ContactPage.tsx           # Contact page
└── PrivacyPolicyPage.tsx     # Privacy policy page
```

#### Context Directory (`src/context/`)
```
context/
├── ConsultationContext.tsx   # Consultation state management
├── AuthContext.tsx           # Authentication state
├── AdminContext.tsx          # Admin panel state
└── UIContext.tsx             # UI state management
```

#### Types Directory (`src/types/`)
```
types/
├── consultation.ts            # Consultation-related types
├── patient.ts                # Patient-related types
├── admin.ts                  # Admin-related types
├── user.ts                   # User-related types
└── common.ts                 # Common type definitions
```

#### Utils Directory (`src/utils/`)
```
utils/
├── validation.ts             # Validation utilities
├── formatting.ts             # Data formatting utilities
├── api.ts                    # API utility functions
├── storage.ts                # Local storage utilities
└── constants.ts              # Application constants
```

#### Styles Directory (`src/styles/`)
```
styles/
├── globals.css               # Global CSS styles
├── components.css            # Component-specific styles
├── utilities.css             # Utility classes
└── variables.css             # CSS custom properties
```

### Configuration Files

#### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite --host",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  }
}
```

#### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### Tailwind Configuration
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        }
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

### File Naming Conventions

#### Components
- **PascalCase**: `ConsultationBooking.tsx`, `PatientPortal.tsx`
- **Descriptive names**: Clear, purpose-indicating names
- **Consistent suffixes**: Use appropriate suffixes (Section, Modal, Form)

#### Files
- **kebab-case**: `consultation-booking.tsx`, `patient-portal.tsx`
- **Descriptive names**: Clear, purpose-indicating names
- **Consistent extensions**: `.tsx` for React components, `.ts` for utilities

#### Folders
- **kebab-case**: `patient-portal/`, `admin-panel/`
- **Logical grouping**: Group related components together
- **Clear hierarchy**: Use nested folders for complex features

### Import Organization

#### Import Order
1. **React imports**: `import React from 'react'`
2. **Third-party libraries**: `import { useState } from 'react'`
3. **Internal components**: `import { Button } from '../ui/Button'`
4. **Types**: `import type { Patient } from '../../types/patient'`
5. **Utilities**: `import { formatDate } from '../../utils/formatting'`
6. **Styles**: `import './Component.css'`

#### Import Paths
- **Absolute paths**: Use `@/` alias for src directory
- **Relative paths**: Use relative paths for closely related files
- **Consistent structure**: Maintain consistent import patterns

### Code Organization Principles

#### Single Responsibility
- Each component should have one clear purpose
- Break complex components into smaller, focused ones
- Keep functions small and focused

#### Separation of Concerns
- Separate business logic from UI components
- Use custom hooks for complex state management
- Keep components pure and predictable

#### Reusability
- Create reusable UI components
- Extract common logic into utility functions
- Use composition over inheritance

#### Maintainability
- Write clear, self-documenting code
- Use consistent naming conventions
- Add comprehensive comments for complex logic
