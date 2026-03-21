# Banner Insert via Postman - Complete Guide

## Method 1: Using Seed Script (Recommended for Initial Setup)

### Run Seed Script
```bash
cd Backend
node seed-banners.js
```

This will insert 3 default banners with different types (circle, arch, modern).

---

## Method 2: Using Postman API (For Custom Banners)

### API Endpoint
```
POST http://localhost:5000/api/admin/banners/CreateBanner
```

### Headers
```
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: multipart/form-data
```

### Request Body (form-data)

#### Required Fields:
| Key | Type | Value | Description |
|-----|------|-------|-------------|
| `type` | text | `circle` / `arch` / `modern` | Banner design type |
| `topBadge` | text | `Fragrance & Elegance Co` | Top badge text |
| `title` | text | `Vamana Signature Collection` | Main title |
| `subtitle` | text | `Innovating the Perfume Industry` | Subtitle text |
| `websiteUrl` | text | `www.vamana.com` | Website URL |

#### Optional Fields:
| Key | Type | Value | Description |
|-----|------|-------|-------------|
| `bottomBadge` | text | `Crafted by: Vamana` | Bottom badge (for circle type) |
| `bottomText` | text | `Since 2024` | Bottom text (for arch type) |
| `order` | text | `1` | Display order (default: 0) |
| `isActive` | text | `true` | Active status (default: true) |
| `bannerImage` | file | [Select Image] | Banner background image |

---

## Postman Examples

### Example 1: Circle Type Banner
```
POST http://localhost:5000/api/admin/banners/CreateBanner

Body (form-data):
- type: circle
- topBadge: Fragrance & Elegance Co
- title: Vamana Signature Collection
- subtitle: Innovating the Perfume Industry with Sustainable Solutions
- bottomBadge: Crafted by: Vamana
- websiteUrl: www.vamana.com
- order: 1
- isActive: true
- bannerImage: [Upload Image File]
```

### Example 2: Arch Type Banner
```
POST http://localhost:5000/api/admin/banners/CreateBanner

Body (form-data):
- type: arch
- topBadge: Vamana Fragrances
- title: Exquisite Fragrances
- subtitle: Awaken Your Senses, Embrace Timeless Elegance
- bottomText: Crafted with Excellence • Since 2024
- websiteUrl: www.vamana.com
- order: 2
- isActive: true
- bannerImage: [Upload Image File]
```

### Example 3: Modern Type Banner
```
POST http://localhost:5000/api/admin/banners/CreateBanner

Body (form-data):
- type: modern
- topBadge: Refined Essentials
- title: Luxury Perfume Presentation
- subtitle: Elegance Crafted for Modern Connoisseurs
- bottomBadge: Master Perfumer
- websiteUrl: www.vamana.com
- order: 3
- isActive: true
- bannerImage: [Upload Image File]
```

---

## Step-by-Step Postman Setup

### 1. Get Admin Token
First, login to get admin token:
```
POST http://localhost:5000/api/admin/auth/login

Body (JSON):
{
  "email": "admin@vamana.com",
  "password": "your_password"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {...}
}
```

Copy the `token` from response.

### 2. Create New Request in Postman
1. Click "New" → "HTTP Request"
2. Set method to `POST`
3. Enter URL: `http://localhost:5000/api/admin/banners/CreateBanner`

### 3. Set Headers
1. Click "Headers" tab
2. Add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`

### 4. Set Body
1. Click "Body" tab
2. Select "form-data" (NOT raw JSON)
3. Add fields as shown in examples above
4. For `bannerImage`, change type from "Text" to "File" and select image

### 5. Send Request
Click "Send" button

### 6. Expected Response
```json
{
  "success": true,
  "message": "Banner created successfully",
  "data": {
    "_id": "65f1234567890abcdef12345",
    "type": "circle",
    "topBadge": "Fragrance & Elegance Co",
    "title": "Vamana Signature Collection",
    "subtitle": "Innovating the Perfume Industry",
    "bottomBadge": "Crafted by: Vamana",
    "websiteUrl": "www.vamana.com",
    "order": 1,
    "isActive": true,
    "image": "1234567890.jpg",
    "createdAt": "2024-03-12T10:30:00.000Z",
    "updatedAt": "2024-03-12T10:30:00.000Z"
  }
}
```

---

## Other Banner APIs

### Get All Banners
```
GET http://localhost:5000/api/admin/banners/GetBanners
```

### Get Single Banner
```
GET http://localhost:5000/api/admin/banners/GetBanner/:id
```

### Update Banner
```
PUT http://localhost:5000/api/admin/banners/UpdateBanner/:id

Body (form-data):
- Same fields as Create
- Only include fields you want to update
```

---

## Banner Types Explained

### 1. Circle Type
- Has `bottomBadge` field
- Circular design elements
- Best for: Brand showcase, signature collections

### 2. Arch Type
- Has `bottomText` field
- Arch-shaped design
- Best for: Elegant presentations, premium products

### 3. Modern Type
- Has `bottomBadge` field
- Modern, clean design
- Best for: Contemporary collections, minimalist style

---

## Image Requirements

### Recommended Specifications:
- Format: JPG, PNG, WebP
- Size: 1920x600px (or similar wide aspect ratio)
- Max file size: 5MB
- Quality: High resolution for best display

### Image Upload Location:
Images are stored in: `Backend/uploads/`

---

## Troubleshooting

### Error: "Please provide all required fields"
- Make sure you've included: type, topBadge, title, subtitle, websiteUrl

### Error: "Unauthorized"
- Check if Authorization header is set correctly
- Verify token is valid (not expired)
- Format: `Bearer YOUR_TOKEN` (with space after Bearer)

### Error: "Banner not found"
- Check if banner ID is correct
- Verify banner exists in database

### Image not uploading
- Make sure field name is exactly `bannerImage`
- Change field type to "File" in Postman
- Check file size is under 5MB

---

## Quick Test Commands

### Using cURL (Alternative to Postman)

```bash
# Create banner without image
curl -X POST http://localhost:5000/api/admin/banners/CreateBanner \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "type=circle" \
  -F "topBadge=Test Badge" \
  -F "title=Test Title" \
  -F "subtitle=Test Subtitle" \
  -F "websiteUrl=www.test.com" \
  -F "order=1"

# Create banner with image
curl -X POST http://localhost:5000/api/admin/banners/CreateBanner \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "type=circle" \
  -F "topBadge=Test Badge" \
  -F "title=Test Title" \
  -F "subtitle=Test Subtitle" \
  -F "websiteUrl=www.test.com" \
  -F "bannerImage=@/path/to/image.jpg"
```

---

## Database Direct Insert (MongoDB Compass)

If you want to insert directly in MongoDB:

```javascript
// Connect to your database
// Go to 'banners' collection
// Click "Insert Document"
// Paste this:

{
  "type": "circle",
  "topBadge": "Fragrance & Elegance Co",
  "title": "Vamana Signature Collection",
  "subtitle": "Innovating the Perfume Industry",
  "bottomBadge": "Crafted by: Vamana",
  "websiteUrl": "www.vamana.com",
  "order": 1,
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

Note: Image field will be empty if inserted directly. Use API for image upload.

---

## Summary

**Easiest Method**: Run `node seed-banners.js` for default banners

**For Custom Banners**: Use Postman with form-data and Authorization header

**Required Fields**: type, topBadge, title, subtitle, websiteUrl

**Optional**: bottomBadge (circle), bottomText (arch), order, isActive, bannerImage
