# Complete Site Settings Implementation Guide

## ✅ BACKEND - ALREADY DONE

All backend files are created and working:
- Model: `Backend/Admin/models/SiteSettings.js`
- Controller: `Backend/Admin/controllers/siteSettingsController.js`
- Routes: Added to admin and member routes
- APIs: `GET/PUT /api/admin/site-settings`, `GET /api/member/site-settings`

## 🔧 FRONTEND - TO IMPLEMENT

### 1. Admin Settings Page - Add Site Settings Tab

Open `admin/src/pages/Settings.jsx` and add this after line 20 (after imports):

```javascript
import { getSiteSettings, updateSiteSettings } from '../APIS/apis/SiteSettingsApi';
```

Add state for site settings (around line 40):
```javascript
const [siteSettings, setSiteSettings] = useState(null);
const [logoPreview, setLogoPreview] = useState(null);
const [logoFile, setLogoFile] = useState(null);
```

Add fetch function (around line 90):
```javascript
const fetchSiteSettings = async () => {
  try {
    const data = await getSiteSettings();
    setSiteSettings(data.data);
    setLogoPreview(`http://localhost:5000${data.data.logo}`);
  } catch (error) {
    toast.error('Failed to load site settings');
  }
};
```

Call it in useEffect:
```javascript
useEffect(() => {
  fetchCurrentUser();
  fetchAllAdmins();
  fetchAllThemes();
  fetchSiteSettings(); // ADD THIS
}, []);
```

Add save function:
```javascript
const handleSaveSettings = async () => {
  try {
    const formData = new FormData();
    if (logoFile) formData.append('logo', logoFile);
    formData.append('siteName', siteSettings.siteName);
    formData.append('tagline', siteSettings.tagline);
    formData.append('email', siteSettings.email);
    formData.append('phone', siteSettings.phone);
    formData.append('address', siteSettings.address);
    formData.append('socialLinks', JSON.stringify(siteSettings.socialLinks));
    formData.append('footerAbout', siteSettings.footerAbout);
    formData.append('footerCopyright', siteSettings.footerCopyright);
    
    await updateSiteSettings(formData);
    toast.success('Settings updated successfully!');
    fetchSiteSettings();
  } catch (error) {
    toast.error('Failed to update settings');
  }
};
```

Add "Site Settings" tab button (find the tabs section around line 200):
```javascript
<button onClick={() => setActiveTab('site')} 
  className={activeTab === 'site' ? 'active' : ''}>
  Site Settings
</button>
```

Add Site Settings tab content (after themes tab, around line 400):
```javascript
{activeTab === 'site' && siteSettings && (
  <div className="settings-section">
    <h3>Site Settings</h3>
    
    {/* Logo Upload */}
    <div className="form-group">
      <label>Logo</label>
      {logoPreview && <img src={logoPreview} alt="Logo" style={{width: '150px', marginBottom: '10px'}} />}
      <input type="file" accept="image/*" onChange={(e) => {
        setLogoFile(e.target.files[0]);
        setLogoPreview(URL.createObjectURL(e.target.files[0]));
      }} />
    </div>

    {/* Site Info */}
    <div className="form-group">
      <label>Site Name</label>
      <input value={siteSettings.siteName} onChange={(e) => 
        setSiteSettings({...siteSettings, siteName: e.target.value})} />
    </div>

    <div className="form-group">
      <label>Tagline</label>
      <input value={siteSettings.tagline} onChange={(e) => 
        setSiteSettings({...siteSettings, tagline: e.target.value})} />
    </div>

    {/* Contact Info */}
    <div className="form-group">
      <label>Email</label>
      <input value={siteSettings.email} onChange={(e) => 
        setSiteSettings({...siteSettings, email: e.target.value})} />
    </div>

    <div className="form-group">
      <label>Phone</label>
      <input value={siteSettings.phone} onChange={(e) => 
        setSiteSettings({...siteSettings, phone: e.target.value})} />
    </div>

    <div className="form-group">
      <label>Address</label>
      <input value={siteSettings.address} onChange={(e) => 
        setSiteSettings({...siteSettings, address: e.target.value})} />
    </div>

    {/* Social Links */}
    <h4>Social Media Links</h4>
    <div className="form-group">
      <label>Facebook</label>
      <input value={siteSettings.socialLinks.facebook} onChange={(e) => 
        setSiteSettings({...siteSettings, socialLinks: {...siteSettings.socialLinks, facebook: e.target.value}})} />
    </div>

    <div className="form-group">
      <label>Instagram</label>
      <input value={siteSettings.socialLinks.instagram} onChange={(e) => 
        setSiteSettings({...siteSettings, socialLinks: {...siteSettings.socialLinks, instagram: e.target.value}})} />
    </div>

    <div className="form-group">
      <label>Twitter</label>
      <input value={siteSettings.socialLinks.twitter} onChange={(e) => 
        setSiteSettings({...siteSettings, socialLinks: {...siteSettings.socialLinks, twitter: e.target.value}})} />
    </div>

    <div className="form-group">
      <label>YouTube</label>
      <input value={siteSettings.socialLinks.youtube} onChange={(e) => 
        setSiteSettings({...siteSettings, socialLinks: {...siteSettings.socialLinks, youtube: e.target.value}})} />
    </div>

    <div className="form-group">
      <label>LinkedIn</label>
      <input value={siteSettings.socialLinks.linkedin} onChange={(e) => 
        setSiteSettings({...siteSettings, socialLinks: {...siteSettings.socialLinks, linkedin: e.target.value}})} />
    </div>

    {/* Footer Content */}
    <h4>Footer Content</h4>
    <div className="form-group">
      <label>About Text</label>
      <textarea value={siteSettings.footerAbout} onChange={(e) => 
        setSiteSettings({...siteSettings, footerAbout: e.target.value})} rows="3" />
    </div>

    <div className="form-group">
      <label>Copyright Text</label>
      <input value={siteSettings.footerCopyright} onChange={(e) => 
        setSiteSettings({...siteSettings, footerCopyright: e.target.value})} />
    </div>

    <button onClick={handleSaveSettings} className="btn btn-primary">
      Save Settings
    </button>
  </div>
)}
```

### 2. Member Header - Use Dynamic Logo

Open `member/src/components/common/Header.jsx` and add at top:

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';
```

