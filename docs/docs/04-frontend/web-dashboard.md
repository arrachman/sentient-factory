# Web Dashboard

## 🏭 Overview

The Web Dashboard is the primary interface for factory managers, operators, and administrators to monitor and control manufacturing operations in real-time. It provides comprehensive visualization of production data, equipment status, quality metrics, and supply chain information.

## 🎯 Key Features

### Real-time Monitoring

- **Live Production Metrics**: OEE, throughput, yield rates
- **Equipment Status**: Machine uptime/downtime, alerts
- **Quality Control**: Defect rates, inspection results
- **Energy Consumption**: Power usage, efficiency metrics

### Data Visualization

- **Interactive Dashboards**: Customizable widget-based layouts
- **Charts & Graphs**: Time-series, bar, pie, and gauge charts
- **Geospatial Maps**: Factory floor layout with equipment locations
- **Heat Maps**: Production hotspots and bottlenecks

### Management Tools

- **Production Scheduling**: Job planning and resource allocation
- **Maintenance Management**: Work orders, preventive maintenance
- **Inventory Tracking**: Raw materials, WIP, finished goods
- **Quality Management**: Inspection plans, non-conformance tracking

### Analytics & Reporting

- **Predictive Analytics**: Machine learning insights
- **Custom Reports**: Ad-hoc query and export
- **KPI Dashboards**: Performance indicators
- **Trend Analysis**: Historical data comparison

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4 + CSS Modules
- **UI Components**: Radix UI, Custom components
- **State Management**: React Query, Zustand
- **Charts**: ApexCharts, Recharts
- **Maps**: Leaflet + React Leaflet
- **Tables**: TanStack Table
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner (toasts)
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React, Remix Icons

### Project Structure

```
apps/web-dashboard/
├── app/                    # Next.js App Router
│   ├── (auth)/           # Authentication routes
│   │   ├── login/       # Login page
│   │   ├── register/    # Registration page
│   │   └── layout.tsx   # Auth layout
│   ├── dashboard/       # Main dashboard
│   │   ├── overview/    # Overview page
│   │   ├── production/  # Production monitoring
│   │   ├── quality/     # Quality control
│   │   ├── maintenance/ # Maintenance management
│   │   ├── inventory/   # Inventory tracking
│   │   └── layout.tsx   # Dashboard layout
│   ├── settings/        # User and system settings
│   ├── api/            # API routes (serverless)
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page (redirect)
│
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   │   ├── button.tsx  # Button variants
│   │   ├── card.tsx    # Card components
│   │   ├── table.tsx   # Data tables
│   │   ├── form/       # Form components
│   │   └── charts/     # Chart components
│   ├── layout/         # Layout components
│   │   ├── sidebar.tsx # Navigation sidebar
│   │   ├── header.tsx  # Top header
│   │   └── footer.tsx  # Dashboard footer
│   ├── widgets/        # Dashboard widgets
│   │   ├── kpi-card.tsx # KPI display cards
│   │   ├── chart-widget.tsx # Chart widgets
│   │   └── alert-widget.tsx # Alert widgets
│   └── features/       # Feature-specific components
│       ├── production/ # Production components
│       ├── quality/    # Quality components
│       └── maps/       # Map components
│
├── hooks/              # Custom React hooks
│   ├── use-api.ts      # API hook with React Query
│   ├── use-websocket.ts # WebSocket connection
│   ├── use-chart-data.ts # Chart data processing
│   └── use-filters.ts  # Filter and search hooks
│
├── lib/                # Utilities and helpers
│   ├── api/           # API client configuration
│   │   ├── client.ts  # HTTP client
│   │   ├── endpoints.ts # API endpoints
│   │   └── types.ts   # API types
│   ├── utils/         # Utility functions
│   │   ├── format.ts  # Data formatting
│   │   ├── validation.ts # Validation helpers
│   │   └── constants.ts # Constants
│   └── themes/        # Theme configuration
│       ├── colors.ts  # Color palette
│       └── charts.ts  # Chart theme config
│
├── public/             # Static assets
│   ├── images/        # Images and icons
│   ├── fonts/         # Custom fonts
│   └── locales/       # i18n translation files
│
├── styles/             # Global styles
│   ├── globals.css    # Global CSS
│   └── themes/        # Theme CSS variables
│
└── types/              # TypeScript definitions
    ├── api.ts         # API response types
    ├── dashboard.ts   # Dashboard-specific types
    └── index.ts       # Barrel exports
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Backend API running (optional for development)

### Installation

```bash
# Navigate to web-dashboard directory
cd apps/web-dashboard

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

