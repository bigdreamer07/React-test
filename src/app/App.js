import React, { useState, useEffect, useCallback } from 'react';

import Block from './components/Block';
import Api from './api/Api';
import { useGlobalState, setStructure } from './store/Store';
import logo from './assets/img/logo.svg';
import './assets/css/App.css';

const App = () => {
  const [structure] = useGlobalState('structure');
  const [section, setSection] = useState(null);
  const [locations, setLocations] = useState([]);
  
  
  useEffect(() => {
    getStructure();
  }, []);

  useEffect(() => {
    if(structure != null) {
      setSection(structure[0]); // we assume first index is the top root section
    }
  }, [structure]);

  function getStructure() {
    Api.getStructure().then(res => {
      setStructure(res.data.data.structure)
    }).catch(err => {
      console.log(err)
    })
  }

  const onActiveChange = useCallback((option, locations) => {
    setLocations(locations);
  }, []);

  return (
    <div className="App">
      <div className="App-body">
        <img src={logo} className="App-logo" alt="logo" />
        {section && <Block data={section} locations={locations} onActiveChange={onActiveChange} /> }
      </div>
    </div>
  );
}

export default App;
