import { createContext, useContext, useEffect, useState } from "react";
import { JWT_LOGIN_POST } from "@/config/api-path";

const AuthContext = createContext();
// 保有狀態
// login
// logout
// getAuthHeader

// component

// 設定 storage key
const storageKey = "Efron";

// 初始化登入狀態
const emptyAuth = {
  id: 0,
  email: "",
  nickname: "",
  token: "",
};

export function AuthContextProvider({ children }) {
  // 宣告登入的狀態
  const [auth, setAuth] = useState(emptyAuth);

  // email & passwoed
  const login = async (email, password) => {
    try {
      const r = await fetch(JWT_LOGIN_POST, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await r.json();
      if (result.success) {
        // token 和用戶的相關資料存到 localStorage
        localStorage.setItem(storageKey, JSON.stringify(result.data));

        // **** 變更狀態
        setAuth(result.data);
      }

      return result.success;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setAuth(emptyAuth);
  };

  const getAuthHeader = () => {
    if (auth.token) {
      return {
        Authorization: `Bearer ${auth.token}`,
      };
    } else {
      return {};
    }
  };

  // 用戶如果重刷頁面, 狀態可以由 localStorage 載入
  useEffect(() => {
    const str = localStorage.getItem(storageKey);
    if (!str) return;
    try {
      const data = JSON.parse(str);
      if (data?.id && data?.token) {
        setAuth(data);
      }
    } catch (ex) {}
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, auth, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
