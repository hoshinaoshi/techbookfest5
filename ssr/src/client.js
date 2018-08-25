import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './Store/store';

import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import Routes from './Routes/routes';

const store = configureStore();

ReactDOM.hydrate(
  <Provider store={store}>
  <BrowserRouter>{renderRoutes(Routes)}</BrowserRouter>
  </Provider>,
  document.getElementById('app')
);
