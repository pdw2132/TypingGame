import React from 'react';
import { Navigate } from 'react-router-dom';
import {GameInfo,GameStart,GameEnd} from './pages';

const routes = [
  {
    path: '/',
    element: <Navigate to="/gameInfo"/>,
  },
  {
    path: '/gameInfo',
    element: <GameInfo/>,
  },
  {
    path: '/gameStart',
    element: <GameStart/>,
  },
  {
    path: '/gameEnd',
    element: <GameEnd/>,
  }
];

export default routes;
