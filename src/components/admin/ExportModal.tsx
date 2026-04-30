import React, { useState } from "react";
import { X, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportModalProps {
	isOpen: boolean;
	onClose: () => void;
	onExportCSV: (department: string) => void;
	onBulkPrint: (department: string) => void;
	processingAction: string | null;
	bulkPrintReady: boolean;
}

export const ExportModal = ({
	isOpen,
	onClose,
	onExportCSV,
	onBulkPrint,
	processingAction,
	bulkPrintReady,
}: ExportModalProps) => {
	const [department, setDepartment] = useState("all");

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
				<div className="flex items-center justify-between p-6 border-b border-slate-100">
					<h3 className="text-lg font-bold text-slate-800">Export Applications</h3>
					<button
						onClick={onClose}
						className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
				<div className="p-6 space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-semibold text-slate-700">
							Select Department
						</label>
						<select
							className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#0a1628] transition-colors font-medium text-slate-700"
							value={department}
							onChange={(e) => setDepartment(e.target.value)}
						>
							<option value="all">All Departments</option>
							<option value="Root Exc">Root Exc</option>
							<option value="HS">HS</option>
							<option value="BS">BS</option>
							<option value="N/A">N/A</option>
						</select>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
						<Button
							type="button"
							variant="outline"
							onClick={() => onExportCSV(department)}
							className="flex-1 flex items-center justify-center gap-2"
						>
							<Download className="w-4 h-4" /> Export CSV
						</Button>
						<Button
							type="button"
							onClick={() => onBulkPrint(department)}
							disabled={processingAction !== null && processingAction !== "bulk-print"}
							className={`flex-1 flex items-center justify-center gap-2 ${bulkPrintReady ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-[#0a1628] hover:bg-[#132238] text-white"}`}
						>
							<Printer className="w-4 h-4" />{" "}
							{processingAction === "bulk-print" ? "Cooking..." : bulkPrintReady ? "Ready to Print" : "Bulk Print"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ExportModal;
