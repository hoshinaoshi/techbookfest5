import Html from '../Container/Html';
import App from '../Container/App';
import About from '../Container/About';

const Routes = [
  {
    component: Html,
    routes: [
      {
        path: '/',
        exact: true,
        component: App,
      },
      {
        path: '/about',
        exact: true,
        component: About,
      },
    ],
  },
];

export default Routes;
