# 🚀 Arogyam Clinic - Supabase Database Integration Guide

This guide will help you set up Supabase database integration for your Arogyam Clinic consultation booking system.

## 📋 Prerequisites

- Supabase account (free tier works perfectly)
- Your Arogyam Clinic project files
- Basic understanding of environment variables

## 🛠️ Step-by-Step Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `arogyam-clinic`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project" (takes ~2 minutes)

### Step 2: Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings → API**
2. Copy these values:
   - **URL**: `https://your-project-id.supabase.co`
   - **Anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
### Step 3: Configure Environment Variables

1. Open your project root directory
2. Create/edit the `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_hereW0Jsignw
```

⚠️ **Replace the values above with your actual Supabase credentials!**

### Step 4: Create Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste this SQL script:

```sql
-- Arogyam Clinic Consultation Booking Table
CREATE TABLE IF NOT EXISTS consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    condition TEXT,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    consultation_type TEXT NOT NULL CHECK (consultation_type IN ('video', 'phone')),
    treatment_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_date ON consultations(preferred_date);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_email ON consultations(email);

-- Enable Row Level Security (RLS)
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Allow public insert" ON consultations
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON consultations
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated update" ON consultations
    FOR UPDATE TO authenticated
    USING (true);

-- Add sample data for testing (optional)
INSERT INTO consultations (name, email, phone, age, gender, condition, preferred_date, preferred_time, consultation_type, treatment_type, status) VALUES
('John Doe', 'john.doe@example.com', '+91 98765 43210', 35, 'male', 'Chronic headaches and stress', '2025-01-25', '10:00:00', 'video', 'General Consultation', 'pending'),
('Jane Smith', 'jane.smith@example.com', '+91 98765 43211', 28, 'female', 'Digestive issues', '2025-01-26', '14:00:00', 'phone', 'Digestive Health', 'confirmed');
```

3. Click **Run** to execute the script
4. Verify the table was created in **Table Editor → consultations**

### Step 5: Test the Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test the booking form:**
   - Open your website at `http://localhost:3000`
   - Click "Book Free Consultation" 
   - Fill and submit the form
   - Check for success message

3. **Test the admin panel:**
   - Go to `http://localhost:3000/admin`
   - Login: Use environment variables for admin credentials
   - Go to "Consultations" tab
   - Verify your test booking appears

## 🔧 What's Been Implemented

### ✅ Frontend Changes
- **New Supabase client** (`lib/supabase.ts`)
- **Database context** (`components/context/SupabaseContext.tsx`)
- **Updated booking form** - saves to Supabase database
- **Updated admin dashboard** - displays real data from database
- **Error handling** - shows clear error messages
- **Loading states** - better user experience

### ✅ Database Features
- **Secure table structure** with proper constraints
- **Row Level Security (RLS)** enabled
- **Performance indexes** for fast queries
- **Data validation** at database level

### ✅ Admin Features
- **Real-time data** from Supabase
- **Status management** - update consultation status
- **Search functionality** - find consultations quickly
- **Error handling** - retry failed operations
- **Refresh button** - manual data reload

## 🎯 How It Works

### User Journey:
1. **User visits website** → clicks "Book Consultation"
2. **Fills booking form** → submits data
3. **Form validates** → saves to Supabase database
4. **Success confirmation** → booking ID generated
5. **Admin notification** → new booking appears in admin panel

### Admin Journey:
1. **Admin logs in** → goes to admin panel
2. **Views consultations** → sees all bookings from database
3. **Updates status** → pending → confirmed → completed
4. **Searches/filters** → finds specific consultations

## 🔍 Testing Checklist

- [ ] **Environment variables** set correctly
- [ ] **Database table** created in Supabase
- [ ] **Form submission** works without errors
- [ ] **Success message** appears after booking
- [ ] **Admin panel** shows booking data
- [ ] **Status updates** work in admin panel
- [ ] **Search function** works properly
- [ ] **Error handling** shows appropriate messages

## 🐛 Troubleshooting

### Common Issues:

**❌ "Cannot read properties of undefined"**
- Check `.env` file has correct Supabase credentials
- Restart development server after updating `.env`

**❌ "Insert failed" or database errors**
- Verify table was created with correct schema
- Check Row Level Security policies in Supabase

**❌ Admin panel shows "No consultations found"**
- Submit a test booking first
- Check Supabase Table Editor for data
- Verify internet connection

**❌ Form submission hangs**
- Check browser console for error messages
- Verify Supabase URL and key in `.env`
- Check network tab for failed requests

## 🚀 Next Steps

### Immediate:
1. **Test thoroughly** with different form data
2. **Add real clinic information** in booking confirmations
3. **Customize email notifications** (future enhancement)

### Future Enhancements:
1. **Email confirmations** for patients
2. **SMS notifications** for appointment reminders
3. **Calendar integration** for Dr. Kajal
4. **Patient portal** for booking history
5. **Payment integration** for consultations

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Test with a fresh browser session
4. Check Supabase dashboard for any service issues

---

**🎉 Congratulations! Your consultation booking system is now fully integrated with Supabase database!**

The system is ready for production use with secure data storage and a professional admin interface.
