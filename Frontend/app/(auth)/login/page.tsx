'use client';

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "../../../context/SessionContext";
import { Building2, Lock, Mail, ShieldAlert, Sparkles, UserCheck } from "lucide-react";

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
	const [activeTab, setActiveTab] = useState<'demo' | 'corporate'>('demo');
	
	// Form inputs
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	// Signup State
	const [isSignUp, setIsSignUp] = useState(false);
	const [empId, setEmpId] = useState("");
	const [signupEmail, setSignupEmail] = useState("");
	const [code, setCode] = useState("");
	const [signupPassword, setSignupPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [signupError, setSignupError] = useState<string | null>(null);
	const [signupSuccess, setSignupSuccess] = useState<string | null>(null);

	const demoUsers = [
		{ name: "David Anderson", role: "Admin", email: "david@democompany.com", pass: "DemoPassword123" },
		{ name: "Sarah Wilson", role: "HR", email: "sarah@democompany.com", pass: "DemoPassword123" },
		{ name: "Michael Brown", role: "Manager", email: "michael@democompany.com", pass: "DemoPassword123" },
		{ name: "John Doe", role: "Employee", email: "john@democompany.com", pass: "DemoPassword123" }
	];

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await login({ email, password });
			const next = searchParams.get("next") || "/dashboard";
			router.replace(next);
		} catch (err: any) {
			setError(err?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	}

	async function handleQuickDemoLogin(demoUser: typeof demoUsers[0]) {
		setError(null);
		setLoading(true);
		try {
			await login({ email: demoUser.email, password: demoUser.pass });
			const next = searchParams.get("next") || "/dashboard";
			router.replace(next);
		} catch (err: any) {
			setError(err?.message || "Demo login failed");
		} finally {
			setLoading(false);
		}
	}

	async function onSignupSubmit(e: FormEvent) {
		e.preventDefault();
		setSignupError(null);
		setSignupSuccess(null);

		if (signupPassword !== confirmPassword) {
			setSignupError("Passwords do not match");
			return;
		}

		setLoading(true);
		try {
			const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
			if (!baseUrl) throw new Error("API base URL is not configured");

			const res = await fetch(`${baseUrl.replace(/\/$/, "")}/auth/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					employeeId: empId,
					email: signupEmail,
					registrationCode: code,
					password: signupPassword
				}),
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}));
				throw new Error(errorData?.message || `Signup failed with status ${res.status}`);
			}

			setSignupSuccess("Account registered successfully! Please sign in using the Corporate Portal.");
			setIsSignUp(false);
			setActiveTab('corporate');
			setEmail(signupEmail);
			setPassword(signupPassword);
		} catch (err: any) {
			setSignupError(err?.message || "Signup failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors duration-300">
			<div className="w-full max-w-md">
				{/* Brand Header */}
				<div className="mb-6 text-center">
					<div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 dark:bg-zinc-50 mb-4 shadow-lg shadow-zinc-900/10 dark:shadow-white/5">
						<Building2 className="w-6 h-6 text-white dark:text-zinc-900" />
					</div>
					<h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
						WorkFlow HRMS
					</h1>
					<p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-1">
						Global Human Resource Management
					</p>
				</div>

				{/* Custom Mode Tabs */}
				{!isSignUp && (
					<div className="flex gap-1.5 bg-zinc-200/60 dark:bg-zinc-900/80 p-1 rounded-xl mb-6 border border-zinc-200 dark:border-zinc-800">
						<button
							type="button"
							onClick={() => {
								setActiveTab('demo');
								setError(null);
							}}
							className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
								activeTab === 'demo'
									? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm border-zinc-200/50 dark:border-zinc-800/50 border'
									: 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
							}`}
						>
							<Sparkles className="w-3.5 h-3.5" />
							Demo Environment
						</button>
						<button
							type="button"
							onClick={() => {
								setActiveTab('corporate');
								setError(null);
							}}
							className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
								activeTab === 'corporate'
									? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm border-zinc-200/50 dark:border-zinc-800/50 border'
									: 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
							}`}
						>
							<UserCheck className="w-3.5 h-3.5" />
							Corporate Portal
						</button>
					</div>
				)}

				{signupSuccess && (
					<div className="mb-6 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-green-800 dark:text-green-300 p-4 shadow-sm text-sm">
						{signupSuccess}
					</div>
				)}

				{isSignUp ? (
					/* Sign Up Card (Corporate Portal Exclusive) */
					<div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
						<div className="mb-4">
							<h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
								Register Account
							</h2>
							<p className="text-xs text-zinc-500 mt-1">
								Only pre-created company emails can activate accounts.
							</p>
						</div>

						<form onSubmit={onSignupSubmit} className="space-y-4">
							<div className="space-y-1.5">
								<label htmlFor="empId" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
									Employee ID
								</label>
								<input
									id="empId"
									type="text"
									value={empId}
									onChange={(e) => setEmpId(e.target.value)}
									required
									className="w-full h-10 px-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300 text-sm"
									placeholder="e.g. emp-001"
								/>
							</div>

							<div className="space-y-1.5">
								<label htmlFor="signupEmail" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
									Official Company Email
								</label>
								<input
									id="signupEmail"
									type="email"
									value={signupEmail}
									onChange={(e) => setSignupEmail(e.target.value)}
									required
									className="w-full h-10 px-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300 text-sm"
									placeholder="e.g. varshita@workflowglobal.com"
								/>
							</div>

							<div className="space-y-1.5">
								<label htmlFor="code" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
									Activation Code
								</label>
								<input
									id="code"
									type="text"
									value={code}
									onChange={(e) => setCode(e.target.value)}
									required
									className="w-full h-10 px-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300 text-sm"
									placeholder="REG-XXXXXX-XXX"
								/>
							</div>

							<div className="space-y-1.5">
								<label htmlFor="signupPassword" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
									Choose Password
								</label>
								<input
									id="signupPassword"
									type="password"
									value={signupPassword}
									onChange={(e) => setSignupPassword(e.target.value)}
									required
									className="w-full h-10 px-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300 text-sm"
									placeholder="••••••••"
								/>
							</div>

							<div className="space-y-1.5">
								<label htmlFor="confirmPassword" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
									Confirm Password
								</label>
								<input
									id="confirmPassword"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
									className="w-full h-10 px-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300 text-sm"
									placeholder="••••••••"
								/>
							</div>

							{signupError && (
								<div className="rounded-md bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3">
									<p className="text-xs text-red-700 dark:text-red-400">{signupError}</p>
								</div>
							)}

							<button
								type="submit"
								disabled={loading}
								className="w-full h-10 rounded-md bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-all shadow-sm text-sm"
							>
								{loading ? "Registering Account..." : "Register Now"}
							</button>

							<div className="text-center pt-2">
								<button 
									type="button"
									onClick={() => setIsSignUp(false)}
									className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 underline"
								>
									Back to Corporate Login
								</button>
							</div>
						</form>
					</div>
				) : activeTab === 'demo' ? (
					/* Demo Environment Card */
					<div className="space-y-4">
						<div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center">
							<p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
								💡 <strong>Demo Evaluation Mode:</strong> Log in as fictional characters sharing an interconnected database. Role switching is fully enabled in this mode.
							</p>
						</div>

						<div className="grid grid-cols-2 gap-3">
							{demoUsers.map((user) => (
								<button
									key={user.email}
									type="button"
									onClick={() => handleQuickDemoLogin(user)}
									disabled={loading}
									className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-left transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between h-28 group relative overflow-hidden"
								>
									<span className="absolute top-0 right-0 w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-bl-full -mr-3 -mt-3 group-hover:scale-110 transition-transform duration-200" />
									<div className="relative z-10">
										<p className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">
											{user.name}
										</p>
										<p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mt-0.5">
											{user.role}
										</p>
									</div>
									<div className="relative z-10 mt-auto flex items-center justify-between w-full">
										<span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[80%]">
											{user.email}
										</span>
										<span className="text-zinc-400 dark:text-zinc-500 font-bold group-hover:translate-x-1 transition-transform">
											→
										</span>
									</div>
								</button>
							))}
						</div>

						{error && (
							<div className="rounded-md bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3">
								<p className="text-sm text-red-700 dark:text-red-400">{error}</p>
							</div>
						)}
					</div>
				) : (
					/* Corporate Portal Form */
					<div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
						<div className="mb-4">
							<h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
								Corporate Sign In
							</h2>
							<p className="text-xs text-zinc-500 mt-1">
								Role switching is disabled for real corporate employees.
							</p>
						</div>

						<form onSubmit={onSubmit} className="space-y-4">
							<div className="space-y-1.5">
								<label htmlFor="email" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
									Corporate Email
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
										className="w-full h-10 pl-10 pr-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300"
										placeholder="you@workflowglobal.com"
									/>
								</div>
							</div>

							<div className="space-y-1.5">
								<label htmlFor="password" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
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
										className="w-full h-10 pl-10 pr-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300"
										placeholder="••••••••"
									/>
								</div>
							</div>

							{error && (
								<div className="rounded-md bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3">
									<p className="text-sm text-red-700 dark:text-red-400">{error}</p>
								</div>
							)}

							<button
								type="submit"
								disabled={loading}
								className="w-full h-10 rounded-md bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-all shadow-sm text-sm"
							>
								{loading ? "Signing in..." : "Sign In"}
							</button>

							<div className="flex justify-between items-center pt-2">
								<button 
									type="button"
									onClick={() => {
										setIsSignUp(true);
										setEmpId("");
										setSignupEmail("");
										setCode("");
										setSignupPassword("");
										setConfirmPassword("");
										setSignupError(null);
									}}
									className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 underline"
								>
									Register profile
								</button>
								<button 
									type="button"
									onClick={() => alert("Please contact IT support or HR to recover your password.")}
									className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 underline"
								>
									Forgot Password?
								</button>
							</div>
						</form>
					</div>
				)}

				{/* Footer */}
				<div className="mt-8 text-center">
					<p className="text-[10px] text-zinc-400 dark:text-zinc-500">
						Protected Environment. Unauthorized access is strictly prohibited.
					</p>
				</div>
			</div>
		</div>
	);
}
