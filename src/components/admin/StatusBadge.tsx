export const STATUS_CFG: Record<string, { label: string; textClass: string; bgClass: string; dotClass: string }> = {
	submitted: { label: "Submitted", textClass: "text-blue-600", bgClass: "bg-blue-100", dotClass: "bg-blue-600" },
	reviewing: { label: "Reviewing", textClass: "text-purple-600", bgClass: "bg-purple-100", dotClass: "bg-purple-600" },
	approved: { label: "Approved", textClass: "text-emerald-600", bgClass: "bg-emerald-100", dotClass: "bg-emerald-600" },
	rejected: { label: "Rejected", textClass: "text-red-600", bgClass: "bg-red-100", dotClass: "bg-red-600" },
};

export const StatusBadge = ({ status }: { status: string }) => {
	const cfg = STATUS_CFG[status] || STATUS_CFG.submitted;
	return (
		<span className={`inline-flex items-center gap-1.5 font-sans text-[11px] font-medium px-2.5 py-1 rounded-full ${cfg.textClass} ${cfg.bgClass}`}>
			<span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
			{cfg.label}
		</span>
	);
};

export default StatusBadge;
