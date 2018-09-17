import React from 'react';
import { Link } from 'react-router-dom';
import APIStatus from '../Component/APIStatus';

const App = props => {
  return (
    <div>
      This Page is Top Page<br />
      <APIStatus />
      <Link to={'/about'}>about</Link>
    </div>
  );
};

export default App;
