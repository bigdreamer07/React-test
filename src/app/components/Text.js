import React, { memo } from 'react';
import '../assets/css/App.css';

const Text = memo((props) => {
  return (
    <div className="Text">
      <h6 className="Text-content">{props.title}</h6>
    </div>
  )
});

export default Text;