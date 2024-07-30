"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { PUBLIC_ROUTES } from "../../constants";
import { Loader } from "./loader";

interface AuthContextProps {
  token: string;
  handleSetToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  token: "",
  handleSetToken: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleSetToken = useCallback((token: string) => {
    setToken(token);
    localStorage.setItem("token", token);
  }, []);

  useEffect(() => {
    const tk = localStorage.getItem("token");
    if (PUBLIC_ROUTES.includes(pathname)) {
      if (tk) {
        handleSetToken(tk);
        router.push("/");
      } else {
        setLoading(false);
      }
    } else {
      if (!tk) {
        router.push("/login");
      } else {
        handleSetToken(tk);
        setLoading(false);
      }
    }
  }, [handleSetToken, pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        token,
        handleSetToken,
      }}
    >
      {loading ? <Loader /> : null}
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};