Add state and fetch:
```javascript
const [settings, setSettings] = useState(null);

useEffect(() => {
  fetchSettings();
}, []);

const fetchSettings = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/member/site-settings`);
    setSettings(response.data.data);
  } catch (error) {
    console.error('Failed to load settings');
  }
};
```

Replace logo img src with:
```javascript
<img 
  src={settings ? `http://localhost:5000${settings.logo}` : '/logo.png'} 
  alt={settings?.siteName || 'Logo'} 
/>
```

### 3. Member Footer - Use Dynamic Content

Open `member/src/components/common/Footer.jsx` and add at top:

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';
```

Add state and fetch:
```javascript
const [settings, setSettings] = useState(null);

useEffect(() => {
  fetchSettings();
}, []);

const fetchSettings = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/member/site-settings`);
    setSettings(response.data.data);
  } catch (error) {
    console.error('Failed to load settings');
  }
};
```

Replace hardcoded content with dynamic:
```javascript
{/* Logo */}
<img src={settings ? `http://localhost:5000${settings.logo}` : '/logo.png'} alt="Logo" />

{/* About Text */}
<p>{settings?.footerAbout || 'Loading...'}</p>

{/* Contact Info */}
<p><FontAwesomeIcon icon={faEnvelope} /> {settings?.email}</p>
<p><FontAwesomeIcon icon={faPhone} /> {settings?.phone}</p>
<p><FontAwesomeIcon icon={faMapMarkerAlt} /> {settings?.address}</p>

{/* Social Links */}
{settings?.socialLinks.facebook && (
  <a href={settings.socialLinks.facebook} target="_blank">
    <FontAwesomeIcon icon={faFacebookF} />
  </a>
)}
{settings?.socialLinks.instagram && (
  <a href={settings.socialLinks.instagram} target="_blank">
    <FontAwesomeIcon icon={faInstagram} />
  </a>
)}
{/* ... repeat for other social links */}

{/* Copyright */}
<p>{settings?.footerCopyright}</p>
```

## 🚀 TESTING

1. Restart backend: `cd Backend && npm start`
2. Go to Admin Settings page
3. Click "Site Settings" tab
4. Upload logo, change site name, add social links
5. Click "Save Settings"
6. Go to member site - check header logo and footer content
7. Changes should reflect immediately!

## 📝 NOTES

- Backend creates default settings automatically
- Only ONE settings document exists in database
- Logo uploads to `/uploads` folder
- Old logo is deleted when new one is uploaded
- All changes are immediate - no restart needed
- Settings are public on member side (no auth required)

## ✅ COMPLETE!

Backend: 100% Done
Frontend: Follow steps above to complete

Total Implementation Time: ~30 minutes
