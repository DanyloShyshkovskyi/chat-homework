import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom'

import Layout from 'layout/index'
import { Login } from 'pages/Login'
import NotFound from 'pages/NotFound'

import { BASE_URL } from 'shared/config/variables'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Navigate to='/chats' />,
      },
      {
        path: 'chats',
        lazy: () => import('pages/Chats'),
      },
      {
        path: 'chat/:chatId',
        lazy: () => import('pages/Chat'),
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        lazy: () => import('pages/Register'),
      },
      {
        path: 'profile',
        lazy: () => import('pages/Profile'),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes, { basename: BASE_URL })
