# Delete Confirmation Modal

A beautiful, reusable confirmation modal for delete operations with smooth animations and clear visual feedback.

## Features

- ✅ Beautiful gradient header with warning icon
- ✅ Animated entrance and pulse effects
- ✅ Clear warning message with item name display
- ✅ Loading state during deletion
- ✅ Prevents accidental clicks during deletion
- ✅ Backdrop blur effect
- ✅ Fully responsive design
- ✅ Customizable messages and titles

## Usage

### Basic Example

```jsx
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';

function MyComponent() {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (item) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteItem(deleteModal.item.id);
      toast.success('Item deleted successfully!');
      setDeleteModal({ isOpen: false, item: null });
    } catch (error) {
      toast.error('Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button onClick={() => handleDeleteClick(item)}>Delete</button>

      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => !isDeleting && setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        itemName={deleteModal.item?.name}
        isDeleting={isDeleting}
      />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | required | Controls modal visibility |
| `onClose` | function | required | Called when modal should close |
| `onConfirm` | function | required | Called when user confirms deletion |
| `title` | string | "Confirm Delete" | Modal header title |
| `message` | string | "Are you sure..." | Main confirmation message |
| `itemName` | string | "" | Name of item being deleted (displayed in box) |
| `isDeleting` | boolean | false | Shows loading state on confirm button |

## Examples

### Delete Coupon
```jsx
<DeleteConfirmationModal 
  isOpen={deleteModal.isOpen}
  onClose={() => setDeleteModal({ isOpen: false, coupon: null })}
  onConfirm={handleDeleteConfirm}
  title="Delete Coupon"
  message="Are you sure you want to delete this coupon? This will permanently remove it from the system."
  itemName={deleteModal.coupon?.code}
  isDeleting={isDeleting}
/>
```

### Delete Product
```jsx
<DeleteConfirmationModal 
  isOpen={deleteModal.isOpen}
  onClose={() => setDeleteModal({ isOpen: false, product: null })}
  onConfirm={handleDeleteConfirm}
  title="Delete Product"
  message="This product will be permanently removed from your inventory."
  itemName={deleteModal.product?.name}
  isDeleting={isDeleting}
/>
```

### Delete User
```jsx
<DeleteConfirmationModal 
  isOpen={deleteModal.isOpen}
  onClose={() => setDeleteModal({ isOpen: false, user: null })}
  onConfirm={handleDeleteConfirm}
  title="Delete User"
  message="This user account will be permanently deleted along with all associated data."
  itemName={deleteModal.user?.email}
  isDeleting={isDeleting}
/>
```

### Simple Delete (No Item Name)
```jsx
<DeleteConfirmationModal 
  isOpen={deleteModal.isOpen}
  onClose={() => setDeleteModal({ isOpen: false })}
  onConfirm={handleDeleteConfirm}
  title="Confirm Delete"
  message="Are you sure you want to proceed with this deletion?"
  isDeleting={isDeleting}
/>
```

## Visual Features

### Header
- Red gradient background (#dc3545 to #c82333)
- Warning triangle icon in circular badge
- White text for high contrast

### Body
- Large animated trash icon with pulse effect
- Clear message text
- Item name displayed in highlighted box (if provided)
- Yellow warning banner: "This action cannot be undone!"

### Footer
- Cancel button (gray, disabled during deletion)
- Delete button (red gradient, shows spinner during deletion)
- Smooth hover effects

### Animations
- Fade in backdrop
- Slide in modal from slightly above
- Pulse effect on trash icon
- Smooth hover transitions

## Best Practices

1. **Always disable close during deletion:**
   ```jsx
   onClose={() => !isDeleting && setDeleteModal({ isOpen: false, item: null })}
   ```

2. **Show loading state:**
   ```jsx
   const [isDeleting, setIsDeleting] = useState(false);
   ```

3. **Provide clear item identification:**
   ```jsx
   itemName={item?.code || item?.name || item?.id}
   ```

4. **Handle errors gracefully:**
   ```jsx
   try {
     await deleteItem(id);
     toast.success('Deleted!');
   } catch (error) {
     toast.error('Failed to delete');
   } finally {
     setIsDeleting(false);
   }
   ```

5. **Refresh data after deletion:**
   ```jsx
   await deleteItem(id);
   dispatch(fetchItems()); // Refresh list
   ```

## Styling

The modal uses:
- CSS-in-JS for all styling
- CSS variables for colors (var(--sand-*))
- Inline animations with @keyframes
- Bootstrap spinner for loading state
- FontAwesome icons

## Accessibility

- Backdrop click closes modal (unless deleting)
- ESC key support (add if needed)
- Clear visual hierarchy
- High contrast colors
- Disabled state prevents accidental clicks
- Loading indicator for async operations

## Integration with Existing Code

This modal is already integrated in:
- ✅ Coupons page (`admin/src/pages/Coupons.jsx`)

Can be easily added to:
- Products page
- Users page
- Orders page
- Any other delete operations

## File Location

`admin/src/components/modals/DeleteConfirmationModal.jsx`

---

**Status:** ✅ Production Ready

A polished, reusable component that provides a much better user experience than browser confirm dialogs!
