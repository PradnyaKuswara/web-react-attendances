import { AuthProvider } from './providers/AuthProvider';
import ReactQueryClientProvider from './providers/ReactQueryClientProvider';
import ThemeProvider from './providers/ThemeProvider';
import RouteWeb from './routes/Route';
import './styles/App.css';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <ThemeProvider>
      <ReactQueryClientProvider>
        <AuthProvider>
          <ToastContainer />
          <RouteWeb />
        </AuthProvider>
      </ReactQueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
