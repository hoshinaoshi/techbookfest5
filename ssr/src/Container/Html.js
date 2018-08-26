import React from 'react';
import { renderRoutes } from 'react-router-config';

const Html = props => {
  return (
    <html>
      <head>
        <title>App</title>
      </head>
      <body>
        <div id="app">{renderRoutes(props.route.routes)}</div>
        <script src="/client.js" />
      </body>
    </html>
  );
};

export default Html;
