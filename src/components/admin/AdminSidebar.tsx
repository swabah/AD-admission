import { Users, Clock, Eye, Check, Download, RefreshCw, LogOut, Printer } from "lucide-react";
import logo from "../../assets/logo.jpg";
import type { ApplicationData } from "../../services/supabase";
import { Button } from "../ui/button";

interface AdminSidebarProps {
	applications: ApplicationData[];
	onExport: () => void;
	onExportPDF: () => void;
	onRefresh: () => void;
	onLogout: () => void;
	mobileMenuOpen?: boolean;
}

const StatItem = ({ label, value, icon: Icon, accentClass, bgAccentClass }: {
	label: string; value: number; icon: React.ElementType; accentClass: string; bgAccentClass: string;
}) => (
	<div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
		<div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgAccentClass} ${accentClass} group-hover:scale-110 transition-transform`}>
			<Icon className="w-5 h-5" />
		</div>
		<div>
			<div className="font-display text-lg text-white font-medium leading-none mb-1">{value}</div>
			<div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">{label}</div>
		</div>
	</div>
);

export const AdminSidebar = ({ applications, onExport, onExportPDF, onRefresh, onLogout, mobileMenuOpen }: AdminSidebarProps) => {
	const stats = [
		{ label: "Total Applications", value: applications.length, icon: Users, accentClass: "text-blue-600", bgAccentClass: "bg-blue-100" },
		{ label: "Pending Review", value: applications.filter(a => !a.status || a.status === "submitted").length, icon: Clock, accentClass: "text-amber-600", bgAccentClass: "bg-amber-100" },
		{ label: "Under Review", value: applications.filter(a => a.status === "reviewing").length, icon: Eye, accentClass: "text-purple-600", bgAccentClass: "bg-purple-100" },
		{ label: "Approved", value: applications.filter(a => a.status === "approved").length, icon: Check, accentClass: "text-emerald-600", bgAccentClass: "bg-emerald-100" },
	];

	return (
		<aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#0a1628] to-[#132238] shadow-sm transform transition-transform duration-300 flex flex-col ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:static"}`}>
			<div className="p-8 border-b border-white/10">
				<div className="mb-6 bg-white p-1.5 rounded-2xl w-fit shadow-xl shadow-black/20">
					<img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
				</div>
				<h2 className="font-display text-2xl text-white font-bold leading-tight">Ahlussuffa Dars</h2>
				<p className="text-xs text-white/50 mt-1 uppercase tracking-wider font-semibold">Admission Portal</p>
			</div>

			<div className="flex-1 overflow-y-auto p-4 space-y-2">
				{stats.map(s => <StatItem key={s.label} {...s} />)}
			</div>

			<div className="p-4 border-t border-white/10 space-y-1">
			<div className="p-4 border-t border-white/10 space-y-2">
				<Button 
					variant="ghost" 
					onClick={onExport} 
					className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10"
				>
					<Download className="w-4 h-4" /> Export CSV
				</Button>
				<Button 
					variant="ghost" 
					onClick={onExportPDF} 
					className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10"
				>
					<Printer className="w-4 h-4" /> Export Bulk PDF
				</Button>
				<Button 
					variant="ghost" 
					onClick={onRefresh} 
					className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10"
				>
					<RefreshCw className="w-4 h-4" /> Refresh Data
				</Button>
				<Button 
					variant="ghost" 
					onClick={onLogout} 
					className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-4"
				>
					<LogOut className="w-4 h-4" /> Sign Out
				</Button>
			</div>
			</div>
		</aside>
	);
};

export default AdminSidebar;
