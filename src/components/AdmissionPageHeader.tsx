import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import logo from "../assets/logo.jpg";

interface AdmissionPageHeaderProps {
	title: string;
	session: string;
	backLink?: string;
}

export const AdmissionPageHeader = ({
	title,
	session,
	backLink = "/apply",
}: AdmissionPageHeaderProps) => (
	<header className="sticky top-0 z-50 bg-[#0a1628]/95 backdrop-blur-md border-b border-[#c8922a]/20 py-3 sm:py-4 mb-8 sm:mb-12 shadow-xl shadow-[#0a1628]/10">
		<div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
			<div className="flex items-center gap-2.5 sm:gap-5">
				<div className="bg-white p-1 rounded-xl shadow-lg border border-white/20 shrink-0">
					<img
						src={logo}
						alt="Logo"
						className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
					/>
				</div>
				<div className="min-w-0">
					<h1 className="text-white text-base sm:text-2xl font-display font-bold leading-none mb-1 sm:mb-1.5 truncate">
						{title}
					</h1>
					<p className="text-[#c8922a] text-[8px] sm:text-[10px] uppercase font-bold tracking-[0.15em] truncate">
						Session {session}
					</p>
				</div>
			</div>
			<Link
				to={backLink}
				className="text-white/60 hover:text-white text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-colors group shrink-0"
			>
				<ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
				<span className="hidden xs:inline">
					Back <span className="hidden sm:inline">to Portal</span>
				</span>
			</Link>
		</div>
	</header>
);

export default AdmissionPageHeader;
