import React, { useState, useEffect, memo, useCallback } from 'react';
import Line from './Line';
import Text from './Text';
import Api from '../api/Api';
import { useGlobalState } from '../store/Store';
import '../assets/css/App.css';

const Block = memo(({data, onActiveChange, locations}) => {
  const [structure] = useGlobalState('structure');
  const [actives, setActives] = useState(calcInitialActives());
  const [texts, setTexts] = useState(calcInitialActives());
  const [options, setOptions] = useState([]);

  const folders = data.data.map(line => structure.find(x => x.type === 'line' && x.id === line))
                           .map(line => structure.find(x => x.type === 'folder' && x.id === line.data[0]))
                           .filter(folder => folder);

  function calcInitialActives() {
    return data.data.map(line => structure.find(x => x.type === 'line' && x.id === line))
                    .map(line => structure.find(x => x.type === 'text' && x.id === line.data[0]))
                    .filter(line => line)
                    .map(text => text.original)
  }

  const getSuggestions = () => {
    let payload = {
      "want": data.original.want,
      "active": actives.map(active => active.id)
    }

    Api.getSuggestions(payload).then(res => {
      setOptions(res.data.data.response)
    }).catch(err => {
      setOptions([])
    });
  };

  useEffect(() => {
    getSuggestions();
  }, [data, actives, locations]);

  useEffect(() => {
    if(data.type === 'folder') {
      data.properties.locations.forEach(element => {
        let existLoc = locations.find((x) => x.name === element.name);
        if(existLoc) {
          getSuggestions();
        }
      });
    }
  }, [locations]);

  const onOptionClick = useCallback((option) => {
    let existText = texts.find((x) => x.id === option.id);
    if(!existText) {
      setActives([...actives, option]);
      setTexts([...texts, option]);
      
      if(onActiveChange) {
        onActiveChange(option, data.type === 'folder' ? data.properties.locations : []);
      }
    }
  }, [data, actives, texts, onActiveChange]);

  const onChildActiveChange = useCallback((option, locations) => {
    if(option) setActives([...actives, option]);
    if(onActiveChange) onActiveChange(option, locations);
  }, [actives, onActiveChange]);

  return (
    <div className={"container Block " + (data.type === "folder" ? "Folder-block" : "Section-block")}>
      <h5 className="Block-title">{data.properties.name}</h5>

      { options.map((option, i) => {
        return (
          <span key={"option-key-" + i} onClick={() => onOptionClick(option)} className="Option-title">{option.name}</span>
        )
      }) }
      
      { texts.map((text, i) => {
        return (
          <Line key={"text-key-" + i}>
            <Text title={text.name} />
          </Line>
        )
      }) }
      
      { folders.map((folder, i) => {
        return (
          <Line key={"folder-key-" + i}>
            <Block data={folder} actives={actives} onActiveChange={onChildActiveChange} locations={locations} />
          </Line>
        )
      }) }
    </div>
  )
}, (prevProps, nextProps) => {
  if(prevProps.data !== nextProps.data || prevProps.onActiveChange !== nextProps.onActiveChange) return false;
  if(!equalsIgnoreOrder(prevProps.locations, nextProps.locations)) {
    
    return false;
  }
  return true;
});

const equalsIgnoreOrder = (a, b) => {
  if (a.length !== b.length) return false;
  const uniqueValues = new Set([...a, ...b]);
  for (const v of uniqueValues) {
    const aCount = a.filter(e => e === v).length;
    const bCount = b.filter(e => e === v).length;
    if (aCount !== bCount) return false;
  }
  return true;
}

export default Block;