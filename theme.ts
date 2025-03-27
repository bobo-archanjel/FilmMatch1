// theme.ts
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const DarkAppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF3366', // pink accent
    background: '#191919', // main background
    surface: '#262626',    // card or surface color
    text: '#FFFFFF',       // default text color on dark backgrounds
    onSurface: '#FFFFFF',
    // Adjust other colors as needed
  },
};
