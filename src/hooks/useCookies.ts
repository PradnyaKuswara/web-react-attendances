/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie';

const useCookies = () => {
  const setCookies = (
    key: string,
    value: string,
    options?: Record<string, any>,
  ) => {
    Cookies.set(key, value, {
      expires: 365,
      ...options,
    });
  };

  const getCookies = (key: string) => {
    return Cookies.get(key);
  };

  const removeCookies = (key: string, options?: Record<string, any>) => {
    Cookies.remove(key, {
      ...options,
    });
  };

  return { setCookies, getCookies, removeCookies };
};

export default useCookies;
