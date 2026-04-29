import { useRef } from "react";
import { Eye, Printer, Download, Share2, Trash2, MoreVertical } from "lucide-react";
import { AppNoChip } from "./AppNoChip";
import { Avatar } from "./Avatar";
import { STATUS_CFG } from "./StatusBadge";
import type { ApplicationData } from "../../services/supabase";

interface DesktopApplicationTableProps {
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

export const DesktopApplicationTable = ({
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
}: DesktopApplicationTableProps) => {
	const dropdownRef = useRef<HTMLDivElement>(null);

	return (
		<table className="hidden md:table w-full text-left border-collapse min-w-[800px]">
			<thead>
				<tr className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
					<th className="p-4 w-12 text-center">
						<input
							type="checkbox"
							className="w-4 h-4 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628]"
							checked={selectedApps.length === applications.length && applications.length > 0}
							onChange={onSelectAll}
						/>
					</th>
					<th className="p-4">App No.</th>
					<th className="p-4">Student Info</th>
					<th className="p-4">Class & Year</th>
					<th className="p-4">Status</th>
					<th className="p-4">Submitted Date</th>
					<th className="p-4 text-center w-16">Actions</th>
				</tr>
			</thead>
			<tbody className="divide-y divide-slate-100">
				{applications.map(app => {
					const id = app.id!;
					const name = `${app.firstName || ""} ${app.lastName || ""}`.trim();
					const status = app.status || "submitted";
					const isSelected = selectedApps.includes(id);

					return (
						<tr key={id} className={`group transition-colors hover:bg-slate-50 ${isSelected ? "bg-blue-50/30" : ""}`}>
							<td className="p-4 text-center">
								<input
									type="checkbox"
									className="w-4 h-4 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628]"
									checked={isSelected}
									onChange={() => onSelectOne(id)}
								/>
							</td>
							<td className="p-4">
								<AppNoChip value={app.appNo || "—"} />
							</td>
							<td className="p-4">
								<div className="flex items-center gap-3">
									<Avatar name={name || "?"} />
									<div>
										<div className="font-semibold text-[#0a1628] text-sm group-hover:text-blue-700 transition-colors">{name}</div>
										<div className="text-xs text-slate-500 font-medium mt-0.5">{app.fatherPhone || "—"}</div>
									</div>
								</div>
							</td>
							<td className="p-4">
								<div className="inline-flex flex-col">
									<span className="text-sm font-bold text-[#0a1628] bg-slate-100 px-2.5 py-0.5 rounded-md inline-block mb-1">{app.applyClass}</span>
									<span className="text-xs text-slate-400 font-mono tracking-wide">{app.academicYear}</span>
								</div>
							</td>
							<td className="p-4">
								<select
									value={status}
									onChange={e => onStatusChange(id, e.target.value)}
									className={`text-xs font-bold rounded-full px-3 py-1.5 border-0 cursor-pointer outline-none transition-transform hover:scale-105 appearance-none text-center ${STATUS_CFG[status]?.bgClass} ${STATUS_CFG[status]?.textClass}`}
								>
									<option value="submitted">Submitted</option>
									<option value="reviewing">Reviewing</option>
									<option value="approved">Approved</option>
									<option value="rejected">Rejected</option>
								</select>
							</td>
							<td className="p-4 text-sm text-slate-500 font-mono tracking-wide">
								{app.submissionDate ? new Date(app.submissionDate as string).toLocaleDateString("en-IN") : "—"}
							</td>
							<td className="p-4 text-center relative">
								<div className="action-dropdown" ref={dropdownRef}>
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
										className="p-1.5 text-slate-400 hover:text-[#0a1628] hover:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a1628]"
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
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default DesktopApplicationTable;
