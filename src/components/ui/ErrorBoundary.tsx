import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  // Level of error boundary: 'route' or 'widget'
  level?: 'route' | 'widget';
  // Context description for error reporting (e.g. 'LeafletMap')
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Send the error report to our serverless endpoint
    try {
      fetch('/api/report-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error_message: `${this.props.context ? `[${this.props.context}] ` : ''}${error.message || 'Unknown render error'}`,
          error_stack: error.stack || 'No JS stack trace',
          component_stack: errorInfo.componentStack || 'No component stack',
          url: window.location.origin + window.location.pathname,
          user_agent: navigator.userAgent,
        }),
      }).catch(err => {
        console.error('Failed to report error to API:', err);
      });
    } catch (reportError) {
      console.error('Failed to dispatch report error:', reportError);
    }
  }

  private handleReset = () => {
    if (this.props.level === 'route') {
      // Route-level: full window reload to reset app routing state
      window.location.reload();
    } else {
      // Widget-level: local state reset to force re-render
      this.setState({ hasError: false, error: null });
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error!, this.handleReset);
        }
        return this.props.fallback;
      }

      const isRoute = this.props.level === 'route';

      return (
        <div
          className={
            isRoute
              ? 'flex min-h-100 flex-col items-center justify-center p-8 text-center bg-kapwa-bg-surface-raised border border-kapwa-border-weak rounded-2xl m-4'
              : 'flex flex-col items-center justify-center p-6 text-center bg-kapwa-bg-surface border border-kapwa-border-weak rounded-xl shadow-xs'
          }
        >
          <div className='bg-rose-50 text-rose-600 rounded-full p-3 mb-4 animate-pulse'>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <h3 className='text-kapwa-text-strong font-bold text-lg mb-2'>
            {isRoute ? 'Failed to Load Page' : 'Component Error'}
          </h3>
          <p className='text-kapwa-text-support text-sm max-w-md mb-4 leading-relaxed'>
            {isRoute
              ? 'We encountered an error loading this section. This issue has been logged, and we are working to resolve it.'
              : 'This element could not be loaded.'}
          </p>
          <button
            onClick={this.handleReset}
            className='cursor-pointer inline-flex items-center justify-center px-4 py-2 text-xs font-bold tracking-widest text-kapwa-text-inverse bg-kapwa-bg-brand-default hover:bg-kapwa-bg-brand-hover rounded-xl transition-all duration-200'
          >
            {isRoute ? 'Reload Page' : 'Try Again'}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
