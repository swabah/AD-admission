import React from "react";
import { Users, Clock, Eye, Check } from "lucide-react";
import { StatCard } from "./StatCard";
import { AdminStatsSkeleton } from "./AdminSkeleton";
import type { ApplicationData } from "@/services/supabase";

interface AdminSummaryStatsProps {
	applications: ApplicationData[];
	isLoading: boolean;
}

export const AdminSummaryStats = ({ applications, isLoading }: AdminSummaryStatsProps) => {
	if (isLoading) return <AdminStatsSkeleton />;

	const stats = [
		{
			label: "Total Applications",
			value: applications.length,
			icon: Users,
			accentClass: "text-blue-600",
			bgAccentClass: "bg-blue-100",
		},
		{
			label: "Pending Review",
			value: applications.filter(
				(a) => !a.status || a.status === "submitted",
			).length,
			icon: Clock,
			accentClass: "text-amber-600",
			bgAccentClass: "bg-amber-100",
		},
		{
			label: "Under Review",
			value: applications.filter((a) => a.status === "reviewing").length,
			icon: Eye,
			accentClass: "text-purple-600",
			bgAccentClass: "bg-purple-100",
		},
		{
			label: "Approved",
			value: applications.filter((a) => a.status === "approved").length,
			icon: Check,
			accentClass: "text-emerald-600",
			bgAccentClass: "bg-emerald-100",
		},
	];

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
			{stats.map((s) => (
				<StatCard key={s.label} {...s} />
			))}
		</div>
	);
};

export default AdminSummaryStats;
