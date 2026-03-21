# Insert Third Banner (Modern Type) 🎨

## Quick Method: Postman Request

### Request Details
```
Method: POST
URL: http://localhost:5000/api/admin/banners/CreateBanner
```

### Headers
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Body (form-data)
Select **form-data** in Body tab, then add these fields:

| Key | Type | Value |
|-----|------|-------|
| `type` | Text | `modern` |
| `topBadge` | Text | `Refined Essentials` |
| `title` | Text | `Luxury Perfume Presentation` |
| `subtitle` | Text | `Elegance Crafted for Modern Connoisseurs` |
| `bottomBadge` | Text | `Master Perfumer` |
| `websiteUrl` | Text | `www.vamana.com` |
| `order` | Text | `3` |
| `isActive` | Text | `true` |
| `bannerImage` | File | [Select your image file] |

---

## Step-by-Step Postman Guide

### Step 1: Get Admin Token
```
POST http://localhost:5000/api/admin/auth/login

Body (raw JSON):
{
  "email": "admin@vamana.com",
  "password": "your_password"
}
```
Copy the token from response.

### Step 2: Create New Request
1. Click **New** → **HTTP Request**
2. Set method to **POST**
3. Enter URL: `http://localhost:5000/api/admin/banners/CreateBanner`

### Step 3: Add Authorization
1. Go to **Headers** tab
2. Add:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`

### Step 4: Add Body Data
1. Go to **Body** tab
2. Select **form-data** (NOT raw)
3. Add all fields from table above
4. For `bannerImage`:
   - Change dropdown from "Text" to "File"
   - Click "Select Files" and choose your image

### Step 5: Send Request
Click **Send** button

### Step 6: Expected Response
```json
{
  "success": true,
  "message": "Banner created successfully",
  "data": {
    "_id": "65f1234567890abcdef12345",
    "type": "modern",
    "topBadge": "Refined Essentials",
    "title": "Luxury Perfume Presentation",
    "subtitle": "Elegance Crafted for Modern Connoisseurs",
    "bottomBadge": "Master Perfumer",
    "websiteUrl": "www.vamana.com",
    "order": 3,
    "isActive": true,
    "image": "1710243600000.jpg",
    "createdAt": "2024-03-12T10:30:00.000Z",
    "updatedAt": "2024-03-12T10:30:00.000Z"
  }
}
```

---

## Alternative: Using cURL Command

Copy-paste this in terminal (replace YOUR_TOKEN and IMAGE_PATH):

```bash
curl -X POST http://localhost:5000/api/admin/banners/CreateBanner \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "type=modern" \
  -F "topBadge=Refined Essentials" \
  -F "title=Luxury Perfume Presentation" \
  -F "subtitle=Elegance Crafted for Modern Connoisseurs" \
  -F "bottomBadge=Master Perfumer" \
  -F "websiteUrl=www.vamana.com" \
  -F "order=3" \
  -F "isActive=true" \
  -F "bannerImage=@/path/to/your/image.jpg"
```

---

## Alternative: Run Seed Script (All 3 Banners)

If you want all 3 banners at once:

```bash
cd Backend
node seed-banners.js
```

This will insert:
1. Circle type banner (order: 1)
2. Arch type banner (order: 2)
3. Modern type banner (order: 3)

---

## Verify Banner Created

### Method 1: Check in Postman
```
GET http://localhost:5000/api/admin/banners/GetBanners
```

Should return 3 banners.

### Method 2: Check in MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. Go to `banners` collection
4. You should see 3 documents

### Method 3: Check on Frontend
1. Open: `http://localhost:3000`
2. Home page pe banner slider dekho
3. 3 banners rotate hone chahiye

---

## Troubleshooting

### Error: "No token provided"
- Authorization header add kiya?
- Token format: `Bearer YOUR_TOKEN`
- Space between Bearer and token?

### Error: "Please provide all required fields"
- Check all required fields filled hai:
  - type, topBadge, title, subtitle, websiteUrl

### Error: "Unauthorized"
- Token expire ho gaya? Login karke new token lo
- Admin account active hai?

### Banner not showing on frontend?
- Check `isActive: true` hai
- Backend server restart karo
- Frontend refresh karo (Ctrl+F5)
- Browser cache clear karo

### Image not uploading?
- Field name exactly `bannerImage` hai?
- File type to "File" set kiya?
- Image size 5MB se kam hai?

---

## Image Recommendations

### For Modern Type Banner:
- **Size**: 1920x600px (wide aspect ratio)
- **Format**: JPG or PNG
- **Style**: Clean, minimalist, modern aesthetic
- **Colors**: Match with your theme colors
- **Content**: Perfume bottles, elegant background

### Sample Image Ideas:
1. Luxury perfume bottles on marble surface
2. Modern minimalist perfume display
3. Elegant fragrance collection showcase
4. Contemporary perfume presentation

---

## What Happens After Insert?

1. ✅ Banner saved in MongoDB
2. ✅ Image uploaded to `Backend/uploads/`
3. ✅ Banner appears in admin dashboard
4. ✅ Banner shows on member site home page
5. ✅ Banner rotates in slider with other banners

---

## Next Steps

After inserting banner:

1. **View on Frontend**
   - Open: `http://localhost:3000`
   - Check home page banner slider

2. **Edit if Needed**
   ```
   PUT http://localhost:5000/api/admin/banners/UpdateBanner/BANNER_ID
   ```

3. **Change Order**
   - Update `order` field to change position
   - Lower number = shows first

4. **Deactivate**
   - Set `isActive: false` to hide banner

---

## Quick Copy-Paste for Postman

### Without Image:
```
type: modern
topBadge: Refined Essentials
title: Luxury Perfume Presentation
subtitle: Elegance Crafted for Modern Connoisseurs
bottomBadge: Master Perfumer
websiteUrl: www.vamana.com
order: 3
isActive: true
```

### With Custom Text:
```
type: modern
topBadge: Premium Collection
title: Vamana Signature Series
subtitle: Crafted for the Distinguished
bottomBadge: Est. 2024
websiteUrl: www.vamana.com
order: 3
isActive: true
```

---

## Summary Checklist ✅

- [ ] Got admin token from login API
- [ ] Created POST request in Postman
- [ ] Added Authorization header with Bearer token
- [ ] Selected form-data in Body
- [ ] Added all required fields
- [ ] Selected image file for bannerImage
- [ ] Sent request
- [ ] Got success response
- [ ] Verified banner in database
- [ ] Checked banner on frontend

---

**Ready to insert! 🚀**

Just follow Step 1-6 and your third banner will be created! 🎉
