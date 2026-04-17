import { THEME } from '@/shared/constants/constantTheme';
import { createContext } from 'react';

export const ThemeContext = createContext({
  theme: THEME.LIGHT,
  toggleTheme: () => {},
});
