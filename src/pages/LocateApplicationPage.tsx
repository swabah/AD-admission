import { useState } from "react";
import { Link } from "react-router-dom";
import { searchApplicationsByPhoneAndDob } from "../services/supabase";
import {
	Search,
	ChevronLeft,
	FileText,
	AlertCircle,
	User,
	Printer,
	Download,
} from "lucide-react";
import logo from "../assets/logo.jpg";
import ApplicationPrintDocument from "../components/ApplicationPrintDocument";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "../components/ui/card";

import type { ApplicationData } from "../services/supabase";

type Application = ApplicationData & { id: string };

const LocateApplicationPage = () => {
	const [phone, setPhone] = useState("");
	const [dob, setDob] = useState("");
	const [applications, setApplications] = useState<Application[]>([]);
	const [selectedApp, setSelectedApp] = useState<Application | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searched, setSearched] = useState(false);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		setSearched(true);
		const normalizedPhone = phone
			.replace(/\s/g, "")
			.replace(/[-+()]/g, "")
			.replace(/^91/, "");
		try {
			const results = await searchApplicationsByPhoneAndDob(
				normalizedPhone,
				dob,
			);
			setApplications(results as Application[]);
			if (results.length === 0) setError("No records found.");
		} catch (err) {
			setError("Search failed. Try again.");
		} finally {
			setLoading(false);
		}
	};

	if (selectedApp) {
		return (
			<div className="min-h-screen bg-slate-50">
				<div className="bg-white border-b sticky top-0 z-50 px-6 py-4 flex justify-between items-center no-print">
					<Button variant="ghost" onClick={() => setSelectedApp(null)}>
						<ChevronLeft className="w-4 h-4 mr-2" /> Back
					</Button>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => window.print()}>
							<Printer className="w-4 h-4 mr-2" /> Print
						</Button>
						<Button onClick={() => alert("PDF Download in progress...")}>
							<Download className="w-4 h-4 mr-2" /> PDF
						</Button>
					</div>
				</div>
				<div className="container mx-auto py-8">
					<ApplicationPrintDocument
						app={selectedApp as any}
						showStatus={true}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			{/* Responsive Sticky Header */}
			<header className="sticky top-0 z-50 w-full bg-[#0a1628]/95 backdrop-blur-md border-b border-white/10 shadow-xl shadow-[#0a1628]/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="bg-white p-1 rounded-xl shadow-lg border border-white/20">
							<img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
						</div>
						<h1 className="text-white text-xl sm:text-2xl font-display font-bold truncate max-w-[150px] sm:max-w-none">
							Locate Application
						</h1>
					</div>
					<Link
						to="/apply"
						className="text-white/60 hover:text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors group"
					>
						<ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
						<span className="hidden sm:inline">Back to Portal</span>
						<span className="sm:hidden">Back</span>
					</Link>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
				<Card className="w-full max-w-2xl mx-auto mb-12 border-0 sm:border bg-white shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
					<CardHeader className="p-8 sm:p-12 pb-4">
						<CardTitle className="text-2xl sm:text-3xl font-display font-bold text-[#0a1628]">
							Verification
						</CardTitle>
						<CardDescription className="text-slate-500 font-medium text-base">
							Enter the registered phone number and student's date of birth.
						</CardDescription>
					</CardHeader>
					<CardContent className="p-8 sm:p-12 pt-0">
						<form onSubmit={handleSearch} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label htmlFor="tel" className="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">
										Phone Number
									</label>
									<Input
										type="tel"
										id="tel"
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
										placeholder="+91..."
										required
										className="h-14 rounded-2xl bg-slate-50/50 border-transparent focus:border-[#0a1628] focus:bg-white transition-all text-base font-medium pl-6"
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="date" className="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">
										Date of Birth
									</label>
									<Input
										type="date"
										id="date"
										value={dob}
										onChange={(e) => setDob(e.target.value)}
										required
										className="h-14 rounded-2xl bg-slate-50/50 border-transparent focus:border-[#0a1628] focus:bg-white transition-all text-base font-medium px-6"
									/>
								</div>
							</div>
							<Button type="submit" loading={loading} className="w-full h-14 bg-[#0a1628] hover:bg-[#132238] text-white font-bold rounded-2xl text-lg shadow-xl shadow-[#0a1628]/10 transition-all hover:-translate-y-1 mt-4">
								<Search className="w-5 h-5 mr-2" /> Search Records
							</Button>
						</form>
						{error && (
							<div className="mt-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
								<AlertCircle className="w-5 h-5 shrink-0" /> {error}
							</div>
						)}
					</CardContent>
				</Card>

				{searched && applications.length > 0 && (
					<div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-700">
						<div className="flex items-center justify-between px-2">
							<h3 className="font-display font-bold text-xl text-[#0a1628]">
								Search Results
							</h3>
							<Badge variant="outline" className="bg-white">{applications.length} Found</Badge>
						</div>
						<div className="grid grid-cols-1 gap-4">
							{applications.map((app) => (
								<Card
									key={app.id}
									className="group cursor-pointer hover:border-[#c8922a] hover:shadow-lg transition-all duration-300 rounded-[1.5rem] border-slate-100 bg-white"
									onClick={() => setSelectedApp(app)}
								>
									<CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
										<div className="flex items-center gap-5">
											<div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-[#c8922a]/10 group-hover:text-[#c8922a] transition-colors">
												<User className="w-7 h-7" />
											</div>
											<div>
												<div className="font-display font-bold text-lg text-[#0a1628]">
													{app.firstName} {app.lastName}
												</div>
												<div className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-0.5">
													Applied for Class {app.applyClass}
												</div>
											</div>
										</div>
										<div className="flex flex-col items-end gap-2 w-full sm:w-auto">
											<Badge
												className="bg-[#0a1628] text-white border-none font-mono font-bold px-4 py-1.5 rounded-lg text-xs"
											>
												{app.appNo}
											</Badge>
											<span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Click to view/print</span>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				)}

				<div className="mt-16 text-center pb-20">
					<Button
						asChild
						variant="ghost"
						className="text-slate-400 hover:text-[#0a1628] font-bold uppercase tracking-widest text-[10px]"
					>
						<Link to="/apply" className="flex items-center">
							<FileText className="w-4 h-4 mr-2" /> Admission Home
						</Link>
					</Button>
				</div>
			</main>
		</div>
	);
};

export default LocateApplicationPage;
