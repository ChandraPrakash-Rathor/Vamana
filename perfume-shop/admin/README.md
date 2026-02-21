# Vamana Admin Panel

Admin dashboard for managing the Vamana Perfume Shop.

## Features

✅ **Implemented:**
- Login page with authentication
- Dashboard with statistics
- Recent orders table
- Sidebar navigation
- Responsive topbar
- Same theme as member site
- React Hook Form for validation
- FormData submission

🚧 **Coming Soon:**
- Product management (CRUD)
- Order management
- User management
- Analytics & Reports
- Settings & Configuration
- Image upload
- Real-time notifications

## Tech Stack

- React.js 19
- React Router DOM 7
- React Hook Form
- Bootstrap 5
- FontAwesome Icons
- Recharts (for future analytics)

## Theme

Uses the same elegant sand/beige color scheme as the member site:
- Primary: `#b3873f` (sand-600)
- Background: `#f9f6ed` (sand-100)
- Dark: `#68432b` (sand-900)
- Fonts: Playfair Display (headings), Roboto (body)

## Getting Started

### Installation

```bash
cd admin
npm install
```

### Run Development Server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Demo Credentials

```
Username: admin
Password: admin123
```

## Project Structure

```
admin/
├── public/
│   ├── logo1.png          # Main logo
│   ├── logo.png           # Alternative logo
│   └── favicon.ico        # Favicon
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── AdminLayout.jsx    # Main layout wrapper
│   │       ├── Sidebar.jsx        # Left sidebar navigation
│   │       └── Topbar.jsx         # Top navigation bar
│   ├── pages/
│   │   ├── Login.jsx              # Login page
│   │   ├── Dashboard.jsx          # Main dashboard
│   │   ├── Products.jsx           # Products management
│   │   ├── Orders.jsx             # Orders management
│   │   ├── Users.jsx              # Users management
│   │   ├── Analytics.jsx          # Analytics & reports
│   │   └── Settings.jsx           # Settings
│   ├── styles/
│   │   └── global.css             # Global styles & theme
│   ├── App.js                     # Main app component
│   └── index.js                   # Entry point
└── package.json
```

## Pages

### 1. Login (`/login`)
- Username/password authentication
- Form validation with React Hook Form
- Demo credentials provided

### 2. Dashboard (`/dashboard`)
- Revenue, orders, products, users statistics
- Recent orders table
- Status indicators
- Trend indicators

### 3. Products (`/products`)
- Coming soon: Add, edit, delete products
- Image upload
- Category management
- Stock management

### 4. Orders (`/orders`)
- Coming soon: View all orders
- Update order status
- Order details
- Print invoices

### 5. Users (`/users`)
- Coming soon: View all users
- User details
- Activity logs

### 6. Analytics (`/analytics`)
- Coming soon: Sales charts
- Revenue reports
- Product performance
- Customer insights

### 7. Settings (`/settings`)
- Coming soon: Store settings
- Payment configuration
- Email templates
- Admin profile

## Sidebar Navigation

- Dashboard
- Products
- Orders
- Users
- Analytics
- Settings

Collapsible sidebar with icons and labels.

## Authentication

Currently uses localStorage for demo purposes:
- Login sets `adminLoggedIn` to `true`
- Logout removes the flag
- Protected routes redirect to login if not authenticated

**Note:** In production, implement proper JWT-based authentication with the backend API.

## Styling

- Uses CSS-in-JS for component styling
- Bootstrap 5 for grid and utilities
- Custom CSS variables for theme colors
- Responsive design for mobile/tablet/desktop

## Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## Future Enhancements

- [ ] Complete CRUD operations for products
- [ ] Order management with status updates
- [ ] User management
- [ ] Analytics dashboard with charts
- [ ] Real-time notifications
- [ ] Image upload and management
- [ ] Export reports (PDF, Excel)
- [ ] Email notifications
- [ ] Role-based access control
- [ ] Activity logs
- [ ] Settings management

## Integration with Backend

When backend is ready, update API calls in:
- Login page (`src/pages/Login.jsx`)
- Dashboard stats (`src/pages/Dashboard.jsx`)
- All CRUD operations

## License

Proprietary - All rights reserved
