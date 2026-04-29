import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ChevronRight, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import logo from "../../assets/logo.jpg";
import { authenticateAdmin } from "../../services/supabase";
import { loginSchema, type LoginFormData } from "../../utils/formSchema";

interface LoginScreenProps {
	onLogin: () => void;
	onLoading: (loading: boolean) => void;
}

export const LoginScreen = ({ onLogin, onLoading }: LoginScreenProps) => {
	const [shake, setShake] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const triggerShake = () => {
		setShake(true);
		setTimeout(() => setShake(false), 500);
	};

	const onSubmit = async (data: LoginFormData) => {
		setError(null);
		onLoading(true);
		try {
			const result = await authenticateAdmin(data.email, data.password);
			if (result.success) {
				onLogin();
			} else {
				setError(result.error || "Invalid credentials");
				triggerShake();
			}
		} catch {
			setError("Auth failed. Check connection.");
			triggerShake();
		} finally {
			onLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4 sm:p-6 overflow-hidden">
			{/* Decorative elements kept subtle */}
			<div className="absolute inset-0 pointer-events-none opacity-40">
				<div className="absolute top-0 right-0 w-64 h-64 bg-[#0a1628] rounded-full blur-[100px] -mr-32 -mt-32" />
				<div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c8922a] rounded-full blur-[100px] -ml-32 -mb-32" />
			</div>

			<div 
				className={`relative z-10 bg-white rounded-2xl border border-slate-100 p-8 sm:p-10 w-full max-w-[380px] shadow-2xl shadow-slate-200/50 transition-all ${
					shake ? 'animate-[shake_0.5s_ease-in-out]' : ''
				}`}
			>
				<div className="text-center mb-8">
					<div className="mb-4 inline-block p-1 bg-white rounded-xl shadow-lg border border-slate-50">
						<img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
					</div>
					<h2 className="font-display text-2xl text-[#0a1628] font-bold tracking-tight">Admin Login</h2>
					<p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
						Ahlussuffa Admission
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					{(error || errors.email || errors.password) && (
						<div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[11px] font-bold flex items-center gap-2 animate-in fade-in zoom-in-95">
							<AlertCircle className="w-3.5 h-3.5 shrink-0" />
							{error || errors.email?.message || errors.password?.message}
						</div>
					)}

					<div className="space-y-1.5">
						<Label htmlFor="email" className="text-[9px] uppercase font-black tracking-[0.1em] text-slate-400 ml-1">
							Email Address
						</Label>
						<div className="relative">
							<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
							<Input
								id="email"
								type="email"
								{...register("email")}
								placeholder="admin@ahlussuffa.com"
								disabled={isSubmitting}
								className="pl-11 h-11 rounded-xl bg-slate-50/50 focus:bg-white border-slate-100 focus:border-[#0a1628] transition-all text-sm font-medium"
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="password" className="text-[9px] uppercase font-black tracking-[0.1em] text-slate-400 ml-1">
							Password
						</Label>
						<div className="relative">
							<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
							<Input
								id="password"
								type="password"
								{...register("password")}
								placeholder="••••••••"
								disabled={isSubmitting}
								className="pl-11 h-11 rounded-xl bg-slate-50/50 focus:bg-white border-slate-100 focus:border-[#0a1628] transition-all text-sm font-medium"
							/>
						</div>
					</div>

					<Button
						type="submit"
						loading={isSubmitting}
						disabled={isSubmitting}
						className="w-full h-11 bg-[#0a1628] hover:bg-[#132238] text-white font-bold rounded-xl shadow-lg shadow-[#0a1628]/10 group transition-all mt-2"
					>
						{isSubmitting ? "Authenticating..." : "Sign In"}
						{!isSubmitting && <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />}
					</Button>
				</form>

				<div className="text-center mt-8 pt-6 border-t border-slate-50">
					<p className="text-[9px] text-slate-300 uppercase font-black tracking-[0.2em]">
						Authorized Personnel Only
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginScreen;
