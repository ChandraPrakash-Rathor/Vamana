# Modals Folder

This folder contains all modal components used throughout the admin panel.

## Current Modals

### AddProductModal.jsx
Modal for adding new products to the inventory.

**Features:**
- React Hook Form validation
- Main product image upload with preview and cropping
- Multiple sub-images upload (max 5) with previews
- Image cropping functionality using react-image-crop
- Real-time price calculation with discount
- Form fields:
  - Product Name (required, min 3 chars)
  - SKU (required, uppercase letters/numbers/hyphens only)
  - Category (required, react-select dropdown: Perfume/Attar/Combo)
  - Actual Price (required, must be > 0)
  - Discount % (optional, 0-100%)
  - Final Price (auto-calculated, read-only)
  - Stock Quantity (required, cannot be negative)
  - Description (required, min 20 chars)
  - Main Image (required, with crop option)
  - Sub Images (optional, max 5)
- FormData submission
- Loading state during submission
- Image removal functionality
- Responsive design

**Image Cropping:**
- After selecting an image, a crop modal appears
- Drag to adjust the crop area (1:1 aspect ratio)
- Click "Apply Crop" to confirm or "Cancel" to discard
- Can re-crop the image anytime using the "Crop" button

**Price Calculation:**
- Enter actual price and discount percentage
- Final price is calculated automatically
- Shows discount badge and savings amount
- All three values (actual, discount, final) are submitted

**Usage:**
```jsx
import AddProductModal from '../components/modals/AddProductModal';

const [isModalOpen, setIsModalOpen] = useState(false);

<AddProductModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
/>
```

## Future Modals
- EditProductModal - For editing existing products
- DeleteConfirmModal - For confirming product deletion
- ViewProductModal - For viewing product details
- BulkUploadModal - For bulk product uploads
