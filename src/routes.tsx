import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import ChatPage from './pages/Chat';
import { Route } from './constants';

// const LibraryAssessmentCriteria = Loadable(lazy(() => import('./pages/Settings/pages/LibraryAssessmentCriteria')));

const routes = [
  {
    path: Route.Homepage,
    element: <HomePage />,
    children: [
      {
        index: true,
        element: <ChatPage />,
      },
    ],
  },

  {
    path: Route.Login,
    element: <LoginPage />,
  },

  {
    path: Route.All,
    element: <Navigate to={Route.NotFound} />,
  },
];

export default routes;