### Environment Variables

Create `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws

# Authentication
NEXT_PUBLIC_AUTH_URL=http://localhost:8000/auth
NEXT_PUBLIC_TOKEN_KEY=sentient_factory_token

# Maps and External Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here

# Feature Flags
NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Development
NEXT_PUBLIC_USE_MOCK_API=false
```

## 🔧 Development

### Component Development

```typescript
// Example: Creating a KPI Card component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  change: number;
  format?: 'number' | 'percent' | 'currency';
}

export function KPICard({ title, value, change, format = 'number' }: KPICardProps) {
  const formattedValue = formatValue(value, format);
  const isPositive = change >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {Math.abs(change)}% from last period
        </div>
      </CardContent>
    </Card>
  );
}
```

### API Integration

```typescript
// Using React Query for data fetching
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export function useProductionData(startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: ["production", startDate, endDate],
    queryFn: () => api.production.getMetrics({ startDate, endDate }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds for real-time updates
  });
}

// WebSocket for real-time updates
import { useWebSocket } from "@/hooks/use-websocket";

export function useRealTimeAlerts() {
  const { messages, sendMessage } = useWebSocket("alerts");

  useEffect(() => {
    // Subscribe to alert updates
    sendMessage({ type: "subscribe", channel: "alerts" });

    return () => {
      sendMessage({ type: "unsubscribe", channel: "alerts" });
    };
  }, [sendMessage]);

  return messages;
}
```

### State Management

```typescript
// Using Zustand for global state
import { create } from "zustand";

interface DashboardState {
  // Dashboard layout
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Widget management
  widgets: Widget[];
  addWidget: (widget: Widget) => void;
  removeWidget: (id: string) => void;
  updateWidgetLayout: (layout: WidgetLayout[]) => void;

  // Filters
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  selectedMachines: string[];
  setSelectedMachines: (machines: string[]) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  widgets: [],
  addWidget: (widget) =>
    set((state) => ({ widgets: [...state.widgets, widget] })),
  removeWidget: (id) =>
    set((state) => ({ widgets: state.widgets.filter((w) => w.id !== id) })),
  updateWidgetLayout: (layout) => set({ widgets: layout }),

  dateRange: { from: new Date(), to: new Date() },
  setDateRange: (range) => set({ dateRange: range }),
  selectedMachines: [],
  setSelectedMachines: (machines) => set({ selectedMachines: machines }),
}));
```

## 📊 Data Visualization

### Chart Configuration

