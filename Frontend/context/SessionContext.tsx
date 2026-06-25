'use client';

import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginWithPassword, logout } from "../lib/auth/authService";
import { setCredentials, clearCredentials, AuthUser } from "../store/authSlice";
import { useMutation } from "@apollo/client/react";
import { SWITCH_DEMO_ROLE } from "../graphql/mutation/switchDemoRole";
import { getAccessToken } from "../lib/auth/tokenStorage";

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
		const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";

		if (token) {
			try {
				if (token.startsWith("demo-token")) {
					const originalUserStr = localStorage.getItem("original-user");
					const originalUser = originalUserStr ? JSON.parse(originalUserStr) : null;

					const restoredUser: AuthUser = {
						id: originalUser?.id || "EMP-004",
						name: originalUser?.name || "John Doe",
						email: originalUser?.email || "john.doe@workflowglobal.com",
						role: (localStorage.getItem("demo-role") as any) || originalUser?.role || "Employee",
					};
					setUser(restoredUser);
					dispatch(setCredentials({ user: restoredUser }));
				} else {
					const parts = token.split('.');
					if (parts.length === 3) {
						const payload = JSON.parse(atob(parts[1]));
						const restoredUser: AuthUser = {
							id: payload.nameid || payload.sub || payload.id || "EMP-001",
							name: payload.unique_name || payload.name || "John Doe",
							email: payload.email || "john.doe@workflow.com",
							role: payload.role || "Employee",
						};
						setUser(restoredUser);
						dispatch(setCredentials({ user: restoredUser }));
						localStorage.setItem("original-user", JSON.stringify({
							id: restoredUser.id,
							name: restoredUser.name,
							email: restoredUser.email,
							role: "Employee"
						}));
					}
				}
			} catch (e) {
				console.error("Failed to parse access token:", e);
			}
		} else if (disableAuth) {
			const savedRole = localStorage.getItem("demo-role") || "Employee";
			const originalUserStr = localStorage.getItem("original-user");
			const originalUser = originalUserStr ? JSON.parse(originalUserStr) : null;

			let id = originalUser?.id || "EMP-004";
			let name = originalUser?.name || "John Doe";
			let email = originalUser?.email || "john.doe@workflowglobal.com";

			if (!originalUser) {
				if (savedRole === "Admin") {
					id = "EMP-001";
					name = "Admin User";
					email = "admin@workflowglobal.com";
				} else if (savedRole === "HR") {
					id = "EMP-002";
					name = "HR User";
					email = "hr@workflowglobal.com";
				} else if (savedRole === "Manager") {
					id = "EMP-003";
					name = "Manager User";
					email = "manager@workflowglobal.com";
				}
			}

			const restoredUser: AuthUser = {
				id,
				name,
				email,
				role: savedRole as any,
			};
			setUser(restoredUser);
			dispatch(setCredentials({ user: restoredUser }));
		}
	}, [dispatch]);

	const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
		const res = await loginWithPassword(email, password);
		const nextUser: AuthUser | null =
			res.user ? { id: res.user.id, name: res.user.name, email: res.user.email, role: "Employee" } : null;
		setUser(nextUser);
		dispatch(setCredentials({ user: nextUser }));
		if (nextUser) {
			localStorage.setItem("original-user", JSON.stringify(nextUser));
		}
	}, [dispatch]);

	const signOut = useCallback(async () => {
		await logout();
		setUser(null);
		dispatch(clearCredentials());
		localStorage.removeItem("original-user");
	}, [dispatch]);

	const switchRole = useCallback(async (newRole: string) => {
		if (!user?.id) return;
		
		const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true" || (typeof window !== "undefined" && getAccessToken()?.startsWith("demo-token"));
		if (disableAuth) {
			const originalUserStr = localStorage.getItem("original-user");
			const originalUser = originalUserStr ? JSON.parse(originalUserStr) : null;

			let id = originalUser?.id || "EMP-004";
			let name = originalUser?.name || "John Doe";
			let email = originalUser?.email || "john.doe@workflowglobal.com";

			if (!originalUser) {
				if (newRole === "Admin") {
					id = "EMP-001";
					name = "Admin User";
					email = "admin@workflowglobal.com";
				} else if (newRole === "HR") {
					id = "EMP-002";
					name = "HR User";
					email = "hr@workflowglobal.com";
				} else if (newRole === "Manager") {
					id = "EMP-003";
					name = "Manager User";
					email = "manager@workflowglobal.com";
				}
			}

			const updatedUser: AuthUser = {
				id,
				name,
				email,
				role: newRole as any,
			};
			setUser(updatedUser);
			dispatch(setCredentials({ user: updatedUser }));
			localStorage.setItem("demo-role", newRole);
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
				};
				setUser(updatedUser);
				dispatch(setCredentials({ user: updatedUser }));
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


