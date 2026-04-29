export const Avatar = ({ name }: { name: string }) => {
	const initials = (name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
	const hue = (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
	return (
		<div
			className="w-[34px] h-[34px] rounded-full shrink-0 flex items-center justify-center font-sans text-xs font-semibold shadow-sm"
			style={{ background: `hsl(${hue}, 55%, 88%)`, color: `hsl(${hue}, 55%, 30%)` }}
		>
			{initials}
		</div>
	);
};

export default Avatar;
