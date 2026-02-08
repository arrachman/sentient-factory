# State Management

## Overview

Sentient Factory uses a hybrid state management approach combining React Context, Zustand, and React Query for optimal performance and developer experience.

## State Management Strategy

### 1. Local Component State

**Use Case**: UI state within a single component

```tsx
const Counter = () => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

### 2. Context API

**Use Case**: Shared state across component tree

#### Theme Context

```tsx
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
```

#### Auth Context

```tsx
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await verifyToken(token);
          setUser(userData);
        }
      } catch (error) {
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user, token } = await authApi.login(email, password);
      localStorage.setItem("token", token);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      register: authApi.register,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

### 3. Zustand Store

**Use Case**: Global application state with persistence

#### Factory Store

```tsx
interface FactoryState {
  // State
  factories: Factory[];
  selectedFactory: Factory | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setFactories: (factories: Factory[]) => void;
  selectFactory: (factory: Factory | null) => void;
  addFactory: (factory: Factory) => void;
  updateFactory: (id: string, updates: Partial<Factory>) => void;
  deleteFactory: (id: string) => void;
  fetchFactories: () => Promise<void>;
}

const useFactoryStore = create<FactoryState>((set, get) => ({
  // Initial state
  factories: [],
  selectedFactory: null,
  isLoading: false,
  error: null,

  // Actions
  setFactories: (factories) => set({ factories }),

  selectFactory: (factory) => set({ selectedFactory: factory }),

  addFactory: (factory) =>
    set((state) => ({
      factories: [...state.factories, factory],
    })),

  updateFactory: (id, updates) =>
    set((state) => ({
      factories: state.factories.map((factory) =>
        factory.id === id ? { ...factory, ...updates } : factory,
      ),
    })),

  deleteFactory: (id) =>
    set((state) => ({
      factories: state.factories.filter((factory) => factory.id !== id),
    })),

  fetchFactories: async () => {
    set({ isLoading: true, error: null });
    try {
      const factories = await factoryApi.getAll();
      set({ factories, isLoading: false });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },
}));

// Persist middleware
const persistedFactoryStore = persist(useFactoryStore, {
  name: "factory-storage",
  getStorage: () => localStorage,
  partialize: (state) => ({
    factories: state.factories,
    selectedFactory: state.selectedFactory,
  }),
});
```

#### UI Store

```tsx
interface UIState {
  // State
  sidebarOpen: boolean;
  notifications: Notification[];
  modal: ModalState | null;
  toast: ToastState | null;

  // Actions
  toggleSidebar: () => void;
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
  showToast: (toast: ToastState) => void;
  hideToast: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  notifications: [],
  modal: null,
  toast: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  openModal: (modal) => set({ modal }),

  closeModal: () => set({ modal: null }),

  showToast: (toast) => set({ toast }),

  hideToast: () => set({ toast: null }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
```

### 4. React Query

**Use Case**: Server state management with caching

#### Query Configuration

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 2,
    },
  },
});

// App provider
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);
```

#### Factory Queries

```tsx
// Query keys
export const factoryKeys = {
  all: ["factories"] as const,
  lists: () => [...factoryKeys.all, "list"] as const,
  list: (filters: FactoryFilters) => [...factoryKeys.lists(), filters] as const,
  details: () => [...factoryKeys.all, "detail"] as const,
  detail: (id: string) => [...factoryKeys.details(), id] as const,
};

// Factory queries
export const useFactories = (filters: FactoryFilters = {}) => {
  return useQuery({
    queryKey: factoryKeys.list(filters),
    queryFn: () => factoryApi.getFactories(filters),
    select: (data) => data.factories,
  });
};

export const useFactory = (id: string) => {
  return useQuery({
    queryKey: factoryKeys.detail(id),
    queryFn: () => factoryApi.getFactory(id),
    enabled: !!id,
  });
};

export const useFactoryMetrics = (id: string, period: Period = "day") => {
  return useQuery({
    queryKey: ["factory", id, "metrics", period],
    queryFn: () => factoryApi.getMetrics(id, period),
    enabled: !!id,
    refetchInterval: period === "realtime" ? 5000 : false,
  });
};
```

#### Factory Mutations

```tsx
export const useCreateFactory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: factoryApi.createFactory,
    onSuccess: (newFactory) => {
      // Update cache
      queryClient.setQueryData(
        factoryKeys.list({}),
        (old: Factory[] | undefined) =>
          old ? [...old, newFactory] : [newFactory],
      );

      // Show success toast
      useUIStore.getState().showToast({
        type: "success",
        message: "Factory created successfully",
      });
    },
    onError: (error) => {
      useUIStore.getState().showToast({
        type: "error",
        message: `Failed to create factory: ${error.message}`,
      });
    },
  });
};

export const useUpdateFactory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Factory> }) =>
      factoryApi.updateFactory(id, data),
    onSuccess: (updatedFactory) => {
      // Update cache
      queryClient.setQueryData(
        factoryKeys.detail(updatedFactory.id),
        updatedFactory,
      );

      queryClient.setQueryData(
        factoryKeys.list({}),
        (old: Factory[] | undefined) =>
          old?.map((factory) =>
            factory.id === updatedFactory.id ? updatedFactory : factory,
          ),
      );

      // Show success toast
      useUIStore.getState().showToast({
        type: "success",
        message: "Factory updated successfully",
      });
    },
  });
};

