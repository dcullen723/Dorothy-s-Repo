import React from 'react';

interface State { hasError: boolean; message: string; }

class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#1e293b' }}>
          <h2 style={{ color: '#dc2626' }}>Something went wrong loading the app</h2>
          <pre style={{ background: '#f1f5f9', padding: 16, borderRadius: 8, fontSize: 13 }}>
            {this.state.message}
          </pre>
          <p>Please copy the error above and share it so it can be fixed.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
