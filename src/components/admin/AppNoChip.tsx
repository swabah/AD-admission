import { Badge } from "../ui/badge";

export const AppNoChip = ({ value }: { value: string }) => (
	<Badge variant="outline" className="font-mono text-[11px] font-medium bg-[#0a1628] text-[#c8922a] px-2 py-1 rounded tracking-wide whitespace-nowrap shadow-sm border-none">
		{value}
	</Badge>
);

export default AppNoChip;