export const useDeleteFactory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: factoryApi.deleteFactory,
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.setQueryData(
        factoryKeys.list({}),
        (old: Factory[] | undefined) =>
          old?.filter((factory) => factory.id !== id),
      );

      queryClient.removeQueries({ queryKey: factoryKeys.detail(id) });

      // Show success toast
      useUIStore.getState().showToast({
        type: "success",
        message: "Factory deleted successfully",
      });
    },
  });
};
```

### 5. Form State Management

**Use Case**: Complex forms with validation

#### React Hook Form

```tsx
interface FactoryFormData {
  name: string;
  location: string;
  type: string;
  capacity: number;
  description?: string;
}

const FactoryForm: React.FC<{ factory?: Factory }> = ({ factory }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FactoryFormData>({
    defaultValues: factory || {
      name: "",
      location: "",
      type: "manufacturing",
      capacity: 100,
    },
    resolver: zodResolver(factorySchema),
  });

  const createMutation = useCreateFactory();
  const updateMutation = useUpdateFactory();

  const onSubmit = async (data: FactoryFormData) => {
    if (factory) {
      await updateMutation.mutateAsync({
        id: factory.id,
        data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InputField
        label="Factory Name"
        {...register("name")}
        error={errors.name?.message}
      />

      <InputField
        label="Location"
        {...register("location")}
        error={errors.location?.message}
      />

      <Select
        label="Factory Type"
        options={[
          { value: "manufacturing", label: "Manufacturing" },
          { value: "assembly", label: "Assembly" },
          { value: "processing", label: "Processing" },
        ]}
        {...register("type")}
        error={errors.type?.message}
      />

      <InputField
        label="Capacity (units/hour)"
        type="number"
        {...register("capacity", { valueAsNumber: true })}
        error={errors.capacity?.message}
      />

      <TextArea
        label="Description"
        {...register("description")}
        error={errors.description?.message}
      />

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {factory ? "Update Factory" : "Create Factory"}
        </Button>
      </div>
    </form>
  );
};
```

## State Persistence

### Local Storage

```tsx
// Custom hook for localStorage
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue] as const;
};
```

### Session Storage

```tsx
// Session storage for temporary data
const useSessionStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue] as const;
};
```

## State Synchronization

### Real-time Updates

```tsx
// WebSocket connection for real-time data
const useWebSocket = (url: string, onMessage: (data: any) => void) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [url, onMessage]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  return { sendMessage };
};

// Real-time factory updates
const useRealTimeFactoryUpdates = (factoryId: string) => {
  const queryClient = useQueryClient();

  const handleUpdate = useCallback(
    (update: FactoryUpdate) => {
      // Update factory cache
      queryClient.setQueryData(
        factoryKeys.detail(factoryId),
        (old: Factory | undefined) => (old ? { ...old, ...update } : undefined),
      );

      // Update factory list cache
      queryClient.setQueryData(
        factoryKeys.list({}),
        (old: Factory[] | undefined) =>
          old?.map((factory) =>
            factory.id === factoryId ? { ...factory, ...update } : factory,
          ),
      );

      // Show notification
      useUIStore.getState().addNotification({
        id: `factory-update-${Date.now()}`,
        type: "info",
        title: "Factory Updated",
        message: `Factory ${update.name} has been updated`,
        timestamp: new Date(),
      });
    },
    [factoryId, queryClient],
  );

  useWebSocket(
    `ws://api.sentientfactory.com/factories/${factoryId}/updates`,
    handleUpdate,
  );
};
```

## Performance Optimization

### State Selectors

```tsx
// Select specific pieces of state to prevent unnecessary re-renders
const useSelectedFactory = () => {
  return useFactoryStore((state) => state.selectedFactory);
};

const useFactoryNames = () => {
  return useFactoryStore((state) => state.factories.map((f) => f.name));
};

// Memoized selector
const useFactoryById = (id: string) => {
  return useFactoryStore(
    useCallback((state) => state.factories.find((f) => f.id === id), [id]),
  );
};
```

### Batch Updates

```tsx
// Batch multiple state updates
const useBatchFactoryUpdates = () => {
  const { setFactories, addFactory, updateFactory } = useFactoryStore();

  const batchUpdate = useCallback((updates: FactoryUpdateBatch) => {
    // Use immer for immutable updates
    setProduce((state) => {
      if (updates.add) {
        state.factories.push(...updates.add);
      }

      if (updates.update) {
        updates.update.forEach(({ id, data }) => {
          const factory = state.factories.find((f) => f.id === id);
          if (factory) {
            Object.assign(factory, data);
          }
        });
      }

      if (updates.remove) {
        state.factories = state.factories.filter(
          (f) => !updates.remove!.includes(f.id),
        );
      }
    });
  }, []);

  return batchUpdate;
};
```

## Error Handling

### Error Boundary

```tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Error Recovery

```tsx
// Retry logic for failed queries
const useFactoryWithRetry = (id: string) => {
  return useQuery({
    queryKey: factoryKeys.detail(id),
    queryFn: () => factoryApi.getFactory(id),
    retry: (failureCount, error) => {
      // Don't retry on 404
      if (error.status === 404) return false;

      // Retry up to 3 times
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
```
