# Theme Color Mapping Guide

## Available CSS Variables
All components should use these CSS variables instead of hardcoded colors:

```css
--sand-50   /* Lightest shade */
--sand-100
--sand-200
--sand-300
--sand-400
--sand-500
--sand-600  /* Primary brand color */
--sand-700
--sand-800
--sand-900  /* Darkest shade */
--sand-950  /* Extra dark (also available as --sand-dark) */
```

## Color Replacement Rules

### Replace Hardcoded Colors With:

| Hardcoded Color | Use Instead | Purpose |
|----------------|-------------|---------|
| `#B3873F`, `#b3873f` | `var(--sand-600)` | Primary brand color |
| `#D4A574` | `var(--sand-400)` | Light accent |
| `#8B6F47` | `var(--sand-700)` | Dark accent |
| `#F9F6ED`, `#f9f6ed` | `var(--sand-50)` | Background light |
| `#FFF5E6`, `#fff5e6` | `var(--sand-100)` | Background lighter |
| `#FFE8CC`, `#ffe8cc` | `var(--sand-200)` | Background light accent |
| `#FFD699`, `#ffd699` | `var(--sand-300)` | Border light |
| `rgba(179, 135, 63, X)` | `rgba(var(--sand-600-rgb), X)` | Transparent primary |

### Status Colors (Keep as-is or create new variables):
- Success: `#10b981`, `#27ae60`, `#28a745` → Consider `var(--success-color)`
- Error: `#dc3545`, `#e74c3c`, `#c0392b` → Consider `var(--error-color)`
- Warning: `#f59e0b`, `#ffc107` → Consider `var(--warning-color)`
- Info: `#17a2b8`, `#3498db` → Consider `var(--info-color)`

## Implementation Strategy

### Phase 1: Critical UI Components (HIGH PRIORITY)
1. ✅ Header & Footer (already using CSS variables)
2. ❌ "Why Choose Vamana" section (Home page)
3. ❌ Offers page
4. ❌ Checkout page (Razorpay theme color)
5. ❌ All modals (AddCouponModal, etc.)

### Phase 2: Secondary Components
1. Product cards
2. Cart items
3. Forms and inputs
4. Buttons and CTAs

### Phase 3: Admin Dashboard
1. Sidebar
2. Dashboard cards
3. Tables
4. Forms

## Example Fixes

### Before (Hardcoded):
```jsx
<div style={{
  backgroundColor: '#B3873F',
  color: 'white',
  border: '2px solid #D4A574'
}}>
```

### After (Dynamic):
```jsx
<div style={{
  backgroundColor: 'var(--sand-600)',
  color: 'white',
  border: '2px solid var(--sand-400)'
}}>
```

### For Razorpay Theme:
```javascript
// Before
theme: {
  color: '#B3873F'
}

// After - Get from CSS variable
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--sand-600').trim();

theme: {
  color: primaryColor
}
```

## Status
- ❌ Not Started
- 🔄 In Progress
- ✅ Complete
