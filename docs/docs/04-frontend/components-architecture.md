# Components Architecture

## Overview

Sentient Factory frontend is built with React and follows a component-based architecture with clear separation of concerns.

## Component Hierarchy

### 1. Layout Components

**Purpose**: Define the overall page structure

#### AppLayout

```tsx
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="pl-64 pt-16">
        <div className="p-6">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
```

#### DashboardLayout

```tsx
const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  actions,
  children,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex space-x-3">{actions}</div>
      </div>
      <div className="bg-white rounded-lg shadow">{children}</div>
    </div>
  );
};
```

### 2. UI Components

**Purpose**: Reusable UI building blocks

#### Button

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  ...props
}) => {
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`
        rounded-md font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
```

#### Card

```tsx
interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, actions, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex space-x-2">{actions}</div>}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
```

### 3. Data Visualization Components

**Purpose**: Display charts and metrics

#### LineChart

```tsx
interface LineChartProps {
  data: Array<{ timestamp: string; value: number }>;
  title: string;
  color?: string;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  color = "#3B82F6",
  height = 300,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      const chart = echarts.init(chartRef.current);

      const option = {
        title: {
          text: title,
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: data.map((d) => d.timestamp),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: data.map((d) => d.value),
            type: "line",
            smooth: true,
            lineStyle: {
              color,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: `${color}40` },
                { offset: 1, color: `${color}10` },
              ]),
            },
          },
        ],
      };

      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, [data, title, color]);

  return <div ref={chartRef} style={{ height: `${height}px` }} />;
};
```

#### MetricCard

```tsx
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  trend = "neutral",
}) => {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  };

  const trendIcons = {
    up: <TrendingUp className="w-4 h-4" />,
    down: <TrendingDown className="w-4 h-4" />,
    neutral: <Minus className="w-4 h-4" />,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && <div className="p-3 bg-blue-50 rounded-full">{icon}</div>}
      </div>
      {change !== undefined && (
        <div className="mt-4 flex items-center">
          <span className={`flex items-center ${trendColors[trend]}`}>
            {trendIcons[trend]}
            <span className="ml-1 font-medium">{Math.abs(change)}%</span>
          </span>
          <span className="ml-2 text-sm text-gray-500">
            from previous period
          </span>
        </div>
      )}
    </div>
  );
};
```

### 4. Form Components

**Purpose**: Handle user input and validation

#### InputField

```tsx
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  const inputId = useId();

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500
            ${error ? "border-red-300" : "border-gray-300"}
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
```

#### Select

```tsx
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = "Select an option",
}) => {
  const selectId = useId();

  return (
    <div className="space-y-2">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          block w-full rounded-md border-gray-300 shadow-sm
          focus:border-blue-500 focus:ring-blue-500
          ${error ? "border-red-300" : "border-gray-300"}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
```

### 5. Feature Components

**Purpose**: Complete features composed of multiple components

#### FactoryMonitor

```tsx
interface FactoryMonitorProps {
  factoryId: string;
}

const FactoryMonitor: React.FC<FactoryMonitorProps> = ({ factoryId }) => {
  const { data: factory, isLoading } = useFactory(factoryId);
  const { data: metrics } = useFactoryMetrics(factoryId);
  const { data: alerts } = useFactoryAlerts(factoryId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardLayout
      title={`${factory?.name} - Real-time Monitor`}
      actions={
        <Button variant="primary" icon={<RefreshCw />}>
          Refresh
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key Metrics */}
        <div className="lg:col-span-2">
          <Card title="Production Metrics">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                title="Output"
                value={`${metrics?.output || 0} units`}
                change={metrics?.outputChange}
                trend={metrics?.outputChange > 0 ? "up" : "down"}
                icon={<Package className="w-5 h-5 text-blue-600" />}
              />
              <MetricCard
                title="Efficiency"
                value={`${metrics?.efficiency || 0}%`}
                change={metrics?.efficiencyChange}
                trend={metrics?.efficiencyChange > 0 ? "up" : "down"}
                icon={<Zap className="w-5 h-5 text-green-600" />}
              />
              <MetricCard
                title="Quality"
                value={`${metrics?.quality || 0}%`}
                change={metrics?.qualityChange}
                trend={metrics?.qualityChange > 0 ? "up" : "down"}
                icon={<CheckCircle className="w-5 h-5 text-purple-600" />}
              />
              <MetricCard
                title="Downtime"
                value={`${metrics?.downtime || 0} min`}
                change={metrics?.downtimeChange}
                trend={metrics?.downtimeChange < 0 ? "up" : "down"}
                icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
              />
            </div>
          </Card>
        </div>

        {/* Alerts */}
        <div>
          <Card title="Active Alerts">
            {alerts?.length > 0 ? (
              <ul className="space-y-3">
                {alerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No active alerts</p>
            )}
          </Card>
        </div>

        {/* Charts */}
        <div className="lg:col-span-3">
          <Card title="Production Trends">
            <LineChart
              data={metrics?.trendData || []}
              title="Hourly Production"
              color="#3B82F6"
              height={400}
            />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
```

## Component Organization

### Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── index.ts
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   ├── charts/
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   └── index.ts
│   └── features/
│       ├── FactoryMonitor.tsx
│       ├── SensorDashboard.tsx
│       └── index.ts
├── hooks/
├── utils/
└── types/
```

### Export Pattern

```typescript
// components/ui/index.ts
export { default as Button } from "./Button";
export { default as Card } from "./Card";
export { default as Input } from "./Input";
export { default as Select } from "./Select";

// Usage
import { Button, Card } from "@/components/ui";
```

## Props Design Principles

### 1. Composition over Configuration

```tsx
// Good: Flexible composition
<Card
  title="Factory Overview"
  actions={
    <Button variant="primary">Add Factory</Button>
  }
>
  <FactoryList />
</Card>

// Avoid: Rigid configuration
<FactoryCard
  title="Factory Overview"
  showAddButton={true}
  factoryListComponent={FactoryList}
/>
```

### 2. Consistent Naming

```tsx
// Use consistent prop names
interface ComponentProps {
  // Boolean props start with is/has/should
  isLoading: boolean;
  hasError: boolean;
  shouldValidate: boolean;

  // Event handlers start with on
  onChange: (value: string) => void;
  onSubmit: (data: FormData) => void;

  // Data props are descriptive
  userData: User;
  factoryList: Factory[];

  // Configuration props are optional
  className?: string;
  style?: React.CSSProperties;
}
```

### 3. Type Safety

```typescript
// Use TypeScript for prop validation
interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  size: "sm" | "md" | "lg";
  onClick: () => void;
}

// Use enums for fixed sets
enum ButtonVariant {
  Primary = "primary",
  Secondary = "secondary",
  Danger = "danger",
}

enum ButtonSize {
  Small = "sm",
  Medium = "md",
  Large = "lg",
}
```

## Performance Optimization

### Memoization

```tsx
// Memoize expensive components
const ExpensiveChart = React.memo(({ data }: ChartProps) => {
  // Chart rendering logic
});

// Memoize callbacks
const handleClick = useCallback(() => {
  // Click handler logic
}, [dependencies]);
```

### Lazy Loading

```tsx
// Lazy load heavy components
const HeavyComponent = React.lazy(() => import("./HeavyComponent"));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <HeavyComponent />
  </Suspense>
);
```

### Virtualization

```tsx
// Use virtualization for long lists
import { FixedSizeList as List } from "react-window";

const LongList = ({ items }) => (
  <List height={400} itemCount={items.length} itemSize={50} width="100%">
    {({ index, style }) => (
      <div style={style}>
        <ListItem item={items[index]} />
      </div>
    )}
  </List>
);
```
