# Shopify Webhooks Setup Guide

## Overview

This webhook system enables real-time updates triggered by Shopify changes, eliminating need for periodic API polling and preventing rate limiting issues.

## Webhook Endpoints

### Separate Webhook Handlers (One Event Per Webhook)

#### Product Updates Webhook

- **URL**: `https://your-domain.com/api/webhooks/product`
- **Method**: `POST` (webhook events), `GET` (verification)
- **Topic**: `PRODUCTS_UPDATE` only
- **Triggers**: Price changes, description updates, title changes
- **Action**: Revalidates product page cache

#### Inventory Updates Webhook

- **URL**: `https://your-domain.com/api/webhooks/inventory`
- **Method**: `POST` (webhook events), `GET` (verification)
- **Topic**: `INVENTORY_LEVELS_UPDATE` only
- **Triggers**: Items purchased, stock adjustments
- **Action**: Revalidates product page for stock status

#### Collection Updates Webhook

- **URL**: `https://your-domain.com/api/webhooks/collection`
- **Method**: `POST` (webhook events), `GET` (verification)
- **Topic**: `COLLECTIONS_UPDATE` only
- **Triggers**: Collection added/removed products, collection changes
- **Action**: Revalidates collection page and homepage

## Setup Instructions

### 1. Configure Environment Variables

Add these to your `.env` file:

```env
SHOPIFY_WEBHOOK_SECRET=your_actual_webhook_secret_here
NEXT_PUBLIC_URL=https://your-production-domain.com
```

### 2. Generate Webhook Secrets

1. Go to Shopify Admin → Settings → Notifications → Webhooks
2. Click "Create webhook" THREE times (one for each event)

#### Webhook 1: Product Updates

- **Webhook URL**: `https://your-domain.com/api/webhooks/product`
- **Webhook Topic**: `PRODUCTS_UPDATE`
- **Webhook Version**: `2024-01`
- **Privacy**: `Read and write`
- **Copy Secret**: Save as `SHOPIFY_WEBHOOK_SECRET` in `.env`

#### Webhook 2: Inventory Updates

- **Webhook URL**: `https://your-domain.com/api/webhooks/inventory`
- **Webhook Topic**: `INVENTORY_LEVELS_UPDATE`
- **Webhook Version**: `2024-01`
- **Privacy**: `Read and write`
- **Use Same Secret**: All three webhooks can use the same secret

#### Webhook 3: Collection Updates

- **Webhook URL**: `https://your-domain.com/api/webhooks/collection`
- **Webhook Topic**: `COLLECTIONS_UPDATE`
- **Webhook Version**: `2024-01`
- **Privacy**: `Read and write`
- **Use Same Secret**: All three webhooks can use the same secret

### 3. Webhook Topics Configuration

#### Product Updates (`PRODUCTS_UPDATE`)

- **Triggers**: Price changes, description updates, title changes
- **Action**: Revalidates product page cache
- **Example**: When you change product price in Shopify admin

#### Inventory Updates (`INVENTORY_LEVELS_UPDATE`)

- **Triggers**: Items purchased, stock adjustments
- **Action**: Revalidates product page for stock status
- **Example**: When a customer buys a product

#### Collection Updates (`COLLECTIONS_UPDATE`)

- **Triggers**: Collection added/removed products, collection changes
- **Action**: Revalidates collection page and homepage
- **Example**: When you modify a collection in Shopify admin

## Security Features

### Signature Verification

- Uses HMAC-SHA256 to verify webhook authenticity
- Prevents unauthorized webhook calls
- Configured via `SHOPIFY_WEBHOOK_SECRET`

### Request Validation

- Validates webhook topic headers
- Verifies JSON payload format
- Logs all webhook activities

## Cache Strategy

### Before Webhooks

```typescript
// Problem: API calls on every request
export async function getProduct(handle: string) {
  // No caching = rate limiting risk
}
```

### After Webhooks

```typescript
// Solution: Smart caching with webhook invalidation
export async function getProduct(handle: string) {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("minutes"); // Short cache
}

// Webhook triggers cache invalidation:
await fetch("/api/revalidate?path=/product/updated-handle");
```

## Testing Webhooks

### 1. Local Development

```bash
# Use ngrok to expose local server
ngrok http 3000

# Update webhook URL to ngrok URL
# https://abc123.ngrok.io/api/webhooks
```

### 2. Test Endpoints

```bash
# Test product webhook endpoint
curl https://your-domain.com/api/webhooks/product

# Expected response:
{
  "message": "Product webhook endpoint ready",
  "topic": "PRODUCTS_UPDATE"
}

# Test inventory webhook endpoint
curl https://your-domain.com/api/webhooks/inventory

# Expected response:
{
  "message": "Inventory webhook endpoint ready",
  "topic": "INVENTORY_LEVELS_UPDATE"
}

# Test collection webhook endpoint
curl https://your-domain.com/api/webhooks/collection

# Expected response:
{
  "message": "Collection webhook endpoint ready",
  "topic": "COLLECTIONS_UPDATE"
}
```

### 3. Trigger Test Events

1. Change product price in Shopify admin
2. Check logs for webhook receipt
3. Verify page cache invalidation

## Monitoring

### Webhook Logs

All webhook activities are logged:

```bash
🔔 Webhook received: PRODUCTS_UPDATE from your-shop.myshopify.com
✅ Revalidated product page: /product/your-product-handle
```

### Error Handling

- Invalid signatures return 401
- Invalid JSON returns 400
- Server errors return 500
- All errors are logged for debugging

## Benefits

### ✅ Real-time Updates

- Changes in Shopify admin appear immediately
- Stock updates reflect purchases instantly
- No delay between admin changes and website

### ✅ Rate Limiting Prevention

- No periodic API polling
- Only fetches data when changes occur
- Reduces API calls by 90%+

### ✅ Performance Optimization

- Smart caching with fast response times
- Cache invalidation only when needed
- Better user experience with fast page loads

### ✅ Cost Efficiency

- Fewer API calls = lower costs
- Reduced server load
- Better scalability

## Troubleshooting

### Common Issues

#### Webhook Not Triggered

1. Check webhook URL is accessible
2. Verify webhook secret is correct
3. Ensure webhook is enabled in Shopify admin

#### Cache Not Invalidated

1. Check revalidation API is working
2. Verify `NEXT_PUBLIC_URL` is correct
3. Check logs for revalidation calls

#### Signature Verification Failed

1. Verify `SHOPIFY_WEBHOOK_SECRET` matches Shopify
2. Check webhook body isn't modified
3. Ensure headers are preserved

### Debug Mode

Add debug logging to webhook endpoint:

```typescript
console.log("Webhook headers:", Object.fromEntries(request.headers));
console.log("Webhook body:", body);
```

## Production Considerations

### 1. Use HTTPS

Webhook URLs must use HTTPS in production.

### 2. Monitor Webhook Health

Set up monitoring for webhook failures and retries.

### 3. Backup Webhook URLs

Have multiple webhook endpoints for redundancy.

### 4. Rate Limiting

Implement rate limiting on webhook endpoints to prevent abuse.
