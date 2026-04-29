import { Link } from "react-router-dom";
import {
	ArrowRight,
	Search,
	GraduationCap,
	Home,
	Library,
	Laptop,
	Globe,
	Users,
} from "lucide-react";
import logo from "../assets/logo.jpg";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "../components/ui/card";

const ApplyPage = () => {
	return (
		<div className="min-h-screen bg-slate-50 text-[#0a1628] font-sans selection:bg-[#c8922a] selection:text-white flex flex-col">
			{/* Hero Section */}
			<section className="relative pt-24 pb-32 overflow-hidden bg-[#0a1628]">
				<div className="absolute inset-0 z-0">
					<div className="absolute bottom-0 right-0 w-1/2 h-full bg-[#c8922a]/5 rounded-full blur-[120px]" />
					<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djI2SDI0VjM0SDJWMjRoMjJWMEgzNnYyNGgyMnYxMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
					<div className="flex flex-col items-center text-center max-w-4xl mx-auto">
						<div className="mb-8 p-1.5 rounded-2xl bg-white shadow-xl shadow-[#c8922a]/20">
							<img
								src={logo}
								alt="Ahlussuffa Logo"
								className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-xl"
							/>
						</div>

						<Badge className="mb-6 bg-white/10 text-[#c8922a] hover:bg-white/20 border border-white/10 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] text-[10px] font-bold">
							Admissions Open 2026–2027
						</Badge>

						<h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight mb-8 leading-tight">
							Where Tradition Meets <br /> Modern Education
						</h1>

						<p className="text-base md:text-lg text-slate-400 mb-12 max-w-2xl font-medium leading-relaxed">
							Empowering minds through Islamic and academic excellence. Join an
							institution born from a vision to harmonize traditional Islamic
							scholarship with contemporary excellence.
						</p>

						<div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full sm:w-auto">
							<Button
								asChild
								size="lg"
								className="w-full sm:w-auto h-14 px-10 rounded-xl bg-[#c8922a] hover:bg-[#b07d20] text-[#0a1628] font-bold text-base shadow-lg transition-all hover:-translate-y-1"
							>
								<Link to="/apply/new" className="flex items-center gap-2">
									Apply Now <ArrowRight className="w-4 h-4" />
								</Link>
							</Button>
							<Button
								asChild
								variant="ghost"
								size="lg"
								className="w-full sm:w-auto h-14 px-8 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
							>
								<Link to="/locate">Locate Application</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Bento Grid */}
			<section className="py-24 mt-12 relative z-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<Card className="group overflow-hidden border-slate-200 shadow-xl rounded-3xl bg-white hover:border-[#c8922a] transition-all">
							<CardHeader className="p-10 pb-4">
								<div className="w-12 h-12 rounded-xl bg-[#0a1628] text-[#c8922a] flex items-center justify-center mb-6 shadow-sm">
									<GraduationCap className="w-7 h-7" />
								</div>
								<CardTitle className="text-2xl font-bold text-[#0a1628]">
									New Admission
								</CardTitle>
								<CardDescription className="text-slate-500 font-medium">
									For first-time applicants seeking Junior, Senior, or Graduate
									School pathways.
								</CardDescription>
							</CardHeader>
							<CardContent className="px-10 pb-10">
								<ul className="space-y-3 mt-4">
									<li className="flex items-center gap-3 text-sm text-slate-600">
										<div className="w-1.5 h-1.5 rounded-full bg-[#c8922a]" />{" "}
										Academic Excellence
									</li>
									<li className="flex items-center gap-3 text-sm text-slate-600">
										<div className="w-1.5 h-1.5 rounded-full bg-[#c8922a]" />{" "}
										Holistic Development
									</li>
								</ul>
								<Button
									asChild
									className="w-full h-14 mt-8 rounded-xl bg-[#0a1628] hover:bg-[#132238] text-white font-bold group"
								>
									<Link
										to="/apply/new"
										className="flex items-center justify-between"
									>
										Start New Journey{" "}
										<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
									</Link>
								</Button>
							</CardContent>
						</Card>

						<Card className="group overflow-hidden border-slate-200 shadow-xl rounded-3xl bg-white hover:border-[#c8922a] transition-all">
							<CardHeader className="p-10 pb-4">
								<div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-6 shadow-sm">
									<Home className="w-7 h-7" />
								</div>
								<CardTitle className="text-2xl font-bold text-[#0a1628]">
									Local Re-admission
								</CardTitle>
								<CardDescription className="text-slate-500 font-medium">
									Fast-track re-enrollment for existing students continuing
									their mission.
								</CardDescription>
							</CardHeader>
							<CardContent className="px-10 pb-10">
								<ul className="space-y-3 mt-4">
									<li className="flex items-center gap-3 text-sm text-slate-600">
										<div className="w-1.5 h-1.5 rounded-full bg-slate-300" />{" "}
										Pre-filled Records
									</li>
									<li className="flex items-center gap-3 text-sm text-slate-600">
										<div className="w-1.5 h-1.5 rounded-full bg-slate-300" />{" "}
										Priority Status
									</li>
								</ul>
								<Button
									asChild
									variant="outline"
									className="w-full h-14 mt-8 rounded-xl border-slate-200 text-[#0a1628] font-bold hover:bg-slate-50"
								>
									<Link to="/apply/local">Complete Enrollment</Link>
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Features Section */}
					<div className="mt-24">
						<div className="text-center mb-16">
							<h2 className="text-[#c8922a] font-bold tracking-[0.2em] uppercase text-xs mb-3">
								Our Core Pillars
							</h2>
							<h3 className="text-3xl font-bold text-[#0a1628]">
								A Unique Educational Institution
							</h3>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
							{[
								{
									title: "Advanced Library",
									desc: "Digital & physical resources",
									icon: Library,
								},
								{
									title: "Digital Skills",
									desc: "Modern technology training",
									icon: Laptop,
								},
								{
									title: "Community Outreach",
									desc: "Social welfare programs",
									icon: Globe,
								},
								{
									title: "Holistic Growth",
									desc: "Spiritual & intellectual",
									icon: Users,
								},
							].map((f, i) => (
								<div
									key={i}
									className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center"
								>
									<div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#c8922a]">
										<f.icon className="w-7 h-7" />
									</div>
									<h4 className="font-bold text-[#0a1628] mb-2">{f.title}</h4>
									<p className="text-sm text-slate-500 leading-relaxed">
										{f.desc}
									</p>
								</div>
							))}
						</div>
					</div>

					{/* Tracking Banner */}
					<div className="mt-24">
						<Card className="bg-[#0a1628] border-none rounded-3xl overflow-hidden p-8 md:p-12 shadow-2xl relative">
							<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30" />
							<div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto relative z-10">
								<div className="text-center md:text-left">
									<h3 className="text-2xl font-bold text-white mb-2">
										Ready to Begin Your Journey?
									</h3>
									<p className="text-slate-400 font-medium text-sm">
										Track your submission or find your application records here.
									</p>
								</div>
								<Button
									asChild
									className="h-14 px-10 rounded-xl bg-white text-[#0a1628] hover:bg-slate-100 font-bold whitespace-nowrap"
								>
									<Link to="/locate">
										<Search className="w-4 h-4 mr-2" /> Locate Application
									</Link>
								</Button>
							</div>
						</Card>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-16 bg-white border-t border-slate-100 mt-auto">
				<div className="max-w-7xl mx-auto px-4 sm:px-6">
					<div className="flex flex-col md:flex-row justify-between items-center gap-10">
						<div className="flex flex-col items-center md:items-start">
							<div className="mb-6 bg-white p-1 rounded-lg">
								<img
									src={logo}
									alt="Logo"
									className="w-10 h-10 object-contain"
								/>
							</div>
							<p className="text-slate-500 font-bold text-sm mb-1">
								Ahlussuffa Educational Trust
							</p>
							<p className="text-slate-400 text-xs">
								Where Faith Meets Knowledge
							</p>
						</div>
						<div className="text-center md:text-right text-xs text-slate-400 font-medium">
							<p>Ahlussuffa Campus, Parappram, Pinarayi, Kerala</p>
							<p className="mt-1">+91 99611 59173 · ahlussuffa.igs@gmail.com</p>
							<p className="mt-4">
								© 2026 Ahlussuffa Educational Trust. All rights reserved.
							</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default ApplyPage;
