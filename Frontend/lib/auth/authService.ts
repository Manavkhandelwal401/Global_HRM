import { z } from "zod";
import { clearAccessToken, clearRefreshToken, getAccessToken, refreshAccessTokenSilently, setAccessToken, setRefreshToken } from "./tokenStorage";

const LoginResponseSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string().optional(),
	user: z
		.object({
			id: z.union([z.string(), z.number()]).transform(String),
			email: z.string().email().optional(),
			name: z.string().optional(),
			// extend as needed
		})
		.optional(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export async function loginWithPassword(email: string, password: string): Promise<LoginResponse> {
	const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
	if (disableAuth) {
		const demoUsers: Record<string, { password: string; user: LoginResponse["user"] }> = {
			"admin@workflowglobal.com": { password: "Admin@2024", user: { id: "EMP-001", email: "admin@workflowglobal.com", name: "Admin User" } },
			"hr@workflowglobal.com": { password: "Hr@2024", user: { id: "EMP-002", email: "hr@workflowglobal.com", name: "HR User" } },
			"manager@workflowglobal.com": { password: "Manager@2024", user: { id: "EMP-003", email: "manager@workflowglobal.com", name: "Manager User" } },
			"john.doe@workflowglobal.com": { password: "Employee@2024", user: { id: "EMP-004", email: "john.doe@workflowglobal.com", name: "John Doe" } },
			"mayank.khandelwal@workflowglobal.com": { password: "Mayank@2024", user: { id: "EMP-005", email: "mayank.khandelwal@workflowglobal.com", name: "Mayank Khandelwal" } },
		};
		const match = demoUsers[email.trim().toLowerCase()];
		if (match && match.password === password) {
			const demoResponse: LoginResponse = {
				accessToken: "demo-token-local",
				refreshToken: "demo-refresh-token",
				user: match.user,
			};
			setAccessToken(demoResponse.accessToken);
			if (demoResponse.refreshToken) setRefreshToken(demoResponse.refreshToken);
			return demoResponse;
		}
		throw new Error("Invalid demo credentials");
	}

	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
	const res = await fetch(`${baseUrl.replace(/\/$/, "")}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
		credentials: "include",
	});
	if (!res.ok) {
		const message = await safeErrorMessage(res);
		throw new Error(message);
	}
	const data = await res.json();
	const parsed = LoginResponseSchema.parse(data);
	setAccessToken(parsed.accessToken);
	if (parsed.refreshToken) setRefreshToken(parsed.refreshToken);
	return parsed;
}

export async function logout() {
	clearAccessToken();
	clearRefreshToken();
}

export async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit, retryOn401 = true) {
	const withAuth = async (): Promise<Response> => {
		const token = getAccessToken();
		const headers = new Headers(init?.headers || {});
		if (token) headers.set("Authorization", `Bearer ${token}`);
		return fetch(input, { ...init, headers, credentials: "include" });
	};
	let res = await withAuth();
	if (res.status === 401 && retryOn401) {
		const token = await refreshAccessTokenSilently();
		if (token) {
			res = await withAuth();
		}
	}
	return res;
}

async function safeErrorMessage(res: Response): Promise<string> {
	try {
		const data = (await res.json());
		return data?.message || `Request failed with status ${res.status}`;
	} catch {
		return `Request failed with status ${res.status}`;
	}
}


