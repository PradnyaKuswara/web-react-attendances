import ReactQueryClientProvider from './providers/ReactQueryClientProvider';
import ThemeProvider from './providers/ThemeProvider';
import RouteWeb from './routes/Route';
import './styles/App.css';

const App = () => {
  return (
    <ThemeProvider>
      <ReactQueryClientProvider>
        <RouteWeb />
      </ReactQueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
