# Images Folder Structure

This folder contains all static images for the LilyaArt website.

## 📁 Folder Organization

```
public/images/
├── hero/          # Hero section images for different pages
├── logos/         # Logo files (SVG preferred for scalability)
├── backgrounds/   # Background images and patterns
├── gallery/       # Artwork gallery placeholder images
└── social/        # Social media icons and graphics
```

## 🎨 Usage Examples

### Hero Images

```tsx
<Image
  src="/images/hero/hero-homepage.jpg"
  alt="LilyaArt Hero Background"
  fill
  priority
/>
```

### Logos

```tsx
<img src="/images/logos/logo-primary.svg" alt="LilyaArt Logo" />
```

### Background Images (CSS)

```css
.hero-section {
  background-image: url("/images/backgrounds/bg-pattern.jpg");
  background-size: cover;
}
```

## 📏 File Naming Conventions

- Use **kebab-case** (lowercase with hyphens)
- Be **descriptive** (e.g., `hero-homepage.jpg` not `img1.jpg`)
- Include **purpose** in name (e.g., `logo-primary.svg`)

## 🎯 Recommended File Types

- **Logos:** SVG (for scalability) or PNG (for transparency)
- **Hero Images:** JPG (for photos) or WebP (for performance)
- **Backgrounds:** JPG (large photos) or PNG (patterns)
- **Icons:** SVG (for crisp display at any size)

## 📱 Image Optimization Tips

- Use **WebP format** for better performance
- Compress images before uploading
- Use **responsive images** with Next.js Image component
- Add **alt text** for accessibility

## 🔧 Adding New Images

1. Place images in the appropriate folder
2. Use descriptive names
3. Optimize for web (compress, use appropriate format)
4. Update components to reference the new image paths

## 📋 Current Images

### Hero Section

- `hero-homepage.jpg` - Main homepage hero image

### Logos

- `logo-primary.svg` - Main LilyaArt logo

### Backgrounds

- `bg-pattern.jpg` - Repeating background pattern

### Gallery

- `placeholder.jpg` - Default artwork placeholder

### Social

- `facebook.svg` - Facebook icon
- `instagram.svg` - Instagram icon
- `twitter.svg` - Twitter icon
- `linkedin.svg` - LinkedIn icon
