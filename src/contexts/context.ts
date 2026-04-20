import type useUserData from '@/hooks/useUserData';
import { THEME } from '@/shared/constants/constantTheme';
import { createContext } from 'react';

export const ThemeContext = createContext({
  theme: THEME.LIGHT,
  toggleTheme: () => {},
});

export const AuthContext = createContext<ReturnType<typeof useUserData> | null>(
  null,
);
