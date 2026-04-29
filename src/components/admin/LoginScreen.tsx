import { useState } from "react";
import { Lock, ChevronRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
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

	const attempt = async () => {
		if (!email.trim() || !password.trim()) {
			setError("Please enter email and password");
			setShake(true);
			setTimeout(() => setShake(false), 500);
			return;
		}

		setIsLoading(true);
		setError(null);
		onLoading(true);

		try {
			const result = await authenticateAdmin(email, password);

			if (result.success) {
				onLogin();
			} else {
				setError(result.error || "Invalid email or password");
				setShake(true);
				setTimeout(() => setShake(false), 500);
			}
		} catch {
			setError("Authentication failed. Please try again.");
			setShake(true);
			setTimeout(() => setShake(false), 500);
		} finally {
			setIsLoading(false);
			onLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] font-sans relative overflow-hidden">
			<div className="absolute inset-0 pointer-events-none z-0">
				<div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#1e3a5f] opacity-20 blur-3xl" />
				<div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#c8922a] opacity-20 blur-3xl" />
			</div>

			<div className={`relative z-10 bg-white rounded-3xl border border-slate-200 p-12 w-full max-w-md shadow-sm animate-in fade-in slide-in-from-bottom-8 ${shake ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
				<div className="text-center mb-8">
					<div className="w-16 h-16 rounded-full bg-[#0a1628] mx-auto mb-4 flex items-center justify-center border-4 border-[#c8922a] overflow-hidden shadow-sm">
						<img src={logo} alt="Logo" className="w-full h-full object-cover filter invert brightness-0" />
					</div>
					<h2 className="font-display text-2xl text-[#0a1628] mb-1">Admin Portal</h2>
					<p className="text-sm text-slate-500">Ahlussuffa Dars · Admission System</p>
				</div>

				<div className="space-y-4">
					{error && (
						<div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-medium">
							{error}
						</div>
					)}
					<div className="relative">
						<div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
							<Mail className="w-5 h-5" />
						</div>
						<input
							type="email"
							value={email}
							placeholder="Enter admin email"
							onChange={e => setEmail(e.target.value)}
							onKeyDown={e => e.key === "Enter" && !isLoading && attempt()}
							disabled={isLoading}
							className="w-full pl-12 pr-4 py-3 font-sans text-sm border-2 border-slate-100 rounded-xl outline-none bg-slate-50 text-slate-800 focus:border-[#0a1628] focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						/>
					</div>
					<div className="relative">
						<div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
							<Lock className="w-5 h-5" />
						</div>
						<input
							type="password"
							value={password}
							placeholder="Enter password"
							onChange={e => setPassword(e.target.value)}
							onKeyDown={e => e.key === "Enter" && !isLoading && attempt()}
							disabled={isLoading}
							className="w-full pl-12 pr-4 py-3 font-sans text-sm border-2 border-slate-100 rounded-xl outline-none bg-slate-50 text-slate-800 focus:border-[#0a1628] focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						/>
					</div>
					<Button
						type="button"
						onClick={attempt}
						loading={isLoading}
						disabled={isLoading}
						className="w-full py-3 bg-[#0a1628] hover:bg-[#132238] text-white font-sans text-sm font-medium rounded-xl shadow-sm"
					>
						{isLoading ? "Authenticating..." : "Sign In"}
						<ChevronRight className="w-4 h-4" />
					</Button>
				</div>
				<div className="text-center mt-6 text-xs text-slate-400 uppercase tracking-widest font-semibold">
					Authorised personnel only
				</div>
			</div>
		</div>
	);
};

export default LoginScreen;
