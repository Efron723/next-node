import { createContext, useContext } from "react";

const AuthContext = createContext();
// 保有狀態
// login
// logout
// getAuthHeader

// component
export function AuthContextProvider({ children }) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
