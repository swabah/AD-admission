import React from "react";

interface StatCardProps {
	label: string;
	value: number;
	icon: React.ElementType;
	accentClass: string;
	bgAccentClass: string;
}

export const StatCard = ({
	label,
	value,
	icon: Icon,
	accentClass,
	bgAccentClass,
}: StatCardProps) => (
	<div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col gap-3 shadow-sm hover:shadow-sm transition-all relative overflow-hidden group">
		<div className={`absolute top-0 left-0 w-1 h-full ${bgAccentClass}`}></div>
		<div className="flex justify-between items-start pl-2">
			<div
				className={`w-10 h-10 rounded-xl ${bgAccentClass} ${accentClass} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
			>
				<Icon className="w-5 h-5" />
			</div>
		</div>
		<div className="pl-2">
			<div className="font-display text-3xl text-slate-800 leading-none font-medium mb-1">
				{value}
			</div>
			<div className="font-sans text-xs text-slate-500 font-semibold tracking-wide uppercase">
				{label}
			</div>
		</div>
	</div>
);

export default StatCard;
