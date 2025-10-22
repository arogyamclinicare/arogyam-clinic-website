# 🏥 Arogyam Clinic Management System

A comprehensive healthcare management system built with React, TypeScript, and Supabase.

## ✨ Features

### 🔐 Admin Dashboard
- **Secure Authentication**: Browser-compatible admin login
- **Patient Management**: View, edit, and manage patient records
- **Consultation Management**: Book, edit, and track consultations
- **Prescription Management**: Create and manage prescriptions
- **Analytics Dashboard**: View system statistics and reports

### 👥 Patient Portal
- **Patient Login**: Secure patient authentication
- **Appointment Booking**: Book consultations online
- **Medical History**: View consultation history
- **Prescription Access**: Download prescription PDFs

### 🛡️ Security Features
- **Rate Limiting**: Prevents brute force attacks
- **Session Management**: Secure session handling
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Robust error boundaries

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd arogyam-clinic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.template .env
   ```
   
   Configure your `.env` file with:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_EMAIL=admin@arogyam.com
   VITE_ADMIN_PASSWORD=your_admin_password
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   ```
   http://localhost:3000
   ```


## 📁 Project Structure

```
arogyam-clinic/
├── components/          # React components
│   ├── admin/          # Admin-specific components
│   ├── modals/         # Modal components
│   ├── ui/             # Reusable UI components
│   └── ...
├── lib/                # Utility libraries
│   ├── security/       # Security utilities
│   ├── supabase.ts     # Database client
│   └── ...
├── styles/             # CSS styles
├── __tests__/          # Test files
└── public/             # Static assets
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## 🔒 Security

This application implements several security measures:

- **Environment Variables**: All sensitive data stored in environment variables
- **Rate Limiting**: Login attempt limiting
- **Input Validation**: Comprehensive form validation with Zod
- **Error Boundaries**: Graceful error handling
- **Secure Sessions**: Browser-compatible session management

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure Environment Variables**
   - Add all `VITE_*` variables in Vercel dashboard
   - Ensure production values are set

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting provider

## 📊 Database Schema

The application uses Supabase with the following main tables:

- `patients` - Patient information
- `consultations` - Consultation records
- `prescription_drugs` - Prescription details
- `drug_templates` - Medicine templates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@arogyam.com or create an issue in the repository.

---

**Built with ❤️ for Arogyam Clinic**