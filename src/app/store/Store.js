import { createGlobalState } from 'react-hooks-global-state';

const { setGlobalState, useGlobalState } = createGlobalState({
  structure: null
});

export const setStructure = structureData => {
  setGlobalState('structure', structureData);
};

export { useGlobalState };
