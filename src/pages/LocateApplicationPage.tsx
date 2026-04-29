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
			<header className="bg-[#0a1628] border-b border-[#c8922a]/20 py-4 mb-12 shadow-md">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
					<div className="flex items-center gap-5">
						<div className="bg-white p-1 rounded-xl shadow-lg border border-white/20">
							<img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
						</div>
						<h1 className="text-white text-2xl font-display font-bold">
							Locate Application
						</h1>
					</div>
					<Link
						to="/apply"
						className="text-white/60 hover:text-white text-xs font-bold flex items-center gap-2 transition-colors group"
					>
						<ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
						Back to Portal
					</Link>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6">
				<Card className="w-full max-w-lg mx-auto mb-12 border-0 bg-transparent shadow-none sm:border sm:bg-white sm:shadow-sm sm:rounded-xl overflow-hidden">
					<CardHeader className="px-0 sm:px-6">
						<CardTitle className="text-center md:text-left">
							Verification
						</CardTitle>
						<CardDescription className="text-center md:text-left">
							Enter details to find your application.
						</CardDescription>
					</CardHeader>
					<CardContent className="px-0 sm:px-6">
						<form onSubmit={handleSearch} className="space-y-4">
							<div className="space-y-2">
								<label htmlFor="tel" className="text-sm font-medium">
									Phone Number
								</label>
								<Input
									type="tel"
									id="tel"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									placeholder="+91..."
									required
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="date" className="text-sm font-medium">
									Date of Birth
								</label>
								<Input
									type="date"
									id="date"
									value={dob}
									onChange={(e) => setDob(e.target.value)}
									required
								/>
							</div>
							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? (
									"Searching..."
								) : (
									<>
										<Search className="w-4 h-4 mr-2" /> Search
									</>
								)}
							</Button>
						</form>
						{error && (
							<div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
								<AlertCircle className="w-4 h-4" /> {error}
							</div>
						)}
					</CardContent>
				</Card>

				{searched && applications.length > 0 && (
					<div className="space-y-4 max-w-4xl mx-auto">
						<h3 className="font-bold text-lg px-2 text-center md:text-left">
							Results
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{applications.map((app) => (
								<Card
									key={app.id}
									className="cursor-pointer hover:border-[#c8922a] transition-colors h-full"
									onClick={() => setSelectedApp(app)}
								>
									<CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
										<div className="flex items-center gap-4">
											<div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0">
												<User className="w-6 h-6" />
											</div>
											<div>
												<div className="font-bold text-[#0a1628]">
													{app.firstName} {app.lastName}
												</div>
												<div className="text-sm text-slate-500 font-medium">
													Class {app.applyClass}
												</div>
											</div>
										</div>
										<Badge
											variant="secondary"
											className="shrink-0 self-end sm:self-auto bg-slate-100 text-[#0a1628] border-none"
										>
											{app.appNo}
										</Badge>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				)}

				<div className="mt-12 text-center pb-20">
					<Button
						asChild
						variant="link"
						className="text-slate-500 hover:text-[#0a1628]"
					>
						<Link to="/apply" className="flex items-center">
							<FileText className="w-4 h-4 mr-2" /> Back to Admissions
						</Link>
					</Button>
				</div>
			</main>
		</div>
	);
};

export default LocateApplicationPage;
