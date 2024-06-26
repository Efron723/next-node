// import "@/styles/globals.css";
import AuthContext, { AuthContextProvider } from "@/contexts/auth-context";

export default function App({ Component, pageProps }) {
  return (
    // contextProvider 包在 _app.js 裡面
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}
