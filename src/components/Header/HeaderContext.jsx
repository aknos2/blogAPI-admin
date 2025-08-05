/* eslint-disable react-refresh/only-export-components */
import { createContext } from 'react';

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  return (
    <HeaderContext.Provider>
      {children}
    </HeaderContext.Provider>
  );
};