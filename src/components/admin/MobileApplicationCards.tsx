import { Eye, Printer, Download, Share2, Trash2, MoreVertical } from "lucide-react";
import { AppNoChip } from "./AppNoChip";
import { Avatar } from "./Avatar";
import { STATUS_CFG } from "./StatusBadge";
import type { ApplicationData } from "../../services/supabase";

interface MobileApplicationCardsProps {
	applications: ApplicationData[];
	selectedApps: string[];
	dropdownOpen: string | null;
	dropdownPos: { top: number; left: number };
	onSelectAll: () => void;
	onSelectOne: (id: string) => void;
	onView: (app: ApplicationData) => void;
	onPrint: (app: ApplicationData) => void;
	onDownload: (app: ApplicationData) => void;
	onShare: (app: ApplicationData) => void;
	onDelete: (id: string, photoUrl?: string | null) => void;
	onStatusChange: (id: string, status: string) => void;
	onDropdownOpen: (id: string, rect: DOMRect) => void;
	onDropdownClose: () => void;
}

export const MobileApplicationCards = ({
	applications,
	selectedApps,
	dropdownOpen,
	dropdownPos,
	onSelectAll,
	onSelectOne,
	onView,
	onPrint,
	onDownload,
	onShare,
	onDelete,
	onStatusChange,
	onDropdownOpen,
	onDropdownClose,
}: MobileApplicationCardsProps) => {
	return (
		<div className="md:hidden flex flex-col gap-4 p-4">
			<div className="flex items-center justify-between">
				<label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
					<input
						type="checkbox"
						className="w-5 h-5 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628]"
						checked={selectedApps.length === applications.length && applications.length > 0}
						onChange={onSelectAll}
					/>
					Select All {applications.length > 0 && `(${applications.length})`}
				</label>
			</div>
			{applications.map(app => {
				const id = app.id!;
				const name = `${app.firstName || ""} ${app.lastName || ""}`.trim();
				const status = app.status || "submitted";
				const isSelected = selectedApps.includes(id);

				return (
					<div
						key={id}
						className={`flex flex-col bg-white border rounded-2xl p-4 shadow-sm relative transition-all ${isSelected ? "border-blue-400 bg-blue-50/50 ring-2 ring-blue-100" : "border-slate-200"}`}
					>
						<div className="flex justify-between items-start mb-4">
							<div className="flex items-center gap-3">
								<input
									type="checkbox"
									className="w-5 h-5 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628]"
									checked={isSelected}
									onChange={() => onSelectOne(id)}
								/>
								<AppNoChip value={app.appNo || "—"} />
							</div>
							<div className="action-dropdown">
								<button
									type="button"
									onClick={e => {
										if (dropdownOpen === id) {
											onDropdownClose();
											return;
										}
										const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
										onDropdownOpen(id, r);
									}}
									className="p-1.5 text-slate-400 hover:text-[#0a1628] hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
								>
									<MoreVertical className="w-5 h-5" />
								</button>
								{dropdownOpen === id && (
									<div
										className="fixed z-50 w-48 bg-white border border-slate-200 rounded-xl shadow-sm py-1 animate-in fade-in zoom-in-95"
										style={{ top: dropdownPos.top, left: dropdownPos.left }}
									>
										<button
											type="button"
											onClick={() => { onView(app); onDropdownClose(); }}
											className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0a1628] font-medium transition-colors"
										>
											<Eye className="w-4 h-4 text-slate-400" /> View Details
										</button>
										<button
											type="button"
											onClick={() => { onPrint(app); onDropdownClose(); }}
											className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0a1628] font-medium transition-colors"
										>
											<Printer className="w-4 h-4 text-slate-400" /> Print Form
										</button>
										<button
										type="button"
											onClick={() => { onDownload(app); onDropdownClose(); }}
											className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0a1628] font-medium transition-colors"
										>
											<Download className="w-4 h-4 text-slate-400" /> Download PDF
										</button>
										<button
										type="button"
											onClick={() => { onShare(app); onDropdownClose(); }}
											className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0a1628] font-medium transition-colors"
										>
											<Share2 className="w-4 h-4 text-slate-400" /> Share Link
										</button>
										<div className="h-px bg-slate-100 my-1"></div>
										<button
										type="button"
											onClick={() => { onDelete(id, app.photoUrl); onDropdownClose(); }}
											className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
										>
											<Trash2 className="w-4 h-4 text-red-400" /> Delete Application
										</button>
									</div>
								)}
							</div>
						</div>

						<div className="flex items-center gap-4 mb-4">
							<Avatar name={name || "?"} />
							<div>
								<div className="font-bold text-[#0a1628] text-base">{name}</div>
								<div className="text-sm text-slate-500 font-medium mt-0.5">{app.fatherPhone || "—"}</div>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
							<div>
								<div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Class</div>
								<div className="font-semibold text-slate-800">{app.applyClass}</div>
							</div>
							<div>
								<div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Year</div>
								<div className="font-mono text-sm font-semibold text-slate-600">{app.academicYear}</div>
							</div>
							<div>
								<div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Date</div>
								<div className="font-mono text-sm font-semibold text-slate-600">
									{app.submissionDate ? new Date(app.submissionDate as string).toLocaleDateString("en-IN") : "—"}
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
							<span className="text-xs font-bold text-slate-400 uppercase">Status</span>
							<select
								value={status}
								onChange={e => onStatusChange(id, e.target.value)}
								className={`text-xs font-bold rounded-full px-4 py-2 border-0 cursor-pointer outline-none transition-transform hover:scale-105 appearance-none text-center ${STATUS_CFG[status]?.bgClass} ${STATUS_CFG[status]?.textClass}`}
							>
								<option value="submitted">Submitted</option>
								<option value="reviewing">Reviewing</option>
								<option value="approved">Approved</option>
								<option value="rejected">Rejected</option>
							</select>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default MobileApplicationCards;
