# 🚀 LilyaArt Deployment Guide

## 📋 Table of Contents

1. [Codebase Cleanup](#-codebase-cleanup)
2. [Automated Test Suite](#-automated-test-suite)
3. [Environment Configuration](#-environment-configuration)
4. [Pre-Deployment Checklist](#-pre-deployment-checklist)
5. [Deployment Steps](#-deployment-steps)
6. [Security Considerations](#-security-considerations)
7. [Monitoring & Maintenance](#-monitoring--maintenance)
8. [Troubleshooting](#-troubleshooting)

---

## 🧹 Codebase Cleanup

### ❌ **Files to Remove**

```bash
# Debug API routes (keep admin-token for local development)
rm -rf app/api/test-env/
rm -rf app/api/test-inventory/
rm -rf app/api/test-payment/
rm -rf app/api/debug-env/
```

### 📁 **Files to Keep (Local Development)**

- `TODO.md` - Development notes (keep locally, don't deploy)
- `tests/` - Test suite (deploy to test environment only)
- `scripts/shopify-token-generator.js` - Keep locally as backup
- `app/api/admin-token/` - Token generation (keep locally, disable in production)

### 📁 **Files to Deploy (Production)**

- All core application files (app/, components/, lib/, styles/)
- `package.json` and `package-lock.json`
- `.env.example` (template only)
- `tailwind.config.ts`
- `README.md`

---

## 🧪 Automated Test Suite

### 📁 **Test Structure**

```
tests/
├── README.md                    # Test documentation
├── run-tests.js                 # Main test runner
├── server-actions.automated.test.js  # Server actions validation
├── inventory-update.automated.test.js # Shopify integration tests
└── revalidate.html              # Manual webhook testing
```

### 🚀 **Test Commands**

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:server-actions
npm run test:inventory

# Direct execution
node tests/run-tests.js --help
```

### 📊 **Test Coverage**

- ✅ **Server Actions**: File structure, exports, dependencies
- ✅ **Inventory Integration**: Shopify API, error handling
- ✅ **API Endpoints**: Accessibility, responses
- ✅ **Environment Variables**: Validation, configuration

---

## 🔧 Environment Configuration

### 🔑 **Required Environment Variables**

```bash
# Shopify Configuration
SHOPIFY_STORE_DOMAIN="https://lilyaart-2.myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="your-production-storefront-token"
SHOPIFY_ADMIN_ACCESS_TOKEN="your-production-admin-token"
SHOPIFY_WEBHOOK_SECRET="your-production-webhook-secret"
SHOPIFY_REVALIDATION_SECRET="your-production-revalidation-secret"
SHOPIFY_CLIENT_ID="your-app-client-id"
SHOPIFY_CLIENT_SECRET="your-app-client-secret"

# Site Configuration
NEXT_PUBLIC_URL="https://your-production-domain.com"
COMPANY_NAME="LilyaArt"
SITE_NAME="LilyaArt"

# Optional Analytics
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-vercel-analytics-id"
```

### 📝 **Environment Files**

- **`.env.example`** - Template for new environments
- **`.env`** - Production secrets (NEVER commit to Git)
- **`.env.local`** - Local overrides

---

## ✅ Pre-Deployment Checklist

### 🧪 **Testing**

- [ ] Run automated test suite: `npm test`
- [ ] Check code formatting: `npm run prettier:check`
- [ ] Build application: `npm run build`
- [ ] Test payment flow with real Shopify credentials
- [ ] Verify inventory updates in Shopify admin
- [ ] Test error handling (declined/failed payments)

### 🔒 **Security**

- [ ] Remove debug API endpoints from production
- [ ] Verify environment variables are not exposed client-side
- [ ] Check CORS settings for API routes
- [ ] Validate webhook security signatures
- [ ] Set up rate limiting on sensitive endpoints

### 📱 **Functionality**

- [ ] Product pages load correctly
- [ ] Checkout flow works end-to-end
- [ ] Mobile responsive design works
- [ ] SEO meta tags are correct
- [ ] Performance metrics are acceptable
- [ ] Error pages display properly

---

## 🚀 Deployment Steps

### 1️⃣ **Preparation**

```bash
# Ensure clean working directory
git status
git pull origin main

# Run tests
npm test

# Build application
npm run build
```

### 2️⃣ **Code Cleanup**

```bash
# Remove unused files (see cleanup section above)
# Remove debug API routes
# Remove development files
```

### 3️⃣ **Git Preparation**

```bash
# Add changes
git add .
git commit -m "feat: Prepare for production deployment

- Clean codebase and remove debug files
- Organize test suite for CI/CD
- Update environment configuration
- Verify all functionality works correctly"

# Push to production
git push origin main
```

### 🚀 **Deployment Strategy**

#### **🧪 Test Environment**

```bash
# Deploy to test environment with full test suite
git checkout test
git merge main
npm test
npm run build
# Deploy to test server (Vercel preview, staging, etc.)
```

#### **📚 Documentation (Local Only)**

```bash
# Keep documentation locally for development
# Don't deploy docs to production
# Use version control for documentation management
```

#### **🚀 Production Environment**

```bash
# Deploy only core application files
git checkout main
npm run build
# Deploy to production (Vercel, AWS, etc.)
# No test files, no docs, no debug endpoints
```

### 📦 **Deployment Files by Environment**

| Environment    | Core App | Tests | Docs | Debug APIs | Admin Token |
| -------------- | -------- | ----- | ---- | ---------- | ----------- |
| **Local**      | ✅       | ✅    | ✅   | ✅         |
| **Test**       | ✅       | ✅    | ❌   | ❌         |
| **Production** | ✅       | ❌    | ❌   | ❌         |

### 4️⃣ **Deployment Options**

#### **🥇 Option A: Vercel (HIGHLY RECOMMENDED)**

**Why Vercel is perfect for LilyaArt:**

- ✅ **Next.js native** - Built by Next.js creators
- ✅ **Zero configuration** - Your code is already optimized
- ✅ **Automatic optimization** - Image optimization, CDN, edge functions
- ✅ **Environment variables** - Secure secret management
- ✅ **Preview deployments** - Automatic for each PR
- ✅ **Analytics built-in** - Performance monitoring

```bash
# Install Vercel CLI
npm i -g vercel

# One-command deployment
vercel --prod

# Or GitHub integration for auto-deployment
vercel link
vercel --prod --confirm
```

**Vercel Setup Steps:**

1. **Install CLI**: `npm i -g vercel`
2. **Login**: `vercel login`
3. **Link project**: `vercel link`
4. **Deploy**: `vercel --prod`
5. **Set environment variables** in Vercel dashboard:
   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - `SHOPIFY_ADMIN_ACCESS_TOKEN`
   - `SHOPIFY_CLIENT_ID`
   - `SHOPIFY_CLIENT_SECRET`

#### **🥈 Option B: Docker**

**For container-based deployments:**

- ✅ **Portable** - Deploy anywhere
- ✅ **Consistent** - Same environment everywhere
- ✅ **Scalable** - Easy to scale horizontally

```dockerfile
# Create Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t lilyaart .
docker run -p 3000:3000 -e NODE_ENV=production lilyaart
```

#### **🥉 Option C: Manual/VPS Deployment**

**For custom server deployments:**

- ✅ **Full control** - Complete server management
- ✅ **Cost effective** - Lower hosting costs
- ✅ **Customizable** - Any server configuration

```bash
# Build for production
npm run build

# Start production server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "lilyaart" -- start
```

### 5️⃣ **Post-Deployment Verification**

```bash
# Test production URL
curl https://your-domain.com

# Run tests in production
NODE_ENV=production npm test

# Check Shopify integration
curl -X POST https://your-domain.com/api/admin-token
```

---

## 🎯 **Platform Readiness Assessment**

### **� Current Deployment Platform Compatibility**

| Platform       | Ready?            | Setup Time | Cost         | Performance  | Recommendation            |
| -------------- | ----------------- | ---------- | ------------ | ------------ | ------------------------- |
| **Vercel**     | ✅ **100% Ready** | ⚡ 2 min   | 💰 Free tier | 🚀 Excellent | 🥇 **HIGHLY RECOMMENDED** |
| **Docker**     | ✅ Ready          | 🐳 10 min  | 💰 Variable  | 🚀 Excellent | 🥈 Good alternative       |
| **Manual VPS** | ✅ Ready          | ⚙️ 30 min  | 💰 Low       | 🚀 Good      | 🥉 For advanced users     |

### **🚀 Why Your Code is Vercel-Optimized**

Your codebase shows clear signs of Vercel optimization:

```json
// package.json - Vercel-specific optimizations
{
  "scripts": {
    "analyze": "ANALYZE=true next build" // Vercel bundle analyzer
  },
  "engines": {
    "node": ">=18.0.0", // Vercel Node.js version
    "pnpm": ">=8.0.0" // Modern package manager
  }
}
```

```javascript
// next.config.mjs - Production-ready configuration
export default {
  experimental: {
    optimizePackageImports: ["@heroicons/react"], // Bundle optimization
    cacheComponents: true, // Performance boost
  },
  images: {
    formats: ["image/avif", "image/webp"], // Modern image formats
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Production ready
  },
};
```

### **⚡ Quick Vercel Deployment**

Since your code is already optimized:

```bash
# 1. Install Vercel CLI (if not already installed)
npm i -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Link your project (one-time setup)
vercel link

# 4. Deploy to production
vercel --prod

# 5. Your app is live! 🎉
```

**Environment Variables Setup in Vercel Dashboard:**

- Navigate to your project → Settings → Environment Variables
- Add all required Shopify credentials
- Redeploy with `vercel --prod`

---

## 🎯 **Vercel Environment Strategy**

### **📁 How Vercel Handles Different Environments**

With the new configuration files (`.vercelignore` and `vercel.json`), Vercel now knows exactly what to deploy where:

#### **🧪 Test Environment (Preview Deployments)**

```bash
# Automatic for every PR/branch
git checkout feature-branch
git push origin feature-branch
# Vercel automatically creates preview deployment
```

**What gets deployed to Preview:**

- ✅ Core application files
- ✅ All API routes (except debug endpoints excluded by .vercelignore)
- ❌ Tests folder (excluded by .vercelignore)
- ❌ TODO.md (excluded by .vercelignore)
- ❌ Debug endpoints (excluded by .vercelignore)

#### **🚀 Production Environment**

```bash
# Deploy main branch to production
git checkout main
vercel --prod
```

**What gets deployed to Production:**

- ✅ Core application files
- ✅ Production API routes only
- ❌ Tests folder (excluded by .vercelignore)
- ❌ TODO.md (excluded by .vercelignore)
- ❌ All debug endpoints (excluded by .vercelignore)
- ❌ Admin token endpoint (excluded by .vercelignore)

#### **💻 Local Development**

```bash
# Everything stays local
npm run dev
```

**What stays local:**

- ✅ All files (including tests, TODO.md, debug endpoints)
- ✅ Admin token endpoint for local testing
- ✅ Full test suite for local development

### **📋 Configuration Files Created**

#### **`.vercelignore` - Controls what NOT to deploy**

```
tests/                    # Test files - never deploy
TODO.md                   # Development notes - never deploy
scripts/                  # Utility scripts - never deploy
app/api/admin-token/      # Token generation - never deploy
app/api/test-*/           # Debug endpoints - never deploy
.env*                     # Environment files - never deploy
```

#### **`vercel.json` - Deployment configuration**

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "SHOPIFY_STORE_DOMAIN": {
      "description": "Shopify store domain"
    }
    // ... other environment variables
  }
}
```

### **🔄 Deployment Flow Summary**

| Environment    | Command         | What Gets Deployed | Use Case              |
| -------------- | --------------- | ------------------ | --------------------- |
| **Local**      | `npm run dev`   | Everything         | Development & testing |
| **Preview**    | `git push` (PR) | Core app only      | Feature testing       |
| **Production** | `vercel --prod` | Core app only      | Live site             |

---

## � Security Considerations

- **Disable debug endpoints**: Remove `/api/admin-token` in production
- **Environment variables**: Use platform secret management
- **API security**: Implement rate limiting and CORS
- **Webhook validation**: Verify Shopify webhook signatures
- **HTTPS only**: Ensure all traffic uses SSL/TLS

### 🔐 **Secrets Management**

```bash
# Vercel Environment Variables
vercel env add SHOPIFY_ADMIN_ACCESS_TOKEN
vercel env add SHOPIFY_CLIENT_SECRET
vercel env add SHOPIFY_WEBHOOK_SECRET

# AWS Secrets Manager (alternative)
aws secretsmanager create-secret --name lilyaart/production
```

### 📊 **Security Headers**

```javascript
// next.config.js
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
];
```

---

## 📈 Monitoring & Maintenance

### 📊 **Post-Launch Monitoring**

```bash
# Set up error monitoring
npm install @sentry/nextjs

# Add to next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig({
  // Your existing config
}, {
  silent: true,
  org: 'your-org',
  project: 'lilyaart'
});
```

### 🔄 **Regular Maintenance**

- **Weekly**: Run automated test suite
- **Monthly**: Review error logs and performance metrics
- **Quarterly**: Update dependencies and security patches
- **As needed**: Update product catalog and inventory

### 📈 **Performance Monitoring**

- **Uptime monitoring**: UptimeRobot, Pingdom
- **Performance**: Web Vitals, Lighthouse
- **Error tracking**: Sentry, LogRocket
- **Analytics**: Google Analytics, Vercel Analytics

---

## 🛠️ Troubleshooting

### 🧪 **Test Failures**

```bash
# Environment variables missing
❌ SHOPIFY_ADMIN_ACCESS_TOKEN: NOT_SET
# Solution: Set up .env file with proper credentials

# API connection failed
❌ API Connection Failed: 401 Unauthorized
# Solution: Regenerate Admin API token using /api/admin-token

# Server actions not found
❌ completeShopifyOrder: MISSING
# Solution: Restart dev server and clear .next cache
```

### 🚀 **Deployment Issues**

```bash
# Build fails
npm run build
# Check for TypeScript errors and missing dependencies

# Production errors
heroku logs --tail
# Check environment variables and API connections

# Performance issues
npm run analyze
# Optimize bundle size and loading performance
```

### 🔧 **Common Fixes**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Admin API token
curl -X POST http://localhost:3000/api/admin-token

# Restart development server
npm run dev
```

---

## 🎯 CI/CD Integration

### 🔄 **GitHub Actions Workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy LilyaArt

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Check formatting
        run: npm run prettier:check

      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

### 📋 **Environment Setup for CI/CD**

```bash
# GitHub Secrets
SHOPIFY_STORE_DOMAIN
SHOPIFY_STOREFRONT_ACCESS_TOKEN
SHOPIFY_ADMIN_ACCESS_TOKEN
SHOPIFY_CLIENT_ID
SHOPIFY_CLIENT_SECRET
SHOPIFY_WEBHOOK_SECRET
VERCEL_TOKEN
ORG_ID
PROJECT_ID
```

---

## 🎉 Go-Live Checklist

### ✅ **Final Verification**

- [ ] All environment variables configured in production
- [ ] Automated tests pass (`npm test`)
- [ ] Code formatting is correct (`npm run prettier:check`)
- [ ] Application builds successfully (`npm run build`)
- [ ] Payment processing works end-to-end
- [ ] Inventory updates correctly in Shopify
- [ ] Error handling displays proper messages
- [ ] Mobile responsive design works
- [ ] SEO meta tags are correct
- [ ] Performance metrics are acceptable
- [ ] Security measures are in place
- [ ] Debug endpoints removed/disabled
- [ ] Monitoring is configured
- [ ] Backup strategy is in place

### 🚀 **Ready to Launch!**

Once all checklist items are complete, LilyaArt is ready for production deployment with:

- ✅ **Clean, optimized codebase**
- ✅ **Comprehensive automated test suite**
- ✅ **Secure configuration**
- ✅ **Tested payment and inventory flow**
- ✅ **Professional error handling**
- ✅ **Mobile-responsive design**
- ✅ **SEO-optimized pages**
- ✅ **CI/CD-ready pipeline**
- ✅ **Monitoring and maintenance plan**

---

## 📞 Support & Maintenance

### 🆘 **Emergency Contacts**

- **Developer**: [Your contact info]
- **Shopify Support**: Shopify Help Center
- **Hosting Provider**: Vercel/AWS support

### 📚 **Documentation**

- **Shopify API Docs**: https://shopify.dev/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs

### 🔄 **Update Process**

1. Test changes in development
2. Run automated test suite
3. Update documentation
4. Deploy to staging
5. Verify functionality
6. Deploy to production
7. Monitor for issues

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Status**: Production Ready
**Maintainer**: LilyaArt Development Team
