import { useState } from "react";
import { Link } from "react-router-dom";
import { searchApplicationsByPhoneAndDob } from "../services/supabase";
import { Search, Printer, Download, ChevronLeft, Calendar, Phone, User, Info, FileText } from "lucide-react";
import logo from "../assets/logo.jpg";
import ApplicationPrintDocument from "../components/ApplicationPrintDocument";

interface Application {
 id: string;
 appNo: string;
 firstName: string;
 lastName: string;
 dob: string;
 studentPhone?: string;
 address: string;
 applyClass: string;
 academicYear: string;
 fatherName: string;
 fatherPhone: string;
 motherName: string;
 motherPhone?: string;
 photo?: string;
 submissionDate: string;
 status?: string;
 admissionType?: string;
}

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
 
 try {
 const results = await searchApplicationsByPhoneAndDob(phone, dob);
 setApplications(results);
 if (results.length === 0) {
 setError("No applications found with this phone number and date of birth.");
 }
 } catch (err) {
 console.error("Search error:", err);
 setError("Something went wrong. Please try again.");
 } finally {
 setLoading(false);
 }
 };

 const handlePrint = () => {
 window.print();
 };

 const handleDownloadPDF = async () => {
		const element = document.getElementById("printArea");
		if (!element) return;
		
		const html2pdf = (await import("html2pdf.js")).default;
		
		const originalTransform = element.style.transform;
		element.style.transform = "none";
		
		const safeName = `${selectedApp?.first_name || ''} ${selectedApp?.last_name || ''}`.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'Student';
		const opt = {
			margin: 0,
			filename: `${safeName}_${selectedApp?.app_no || selectedApp?.appNo || 'Form'}.pdf`,
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2, useCORS: true },
			jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
		};
		
		html2pdf().from(element).set(opt).save().then(() => {
			element.style.transform = originalTransform;
		});
	};

 if (selectedApp) {
 return (
 <div className="min-h-screen bg-[#faf8f5]">
 <div className="no-print sticky top-0 z-50 bg-[#0a1628] border-b border-[#c8922a]/30 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm backdrop-blur-md">
 <button 
 onClick={() => setSelectedApp(null)}
 className="inline-flex items-center gap-2 text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2 transition-all"
 >
 <ChevronLeft className="w-4 h-4" />
 Back to Results
 </button>
 <div className="flex gap-3">
 <button 
 onClick={handlePrint}
 className="inline-flex items-center gap-2 text-sm text-white bg-gradient-to-r from-[#c8922a] to-[#a37521] hover:from-[#d4a040] hover:to-[#c8922a] border border-[#c8922a]/50 rounded-xl px-5 py-2 shadow-sm transition-all hover:-translate-y-0.5"
 >
 <Printer className="w-4 h-4" />
 Print
 </button>
 <button 
 onClick={handleDownloadPDF}
 className="inline-flex items-center gap-2 text-sm text-[#0a1628] bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-5 py-2 shadow-sm transition-all hover:-translate-y-0.5"
 >
 <Download className="w-4 h-4" />
 Download PDF
 </button>
 </div>
 </div>
	<div className="pt-8 pb-20">
		<ApplicationPrintDocument app={selectedApp} showStatus={true} />
	</div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-[#faf8f5] text-[#0a1628] font-body selection:bg-[#c8922a] selection:text-white flex flex-col">
 {/* Header */}
 <header className="relative bg-gradient-to-b from-[#0a1628] to-[#132238] pt-16 pb-24 overflow-hidden shrink-0">
 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djI2SDI0VjM0SDJWMjRoMjJWMEgzNnYyNGgyMnYxMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
 <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
 <Link to="/" className="w-20 h-20 rounded-2xl bg-white/5 border border-[#c8922a]/30 p-2 backdrop-blur-md mb-6 hover:scale-105 transition-transform">
 <img src={logo} alt="Ahlussuffa Logo" className="w-full h-full object-contain filter invert brightness-0" />
 </Link>
 <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Ahlussuffa Dars</h1>
 <p className="text-[#c8922a] tracking-widest text-sm uppercase font-semibold mb-6">Find Your Application</p>
 </div>
 </header>

 {/* Main Content */}
 <main className="flex-grow container mx-auto px-6 relative z-20 -mt-16 pb-24 max-w-3xl">
 <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">
 
 <div className="text-center mb-10">
 <h2 className="text-2xl font-display font-bold text-[#0a1628] mb-3">Locate Application</h2>
 <p className="text-slate-500">Enter your mobile number and date of birth to find your submitted application form.</p>
 </div>

 <form onSubmit={handleSearch} className="space-y-6">
 <div className="space-y-2">
 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
 <Phone className="w-3 h-3" />
 Mobile Number <span className="text-red-500">*</span>
 </label>
 <input
 type="tel"
 value={phone}
 onChange={(e) => setPhone(e.target.value)}
 placeholder="+91 XXXXX XXXXX"
 required
 className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c8922a] focus:border-transparent transition-all text-lg"
 />
 <p className="text-xs text-slate-400">Enter father's, mother's, or student's phone number</p>
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
 <Calendar className="w-3 h-3" />
 Date of Birth <span className="text-red-500">*</span>
 </label>
 <input
 type="date"
 value={dob}
 onChange={(e) => setDob(e.target.value)}
 required
 className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c8922a] focus:border-transparent transition-all text-lg"
 />
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full mt-4 flex items-center justify-center gap-3 px-6 py-4 bg-[#0a1628] hover:bg-[#132238] text-white rounded-xl font-bold text-lg transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed group"
 >
 {loading ? (
 <>
 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
 <span>Searching...</span>
 </>
 ) : (
 <>
 <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
 <span>Search Application</span>
 </>
 )}
 </button>
 </form>

 {error && (
 <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
 <Info className="w-5 h-5 shrink-0 mt-0.5" />
 <p>{error}</p>
 </div>
 )}

 {searched && applications.length > 0 && (
 <div className="mt-12 pt-10 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4">
 <div className="flex items-center justify-between mb-6">
 <h3 className="font-display font-bold text-xl text-[#0a1628]">
 Found {applications.length} Application{applications.length > 1 ? "s" : ""}
 </h3>
 <span className="px-3 py-1 bg-[#c8922a]/10 text-[#c8922a] rounded-full text-xs font-bold uppercase tracking-wider">Results</span>
 </div>
 
 <div className="space-y-4">
 {applications.map((app) => (
 <div 
 key={app.id}
 onClick={() => setSelectedApp(app)}
 className="group bg-white border border-slate-200 hover:border-[#c8922a] rounded-2xl p-5 cursor-pointer transition-all hover:shadow-sm hover:"
 >
 <div className="flex justify-between items-start mb-4">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#c8922a]/10 group-hover:text-[#c8922a] transition-colors">
 <User className="w-6 h-6" />
 </div>
 <div>
 <h4 className="font-display font-bold text-lg text-[#0a1628] group-hover:text-[#c8922a] transition-colors">
 {app.firstName} {app.lastName}
 </h4>
 <p className="text-sm text-slate-500 font-medium">
 Class {app.applyClass} · {app.academicYear}
 </p>
 </div>
 </div>
 <div className="px-3 py-1 bg-[#0a1628] text-[#e8b86d] font-mono text-xs rounded-lg font-bold shadow-sm">
 {app.appNo}
 </div>
 </div>
 
 <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-500 bg-slate-50 p-3 rounded-xl mb-4">
 <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {app.fatherPhone}</div>
 <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {new Date(app.submissionDate).toLocaleDateString()}</div>
 </div>

 <div className="flex flex-wrap gap-2 justify-end">
 <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
 app.admissionType === "local" 
 ? "bg-amber-100 text-amber-700" 
 : "bg-blue-100 text-blue-700"
 }`}>
 {app.admissionType === "local" ? "Local Admission" : "New Admission"}
 </span>
 <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 capitalize">
 {app.status || "Submitted"}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>

 <div className="mt-12 text-center">
 <p className="text-slate-500 mb-4">Need to submit a new application?</p>
 <Link 
 to="/apply" 
 className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-[#0a1628] font-semibold transition-all hover:shadow-sm"
 >
 <FileText className="w-4 h-4" />
 Go to Application Page
 </Link>
 </div>
 </main>
 </div>
 );
};

export default LocateApplicationPage;
