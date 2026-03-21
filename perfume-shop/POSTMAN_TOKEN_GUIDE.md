# Postman Me Token Kaise Pass Karein 🔐

## Method 1: Authorization Header (Recommended)

### Step 1: Get Admin Token
First, login karke token lo:

```
POST http://localhost:5000/api/admin/auth/login

Body (raw JSON):
{
  "email": "admin@vamana.com",
  "password": "your_password"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjEyMzQ1Njc4OTBhYmNkZWYxMjM0NSIsImlhdCI6MTcxMDI0MzYwMCwiZXhwIjoxNzEwMzMwMDAwfQ.abc123xyz",
  "admin": {
    "_id": "65f1234567890abcdef12345",
    "name": "Admin",
    "email": "admin@vamana.com"
  }
}
```

Copy the `token` value.

### Step 2: Postman Me Token Add Karo

#### Option A: Headers Tab (Most Common)
1. Postman me apna request kholo
2. **Headers** tab pe click karo
3. Add new header:
   - **Key**: `Authorization`
   - **Value**: `Bearer YOUR_TOKEN_HERE`

**Example:**
```
Key: Authorization
Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjEyMzQ1Njc4OTBhYmNkZWYxMjM0NSIsImlhdCI6MTcxMDI0MzYwMCwiZXhwIjoxNzEwMzMwMDAwfQ.abc123xyz
```

**⚠️ Important:** 
- `Bearer` aur token ke beech me **space** hona chahiye
- Token ke aage/peeche extra space nahi hona chahiye

#### Option B: Authorization Tab (Easier)
1. Postman me apna request kholo
2. **Authorization** tab pe click karo
3. **Type** dropdown se **Bearer Token** select karo
4. **Token** field me apna token paste karo (without "Bearer" word)

---

## Method 2: Environment Variables (Best for Multiple Requests)

### Step 1: Environment Banao
1. Postman me top-right corner me **Environments** icon click karo
2. **Create Environment** click karo
3. Name do: `Vamana Local`

### Step 2: Variables Add Karo
```
Variable Name: admin_token
Initial Value: (leave empty)
Current Value: (leave empty for now)
```

```
Variable Name: base_url
Initial Value: http://localhost:5000
Current Value: http://localhost:5000
```

### Step 3: Token Get Karo aur Save Karo
1. Login request bhejo
2. Response me se token copy karo
3. Environment me `admin_token` variable me paste karo

### Step 4: Requests Me Use Karo
**Headers:**
```
Key: Authorization
Value: Bearer {{admin_token}}
```

**URL:**
```
{{base_url}}/api/admin/banners/CreateBanner
```

---

## Method 3: Collection Variables (For Sharing)

### Step 1: Collection Banao
1. Left sidebar me **Collections** pe click karo
2. **Create Collection** click karo
3. Name: `Vamana Admin APIs`

### Step 2: Variables Add Karo
1. Collection pe right-click → **Edit**
2. **Variables** tab pe jao
3. Add variables:
```
base_url: http://localhost:5000
admin_token: (token paste karo)
```

### Step 3: Requests Add Karo
Collection me requests add karo aur variables use karo:
```
URL: {{base_url}}/api/admin/banners/CreateBanner
Header: Authorization: Bearer {{admin_token}}
```

---

## Complete Example: Banner Create Request

### Request Setup
```
Method: POST
URL: http://localhost:5000/api/admin/banners/CreateBanner

Headers:
- Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- Content-Type: multipart/form-data (auto-set)

Body (form-data):
- type: circle
- topBadge: Test Badge
- title: Test Title
- subtitle: Test Subtitle
- websiteUrl: www.test.com
- order: 1
- isActive: true
- bannerImage: [Select File]
```

---

## Token Expire Ho Gaya? 🔄

### Check Token Expiry
Token usually 30 days ke liye valid hota hai. Agar expire ho gaya to:

1. Login API call karo again
2. New token copy karo
3. Environment/Collection variable update karo

### Auto-Refresh Token (Advanced)
Postman me pre-request script add kar sakte ho:

