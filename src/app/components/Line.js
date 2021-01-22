import React, { memo } from 'react';
import '../assets/css/App.css';

const Line = memo((props) => {
  return (
    <div className="container Line">
      {props.children}
    </div>
  )
});

export default Line;