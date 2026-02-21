# Perfume Loader Components

Beautiful perfume spray-themed loaders for the Vamana Perfumes admin panel.

## Components

### 1. PerfumeLoader (Full Screen)
A full-screen loader with an animated perfume bottle spraying particles.

**Usage:**
```jsx
import PerfumeLoader from '../components/common/PerfumeLoader';

// In your component
{isLoading && <PerfumeLoader message="Loading products..." />}
```

**Props:**
- `message` (optional): Custom loading message. Default: "Loading..."

**Features:**
- Animated perfume bottle with floating effect
- Liquid wave animation inside bottle
- Spray nozzle with pumping animation
- Particle spray effect with mist
- Pulsing text and bouncing dots
- Backdrop blur effect
- Theme-consistent colors (sand palette)

**Use Cases:**
- Page loading
- Data fetching
- Large operations
- Initial app load

---

### 2. SprayLoader (Inline)
A compact inline loader for buttons and smaller areas.

**Usage:**
```jsx
import SprayLoader from '../components/common/SprayLoader';

// In a button
<button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <SprayLoader size="small" color="white" />
      <span className="ms-2">Submitting...</span>
    </>
  ) : (
    'Submit'
  )}
</button>
```

**Props:**
- `size` (optional): 'small', 'medium', or 'large'. Default: 'medium'
- `color` (optional): Any CSS color value. Default: 'var(--sand-600)'

**Features:**
- Mini perfume bottle animation
- Spray particle effects
- Floating animation
- Customizable size and color
- Lightweight and performant

**Use Cases:**
- Button loading states
- Inline loading indicators
- Form submissions
- Small loading areas

---

## Examples

### Full Screen Loader
```jsx
import { useState, useEffect } from 'react';
import PerfumeLoader from '../components/common/PerfumeLoader';

function ProductsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return <PerfumeLoader message="Loading products..." />;
  }

  return <div>Your content here</div>;
}
```

### Button with Inline Loader
```jsx
import { useState } from 'react';
import SprayLoader from '../components/common/SprayLoader';

function AddProductButton() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    // Your submit logic
    await submitProduct();
    setSubmitting(false);
  };

  return (
    <button 
      onClick={handleSubmit}
      disabled={submitting}
      style={{
        padding: '0.75rem 2rem',
        background: 'linear-gradient(135deg, var(--sand-600), var(--sand-700))',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: submitting ? 'not-allowed' : 'pointer'
      }}
    >
      {submitting ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SprayLoader size="small" color="white" />
          <span>Adding Product...</span>
        </div>
      ) : (
        'Add Product'
      )}
    </button>
  );
}
```

### Card Loading State
```jsx
import SprayLoader from '../components/common/SprayLoader';

function ProductCard({ loading, product }) {
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
        backgroundColor: 'var(--sand-100)',
        borderRadius: '12px'
      }}>
        <SprayLoader size="large" />
      </div>
    );
  }

  return <div>{/* Product card content */}</div>;
}
```

### Different Sizes
```jsx
<SprayLoader size="small" />   {/* 30px bottle */}
<SprayLoader size="medium" />  {/* 40px bottle - default */}
<SprayLoader size="large" />   {/* 50px bottle */}
```

### Custom Colors
```jsx
<SprayLoader color="white" />              {/* White loader */}
<SprayLoader color="#007bff" />            {/* Blue loader */}
<SprayLoader color="var(--sand-600)" />    {/* Theme color - default */}
```

---

## Animation Details

### PerfumeLoader Animations:
1. **bottleFloat**: Bottle moves up and down smoothly
2. **liquidWave**: Liquid inside bottle has wave effect
3. **shine**: Shine effect on bottle glass
4. **nozzlePump**: Spray nozzle pumps up and down
5. **sprayParticle**: 8 particles spray out in arc pattern
6. **mistExpand**: Mist cloud expands and fades
7. **textPulse**: Loading text pulses
8. **dotBounce**: Loading dots bounce in sequence

### SprayLoader Animations:
1. **miniFloat**: Mini bottle floats gently
2. **miniSpray**: 3 particles spray out

---

## Styling Tips

### Match Your Theme
```jsx
// Use theme colors
<SprayLoader color="var(--sand-600)" />

// Match button color
<SprayLoader color="white" />  // For dark buttons
<SprayLoader color="var(--sand-900)" />  // For light buttons
```

### Responsive Sizing
```jsx
// Mobile
<SprayLoader size="small" />

// Tablet
<SprayLoader size="medium" />

// Desktop
<SprayLoader size="large" />
```

---

## Performance Notes

- Both loaders use CSS animations (GPU accelerated)
- No external dependencies except React
- Minimal re-renders
- Lightweight bundle size
- Smooth 60fps animations

---

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

---

## Accessibility

- Loaders are purely visual
- Consider adding `aria-live="polite"` to loading messages
- Ensure sufficient color contrast
- Provide alternative text for screen readers

```jsx
<div role="status" aria-live="polite">
  <PerfumeLoader message="Loading products..." />
  <span className="sr-only">Loading products, please wait...</span>
</div>
```
