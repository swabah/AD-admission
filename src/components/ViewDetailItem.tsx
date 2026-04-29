import React from "react";

interface ViewDetailItemProps {
	label: string;
	value?: string | null;
	fullWidth?: boolean;
}

export const ViewDetailItem = ({
	label,
	value,
	fullWidth = false,
}: ViewDetailItemProps) => (
	<div
		className={`form-group ${fullWidth ? "full" : ""}`}
		style={{ marginBottom: "16px" }}
	>
		<label
			style={{
				display: "block",
				fontSize: "11px",
				fontWeight: 600,
				textTransform: "uppercase",
				letterSpacing: "0.06em",
				color: "var(--text-muted)",
				marginBottom: "6px",
			}}
		>
			{label}
		</label>
		<div
			style={{
				padding: "12px 16px",
				background: "var(--bg)",
				borderRadius: "10px",
				border: "1px solid var(--card-border)",
				fontSize: "14px",
				color: value ? "var(--text)" : "var(--text-muted)",
				minHeight: "44px",
				display: "flex",
				alignItems: "center",
			}}
		>
			{value || "—"}
		</div>
	</div>
);

export default ViewDetailItem;
