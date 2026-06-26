'use client';

import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useApolloClient } from "@apollo/client/react";
import { loginWithPassword, logout } from "../lib/auth/authService";
import { setCredentials, clearCredentials, AuthUser } from "../store/authSlice";
import { useMutation } from "@apollo/client/react";
import { SWITCH_DEMO_ROLE } from "../graphql/mutation/switchDemoRole";
import { getAccessToken, clearAllAuthData } from "../lib/auth/tokenStorage";

export type SessionContextValue = {
	isAuthenticated: boolean;
	user: AuthUser | null;
	login: (args: { email: string; password: string }) => Promise<void>;
	logout: () => Promise<void>;
	switchRole: (newRole: string) => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: PropsWithChildren) {
	const dispatch = useDispatch();
	const [user, setUser] = useState<AuthUser | null>(null);
	const isAuthenticated = Boolean(user);
	const [switchDemoRoleMutation] = useMutation<any, any>(SWITCH_DEMO_ROLE);

	useEffect(() => {
		const token = getAccessToken();

		if (token) {
			try {
				if (token.startsWith("demo-token")) {
					const originalUserStr = localStorage.getItem("original-user");
					if (originalUserStr) {
						const originalUser = JSON.parse(originalUserStr);
						const restoredUser: AuthUser = {
							id: originalUser.id,
							name: originalUser.name,
							email: originalUser.email,
							role: originalUser.role || "Employee",
							isDemo: originalUser.isDemo ?? true,
						};
						setUser(restoredUser);
						dispatch(setCredentials({ user: restoredUser }));
					} else {
						// Force redirect to login if no real session exists
						setUser(null);
						dispatch(clearCredentials());
						clearAllAuthData();
					}
				} else {
					const parts = token.split('.');
					if (parts.length === 3) {
						const payload = JSON.parse(atob(parts[1]));
						const restoredUser: AuthUser = {
							id: payload.nameid || payload.sub || payload.id || "EMP-001",
							name: payload.unique_name || payload.name || "John Doe",
							email: payload.email || "john.doe@workflow.com",
							role: payload.role || "Employee",
							isDemo: payload.isDemo === "true" || payload.isDemo === true,
						};
						setUser(restoredUser);
						dispatch(setCredentials({ user: restoredUser }));
						localStorage.setItem("original-user", JSON.stringify(restoredUser));
					}
				}
			} catch (e) {
				console.error("Failed to parse access token:", e);
			}

		}
	}, [dispatch]);

	const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
		const res = await loginWithPassword(email, password);
		const nextUser: AuthUser | null =
			res.user ? { 
				id: res.user.id, 
				name: res.user.name, 
				email: res.user.email, 
				role: res.user.role,
				isDemo: res.user.isDemo
			} : null;
		setUser(nextUser);
		dispatch(setCredentials({ user: nextUser }));
		if (nextUser) {
			localStorage.setItem("original-user", JSON.stringify(nextUser));
		}
	}, [dispatch]);

	const apolloClient = useApolloClient();
	const signOut = useCallback(async () => {
		  await logout();
		  await apolloClient.clearStore();
		  clearAllAuthData();
		  setUser(null);
		  dispatch(clearCredentials());
	}, [dispatch, apolloClient]);

	const switchRole = useCallback(async (newRole: string) => {
		if (!user?.id) return;
		if (user.isDemo === false) {
			console.warn("Switch role is not allowed for real employees");
			return;
		}
		
		try {
			const { data } = await switchDemoRoleMutation({
				variables: {
					userId: user.id,
					newRole,
				},
			});

			if (data?.switchDemoRole) {
				const updatedUser: AuthUser = {
					id: data.switchDemoRole.id,
					email: data.switchDemoRole.email,
					name: `${data.switchDemoRole.firstName} ${data.switchDemoRole.lastName}`,
					role: data.switchDemoRole.role || "Employee",
					isDemo: true
				};
				setUser(updatedUser);
				dispatch(setCredentials({ user: updatedUser }));
				localStorage.setItem("original-user", JSON.stringify(updatedUser));
			}
		} catch (error) {
			console.error('Failed to switch role:', error);
		}
	}, [user, switchDemoRoleMutation, dispatch]);

	const value = useMemo<SessionContextValue>(() => {
		return {
			isAuthenticated,
			user,
			login,
			logout: signOut,
			switchRole,
		};
	}, [isAuthenticated, login, signOut, switchRole, user]);

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
	const ctx = useContext(SessionContext);
	if (!ctx) throw new Error("useSession must be used within SessionProvider");
	return ctx;
}


