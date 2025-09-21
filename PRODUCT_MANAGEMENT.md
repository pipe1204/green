# 📦 Product Management Guide

This guide explains how to add, edit, and remove products from the Green e-commerce platform.

## 📁 File Structure

Products are managed in a single file:

```
data/products.ts
```

## 🔧 How to Add a New Product

### Step 1: Open the Products File

Navigate to `data/products.ts` and find the `products` array.

### Step 2: Add Your Product Object

Add a new product object to the array. Here's the complete structure:

```typescript
{
  id: "unique-product-id", // Use kebab-case, no spaces
  name: "Product Name", // Display name
  model: "MODEL-2024", // Model number/code
  type: "motorbike", // Options: "motorbike" | "scooter" | "bicycle" | "other"
  price: 5000000, // Price in COP (Colombian Pesos)
  description: "Detailed product description that will be shown on the product page.",

  // Product features (array of strings)
  features: [
    "Feature 1 description",
    "Feature 2 description",
    "Feature 3 description",
    // Add as many as needed
  ],

  // Available colors
  colors: [
    {
      id: "color-id", // Unique color identifier
      name: "Color Name", // Display name
      hex: "#000000", // Hex color code
      image: "/images/product/color-image.jpg", // Image path
      description: "Color description"
    },
    // Add more colors as needed
  ],

  // Product images
  images: [
    {
      id: "image-id",
      url: "/images/product/main-image.jpg",
      alt: "Alt text for accessibility",
      isHero: true // Set to true for the main image
    },
    {
      id: "detail-1",
      url: "/images/product/detail-1.jpg",
      alt: "Detail image description"
    }
    // Add more images as needed
  ],

  // Technical specifications
  specifications: {
    battery: "48V 20Ah", // Battery specification
    range: "80", // Range in km (number as string)
    chargeTime: "3", // Charging time in hours (number as string)
    warranty: "2 años de garantía completa", // Warranty description
    delivery: "5-7 días hábiles", // Delivery time
    environmental: "Cero emisiones de CO2", // Environmental benefit

    // Performance specs (optional)
    performance: {
      maxSpeed: "60 km/h",
      power: "3000W",
      torque: "100 Nm"
    },

    // Dimensions (optional)
    dimensions: {
      weight: "45 kg",
      length: "1.8 m",
      width: "0.7 m",
      height: "1.1 m"
    },

    // Features breakdown (optional)
    features: {
      display: "Pantalla LCD 5 pulgadas",
      connectivity: ["Bluetooth", "WiFi", "App móvil"],
      safety: ["ABS", "Frenos regenerativos", "Luces LED"]
    }
  },

  // Environmental benefits
  environmentalBenefits: [
    "Benefit 1",
    "Benefit 2",
    "Benefit 3"
  ],

  // Availability
  availability: "in-stock", // Options: "in-stock" | "pre-order" | "coming-soon"
  deliveryTime: "5-7 días hábiles" // Delivery timeframe
}
```

### Step 3: Add Images

1. Create a folder in `public/images/` with your product name (e.g., `public/images/new-product/`)
2. Add your product images to this folder
3. Update the image paths in your product object

### Step 4: Update Featured Products (Optional)

If you want your new product to appear in the hero carousel:

1. Open `data/products.ts`
2. Find the `featuredProducts` array
3. Add your new product to the array

## ✏️ How to Edit an Existing Product

### Step 1: Find the Product

1. Open `data/products.ts`
2. Find the product by its `id` in the `products` array

### Step 2: Update Properties

Modify any properties you want to change:

- **Price**: Update the `price` number
- **Description**: Change the `description` text
- **Features**: Add, remove, or modify items in the `features` array
- **Colors**: Add new colors or modify existing ones
- **Specifications**: Update any technical specs

### Step 3: Save Changes

Save the file and the changes will be reflected immediately on the website.

## 🗑️ How to Remove a Product

### Step 1: Remove from Products Array

1. Open `data/products.ts`
2. Find the product in the `products` array
3. Delete the entire product object (including the comma)

### Step 2: Remove from Featured Products (if applicable)

1. If the product was featured, remove it from the `featuredProducts` array
2. Make sure there's at least one featured product remaining

