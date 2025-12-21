import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from './components/ui/Toast';
import { useToastStore } from './stores/toastStore';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  const { toasts, removeToast } = useToastStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
