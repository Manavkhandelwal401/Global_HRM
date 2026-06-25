'use client';

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "../../../context/SessionContext";
import { Building2, Lock, Mail } from "lucide-react";

export default function LoginPage() {
	return (
		<Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
			<LoginForm />
		</Suspense>
	);
}

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { login } = useSession();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await login({ email, password });
			const next = searchParams.get("next") || "/";
			router.replace(next);
		} catch (err: any) {
			setError(err?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
			<div className="w-full max-w-md">
				{/* Brand Header */}
				<div className="mb-8 text-center">
					<div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 dark:bg-zinc-50 mb-4">
						<Building2 className="w-6 h-6 text-white dark:text-zinc-900" />
					</div>
					<h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
						Welcome back
					</h1>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">
						Sign in to your HRMS account
					</p>
				</div>

				{/* Login Card */}
				<form 
					onSubmit={onSubmit} 
					className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-5"
				>
					{/* Email Field */}
					<div className="space-y-2">
						<label 
							htmlFor="email" 
							className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
						>
							Email address
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Mail className="h-4 w-4 text-zinc-400" />
							</div>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full h-10 pl-10 pr-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300 focus:border-transparent transition-all"
								placeholder="you@company.com"
							/>
						</div>
					</div>

					{/* Password Field */}
					<div className="space-y-2">
						<label 
							htmlFor="password" 
							className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
						>
							Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Lock className="h-4 w-4 text-zinc-400" />
							</div>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="w-full h-10 pl-10 pr-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300 focus:border-transparent transition-all"
								placeholder="••••••••"
							/>
						</div>
					</div>

					{/* Error Message */}
					{error && (
						<div className="rounded-md bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3">
							<p className="text-sm text-red-700 dark:text-red-400">{error}</p>
						</div>
					)}

					{/* Submit Button */}
					<button
						type="submit"
						disabled={loading}
						className="w-full h-10 rounded-md bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
					>
						{loading ? (
							<span className="inline-flex items-center gap-2">
								<svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Signing in...
							</span>
						) : (
							"Sign in"
						)}
					</button>
				</form>

				{/* Footer */}
				<div className="mt-6 text-center">
					<p className="text-xs text-zinc-500 dark:text-zinc-500">
						By signing in, you agree to our Terms of Service and Privacy Policy
					</p>
				</div>
			</div>
		</div>
	);
}

// Made with Bob
