import { useEffect, useState } from 'react';
import { ThemeContext } from '../contexts/context';
import { THEME } from '../shared/constants/constantTheme';
import useLocalStorage from '../hooks/useLocalStorage';
import { KEY } from '../shared/constants/constantStorage';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const storage = useLocalStorage();
  const light = THEME.LIGHT;
  const dark = THEME.DARK;

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = storage.getLocalStorage(KEY.localStorage.theme.name);
      return storedTheme ?? light;
    }
    return light;
  });

  useEffect(() => {
    storage.setLocalStorage(KEY.localStorage.theme.name, theme);

    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.setAttribute('data-theme', theme);
    }
  }, [theme, storage]);

  useEffect(() => {
    if (storage.getLocalStorage(KEY.localStorage.locale.name) === null) {
      storage.setLocalStorage(KEY.localStorage.locale.name, 'en');
    }
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === light ? dark : light));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
