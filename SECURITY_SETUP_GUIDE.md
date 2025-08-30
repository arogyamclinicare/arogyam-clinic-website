# 🔒 Security Setup Guide for Production Deployment
## Arogyam Homeopathic Clinic Website

**⚠️ CRITICAL: Complete this guide before going live!**

---

## **🚨 IMMEDIATE SECURITY ACTIONS REQUIRED**

### **1. Regenerate All Compromised Credentials**

Since your production credentials were exposed in version control, you **MUST** regenerate everything:

#### **🔑 Supabase API Keys**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. **Revoke the current anon key**
4. **Generate a new anon key**
5. Update your production environment

#### **🔐 Admin Password**
1. **Change your admin password immediately**
2. Generate new bcrypt hash
3. Update production environment

---

## **🔧 STEP-BY-STEP SECURITY SETUP**

### **Step 1: Create Production Environment File**

```bash
# Copy the template
cp env.template .env.production

# Edit with your NEW credentials
nano .env.production
```

### **Step 2: Generate Secure Admin Password**

```bash
# Install bcrypt CLI
npm install -g bcrypt-cli

# Generate hash for your new password
bcrypt-cli hash "your_new_secure_password"
```

### **Step 3: Update Supabase Security**

1. **Row Level Security (RLS)**
   - Enable RLS on all tables
   - Create proper policies for each table
   - Test policies thoroughly

2. **API Key Permissions**
   - Use minimal required permissions
   - Restrict access to necessary tables only
   - Monitor API usage

### **Step 4: Vercel Security Configuration**

Your `vercel.json` already has excellent security headers:
- ✅ HSTS (HTTP Strict Transport Security)
- ✅ CSP (Content Security Policy)
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block

---

## **🔍 SECURITY CHECKLIST**

### **✅ Environment Security**
- [ ] `.env.production` created with NEW credentials
- [ ] Old credentials revoked from Supabase
- [ ] New admin password hash generated
- [ ] Environment file NOT committed to git

### **✅ Supabase Security**
- [ ] RLS policies implemented
- [ ] New API key generated
- [ ] Old API key revoked
- [ ] Database access restricted

### **✅ Application Security**
- [ ] CSRF protection active
- [ ] Rate limiting configured
- [ ] Input validation working
- [ ] Session management secure

### **✅ Deployment Security**
- [ ] HTTPS enforced
- [ ] Security headers active
- [ ] Error messages sanitized
- [ ] Logging configured

---

## **🚀 PRODUCTION DEPLOYMENT STEPS**

### **1. Test Security Locally**
```bash
# Test with new credentials
npm run dev

# Verify admin login works
# Test all forms and validation
# Check error handling
```

### **2. Production Build**
```bash
# Clean build
npm run clean
npm run build:prod

# Verify build output
ls -la dist/
```

### **3. Deploy to Vercel**
```bash
# Deploy with new environment
npm run deploy

# Verify security headers
curl -I https://your-domain.vercel.app
```

### **4. Post-Deployment Security Check**
- [ ] HTTPS working
- [ ] Security headers present
- [ ] Admin panel accessible
- [ ] Forms working
- [ ] No console errors

---

## **📊 SECURITY MONITORING**

### **Daily Checks**
- Monitor login attempts
- Check for suspicious activity
- Review error logs
- Monitor API usage

### **Weekly Checks**
- Review security logs
- Check for new vulnerabilities
- Update dependencies
- Backup environment files

### **Monthly Checks**
- Security audit
- Credential rotation
- Policy review
- Performance analysis

---

## **🚨 EMERGENCY PROCEDURES**

### **If Credentials Are Compromised**
1. **IMMEDIATELY** revoke all API keys
2. Generate new credentials
3. Update environment files
4. Redeploy application
5. Monitor for unauthorized access
6. Review access logs

### **If Attack Detected**
1. Block suspicious IPs
2. Review security logs
3. Check for data breaches
4. Notify stakeholders
5. Implement additional security
6. Document incident

---

## **📞 SECURITY CONTACTS**

- **DevOps Engineer**: [Your Contact]
- **Security Team**: [Security Contact]
- **Emergency**: [Emergency Contact]

---

## **✅ COMPLETION CHECKLIST**

**Before going live, ensure:**
- [ ] All credentials regenerated
- [ ] Security headers active
- [ ] RLS policies implemented
- [ ] Monitoring configured
- [ ] Backup procedures ready
- [ ] Incident response plan ready

**Your website will be secure and production-ready! 🚀**
