import React from "react";
import { Menu, Download, Printer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminTopbarProps {
	onMenuClick: () => void;
	onExportCSV: () => void;
	onExportPDF: () => void;
	onRefresh: () => void;
	isLoading: boolean;
	processingAction: string | null;
}

export const AdminTopbar = ({
	onMenuClick,
	onExportCSV,
	onExportPDF,
	onRefresh,
	isLoading,
	processingAction,
}: AdminTopbarProps) => (
	<header className="shrink-0 bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between z-10 shadow-sm">
		<div className="flex items-center gap-4">
			<button
				type="button"
				className="p-2 -ml-2 text-slate-500 hover:text-[#0a1628] hover:bg-slate-100 rounded-lg lg:hidden"
				onClick={onMenuClick}
			>
				<Menu className="w-6 h-6" />
			</button>
			<h1 className="font-display text-2xl font-bold text-[#0a1628] hidden sm:block">
				Dashboard
			</h1>
		</div>
		<div className="flex items-center gap-3">
			<button
				type="button"
				onClick={onExportCSV}
				className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0a1628] bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-colors"
			>
				<Download className="w-4 h-4" /> CSV
			</button>
			<button
				type="button"
				onClick={onExportPDF}
				disabled={processingAction !== null}
				className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0a1628] bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-colors disabled:opacity-50"
			>
				<Printer className="w-4 h-4" />{" "}
				{processingAction === "bulk-download" ? "..." : "Bulk PDF"}
			</button>
			<Button
				type="button"
				onClick={onRefresh}
				loading={isLoading}
				disabled={isLoading}
				className="flex items-center gap-2 bg-[#0a1628] hover:bg-[#132238] text-white rounded-lg shadow-sm"
			>
				<RefreshCw className="w-4 h-4" /> Refresh
			</Button>
		</div>
	</header>
);

export default AdminTopbar;
