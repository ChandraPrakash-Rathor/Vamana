# Number Input Edit Fix

## Issue
When editing number fields (prices, discount) in Edit modals, users couldn't properly update the values because the cursor would jump to the end of the input field after each keystroke. Additionally, using `reset()` in the dependency array caused infinite re-renders.

## Root Cause
1. Using multiple `setValue()` calls in `useEffect` for number inputs causes the input to re-render and lose cursor position after each character typed.
2. Including `reset` in the useEffect dependency array causes infinite loops because `reset` is recreated on every render.

## Solution
1. Changed from using multiple `setValue()` calls to using a single `reset()` call with all form values at once.
2. Added a `useRef` flag (`hasInitialized`) to ensure the form is only initialized once when the modal opens.
3. Added a separate `useEffect` to reset the initialization flag when the modal closes.

## Files Fixed

### 1. EditLimitedOfferModal.jsx
**Changes:**
- Added `useRef` import and `hasInitialized` ref
- Modified useEffect to only run once per modal open using the ref flag
- Added second useEffect to reset flag when modal closes

**Code:**
```javascript
import { useState, useEffect, useRef } from 'react';

const hasInitialized = useRef(false);

// Prefill form when offer changes
useEffect(() => {
  if (offer && isOpen && productOptions.length > 0 && !hasInitialized.current) {
    reset({
      title: offer.title,
      description: offer.description,
      originalPrice: offer.originalPrice,
      offerPrice: offer.offerPrice,
      startDate: parseDate(offer.startDate),
      endDate: parseDate(offer.endDate),
      stockLimit: offer.stockLimit || '',
      featured: offer.featured || false
    });
    
    // Pre-select product
    const productId = typeof offer.product === 'object' ? offer.product._id : offer.product;
    const selectedProduct = productOptions.find(p => p.value === productId);
    setSelectedProduct(selectedProduct || null);
    
    hasInitialized.current = true;
  }
}, [offer, isOpen, productOptions, reset]);

// Reset initialization flag when modal closes
useEffect(() => {
  if (!isOpen) {
    hasInitialized.current = false;
  }
}, [isOpen]);
```

### 2. EditSaleModal.jsx
**Changes:**
- Added `useRef` import and `hasInitialized` ref
- Modified useEffect to only run once per modal open using the ref flag
- Added second useEffect to reset flag when modal closes

**Code:**
```javascript
import { useState, useEffect, useRef } from 'react';

const hasInitialized = useRef(false);

// Prefill form when sale changes
useEffect(() => {
  if (sale && isOpen && productOptions.length > 0 && !hasInitialized.current) {
    reset({
      name: sale.name,
      description: sale.description,
      discount: sale.discount,
      startDate: parseDate(sale.startDate),
      endDate: parseDate(sale.endDate)
    });
    
    // Pre-select products
    if (sale.rawApplicableProducts && sale.rawApplicableProducts.length > 0) {
      const selectedProducts = productOptions.filter(product => 
        sale.rawApplicableProducts.includes(product.value)
      );
      setSelectedProducts(selectedProducts);
    } else {
      setSelectedProducts([]);
    }
    
    hasInitialized.current = true;
  }
}, [sale, isOpen, productOptions, reset]);

// Reset initialization flag when modal closes
useEffect(() => {
  if (!isOpen) {
    hasInitialized.current = false;
  }
}, [isOpen]);
```

## Benefits
- ✅ Smooth editing of number inputs (prices, discount, stock limit)
- ✅ Cursor stays in correct position while typing
- ✅ No infinite re-render loops
- ✅ Form only initializes once per modal open
- ✅ Better performance
- ✅ Better user experience
- ✅ Cleaner code with single reset call

## Technical Details
1. The `reset()` method from react-hook-form sets all form values at once without triggering multiple re-renders, which preserves the cursor position in input fields.
2. The `useRef` hook creates a persistent flag that doesn't cause re-renders when changed.
3. The flag ensures the form is only initialized once when the modal opens, preventing infinite loops.
4. When the modal closes, the flag is reset so the form can be initialized again next time.

## Status: ✅ FIXED
Both EditLimitedOfferModal and EditSaleModal now allow smooth editing of all number fields without infinite re-render issues.
