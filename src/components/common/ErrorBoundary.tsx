/**
 * FORMGRID INDUSTRIAL ERROR BOUNDARY & WEBGL CONTEXT RECOVERY
 * Catches graphics driver context losses and unexpected UI state halts
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
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
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FORMGRID SYSTEM RUNTIME ERROR:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[360px] flex items-center justify-center p-6 bg-surface rounded-xl border border-red-500/30 text-center font-mono">
          <div className="max-w-md space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-precision-white uppercase tracking-wider">
                {this.props.fallbackTitle || 'WebGL Kernel Interrupted'}
              </h3>
              <p className="text-xs text-zinc-400 font-sans">
                A graphics hardware reset or unexpected mathematical anomaly occurred. The parametric engine has been safely halted.
              </p>
            </div>

            {this.state.error && (
              <div className="p-2.5 rounded bg-black/70 border border-zinc-800 text-[10px] text-zinc-500 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-precision-white font-medium flex items-center justify-center space-x-2 mx-auto transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-signal-orange" />
              <span>RESTART WEBGL SUBSYSTEM</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