```javascript
// Pre-request Script
const tokenExpiry = pm.environment.get("token_expiry");
const currentTime = new Date().getTime();

if (!tokenExpiry || currentTime > tokenExpiry) {
    // Login and get new token
    pm.sendRequest({
        url: 'http://localhost:5000/api/admin/auth/login',
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                email: 'admin@vamana.com',
                password: 'your_password'
            })
        }
    }, function (err, res) {
        if (!err) {
            const token = res.json().token;
            pm.environment.set("admin_token", token);
            // Set expiry to 29 days from now
            pm.environment.set("token_expiry", currentTime + (29 * 24 * 60 * 60 * 1000));
        }
    });
}
```

---

## Common Errors & Solutions

### ❌ Error: "No token provided"
**Solution:** 
- Check if Authorization header hai
- Check spelling: `Authorization` (capital A)

### ❌ Error: "Invalid token"
**Solution:**
- Token copy karte time extra space na ho
- `Bearer` word ke baad space ho
- Token expire to nahi ho gaya?
- Login karke new token lo

### ❌ Error: "Token expired"
**Solution:**
- Login API call karo
- New token lo
- Environment variable update karo

### ❌ Error: "Unauthorized"
**Solution:**
- Check if token sahi hai
- Check if admin account active hai
- Backend server running hai?

---

## Testing Different User Roles

### Admin Token
```
Login: POST /api/admin/auth/login
Use for: All admin APIs
```

### Member Token
```
Login: POST /api/member/auth/login
Use for: Member APIs (cart, orders, etc.)
```

---

## Quick Copy-Paste Examples

### 1. Get All Banners (No Auth Required)
```
GET http://localhost:5000/api/admin/banners/GetBanners
```

### 2. Create Banner (Auth Required)
```
POST http://localhost:5000/api/admin/banners/CreateBanner

Headers:
Authorization: Bearer YOUR_TOKEN

Body (form-data):
type: circle
topBadge: Test
title: Test Title
subtitle: Test Subtitle
websiteUrl: www.test.com
```

### 3. Update Banner (Auth Required)
```
PUT http://localhost:5000/api/admin/banners/UpdateBanner/BANNER_ID

Headers:
Authorization: Bearer YOUR_TOKEN

Body (form-data):
title: Updated Title
isActive: true
```

---

## Postman Collection Export/Import

### Export Collection
1. Collection pe right-click
2. **Export** click karo
3. Collection v2.1 select karo
4. Save JSON file

### Import Collection
1. **Import** button click karo
2. JSON file select karo
3. Collection import ho jayega with all requests

### Share with Team
- Export collection
- Share JSON file
- Team members import kar sakte hain
- Environment variables separately share karo

---

## Pro Tips 💡

### 1. Use Collection Runner
- Multiple requests ek saath test karo
- Automated testing ke liye

### 2. Save Responses
- Response pe click karo
- **Save Response** → **Save as example**
- Future reference ke liye

### 3. Use Tests Tab
```javascript
// Tests tab me add karo
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.token).to.exist;
});
```

### 4. Use Pre-request Scripts
```javascript
// Current timestamp add karo
pm.environment.set("timestamp", new Date().getTime());
```

---

## Summary Checklist ✅

- [ ] Login API se token liya
- [ ] Token copy kiya (without extra spaces)
- [ ] Authorization header add kiya
- [ ] `Bearer` word ke baad space hai
- [ ] Request bheja
- [ ] Response check kiya
- [ ] Token environment variable me save kiya
- [ ] Other requests me reuse kiya

---

## Need Help?

### Check These:
1. Backend server running hai? (`npm start` in Backend folder)
2. MongoDB connected hai?
3. Admin account exists?
4. Token format sahi hai?
5. API endpoint sahi hai?

### Debug Steps:
1. Console me backend logs dekho
2. Postman console dekho (View → Show Postman Console)
3. Network tab me request/response dekho
4. Token JWT.io pe decode karke dekho

---

**Happy API Testing! 🚀**
