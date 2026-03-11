import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-rose-500" />
          </div>
          <h1 className="text-[22px] font-bold text-slate-900 mb-3 tracking-tight">页面遇到了一点问题</h1>
          <p className="text-[14px] text-slate-500 mb-8 leading-relaxed max-w-[280px]">
            抱歉，系统在渲染时发生了意外错误。您可以尝试刷新页面恢复。
          </p>
          <button
            onClick={this.handleReload}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-[20px] font-bold text-[15px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] active:scale-95 transition-transform"
          >
            <RefreshCw className="w-4 h-4" />
            重新加载页面
          </button>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-12 p-4 bg-slate-200 rounded-xl text-left w-full max-w-md overflow-auto">
              <p className="text-xs text-slate-700 font-mono whitespace-pre-wrap">
                {this.state.error.toString()}
              </p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
