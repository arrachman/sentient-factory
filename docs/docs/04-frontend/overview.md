# Frontend Overview

## 🎯 Introduction

The Sentient Factory frontend consists of two main applications:

1. **Web Dashboard** - Internal admin dashboard for factory management
2. **Landing Page** - Public marketing website for customer acquisition

Both applications are built with modern web technologies and follow best practices for performance, accessibility, and maintainability.

## 🏗️ Architecture

### Technology Stack

| Technology           | Web Dashboard           | Landing Page          | Purpose                        |
| -------------------- | ----------------------- | --------------------- | ------------------------------ |
| **Framework**        | Next.js 16              | Next.js 16            | React framework with SSR/SSG   |
| **Language**         | TypeScript              | TypeScript            | Type-safe JavaScript           |
| **Styling**          | Tailwind CSS 4          | Tailwind CSS 4        | Utility-first CSS framework    |
| **UI Components**    | Radix UI, Custom        | Radix UI, Magic UI    | Accessible component libraries |
| **State Management** | React Query, Zustand    | React Context         | Data fetching and state        |
| **Forms**            | React Hook Form + Zod   | React Hook Form + Zod | Form validation and handling   |
| **Charts**           | ApexCharts, Recharts    | -                     | Data visualization             |
| **Maps**             | Leaflet + React Leaflet | -                     | Interactive maps               |
| **Animations**       | Framer Motion           | Framer Motion         | Smooth animations              |

### Shared Infrastructure

Both applications share:

- **Monorepo structure** with pnpm workspaces
- **TypeScript** for type safety
- **ESLint + Prettier** for code quality
- **Tailwind CSS** for styling
- **Component-driven architecture**

## 📁 Project Structure

```
apps/
├── web-dashboard/           # Admin dashboard application
│   ├── app/                 # Next.js 13+ app directory
│   │   ├── (auth)/         # Authentication routes
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── api/           # API routes
│   │   └── layout.tsx     # Root layout
│   ├── components/         # Reusable components
│   │   ├── ui/            # Base UI components
│   │   ├── charts/        # Chart components
│   │   ├── forms/         # Form components
│   │   └── layout/        # Layout components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and helpers
│   ├── public/            # Static assets
│   └── styles/            # Global styles
│
└── landing-page/          # Marketing website
    ├── app/               # Next.js 13+ app directory
    │   ├── page.tsx      # Home page
    │   ├── pricing/      # Pricing page
    │   ├── contact/      # Contact page
    │   └── layout.tsx    # Root layout
    ├── components/        # Reusable components
    │   ├── ui/           # Base UI components
    │   ├── sections/     # Page sections
    │   └── magicui/      # Animated UI components
    ├── hooks/            # Custom React hooks
    ├── lib/              # Utilities and helpers
    └── public/           # Static assets
```

## 🚀 Development Setup

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Or start individual apps
cd apps/web-dashboard && pnpm dev
cd apps/landing-page && pnpm dev
```

### Environment Variables

Create `.env.local` files in each app directory:

**Web Dashboard (.env.local):**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

**Landing Page (.env.local):**

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_key_here
```

## 🔧 Development Guidelines

### Component Development

1. **Atomic Design**: Follow atomic design principles (atoms, molecules, organisms)
2. **TypeScript**: Always define proper types and interfaces
3. **Storybook**: Create stories for complex components (coming soon)
4. **Testing**: Write unit tests with Jest and React Testing Library

### Styling Guidelines

1. **Tailwind CSS**: Use utility classes for styling
2. **CSS Modules**: For complex component-specific styles
3. **Design Tokens**: Use CSS custom properties for theming
4. **Responsive Design**: Mobile-first approach

### Performance Optimization

1. **Code Splitting**: Use dynamic imports for large components
2. **Image Optimization**: Use Next.js Image component
3. **Bundle Analysis**: Regular bundle size monitoring
4. **Lazy Loading**: Implement for below-the-fold content

## 📱 Responsive Design

Both applications are fully responsive with breakpoints:

| Breakpoint      | Prefix | Use Case            |
| --------------- | ------ | ------------------- |
| < 640px         | `sm:`  | Mobile phones       |
| 640px - 767px   | `md:`  | Tablets (portrait)  |
| 768px - 1023px  | `lg:`  | Tablets (landscape) |
| 1024px - 1279px | `xl:`  | Desktop             |
| ≥ 1280px        | `2xl:` | Large desktop       |

## 🎨 Theming System

### Web Dashboard

- **Light/Dark mode** with `next-themes`
- **Custom color palette** for factory data visualization
- **Accessibility** compliant (WCAG 2.1 AA)

### Landing Page

- **Brand colors** with gradient support
- **Animated transitions** with Framer Motion
- **Dark mode** support

## 🔌 API Integration

### Web Dashboard

- **React Query** for data fetching and caching
- **WebSocket** for real-time updates
- **Error boundaries** for graceful error handling
- **Loading states** with skeletons

### Landing Page

- **Static generation** for marketing pages
- **Form submissions** with validation
- **Analytics integration** (Google Analytics)

## 🧪 Testing

### Test Types

1. **Unit Tests**: Component logic and utilities
2. **Integration Tests**: API interactions
3. **E2E Tests**: User workflows with Cypress
4. **Visual Regression**: Component snapshots

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific app tests
cd apps/web-dashboard && pnpm test
cd apps/landing-page && pnpm test
```

## 📦 Build & Deployment

### Build Commands

```bash
# Build all apps
pnpm build

# Build individual apps
cd apps/web-dashboard && pnpm build
cd apps/landing-page && pnpm build
```

### Deployment Targets

- **Vercel**: Primary deployment platform
- **Docker**: Containerized deployment
- **Static Export**: For landing page (optional)

## 🔍 Monitoring & Analytics

### Web Dashboard

- **Error tracking** with Sentry
- **Performance monitoring** with Web Vitals
- **User analytics** with custom events

### Landing Page

- **Google Analytics 4** for traffic analysis
- **Conversion tracking** for marketing campaigns
- **A/B testing** support

## 🤝 Contributing

See the main [Contributing Guide](../contributing.md) for detailed guidelines.

### Frontend-Specific Guidelines

1. **Component Documentation**: Add JSDoc comments
2. **Prop Types**: Use TypeScript interfaces
3. **Storybook**: Create stories for new components
4. **Accessibility**: Follow WCAG guidelines
5. **Performance**: Monitor bundle size and load times

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Framer Motion Documentation](https://www.framer.com/motion/)
