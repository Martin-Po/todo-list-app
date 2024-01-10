import { createTheme } from "@mui/material";

const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 768,
        md: 1024,
        lg: 1300,
        xl: 1536,
      },
    },
    palette: {
      primary: {
        main: '#F3F4F6',
        light: 'white'
      },
      secondary: {
        main: '#607d8b',
      },
    },
    typography: {
    "fontFamily": `Poppins,sans-serif`,
    "color":'rgb(68 86 108)'
  }
  });


  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#212425',
      },
    },
  });

  export { theme, darkTheme }