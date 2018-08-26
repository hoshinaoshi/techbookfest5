import React from 'react';
import { Link } from 'react-router-dom';

const App = props => {
  return (
    <div>
      Name is {props.name || 'hoge'} <br />
      Path is {props.match.path} <br />
      <Link to={'/about'}>about</Link>
    </div>
  );
};

export default App;
