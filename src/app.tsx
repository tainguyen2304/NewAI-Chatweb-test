import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRoutes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import SocketProvider from './components/providers/socket-provider';
import routes from './routes';
import './styles/global.scss';
import { queryClient } from './utils';

export function App() {
  const routing = useRoutes(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <ToastContainer draggable={false} autoClose={3000} />
        {routing}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;
