import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";

const NotFound = () => {
	return (
		<div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
			<div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
				<div className="relative">
					<div className="text-9xl font-display font-black text-[#0a1628]/5 select-none">404</div>
					<div className="absolute inset-0 flex items-center justify-center">
						<AlertCircle className="w-20 h-20 text-[#c8922a] animate-bounce" />
					</div>
				</div>
				
				<div className="space-y-3">
					<h1 className="text-3xl font-display font-bold text-[#0a1628]">Page Not Found</h1>
					<p className="text-slate-500 font-medium leading-relaxed">
						The page you&apos;re looking for doesn&apos;t exist or has been moved to a new location.
					</p>
				</div>

				<Button asChild className="bg-[#0a1628] hover:bg-[#132238] text-white px-8 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-[#0a1628]/10 transition-all hover:-translate-y-1">
					<Link to="/">
						<Home className="w-5 h-5 mr-2" /> Back Home
					</Link>
				</Button>
			</div>
		</div>
	);
};

export default NotFound;
