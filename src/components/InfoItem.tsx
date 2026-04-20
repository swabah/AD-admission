/**
 * InfoItem Component
 * Shared component for displaying label-value pairs
 */

const font = {
  sans: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

interface InfoItemProps {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}

const InfoItem = ({ label, value, mono }: InfoItemProps) => {
  if (!value || value === "—") return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{
        fontFamily: font.sans, fontSize: 10, fontWeight: 500,
        letterSpacing: 0.8, textTransform: "uppercase" as const,
        color: "#6b7280",
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: mono ? font.mono : font.sans,
        fontSize: 13, fontWeight: 500, color: "#111827",
      }}>
        {value}
      </span>
    </div>
  );
};

export default InfoItem;
