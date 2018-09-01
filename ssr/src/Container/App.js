import React from 'react';
import { Link } from 'react-router-dom';

const App = props => {
  return (
    <div>
      This Page is Top Page<br />
      <Link to={'/about'}>about</Link>
    </div>
  );
};

export default App;
