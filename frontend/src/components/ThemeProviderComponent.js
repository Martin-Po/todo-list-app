import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@emotion/react';
import { theme, darkTheme } from '../Theme';

const ThemeProviderComponent = ({ children }) => {
  const activeTheme = useSelector((state) => state.activeTheme);

  return (
    <ThemeProvider theme={activeTheme === 'light' ? theme : darkTheme}>
      {children}
    </ThemeProvider>
  );
};

export default ThemeProviderComponent;