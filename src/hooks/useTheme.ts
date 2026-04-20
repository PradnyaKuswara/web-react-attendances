import { useContext } from 'react';
import { ThemeContext } from '@/contexts/context';

export const useTheme = () => useContext(ThemeContext);
