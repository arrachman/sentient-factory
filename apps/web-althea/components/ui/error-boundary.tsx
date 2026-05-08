'use client';

import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Component, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = { hasError: boolean; error: Error | null };

/**
 * Generic React error boundary untuk wrap section yang risk error
 * (e.g., third-party component, dynamic import). Use sparingly —
 * Next.js app router error.tsx handles most cases.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="card-althea p-6 text-center bg-card border-danger/30">
          <AlertTriangle className="mx-auto h-8 w-8 text-danger mb-2" />
          <h3 className="h3 mb-2">Komponen error</h3>
          <p className="caption mb-3 text-fg-muted">
            {this.state.error?.message || 'Error tidak diketahui'}
          </p>
          <button type="button" onClick={this.reset} className="btn btn-outline btn-sm">
            <RefreshCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
