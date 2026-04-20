/**
 * InfoItem Component
 * Shared component for displaying label-value pairs
 */

interface InfoItemProps {
  label: string;
  value: string | null | undefined;
}

const InfoItem = ({ label, value }: InfoItemProps) => {
  if (!value || value === "—") return null;

  return (
    <div className="info-item">
      <div className="info-label">{label}</div>
      <span>{value}</span>
    </div>
  );
};

export default InfoItem;
