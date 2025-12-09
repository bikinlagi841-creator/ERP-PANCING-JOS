import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 p-4">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full text-center border border-slate-200">
            <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Terjadi Kesalahan Aplikasi</h1>
            <p className="text-slate-600 mb-6">
              Maaf, aplikasi mengalami masalah saat memproses data. Silakan muat ulang halaman.
            </p>
            
            <div className="bg-slate-100 p-4 rounded-lg text-left text-xs font-mono text-slate-600 mb-6 overflow-auto max-h-32">
              {this.state.error?.toString() || "Unknown Error"}
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-ocean-600 text-white py-3 rounded-lg font-semibold hover:bg-ocean-700 transition flex items-center justify-center gap-2"
            >
              <RefreshCcw size={18} /> Muat Ulang Aplikasi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}