### Step 3: Remove Images (Optional)

1. Delete the product's image folder from `public/images/`
2. This step is optional but recommended to keep the project clean

## 📝 Product Types

The platform supports these product types:

- `"motorbike"` - Electric motorcycles
- `"scooter"` - Electric scooters
- `"bicycle"` - Electric bicycles
- `"other"` - Other electric vehicles

## 🎨 Color Management

### Adding Colors

```typescript
colors: [
  {
    id: "unique-color-id",
    name: "Color Display Name",
    hex: "#FF5733", // Use hex color codes
    image: "/images/product/color-image.jpg",
    description: "Brief color description",
  },
];
```

### Color Images

- Each color should have its own image showing the product in that color
- Images should be high quality and consistent in style
- Recommended size: 800x600px or similar

## 🖼️ Image Guidelines

### Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 800x600px minimum
- **Quality**: High resolution for product photos
- **Consistency**: Similar lighting and background across all images

### Image Structure

```
public/images/
├── product-name/
│   ├── hero-1.jpg          # Main product image
│   ├── detail-1.jpg        # Detail shots
│   ├── detail-2.jpg        # More details
│   ├── color-1.jpg         # Color variants
│   └── color-2.jpg         # More colors
```

## 🔄 Making Changes Live

### Development Mode

1. Save your changes to `data/products.ts`
2. The website will automatically reload with your changes
3. No build process required

### Production Deployment

1. Commit your changes to git
2. Push to your repository
3. Deploy to your hosting platform
4. Changes will be live immediately

## ⚠️ Important Notes

### Required Fields

- `id` - Must be unique
- `name` - Product display name
- `price` - Must be a number (in COP)
- `description` - Product description
- `colors` - At least one color required
- `images` - At least one image required
- `specifications` - All specification fields required

### Best Practices

1. **Use descriptive IDs**: `"eco-rider-pro"` instead of `"product1"`
2. **Consistent naming**: Use the same naming pattern for all products
3. **High-quality images**: Invest in good product photography
4. **Accurate specifications**: Ensure all technical details are correct
5. **Test thoroughly**: Always test new products on the website

## 🚀 Quick Example

Here's a minimal product example:

```typescript
{
  id: "city-scooter-basic",
  name: "City Scooter Basic",
  model: "CSB-2024",
  type: "scooter",
  price: 3000000,
  description: "Perfect electric scooter for urban commuting.",
  features: [
    "Lightweight design",
    "30km range",
    "Foldable for easy storage"
  ],
  colors: [
    {
      id: "black",
      name: "Negro",
      hex: "#000000",
      image: "/images/city-scooter-basic/black.jpg",
      description: "Classic black color"
    }
  ],
  images: [
    {
      id: "hero",
      url: "/images/city-scooter-basic/hero.jpg",
      alt: "City Scooter Basic",
      isHero: true
    }
  ],
  specifications: {
    battery: "24V 8Ah",
    range: "30",
    chargeTime: "2",
    warranty: "1 año de garantía",
    delivery: "3-5 días hábiles",
    environmental: "Cero emisiones urbanas",
    performance: {
      maxSpeed: "20 km/h",
      power: "250W",
      torque: "25 Nm"
    },
    dimensions: {
      weight: "15 kg",
      length: "1.0 m",
      width: "0.4 m",
      height: "0.9 m"
    },
    features: {
      display: "LED básico",
      connectivity: ["App móvil"],
      safety: ["Freno de disco", "Luces LED"]
    }
  },
  environmentalBenefits: [
    "Cero emisiones",
    "Reducción del tráfico",
    "Energía limpia"
  ],
  availability: "in-stock",
  deliveryTime: "3-5 días hábiles"
}
```

## 🆘 Troubleshooting

### Common Issues

1. **Product not showing**: Check if the `id` is unique and properly formatted
2. **Images not loading**: Verify image paths are correct and files exist
3. **Specifications missing**: Ensure all required specification fields are filled
4. **Colors not displaying**: Check that color objects have all required properties

### Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Verify all required fields are present
3. Ensure image paths are correct
4. Test with a simple product first

---

**Happy product managing! 🚀**