```typescript
// Chart theme configuration
export const chartTheme = {
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#8B5CF6',
  },
  options: {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 800 },
    },
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 4 },
    grid: { borderColor: '#E5E7EB' },
    xaxis: { type: 'datetime', labels: { datetimeUTC: false } },
    yaxis: { labels: { formatter: (val: number) => val.toLocaleString() } },
  },
};

// Example chart component
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ProductionTrendChart({ data }: { data: ProductionData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(value) => formatDate(value, 'HH:mm')}
          stroke="#6B7280"
        />
        <YAxis stroke="#6B7280" />
        <Tooltip
          formatter={(value) => [value, 'Production']}
          labelFormatter={(label) => formatDate(label, 'MMM d, HH:mm')}
        />
        <Line
          type="monotone"
          dataKey="output"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

## 🗺️ Map Integration

### Factory Floor Map

```typescript
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom marker icons
const machineIcon = new L.Icon({
  iconUrl: '/images/machine-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const alertIcon = new L.Icon({
  iconUrl: '/images/alert-marker.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export function FactoryMap({ machines, alerts, paths }: FactoryMapProps) {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={15}
      style={{ height: '500px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Machine markers */}
      {machines.map((machine) => (
        <Marker
          key={machine.id}
          position={[machine.lat, machine.lng]}
          icon={machine.status === 'alert' ? alertIcon : machineIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{machine.name}</h3>
              <p>Status: {machine.status}</p>
              <p>Output: {machine.output} units/hr</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Material flow paths */}
      {paths.map((path, index) => (
        <Polyline
          key={index}
          pathOptions={{ color: '#3B82F6', weight: 3, opacity: 0.7 }}
          positions={path.coordinates}
        />
      ))}
    </MapContainer>
  );
}
```

## 🔐 Authentication & Authorization

### Role-Based Access Control

```typescript
// User roles and permissions
export enum UserRole {
  OPERATOR = 'operator',
  SUPERVISOR = 'supervisor',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export const permissions = {
  [UserRole.OPERATOR]: [
    'view:dashboard',
    'view:production',
    'view:quality',
    'create:alerts',
  ],
  [UserRole.SUPERVISOR]: [
    ...permissions[UserRole.OPERATOR],
    'edit:production',
    'approve:quality',
    'view:reports',
    'manage:workorders',
  ],
  [UserRole.MANAGER]: [
    ...permissions[UserRole.SUPERVISOR],
    'edit:settings',
    'view:analytics',
    'manage:users',
    'export:data',
  ],
  [UserRole.ADMIN]: [
    '*', // All permissions
  ],
};

// Permission hook
export function usePermission(permission: string): boolean {
  const { user } = useAuth();

  if (!user) return false;

  const userPermissions = permissions[user.role];
  return userPermissions.includes('*') || userPermissions.includes(permission);
}

// Protected component
export function ProtectedComponent({ permission, children }: ProtectedComponentProps) {
  const hasPermission = usePermission(permission);

  if (!hasPermission) {
    return <div className="p-4 text-center text-gray-500">Access denied</div>;
  }

  return <>{children}</>;
}
```

## 🧪 Testing

### Test Structure

```
__tests__/
├── unit/              # Unit tests
│   ├── components/   # Component tests
│   ├── hooks/        # Hook tests
│   └── utils/        # Utility tests
├── integration/      # Integration tests
│   ├── api/         # API integration tests
│   └── auth/        # Authentication tests
└── e2e/             # End-to-end tests
    ├── dashboard/   # Dashboard workflows
    └── production/  # Production workflows
```

### Example Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { KPICard } from '@/components/widgets/kpi-card';

describe('KPICard', () => {
  it('displays positive change with trending up icon', () => {
    render(<KPICard title="Production" value={1000} change={15} />);

    expect(screen.getByText('Production')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('15% from last period')).toBeInTheDocument();
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('text-green-600');
  });

  it('formats currency values correctly', () => {
    render(<KPICard title="Revenue" value={50000} change={-5} format="currency" />);

    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('5% from last period')).toBeInTheDocument();
  });
});
```

## 🚀 Deployment

### Build Configuration

```bash
# Production build
pnpm build

# Build with staging environment
pnpm build:staging

# Start production server
pnpm start
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Environment-Specific Configuration

```javascript
// next.config.js
module.exports = {
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },
  images: {
    domains: ["api.sentientfactory.com", "localhost"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};
```

## 📈 Performance Optimization

### Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/charts/heavy-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Don't render on server
});

const MapComponent = dynamic(() => import('@/components/maps/factory-map'), {
  loading: () => <MapSkeleton />,
});

// Route-based code splitting
const ProductionPage = dynamic(() => import('@/app/dashboard/production/page'));
```

### Image Optimization

```typescript
import Image from 'next/image';

export function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgo..."
      priority={false} // Only for above-the-fold images
    />
  );
}
```

## 🔍 Monitoring & Analytics

### Error Tracking

```typescript
import * as Sentry from '@sentry/nextjs';

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Sentry.ErrorBoundary
      fallback={<ErrorFallback />}
      onError={(error) => {
        console.error('Dashboard error:', error);
        Sentry.captureException(error);
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

// Custom error reporting
export function reportError(error: Error, context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    Sentry.captureException(error);
  });
}
```

### Performance Monitoring

```typescript
import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric);

    // Send to analytics
    if (metric.name === "FCP") {
      analytics.track("web_vital_fcp", { value: metric.value });
    }
  });

  return null;
}
```

## 🤝 Contributing

### Development Workflow

1. **Feature Branches**: Create from `main`
2. **Code Review**: Required for all changes
3. **Testing**: Write tests for new features
4. **Documentation**: Update relevant docs

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb config with custom rules
- **Prettier**: Consistent formatting
- **Commit Messages**: Conventional commits

### Pull Request Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] TypeScript types added
- [ ] No console logs in production code
- [ ] Performance considerations addressed
- [ ] Accessibility compliance checked

## 🆘 Troubleshooting

### Common Issues

**Issue**: Charts not rendering
**Solution**: Check if ApexCharts CSS is imported in `_app.tsx`

**Issue**: WebSocket connection failing
**Solution**: Verify `NEXT_PUBLIC_WS_URL` environment variable

**Issue**: Map tiles not loading
**Solution**: Check Leaflet CSS import and internet connection

**Issue**: Build errors in production
**Solution**: Clear `.next` cache and rebuild

### Debugging Tools

- **React Query DevTools**: For API debugging
- **Redux DevTools**: For state management
- **React Developer Tools**: For component inspection
- **Lighthouse**: For performance auditing

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [ApexCharts Documentation](https://apexcharts.com/docs/)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
