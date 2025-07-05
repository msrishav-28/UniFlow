import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send error to analytics
    if (typeof window !== 'undefined' && (window as any).analyticsService) {
      (window as any).analyticsService.trackEvent('error_boundary', {
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        url: window.location.href
      });
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div className="min-h-screen bg-surface-primary flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="card-premium p-8 text-center">
              {/* Error Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertCircle size={40} className="text-red-500" />
              </div>
              
              {/* Error Message */}
              <h1 className="text-heading-1 text-primary mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-body text-secondary mb-6">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
              
              {/* Error Details (Dev Mode) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-sm text-tertiary cursor-pointer hover:text-primary">
                    Error Details
                  </summary>
                  <pre className="mt-2 p-3 bg-surface-tertiary rounded-lg text-xs overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 btn-premium py-3 flex items-center justify-center"
                >
                  <RefreshCw size={18} className="mr-2" />
                  Try Again
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 glass-button py-3 flex items-center justify-center"
                >
                  <Home size={18} className="mr-2" />
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
