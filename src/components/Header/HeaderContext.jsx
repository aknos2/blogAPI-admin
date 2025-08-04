/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';

const HeaderContext = createContext();

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};

export const HeaderProvider = ({ children, headerPosition, headerPositionReady }) => {
  return (
    <HeaderContext.Provider value={{ headerPosition, headerPositionReady }}>
      {children}
    </HeaderContext.Provider>
  );
};