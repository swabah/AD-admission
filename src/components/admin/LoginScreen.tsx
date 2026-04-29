import { useState } from "react";
import { Lock, ChevronRight, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import logo from "../../assets/logo.jpg";
import { authenticateAdmin } from "../../services/supabase";

interface LoginScreenProps {
	onLogin: () => void;
	onLoading: (loading: boolean) => void;
}

export const LoginScreen = ({ onLogin, onLoading }: LoginScreenProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [shake, setShake] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const validateForm = () => {
		if (!email.trim()) {
			setError("Admin email is required");
			return false;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Please enter a valid email address");
			return false;
		}
		if (!password.trim()) {
			setError("Password is required");
			return false;
		}
		return true;
	};

	const triggerShake = () => {
		setShake(true);
		setTimeout(() => setShake(false), 500);
	};

	const attempt = async () => {
		if (isLoading) return;

		setError(null);
		if (!validateForm()) {
			triggerShake();
			return;
		}

		setIsLoading(true);
		onLoading(true);

		try {
			const result = await authenticateAdmin(email, password);

			if (result.success) {
				onLogin();
			} else {
				setError(result.error || "Invalid email or password");
				triggerShake();
			}
		} catch {
			setError("Authentication failed. Please check your connection.");
			triggerShake();
		} finally {
			setIsLoading(false);
			onLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] font-sans relative overflow-hidden">
			{/* Decorative Elements */}
			<div className="absolute inset-0 pointer-events-none z-0">
				<div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#1e3a5f] opacity-10 blur-3xl" />
				<div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#c8922a] opacity-10 blur-3xl" />
			</div>

			<div 
				className={`relative z-10 bg-white rounded-[2rem] border border-slate-100 p-10 md:p-14 w-full max-w-md shadow-2xl shadow-[#0a1628]/5 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 ${
					shake ? 'animate-[shake_0.5s_ease-in-out]' : ''
				}`}
			>
				<div className="text-center mb-10">
					<div className="mb-8 p-1.5 rounded-2xl bg-white shadow-xl shadow-[#c8922a]/10 inline-block">
						<img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
					</div>
					<h2 className="font-display text-3xl text-[#0a1628] font-bold mb-2 tracking-tight">Admin Portal</h2>
					<p className="text-sm text-slate-400 font-medium uppercase tracking-[0.2em] text-[10px]">
						Ahlussuffa Admission System
					</p>
				</div>

				<div className="space-y-6">
					{error && (
						<div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
							<AlertCircle className="w-4 h-4 shrink-0" />
							{error}
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">
							Email Address
						</Label>
						<div className="relative group">
							<div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0a1628] transition-colors z-10">
								<Mail className="w-4 h-4" />
							</div>
							<Input
								id="email"
								type="email"
								value={email}
								placeholder="admin@ahlussuffa.com"
								onChange={e => setEmail(e.target.value)}
								onKeyDown={e => e.key === "Enter" && attempt()}
								disabled={isLoading}
								className="pl-12 h-14 rounded-2xl bg-slate-50/50 focus:bg-white border-2 border-transparent focus:border-[#0a1628] transition-all text-sm font-medium"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password" className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">
							Password
						</Label>
						<div className="relative group">
							<div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0a1628] transition-colors z-10">
								<Lock className="w-4 h-4" />
							</div>
							<Input
								id="password"
								type="password"
								value={password}
								placeholder="••••••••"
								onChange={e => setPassword(e.target.value)}
								onKeyDown={e => e.key === "Enter" && attempt()}
								disabled={isLoading}
								className="pl-12 h-14 rounded-2xl bg-slate-50/50 focus:bg-white border-2 border-transparent focus:border-[#0a1628] transition-all text-sm font-medium"
							/>
						</div>
					</div>

					<Button
						type="button"
						onClick={attempt}
						loading={isLoading}
						className="w-full h-14 bg-[#0a1628] hover:bg-[#132238] text-white font-bold rounded-2xl shadow-lg shadow-[#0a1628]/10 group transition-all"
					>
						{isLoading ? "Authenticating..." : "Sign In to Dashboard"}
						{!isLoading && <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
					</Button>
				</div>

				<div className="text-center mt-10">
					<p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
						Authorised Access Only
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginScreen;
