# 🚀 N8N Setup Guide - Arogyam Clinic

## 📁 **Files Created:**
✅ `n8n-docker-compose.yml` - N8N configuration  
✅ `railway.json` - Railway deployment config  
✅ `n8n-workflows/welcome-email-workflow.json` - Welcome email automation  
✅ `n8n-workflows/login-credentials-workflow.json` - Login credentials email automation  

---

## 🔄 **Step 2: Push to GitHub**

### **Option A: GitHub Desktop (Easiest)**
1. **Download** [GitHub Desktop](https://desktop.github.com/)
2. **Clone** your `arogyam-n8n-automation` repository
3. **Copy all files** from this folder to the repository folder
4. **Commit** and **Push** to GitHub

### **Option B: Manual Upload**
1. **Go to** your GitHub repository
2. **Click "Add file"** → "Upload files"
3. **Drag and drop** all the files above
4. **Click "Commit changes"**

---

## 🚂 **Step 3: Deploy on Railway**

1. **Go to**: [railway.app](https://railway.app)
2. **Sign up** with GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose** `arogyam-n8n-automation`
6. **Wait** for deployment (2-3 minutes)

---

## 🔐 **Step 4: Access N8N**

- **URL**: Your Railway project URL (e.g., `https://your-project.railway.app`)
- **Username**: `admin`
- **Password**: `arogyam2024`

---

## 📧 **Step 5: Import Workflows**

1. **Open N8N** in your browser
2. **Go to "Workflows"**
3. **Click "Import from File"**
4. **Import both workflow files**:
   - `welcome-email-workflow.json`
   - `login-credentials-workflow.json`

---

## 🔑 **Step 6: Add Credentials**

1. **Go to "Credentials"** in N8N
2. **Add Gmail credentials**:
   - **Email**: `arogyamCliniccare@gmail.com`
   - **Password**: Your App Password (16 characters)
3. **Add Supabase credentials**:
   - **URL**: Your Supabase project URL
   - **API Key**: Your Supabase anon key

---

## ✅ **Ready to Test!**

**Total time needed: ~15 minutes** to get everything working!

**Let me know when you've completed Step 2 (GitHub upload)!** 🚀✨
