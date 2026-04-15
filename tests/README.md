# 🧪 LilyaArt Test Suite

This directory contains automated tests for the LilyaArt e-commerce platform.

## 📋 Test Files

### 🔧 **Server Actions Tests** (`server-actions.automated.test.js`)

Tests the server-side functionality:

- ✅ File structure verification
- ✅ Function exports validation
- ✅ Dependencies checking
- ✅ Environment variables validation
- ✅ API endpoint accessibility

### 📦 **Inventory Update Tests** (`inventory-update.automated.test.js`)

Tests Shopify inventory integration:

- ✅ Single item inventory updates
- ✅ Multiple item inventory updates
- ✅ Invalid variant ID handling
- ✅ Real Shopify API connectivity
- ✅ Error handling and validation

### 🌐 **Manual Test Files**

- `revalidate.html` - Manual webhook testing interface
- `inventory-update.test.js` - Original manual test (deprecated)
- `server-actions.test.js` - Original manual test (deprecated)

## 🚀 Running Tests

### **Run All Tests**

```bash
npm test
```

### **Run Specific Test Suites**

```bash
# Test server actions only
npm run test:server-actions

# Test inventory updates only
npm run test:inventory
```

### **Direct Test Execution**

```bash
# Run all tests with detailed output
node tests/run-tests.js

# Run individual test files
node tests/server-actions.automated.test.js
node tests/inventory-update.automated.test.js
```

## 📊 Test Results

### **Success Indicators**

- ✅ All files exist and are readable
- ✅ All required functions are exported
- ✅ Environment variables are properly set
- ✅ API endpoints are accessible
- ✅ Shopify API connection works

### **Common Issues & Solutions**

#### **Environment Variables Missing**

```
❌ SHOPIFY_ADMIN_ACCESS_TOKEN: NOT_SET
```

**Solution**: Set up your `.env` file with proper Shopify credentials.

#### **API Connection Failed**

```
❌ API Connection Failed: 401 Unauthorized
```

**Solution**: Regenerate your Admin API token using `POST /api/admin-token`.

#### **Server Actions Not Found**

```
❌ completeShopifyOrder: MISSING
```

**Solution**: Restart the development server and clear `.next` cache.

## 🔧 Test Configuration

### **Required Environment Variables**

```bash
SHOPIFY_STORE_DOMAIN="https://lilyaart-2.myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="your-storefront-token"
SHOPIFY_ADMIN_ACCESS_TOKEN="your-admin-token"
SHOPIFY_CLIENT_ID="your-app-client-id"
SHOPIFY_CLIENT_SECRET="your-app-client-secret"
NEXT_PUBLIC_URL="http://localhost:3000"
```

### **Test Data**

The tests use real product data from your Shopify store:

- Variant ID: `gid://shopify/ProductVariant/47666869895386`
- Product: `photo1 (Copy)`
- Price: `$5.00`

## 🎯 Pre-Deployment Checklist

Before deploying to production, run:

```bash
# 1. Run all tests
npm test

# 2. Check code formatting
npm run prettier:check

# 3. Build the application
npm run build

# 4. Start production server
npm start
```

## 🐛 Troubleshooting

### **Test Runner Issues**

- **Node.js not found**: Install Node.js 18+
- **Permission denied**: Run with `node tests/run-tests.js` instead of npm
- **Timeout errors**: Check your internet connection and Shopify API status

### **API Test Failures**

- **401 Unauthorized**: Regenerate Admin API token
- **403 Forbidden**: Check app permissions in Shopify admin
- **429 Too Many Requests**: Wait and retry, check API limits

### **Server Action Issues**

- **File not found**: Ensure you're in the project root directory
- **Export missing**: Check for typos in function names
- **"use server" missing**: Add directive to server action files

## 📈 Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: npm test

- name: Build Application
  run: npm run build

- name: Deploy to Production
  run: npm run deploy
```

## 🔄 Test Maintenance

- **Monthly**: Review test cases for new features
- **Quarterly**: Update test data and environment variables
- **As needed**: Add new tests for additional functionality

---

**Last Updated**: $(date)
**Test Framework**: Custom Node.js Test Runner
**Coverage**: Server Actions, Shopify Integration, API Endpoints
