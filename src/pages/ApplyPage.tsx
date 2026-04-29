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
			{/* Main Header / Navbar */}
			<header className="sticky top-0 z-50 w-full bg-[#0a1628]/95 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-[#0a1628]/20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
					<Link to="/" className="flex items-center gap-4 group">
						<div className="bg-white p-1 rounded-xl shadow-lg border border-white/20 transition-transform group-hover:scale-105">
							<img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
						</div>
						<div className="hidden sm:block">
							<span className="text-white font-display font-bold text-lg block leading-none mb-1">
								Ahlussuffa Dars
							</span>
							<span className="text-[#c8922a] text-[10px] uppercase font-bold tracking-widest block leading-none">
								Admission Portal
							</span>
						</div>
					</Link>

					<nav className="flex items-center gap-3 sm:gap-6">
						<Link
							to="/locate"
							className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
						>
							<Search className="w-4 h-4" />
							<span className="hidden md:inline">Locate Application</span>
						</Link>
						<Button
							asChild
							size="sm"
							className="bg-[#c8922a] hover:bg-[#b07d20] text-[#0a1628] font-bold rounded-lg px-4 h-10 shadow-lg"
						>
							<Link to="/apply/new">Apply Now</Link>
						</Button>
					</nav>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative pt-20 pb-28 md:pt-24 md:pb-32 overflow-hidden bg-[#0a1628]">
				<div className="absolute inset-0 z-0">
					<div className="absolute bottom-0 right-0 w-1/2 h-full bg-[#c8922a]/5 rounded-full blur-[120px]" />
					<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djI2SDI0VjM0SDJWMjRoMjJWMEgzNnYyNGgyMnYxMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
					<div className="flex flex-col items-center text-center max-w-4xl mx-auto">
						<Badge className="mb-8 bg-white/10 text-[#c8922a] hover:bg-white/20 border border-white/10 px-6 py-2 rounded-full uppercase tracking-[0.25em] text-[11px] font-black">
							Session 2026–2027
						</Badge>

						<h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white tracking-tight mb-8 leading-[1.1] px-4">
							Where Tradition Meets <br className="hidden md:block" /> Modern
							Excellence
						</h1>

						<p className="text-base sm:text-lg md:text-xl text-slate-400 mb-12 max-w-2xl font-medium leading-relaxed px-4">
							Empowering minds through Islamic and academic excellence. Join an
							institution born from a vision to harmonize traditional Islamic
							scholarship with contemporary excellence.
						</p>

						<div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full px-6 sm:w-auto">
							<Button
								asChild
								size="lg"
								className="w-full sm:w-auto h-14 px-12 rounded-xl bg-[#c8922a] hover:bg-[#b07d20] text-[#0a1628] font-bold text-lg shadow-xl shadow-[#c8922a]/10 transition-all hover:-translate-y-1"
							>
								<Link to="/apply/new" className="flex items-center gap-2">
									Start Application <ArrowRight className="w-5 h-5" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Bento Grid */}
			<section className="py-24 mt-12 relative z-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<Card className="group overflow-hidden border-slate-200 shadow-xl rounded-[2.5rem] bg-white hover:border-[#c8922a] transition-all duration-500">
							<CardHeader className="p-10 pb-4">
								<div className="w-14 h-14 rounded-2xl bg-[#0a1628] text-[#c8922a] flex items-center justify-center mb-8 shadow-lg shadow-[#0a1628]/20 transition-transform group-hover:scale-110">
									<GraduationCap className="w-8 h-8" />
								</div>
								<CardTitle className="text-3xl font-display font-bold text-[#0a1628] mb-2">
									New Admission
								</CardTitle>
								<CardDescription className="text-slate-500 font-medium text-base">
									For first-time applicants seeking Junior, Senior, or Graduate
									School pathways.
								</CardDescription>
							</CardHeader>
							<CardContent className="px-10 pb-10">
								<ul className="space-y-4 mt-6">
									<li className="flex items-center gap-3 text-sm font-bold text-slate-600 uppercase tracking-widest">
										<div className="w-2 h-2 rounded-full bg-[#c8922a]" />{" "}
										Full-time Scholar
									</li>
									<li className="flex items-center gap-3 text-sm font-bold text-slate-600 uppercase tracking-widest">
										<div className="w-2 h-2 rounded-full bg-[#c8922a]" />{" "}
										Holistic Residency
									</li>
								</ul>
								<Button
									asChild
									className="w-full h-16 mt-10 rounded-2xl bg-[#0a1628] hover:bg-[#132238] text-white font-bold text-lg group shadow-xl shadow-[#0a1628]/10"
								>
									<Link
										to="/apply/new"
										className="flex items-center justify-between"
									>
										Proceed to Application{" "}
										<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
									</Link>
								</Button>
							</CardContent>
						</Card>

						<Card className="group overflow-hidden border-slate-200 shadow-xl rounded-[2.5rem] bg-white hover:border-[#c8922a] transition-all duration-500">
							<CardHeader className="p-10 pb-4">
								<div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-8 shadow-sm transition-transform group-hover:scale-110 group-hover:bg-[#c8922a]/10 group-hover:text-[#c8922a]">
									<Home className="w-8 h-8" />
								</div>
								<CardTitle className="text-3xl font-display font-bold text-[#0a1628] mb-2">
									Re-admission
								</CardTitle>
								<CardDescription className="text-slate-500 font-medium text-base">
									Fast-track re-enrollment for existing students continuing
									their scholarly journey.
								</CardDescription>
							</CardHeader>
							<CardContent className="px-10 pb-10">
								<ul className="space-y-4 mt-6">
									<li className="flex items-center gap-3 text-sm font-bold text-slate-600 uppercase tracking-widest">
										<div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-[#c8922a]" />{" "}
										Pre-filled Profile
									</li>
									<li className="flex items-center gap-3 text-sm font-bold text-slate-600 uppercase tracking-widest">
										<div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-[#c8922a]" />{" "}
										Priority Approval
									</li>
								</ul>
								<Button
									asChild
									variant="outline"
									className="w-full h-16 mt-10 rounded-2xl border-2 border-slate-100 text-[#0a1628] font-bold text-lg hover:bg-slate-50 hover:border-slate-200"
								>
									<Link
										to="/apply/local"
										className="flex items-center justify-between"
									>
										Continue Education{" "}
										<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
									</Link>
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="py-24 bg-white border-y border-slate-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-5xl font-display font-bold text-[#0a1628] mb-4">
							Institutional Excellence
						</h2>
						<p className="text-slate-500 font-medium text-lg">
							World-class infrastructure for the modern student.
						</p>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{[
							{
								icon: Library,
								title: "Modern Library",
								desc: "Vast collection of resources",
							},
							{
								icon: Laptop,
								title: "Digital Labs",
								desc: "State-of-the-art facilities",
							},
							{
								icon: Globe,
								title: "Global Reach",
								desc: "Connecting with scholars worldwide",
							},
							{
								icon: Users,
								title: "Community",
								desc: "Lifelong network of peers",
							},
						].map((item, i) => (
							<div
								key={i.toString()}
								className="flex flex-col items-center text-center group"
							>
								<div className="w-16 h-16 rounded-2xl bg-slate-50 text-[#0a1628] flex items-center justify-center mb-6 transition-all group-hover:bg-[#0a1628] group-hover:text-white group-hover:-translate-y-2">
									<item.icon className="w-7 h-7" />
								</div>
								<h3 className="font-bold text-lg text-[#0a1628] mb-2">
									{item.title}
								</h3>
								<p className="text-xs text-slate-500 font-medium leading-relaxed uppercase tracking-wider">
									{item.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-[#0a1628] py-20 mt-auto border-t border-white/5">
				<div className="max-w-7xl mx-auto px-4 sm:px-6">
					<div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
						<div className="flex flex-col items-center md:items-start gap-6 max-w-md">
							<div className="bg-white p-1.5 rounded-2xl shadow-xl">
								<img
									src={logo}
									alt="Logo"
									className="w-12 h-12 object-contain"
								/>
							</div>
							<div>
								<h3 className="text-white text-xl font-display font-bold mb-2">
									Ahlussuffa Dars
								</h3>
								<p className="text-slate-400 text-sm leading-relaxed">
									An institution dedicated to the preservation of traditional
									Islamic values and the advancement of contemporary knowledge.
								</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-16">
							<div className="space-y-4">
								<h4 className="text-[#c8922a] text-xs font-bold uppercase tracking-widest">
									Portal
								</h4>
								<ul className="space-y-3">
									<li>
										<Link
											to="/apply/new"
											className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
										>
											Admission
										</Link>
									</li>
									<li>
										<Link
											to="/locate"
											className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
										>
											Locate
										</Link>
									</li>
								</ul>
							</div>
							<div className="space-y-4">
								<h4 className="text-[#c8922a] text-xs font-bold uppercase tracking-widest">
									Support
								</h4>
								<ul className="space-y-3">
									<li>
										<a
											href="/"
											className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
										>
											Contact
										</a>
									</li>
									<li>
										<a
											href="/"
											className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
										>
											Privacy
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="mt-20 pt-10 border-t border-white/5 text-center">
						<p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.3em]">
							&copy; {new Date().getFullYear()} Ahlussuffa Educational Trust.
							All Rights Reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default ApplyPage;
