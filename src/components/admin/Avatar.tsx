import { Avatar as ShadcnAvatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const Avatar = ({ name, src }: { name: string, src?: string | null }) => {
	const initials = (name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
	const hue = (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
	return (
		<ShadcnAvatar className="w-[34px] h-[34px] shadow-sm">
			{src && <AvatarImage src={src} />}
			<AvatarFallback 
				style={{ background: `hsl(${hue}, 55%, 88%)`, color: `hsl(${hue}, 55%, 30%)` }}
				className="font-sans text-xs font-semibold"
			>
				{initials}
			</AvatarFallback>
		</ShadcnAvatar>
	);
};

export default Avatar;
