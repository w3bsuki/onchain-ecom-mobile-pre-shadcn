# Mobile-First E-Commerce Platform

A high-performance, conversion-optimized e-commerce platform built with Next.js, Tailwind CSS, and Medusa.js. This project follows mobile-first design principles to create a seamless shopping experience on all devices.

## Key Features

- 📱 Mobile-first design with optimized user flows
- ⚡ High-performance architecture with Next.js App Router
- 🛍️ Comprehensive e-commerce functionality
- 🎨 Beautiful design system using Tailwind CSS and shadcn/ui
- 🔐 Secure authentication and payment processing
- 📊 Order tracking and management
- 📦 Medusa.js backend integration

## Technology Stack

- **Frontend**: Next.js 14+, React 18+, Tailwind CSS, shadcn/ui
- **Backend**: Medusa.js, Node.js
- **Database**: PostgreSQL (via Supabase)
- **Payment Processing**: Stripe
- **Deployment**: Vercel

## Project Structure

```
├── components/           # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   └── ...               # Feature components
├── docs/                 # Project documentation
│   ├── MASTER_PLAN.md    # Overall project vision and roadmap
│   ├── Phase1.md         # Phase 1 detailed plan
│   └── ...               # Additional documentation
├── lib/                  # Shared utilities and helpers
├── public/               # Static assets
├── src/                  # Application source code
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── utils/            # Helper utilities
├── my-medusa-store/      # Medusa.js backend
├── .env.local            # Environment variables (create from .env.example)
└── ...                   # Configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account for payment processing

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/onchain-commerce-template.git
   cd onchain-commerce-template
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example env file and configure your environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Set up the Medusa backend:
   ```bash
   cd my-medusa-store
   npm install
   npm run seed
   npm run dev
   ```

5. In a new terminal, start the Next.js development server:
   ```bash
   cd ..
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Project Phases

This project follows a phased approach to development:

1. **Phase 1**: Foundation & Core Experience
   - Mobile navigation optimization
   - Product browsing experience
   - Cart and checkout flow
   - User authentication

2. **Phase 2**: Enhanced Features & Optimizations
   - Order tracking
   - Personalization features
   - Performance optimizations
   - A/B testing framework

3. **Phase 3**: Advanced Features & Scaling
   - Advanced search capabilities
   - Customer retention features
   - International expansion readiness
   - Advanced analytics

For more details, see the [Project Documentation](./docs/README.md).

### Design System

This project follows a comprehensive design system documented in [Design System](./docs/DesignSystem.md).

### Mobile-First Development

All components and pages are developed with a mobile-first approach:

1. Design for mobile devices first
2. Add responsive breakpoints for larger devices
3. Ensure all interactive elements are touch-friendly
4. Optimize for performance on mobile networks

## Documentation

For detailed documentation, see the [docs](./docs) directory:

- [Master Plan](./docs/MASTER_PLAN.md) - Overall vision and roadmap
- [Phase Plans](./docs/Phase1.md) - Detailed phase implementation plans
- [Progress Tracking](./docs/Progress-Phase1.md) - Current development status
- [Design System](./docs/DesignSystem.md) - UI/UX guidelines

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
