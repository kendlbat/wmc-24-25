import React, { createContext, useContext, useMemo, useState } from "react";

// DumpsterfireAuth - (c) kendlbat 2025

// IMPORTANT NOTE
// You CAN look here for finding vulnerabilities, but you really SHOULD NOT
// nothing here is broken on purpose, there should not be anything to fix

// Also note that you should not use this code as a reference for your own projects
// In fact, don't ever write your own auth system

async function refreshToken() {
    const refresh_token = localStorage.getItem("refresh_token");

    if (refresh_token) {
        try {
            const response = await fetch("/api/auth/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh_token }),
            });

            if (!response.ok) {
                logout();
                return;
            }

            const { access_token, access_token_expires, user } =
                await response.json();

            localStorage.setItem("token", access_token);
            localStorage.setItem(
                "token_expires",
                new Date(access_token_expires * 1000).toISOString()
            );
            localStorage.setItem("userdata", JSON.stringify(user));
        } catch (e) {
            console.error(e);
            logout();
        }
    }
}

async function getToken() {
    const token = localStorage.getItem("token");
    const token_expires = localStorage.getItem("token_expires");

    if (!token || !token_expires) {
        logout();
        throw new Error("No token found");
    }

    if (new Date(token_expires) < new Date()) {
        await refreshToken();
    }

    return localStorage.getItem("token");
}

const authContext = createContext<{
    authState: {
        accessToken: string | null;
        refreshToken: string | null;
        accessTokenExpires: Date | null;
        refreshTokenExpires: Date | null;
        user: Record<string, unknown> | null;
    };
    setAuthState: React.Dispatch<
        React.SetStateAction<{
            accessToken: string | null;
            refreshToken: string | null;
            accessTokenExpires: Date | null;
            refreshTokenExpires: Date | null;
            user: Record<string, unknown> | null;
        }>
    >;
}>({
    authState: {
        accessToken: localStorage.getItem("token"),
        refreshToken: localStorage.getItem("refresh_token"),
        accessTokenExpires: new Date(
            localStorage.getItem("token_expires") || 0
        ),
        refreshTokenExpires: new Date(
            localStorage.getItem("refresh_token_expires") || 0
        ),
        user: JSON.parse(localStorage.getItem("userdata") || "{}"),
    },
    setAuthState: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<{
        accessToken: string | null;
        refreshToken: string | null;
        accessTokenExpires: Date | null;
        refreshTokenExpires: Date | null;
        user: Record<string, unknown> | null;
    }>({
        accessToken: localStorage.getItem("token"),
        refreshToken: localStorage.getItem("refresh_token"),
        accessTokenExpires: new Date(
            localStorage.getItem("token_expires") || 0
        ),
        refreshTokenExpires: new Date(
            localStorage.getItem("refresh_token_expires") || 0
        ),
        user: JSON.parse(localStorage.getItem("userdata") || "{}"),
    });

    return React.createElement(authContext.Provider, {
        value: {
            authState,
            setAuthState,
        },
        children,
    });
}

export function useAuth() {
    const { authState, setAuthState } = useContext(authContext);

    return useMemo(() => {
        return {
            isSignedIn: authState?.accessToken != null,
            login: async (username: string, password: string) => {
                await login(username, password);
                setAuthState({
                    accessToken: localStorage.getItem("token"),
                    refreshToken: localStorage.getItem("refresh_token"),
                    accessTokenExpires: new Date(
                        localStorage.getItem("token_expires") || 0
                    ),
                    refreshTokenExpires: new Date(
                        localStorage.getItem("refresh_token_expires") || 0
                    ),
                    user: JSON.parse(localStorage.getItem("userdata") || "{}"),
                });
            },
            logout: async () => {
                await logout();
                setAuthState({
                    accessToken: null,
                    refreshToken: null,
                    accessTokenExpires: null,
                    refreshTokenExpires: null,
                    user: null,
                });
            },
            fetch: async (input: RequestInfo, init?: RequestInit) => {
                const token = await getToken();

                if (token !== authState.accessToken) {
                    setAuthState({
                        accessToken: token,
                        refreshToken: localStorage.getItem("refresh_token"),
                        accessTokenExpires: new Date(
                            localStorage.getItem("token_expires") || 0
                        ),
                        refreshTokenExpires: new Date(
                            localStorage.getItem("refresh_token_expires") || 0
                        ),
                        user: JSON.parse(
                            localStorage.getItem("userdata") || "{}"
                        ),
                    });
                }

                return await fetch(input, {
                    ...init,
                    headers: {
                        ...init?.headers,
                        Authorization: `Bearer ${token}`,
                    },
                });
            },
            getToken: async () => {
                const token = await getToken();
                if (token !== authState.accessToken) {
                    setAuthState({
                        accessToken: token,
                        refreshToken: localStorage.getItem("refresh_token"),
                        accessTokenExpires: new Date(
                            localStorage.getItem("token_expires") || 0
                        ),
                        refreshTokenExpires: new Date(
                            localStorage.getItem("refresh_token_expires") || 0
                        ),
                        user: JSON.parse(
                            localStorage.getItem("userdata") || "{}"
                        ),
                    });
                }
                return token;
            },
            user: authState.user,
        };
    }, [authState, setAuthState]);
}

async function login(username: string, password: string) {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    const {
        access_token,
        refresh_token,
        access_token_expires,
        refresh_token_expires,
        user,
    } = await response.json();

    localStorage.setItem("token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem(
        "token_expires",
        new Date(access_token_expires * 1000).toISOString()
    );
    localStorage.setItem(
        "refresh_token_expires",
        new Date(refresh_token_expires * 1000).toISOString()
    );
    localStorage.setItem("userdata", JSON.stringify(user));
}

async function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expires");
    localStorage.removeItem("refresh_token_expires");
    localStorage.removeItem("userdata");
}
