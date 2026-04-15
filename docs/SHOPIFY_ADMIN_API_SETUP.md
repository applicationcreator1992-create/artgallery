# Shopify Admin API Setup Guide

This guide shows how to set up Shopify Admin API access for inventory updates across multiple Shopify stores.

## 📋 Overview

The payment system uses Shopify Admin API to update inventory when orders are completed. This requires:

1. Shopify App credentials (Client ID & Client Secret)
2. Admin API access token generation
3. Environment configuration

## 🔧 Setup for New Shopify Store

### Step 1: Create Shopify App

1. Go to [Shopify Partners Dashboard](https://partners.shopify.com)
2. Click "Create app" → "Custom app"
3. Enter app name (e.g., `store-name-api`)
4. Select the store
5. Configure app settings

### Step 2: Configure Admin API Access

In your app settings, enable these Admin API permissions:

- ✅ `read_inventory`
- ✅ `write_inventory`
- ✅ `read_products`
- ✅ `write_orders`

### Step 3: Get Credentials

From your app's API credentials section, copy:

- **Client ID**
- **Client Secret**

### Step 4: Update Environment Variables

Add these to your `.env` file:

```bash
# Shopify Store Configuration
SHOPIFY_STORE_DOMAIN="https://your-store.myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="your-storefront-token"

# Shopify App Credentials
SHOPIFY_CLIENT_ID="your-app-client-id"
SHOPIFY_CLIENT_SECRET="your-app-client-secret"

# Admin API Token (will be generated)
SHOPIFY_ADMIN_ACCESS_TOKEN="shpat_token_here"
```

### Step 5: Generate Admin API Token

Run the token generator script:

```bash
# Method 1: Using the script (recommended)
node scripts/shopify-token-generator.js

# Method 2: Using API endpoint (requires server running)
curl -X POST http://localhost:3000/api/admin-token
```

### Step 6: Update .env with Generated Token

The script will output your token. Update your `.env`:

```bash
SHOPIFY_ADMIN_ACCESS_TOKEN="shpat_generated_token_here"
```

### Step 7: Restart and Test

```bash
pnpm dev
```

Test with card `1111 1111 1111 1111` and check Shopify admin for inventory updates.

## 🛠️ Available Scripts

### Token Generator Script

**Location**: `scripts/shopify-token-generator.js`

**Usage**:

```bash
node scripts/shopify-token-generator.js
```

**What it does**:

- Reads credentials from environment
- Generates Admin API access token
- Outputs the token for .env file

### API Endpoint

**Location**: `app/api/admin-token/route.ts`

**Usage**:

```bash
curl -X POST http://localhost:3000/api/admin-token
```

**What it does**:

- Server-side token generation
- Returns formatted response
- Includes setup instructions

## 🔄 Migration to New Store

When setting up for a different Shopify store:

1. **Create new app** in Shopify Partners
2. **Get new credentials** (Client ID & Secret)
3. **Update .env file** with new store domain and credentials
4. **Generate new token** using the script
5. **Update .env** with new token
6. **Restart server**

## 📁 File Structure

```
├── scripts/
│   └── shopify-token-generator.js    # Token generation script
├── app/api/
│   └── admin-token/
│       └── route.ts                  # API endpoint for token generation
├── components/cart/
│   ├── admin-token-generator.ts       # Server action for token generation
│   ├── inventory-update.ts            # Admin API inventory updates
│   └── order-completion.ts            # Order completion with inventory updates
└── .env.example                       # Environment variable template
```

## 🛡️ Security Notes

- **Never expose Client Secret** in frontend code
- **Store Admin API token** securely in environment variables
- **Use HTTPS** for all API calls
- **Rotate tokens** periodically for security
- **Limit API permissions** to only what's needed

## 🔍 Troubleshooting

### Common Issues:

1. **"Invalid client credentials"**

   - Check Client ID and Secret are correct
   - Ensure app is properly configured in Shopify Partners

2. **"404 Not Found"**

   - Verify store domain is correct
   - Ensure app is installed on the store

3. **"500 Internal Server Error"**

   - Check environment variables are set
   - Verify server is running

4. **"Inventory not updating"**
   - Confirm Admin API token is valid
   - Check app has write_inventory permission
   - Verify variant IDs are correct format

### Debug Mode:

Enable detailed logging by setting:

```bash
DEBUG=shopify pnpm dev
```

## 📞 Support

For Shopify API issues:

- [Shopify API Documentation](https://shopify.dev/docs/admin-api)
- [Shopify Partners Support](https://partners.shopify.com/support)

For codebase issues:

- Check console logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure app permissions match requirements
