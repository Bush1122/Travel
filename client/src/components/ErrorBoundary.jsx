import AdminLayout from "./admin-view/layout";
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-800 bg-red-100">
          Something went wrong: {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

<ErrorBoundary>
  <AdminLayout />
</ErrorBoundary>;
