import useCookies from "@/hooks/useCookies";
import { AuthContext } from "../contexts/context";
import useUserData from "../hooks/useUserData";
import { KEY } from "@/shared/constants/constantStorage";
import { useEffect } from "react";
import { generateSessionId } from "@/helpers/helper";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userData = useUserData(); // hanya dipanggil sekali di root
  const cookie = useCookies();

  useEffect(() => {
    if (userData.isAuthenticated) {
      cookie.removeCookies(KEY.cookie.sessionId.name, { path: '/' });
    } else {
      const existing = cookie.getCookies(KEY.cookie.sessionId.name);
      if (!existing) {
        const sessionId = generateSessionId();
        cookie.setCookies(KEY.cookie.sessionId.name, sessionId, {
          path: '/'
          , expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 hari
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.isAuthenticated]); // hanya trigger saat auth berubah

  return <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>;
};
