import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Route } from '../../constants';
import { useUserStore } from '../../hooks';

const HomePage = () => {
  const { user } = useUserStore();

  return (
    <Suspense fallback={null}>
      {user ? <Outlet /> : <Navigate to={Route.Login} />}
    </Suspense>
  );
};

export default HomePage;
