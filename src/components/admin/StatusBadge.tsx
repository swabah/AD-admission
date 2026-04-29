import { Badge } from "../ui/badge";

export const STATUS_CFG: Record<string, { label: string; variant: "submitted" | "reviewing" | "approved" | "rejected" }> = {
	submitted: { label: "Submitted", variant: "submitted" },
	reviewing: { label: "Reviewing", variant: "reviewing" },
	approved: { label: "Approved", variant: "approved" },
	rejected: { label: "Rejected", variant: "rejected" },
};

export const StatusBadge = ({ status }: { status: string }) => {
	const cfg = STATUS_CFG[status] || STATUS_CFG.submitted;
	return (
		<Badge variant={cfg.variant} className="gap-1.5 font-sans text-[11px] font-medium px-2.5 py-1 border-none shadow-sm">
			<span className="w-1.5 h-1.5 rounded-full bg-current" />
			{cfg.label}
		</Badge>
	);
};

export default StatusBadge;
