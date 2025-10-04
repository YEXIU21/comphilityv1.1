# COMPHILITY - E-Commerce Frontend

A modern, responsive e-commerce frontend built with Vue.js 3 for computer components and accessories.

## Features

- **Modern UI/UX Design**: Clean, professional design inspired by the prototype
- **Responsive Layout**: Mobile-first design that works on all devices
- **Vue 3 Composition API**: Latest Vue.js features and best practices
- **Component-Based Architecture**: Reusable, maintainable components
- **State Management**: Vuex store for global state management
- **Client-Side Routing**: Vue Router for seamless navigation
- **Shopping Cart & Wishlist**: Full e-commerce functionality
- **User Authentication**: Login, signup, and password reset modals
- **Product Management**: Categories, filtering, and search
- **Performance Optimized**: Fast loading and smooth interactions

## Product Categories

- **PC Sets**: Complete PC bundles and builds
- **Laptops**: Gaming and professional laptops
- **Components**: Processors, motherboards, graphics cards, memory
- **Peripherals**: Keyboards, mice, monitors, speakers
- **Best Sellers**: Top-rated and popular products

## Tech Stack

- **Vue.js 3**: Progressive JavaScript framework
- **Vue Router 4**: Official router for Vue.js
- **Vuex 4**: State management pattern + library
- **CSS3**: Modern styling with custom properties
- **Font Awesome**: Icon library
- **Google Fonts**: Typography (Inter font family)

## Project Structure

```
frontend/
├── public/
│   ├── index.html          # HTML template
│   └── favicon.ico         # Site favicon
├── src/
│   ├── assets/
│   │   └── styles/         # Global styles
│   ├── components/
│   │   ├── common/         # Reusable components
│   │   ├── home/           # Home page components
│   │   ├── layout/         # Layout components
│   │   └── modals/         # Modal components
│   ├── router/             # Vue Router configuration
│   ├── store/              # Vuex store
│   ├── views/              # Page components
│   ├── App.vue             # Root component
│   └── main.js             # Entry point
├── babel.config.js         # Babel configuration
├── package.json            # Dependencies and scripts
├── README.md               # Project documentation
└── vue.config.js           # Vue CLI configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to the project directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run serve
   # or
   yarn serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Available Scripts

- `npm run serve` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Lint and fix files

## Key Components

### Layout Components
- **AppHeader**: Navigation, search, cart, user menu
- **AppFooter**: Company info, links, contact details

### Common Components
- **ProductCard**: Individual product display
- **ProductGrid**: Grid layout for products
- **HeroSlider**: Homepage category showcase

### Modal Components
- **LoginModal**: User authentication
- **SignupModal**: User registration
- **PasswordResetModal**: Password recovery

### Views
- **Home**: Landing page with featured products
- **PcSets**: Complete PC bundles
- **Laptops**: Laptop products with filtering
- **BestSellers**: Top-rated products by category

## State Management

The application uses Vuex for state management with the following modules:

- **Authentication**: User login/logout state
- **Cart**: Shopping cart functionality
- **Wishlist**: Product wishlist management
- **Products**: Product data and categories
- **UI**: Modal states and global UI state

## Responsive Design

The application is built with a mobile-first approach and includes:

- **Mobile (576px and below)**: Single column layout
- **Tablet (768px and below)**: Two column product grid
- **Desktop (1024px and above)**: Full multi-column layout

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.
