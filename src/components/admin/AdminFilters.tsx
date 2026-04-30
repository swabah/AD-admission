import React from "react";
import { Search, ArrowUpAZ, ArrowDownAZ } from "lucide-react";

interface AdminFiltersProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	statusFilter: string;
	onStatusChange: (value: string) => void;
	classFilter: string;
	onClassChange: (value: string) => void;
	departmentFilter: string;
	onDepartmentChange: (value: string) => void;
	sortBy: string;
	onSortByChange: (value: string) => void;
	sortOrder: "asc" | "desc";
	onSortOrderToggle: () => void;
	uniqueClasses: string[];
}

export const AdminFilters = ({
	searchTerm,
	onSearchChange,
	statusFilter,
	onStatusChange,
	classFilter,
	onClassChange,
	departmentFilter,
	onDepartmentChange,
	sortBy,
	onSortByChange,
	sortOrder,
	onSortOrderToggle,
	uniqueClasses,
}: AdminFiltersProps) => (
	<div className="flex flex-col lg:flex-row gap-4">
		<div className="relative flex-1">
			<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
			<input
				type="text"
				className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0a1628] focus:ring-1 focus:ring-[#0a1628] rounded-xl text-sm outline-none transition-all"
				placeholder="Search by name, app no, or father's name..."
				value={searchTerm}
				onChange={(e) => onSearchChange(e.target.value)}
			/>
		</div>
		<div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
			<select
				className="shrink-0 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#0a1628] transition-colors font-medium text-slate-700"
				value={statusFilter}
				onChange={(e) => onStatusChange(e.target.value)}
			>
				<option value="all">All Status</option>
				<option value="submitted">Submitted</option>
				<option value="reviewing">Reviewing</option>
				<option value="approved">Approved</option>
				<option value="rejected">Rejected</option>
				<option value="deleted">Trash / Deleted</option>
			</select>
			<select
				className="shrink-0 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#0a1628] transition-colors font-medium text-slate-700"
				value={classFilter}
				onChange={(e) => onClassChange(e.target.value)}
			>
				<option value="all">All Classes</option>
				{uniqueClasses.map((c) => (
					<option key={c} value={c}>
						{c}
					</option>
				))}
			</select>
			<select
				className="shrink-0 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#0a1628] transition-colors font-medium text-slate-700"
				value={departmentFilter}
				onChange={(e) => onDepartmentChange(e.target.value)}
			>
				<option value="all">All Departments</option>
				<option value="Root Exc">Root Exc</option>
				<option value="HS">HS</option>
				<option value="BS">BS</option>
				<option value="AD">AD</option>
				<option value="PG">PG</option>
				<option value="N/A">N/A</option>
			</select>
			<select
				className="shrink-0 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#0a1628] transition-colors font-medium text-slate-700"
				value={sortBy}
				onChange={(e) => onSortByChange(e.target.value)}
			>
				<option value="date">Date</option>
				<option value="name">Name</option>
				<option value="class">Class</option>
			</select>
			<button
				type="button"
				className="shrink-0 p-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
				onClick={onSortOrderToggle}
			>
				{sortOrder === "asc" ? (
					<ArrowUpAZ className="w-5 h-5" />
				) : (
					<ArrowDownAZ className="w-5 h-5" />
				)}
			</button>
		</div>
	</div>
);

export default AdminFilters;
