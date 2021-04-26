import { useRoutes } from 'react-router-dom';
import routes from './routing';
import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import { hot } from 'react-hot-loader'

const App = () => {
  const routing = useRoutes(routes);


  return (
    <ThemeProvider>
      {routing}
    </ThemeProvider>
  );
};

export default hot(module)(App);
