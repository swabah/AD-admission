import { useState, useEffect, useRef } from "react";
import {
 deleteApplication,
 getAllApplications,
 updateApplicationStatus,
} from "../services/supabase";
import logo from "../assets/logo.jpg";
import StudentViewModal from "../components/StudentViewModal";
import ApplicationPrintDocument from "../components/ApplicationPrintDocument";
import ConfirmDialog from "../components/ConfirmDialog";
import { downloadApplicationPDF } from "../utils/pdfDownloader";
import { 
 Users, Clock, Eye, Check, X, Search, Download, RefreshCw, Printer, 
 Trash2, Share2, MoreVertical, ArrowDownAZ, ArrowUpAZ, Lock, 
 ChevronRight, ArrowLeft, Menu, LogOut 
} from "lucide-react";

// ─── Shared tiny components ───────────────────────────────────────────────────

const STATUS_CFG: Record<string, { label: string; textClass: string; bgClass: string; dotClass: string }> = {
 submitted: { label: "Submitted", textClass: "text-blue-600", bgClass: "bg-blue-100", dotClass: "bg-blue-600" },
 reviewing: { label: "Reviewing", textClass: "text-purple-600", bgClass: "bg-purple-100", dotClass: "bg-purple-600" },
 approved: { label: "Approved", textClass: "text-emerald-600", bgClass: "bg-emerald-100", dotClass: "bg-emerald-600" },
 rejected: { label: "Rejected", textClass: "text-red-600", bgClass: "bg-red-100", dotClass: "bg-red-600" },
};

const StatusBadge = ({ status }: { status: string }) => {
 const cfg = STATUS_CFG[status] || STATUS_CFG.submitted;
 return (
 <span className={`inline-flex items-center gap-1.5 font-sans text-[11px] font-medium px-2.5 py-1 rounded-full ${cfg.textClass} ${cfg.bgClass}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
 {cfg.label}
 </span>
 );
};

const AppNoChip = ({ value }: { value: string }) => (
 <span className="font-mono text-[11px] font-medium bg-[#0a1628] text-[#c8922a] px-2 py-1 rounded tracking-wide whitespace-nowrap shadow-sm">
 {value}
 </span>
);

const Avatar = ({ name }: { name: string }) => {
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

// ─── Login screen ─────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }: { onLogin: (key: string) => void }) => {
 const [key, setKey] = useState("");
 const [shake, setShake] = useState(false);

 const attempt = () => {
 if (key === (import.meta.env.VITE_ADMIN_KEY || "")) {
 onLogin(key);
 } else {
 setShake(true);
 setTimeout(() => setShake(false), 500);
 }
 };

 return (
 <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] font-sans relative overflow-hidden">
 <div className="absolute inset-0 pointer-events-none z-0">
 <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#1e3a5f] opacity-20 blur-3xl" />
 <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#c8922a] opacity-20 blur-3xl" />
 </div>

 <div className={`relative z-10 bg-white rounded-3xl border border-slate-200 p-12 w-full max-w-md shadow-sm animate-in fade-in slide-in-from-bottom-8 ${shake ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
 <div className="text-center mb-8">
 <div className="w-16 h-16 rounded-full bg-[#0a1628] mx-auto mb-4 flex items-center justify-center border-4 border-[#c8922a] overflow-hidden shadow-sm">
 <img src={logo} alt="Logo" className="w-full h-full object-cover filter invert brightness-0" />
 </div>
 <h2 className="font-display text-2xl text-[#0a1628] mb-1">Admin Portal</h2>
 <p className="text-sm text-slate-500">Ahlussuffa Dars · Admission System</p>
 </div>

 <div className="space-y-4">
 <div className="relative">
 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
 <Lock className="w-5 h-5" />
 </div>
 <input
 type="password"
 value={key}
 placeholder="Enter admin key"
 onChange={e => setKey(e.target.value)}
 onKeyDown={e => e.key === "Enter" && attempt()}
 className="w-full pl-12 pr-4 py-3 font-sans text-sm border-2 border-slate-100 rounded-xl outline-none bg-slate-50 text-slate-800 focus:border-[#0a1628] focus:bg-white transition-all"
 />
 </div>
 <button
 onClick={attempt}
 className="w-full py-3 bg-[#0a1628] hover:bg-[#132238] text-white font-sans text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-sm hover:-translate-y-0.5"
 >
 Sign In
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 <div className="text-center mt-6 text-xs text-slate-400 uppercase tracking-widest font-semibold">
 Authorised personnel only
 </div>
 </div>
 </div>
 );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, accentClass, bgAccentClass }: {
 label: string; value: number; icon: any; accentClass: string; bgAccentClass: string;
}) => (
 <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col gap-3 shadow-sm hover:shadow-sm transition-all relative overflow-hidden group">
 <div className={`absolute top-0 left-0 w-1 h-full ${bgAccentClass}`}></div>
 <div className="flex justify-between items-start pl-2">
 <div className={`w-10 h-10 rounded-xl ${bgAccentClass} ${accentClass} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
 <Icon className="w-5 h-5" />
 </div>
 </div>
 <div className="pl-2">
 <div className="font-display text-3xl text-slate-800 leading-none font-medium mb-1">{value}</div>
 <div className="font-sans text-xs text-slate-500 font-semibold tracking-wide uppercase">{label}</div>
 </div>
 </div>
);

// ─── Main AdminPage ───────────────────────────────────────────────────────────
const AdminPage = () => {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [applications, setApplications] = useState<any[]>([]);
 const [selectedApp, setSelectedApp] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const [viewModalApp, setViewModalApp] = useState<any>(null);
 const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
 const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
 const [downloadingApp, setDownloadingApp] = useState<any>(null);
 const [activeTab, setActiveTab] = useState("all");
 const [searchTerm, setSearchTerm] = useState("");
 const [statusFilter, setStatusFilter] = useState("all");
 const [classFilter, setClassFilter] = useState("all");
 const [sortBy, setSortBy] = useState("date");
 const [sortOrder, setSortOrder] = useState<"asc"|"desc">("desc");
 const [selectedApps, setSelectedApps] = useState<string[]>([]);
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [confirmDialog, setConfirmDialog] = useState<{
 isOpen: boolean;
 title: string;
 message: string;
 onConfirm: () => void;
 type: 'danger' | 'warning' | 'info';
 }>({
 isOpen: false,
 title: '',
 message: '',
 onConfirm: () => {},
 type: 'danger'
 });

 const dropdownRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const handler = (e: MouseEvent) => {
 if (!(e.target as Element).closest(".action-dropdown")) setDropdownOpen(null);
 };
 document.addEventListener("mousedown", handler);
 return () => document.removeEventListener("mousedown", handler);
 }, []);

 const fetchApplications = async () => {
 setLoading(true);
 try {
 const data = await getAllApplications();
 setApplications(data);
 } catch (e) {
 console.error(e);
 } finally {
 setLoading(false);
 }
 };

 const handleLogin = () => { setIsAuthenticated(true); fetchApplications(); };

 const handleStatusUpdate = async (id: string, status: string) => {
 await updateApplicationStatus(id, status);
 fetchApplications();
 };

 const handleDelete = (id: string) => {
 setConfirmDialog({
 isOpen: true,
 title: "Delete Application",
 message: "Are you sure you want to delete this application? This action cannot be undone.",
 onConfirm: async () => {
 try {
 await deleteApplication(id);
 fetchApplications();
 setConfirmDialog(prev => ({ ...prev, isOpen: false }));
 } catch (error) {
 console.error("Error deleting application:", error);
 alert("Failed to delete application. Please try again.");
 }
 },
 type: 'danger'
 });
 };

 const shareApplication = async (app: any) => {
 const shareData = { title: `Application ${app.appNo || app.app_no}`, text: `${app.firstName || app.first_name} ${app.lastName || app.last_name}`, url: window.location.href };
 if (navigator.share) await navigator.share(shareData);
 else { navigator.clipboard.writeText(JSON.stringify(shareData, null, 2)); alert("Copied!"); }
 };

 	const handleDirectDownload = async (app: any) => {
		setDownloadingApp(app);
		setTimeout(async () => {
			const name = `${app.firstName || app.first_name || ""} ${app.lastName || app.last_name || ""}`.trim();
			await downloadApplicationPDF(app.appNo || app.app_no || "application", name);
			setDownloadingApp(null);
		}, 100);
		setDropdownOpen(null);
	};

 const exportData = () => {
 if (!applications.length) return;
 const rows = tabApplications.map(app => ({
 "App No": app.appNo || app.app_no,
 "Name": `${app.firstName || app.first_name} ${app.lastName || app.last_name}`,
 "Class": app.applyClass || app.apply_class,
 "Year": app.academicYear || app.academic_year,
 "Status": app.status || "submitted",
 "Submitted": app.submissionDate || app.submission_date,
 "Father": app.fatherName || app.father_name,
 "Phone": app.fatherPhone || app.father_phone,
 }));
 const csv = [Object.keys(rows[0]).join(","), ...rows.map(r => Object.values(r).map(v => `"${v ?? ""}"`).join(","))].join("\n");
 const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: `applications_${new Date().toISOString().split("T")[0]}.csv` });
 a.click();
 };

 const uniqueClasses = [...new Set(applications.map(a => a.applyClass || a.apply_class).filter(Boolean))];

 const filtered = applications
 .filter(app => {
 const name = `${app.firstName || app.first_name || ""} ${app.lastName || app.last_name || ""}`.toLowerCase();
 const appNo = (app.appNo || app.app_no || "").toLowerCase();
 const father = (app.fatherName || app.father_name || "").toLowerCase();
 const q = searchTerm.toLowerCase();
 const matchSearch = !q || name.includes(q) || appNo.includes(q) || father.includes(q);
 const matchStatus = statusFilter === "all" || app.status === statusFilter;
 const matchClass = classFilter === "all" || (app.applyClass || app.apply_class) === classFilter;
 return matchSearch && matchStatus && matchClass;
 })
 .sort((a, b) => {
 let av: any, bv: any;
 if (sortBy === "date") { av = new Date(a.submissionDate || a.submission_date); bv = new Date(b.submissionDate || b.submission_date); }
 else if (sortBy === "name") { av = `${a.firstName || a.first_name}`; bv = `${b.firstName || b.first_name}`; }
 else if (sortBy === "class") { av = a.applyClass || a.apply_class; bv = b.applyClass || b.apply_class; }
 else { av = a.status || "submitted"; bv = b.status || "submitted"; }
 return sortOrder === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
 });

 const tabApplications = activeTab === "all" ? filtered : filtered.filter(app => {
 if (activeTab === "pending") return !app.status || app.status === "submitted";
 return app.status === activeTab;
 });

 const stats = [
 { label: "Total Applications", value: applications.length, icon: Users, accentClass: "text-blue-600", bgAccentClass: "bg-blue-100" },
 { label: "Pending Review", value: applications.filter(a => !a.status || a.status === "submitted").length, icon: Clock, accentClass: "text-amber-600", bgAccentClass: "bg-amber-100" },
 { label: "Under Review", value: applications.filter(a => a.status === "reviewing").length, icon: Eye, accentClass: "text-purple-600", bgAccentClass: "bg-purple-100" },
 { label: "Approved", value: applications.filter(a => a.status === "approved").length, icon: Check, accentClass: "text-emerald-600", bgAccentClass: "bg-emerald-100" },
 ];

 const TABS = [
 { id: "all", label: "All", count: filtered.length },
 { id: "pending", label: "Pending", count: applications.filter(a => !a.status || a.status === "submitted").length },
 { id: "reviewing", label: "Reviewing", count: applications.filter(a => a.status === "reviewing").length },
 { id: "approved", label: "Approved", count: applications.filter(a => a.status === "approved").length },
 { id: "rejected", label: "Rejected", count: applications.filter(a => a.status === "rejected").length },
 ];

 const handleSelectAll = () => {
 setSelectedApps(selectedApps.length === tabApplications.length && tabApplications.length > 0 ? [] : tabApplications.map(a => a.id || a._id));
 };

 const handleBulkStatus = async (status: string) => {
 if (!selectedApps.length || !confirm(`Update ${selectedApps.length} applications to "${status}"?`)) return;
 await Promise.all(selectedApps.map(id => updateApplicationStatus(id, status)));
 setSelectedApps([]); fetchApplications();
 };

 const handleBulkDelete = () => {
 if (!selectedApps.length) return;
 setConfirmDialog({
 isOpen: true,
 title: "Delete Multiple Applications",
 message: `Are you sure you want to delete ${selectedApps.length} application(s) permanently? This action cannot be undone.`,
 onConfirm: async () => {
 try {
 await Promise.all(selectedApps.map(id => deleteApplication(id)));
 setSelectedApps([]); 
 fetchApplications();
 setConfirmDialog(prev => ({ ...prev, isOpen: false }));
 } catch (error) {
 console.error("Error in bulk delete:", error);
 alert("Failed to delete some applications. Please try again.");
 }
 },
 type: 'danger'
 });
 };

 if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;

 if (selectedApp) return (
 <div className="font-sans min-h-screen bg-[#faf8f5]">
 <div className="no-print sticky top-0 z-50 bg-[#0a1628] border-b border-[#c8922a]/30 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm backdrop-blur-md">
 <button onClick={() => setSelectedApp(null)} className="inline-flex items-center gap-2 text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2 transition-all">
 <ArrowLeft className="w-4 h-4" /> Back to Dashboard
 </button>
 </div>
 <div className="py-8">
 <ApplicationPrintDocument app={selectedApp} />
 </div>
 </div>
 );

 if (viewModalApp) return <StudentViewModal app={viewModalApp} onClose={() => setViewModalApp(null)} />;

 return (
 <>
 {downloadingApp && (
    <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <ApplicationPrintDocument app={downloadingApp} />
    </div>
 )}
 <div className="flex min-h-screen font-sans bg-slate-50 text-slate-800">
 
 {/* Sidebar */}
 <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#0a1628] to-[#132238] shadow-sm transform transition-transform duration-300 flex flex-col ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:static"}`}>
 <div className="p-6 border-b border-white/10">
 <div className="w-12 h-12 rounded-xl bg-white/5 border border-[#c8922a]/50 p-1.5 mb-4 shadow-sm">
 <img src={logo} alt="Logo" className="w-full h-full object-contain filter invert brightness-0" />
 </div>
 <h2 className="font-display text-xl text-white font-bold leading-tight">Ahlussuffa Dars</h2>
 <p className="text-xs text-white/50 mt-1 uppercase tracking-wider font-semibold">Admission Portal</p>
 </div>

 <div className="flex-1 overflow-y-auto p-4 space-y-2">
 {stats.map(s => (
 <div key={s.label} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
 <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.bgAccentClass} ${s.accentClass} group-hover:scale-110 transition-transform`}>
 <s.icon className="w-5 h-5" />
 </div>
 <div>
 <div className="font-display text-lg text-white font-medium leading-none mb-1">{s.value}</div>
 <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">{s.label}</div>
 </div>
 </div>
 ))}
 </div>

 <div className="p-4 border-t border-white/10 space-y-1">
 <button onClick={exportData} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors text-left">
 <Download className="w-4 h-4" /> Export CSV
 </button>
 <button onClick={fetchApplications} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors text-left">
 <RefreshCw className="w-4 h-4" /> Refresh Data
 </button>
 <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left mt-4">
 <LogOut className="w-4 h-4" /> Sign Out
 </button>
 </div>
 </aside>

 {/* Mobile Overlay */}
 {mobileMenuOpen && (
 <div className="fixed inset-0 bg-[#0a1628]/50 backdrop-blur-sm z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
 )}

 {/* Main Area */}
 <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
 
 {/* Topbar */}
 <header className="shrink-0 bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between z-10 shadow-sm">
 <div className="flex items-center gap-4">
 <button className="p-2 -ml-2 text-slate-500 hover:text-[#0a1628] hover:bg-slate-100 rounded-lg lg:hidden" onClick={() => setMobileMenuOpen(true)}>
 <Menu className="w-6 h-6" />
 </button>
 <h1 className="font-display text-2xl font-bold text-[#0a1628] hidden sm:block">Dashboard</h1>
 </div>
 <div className="flex items-center gap-3">
 <button onClick={exportData} className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0a1628] bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-colors">
 <Download className="w-4 h-4" /> Export
 </button>
 <button onClick={fetchApplications} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0a1628] hover:bg-[#132238] rounded-lg shadow-sm transition-colors">
 <RefreshCw className="w-4 h-4" /> Refresh
 </button>
 </div>
 </header>

 <div className="flex-1 overflow-y-auto bg-slate-50">
 <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
 
 {/* Stats Grid */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
 {stats.map(s => <StatCard key={s.label} {...s} />)}
 </div>

 {/* Controls */}
 <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
 <div className="flex flex-col lg:flex-row gap-4">
 <div className="relative flex-1">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
 <input
 type="text"
 className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0a1628] focus:ring-1 focus:ring-[#0a1628] rounded-xl text-sm outline-none transition-all"
 placeholder="Search by name, app no, or father's name..."
 value={searchTerm}
 onChange={e => setSearchTerm(e.target.value)}
 />
 </div>
 <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
 <select className="shrink-0 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#0a1628] transition-colors font-medium text-slate-700" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
 <option value="all">All Status</option>
 <option value="submitted">Submitted</option>
 <option value="reviewing">Reviewing</option>
 <option value="approved">Approved</option>
 <option value="rejected">Rejected</option>
 </select>
 <select className="shrink-0 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#0a1628] transition-colors font-medium text-slate-700" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
 <option value="all">All Classes</option>
 {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
 </select>
 <select className="shrink-0 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#0a1628] transition-colors font-medium text-slate-700" value={sortBy} onChange={e => setSortBy(e.target.value)}>
 <option value="date">Date</option>
 <option value="name">Name</option>
 <option value="class">Class</option>
 <option value="status">Status</option>
 </select>
 <button className="shrink-0 p-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors" onClick={() => setSortOrder(s => s === "asc" ? "desc" : "asc")}>
 {sortOrder === "asc" ? <ArrowUpAZ className="w-5 h-5" /> : <ArrowDownAZ className="w-5 h-5" />}
 </button>
 </div>
 </div>

 {/* Bulk Actions */}
 {selectedApps.length > 0 && (
 <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl animate-in slide-in-from-top-2 overflow-x-auto">
 <span className="text-sm font-bold text-blue-800 whitespace-nowrap px-2">{selectedApps.length} selected</span>
 <button onClick={() => handleBulkStatus("approved")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap">
 <Check className="w-4 h-4" /> Approve
 </button>
 <button onClick={() => handleBulkStatus("rejected")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap">
 <X className="w-4 h-4" /> Reject
 </button>
 <button onClick={handleBulkDelete} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap">
 <Trash2 className="w-4 h-4" /> Delete
 </button>
 <button onClick={() => setSelectedApps([])} className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 bg-transparent hover:bg-slate-200/50 rounded-lg transition-colors ml-auto whitespace-nowrap">
 Clear
 </button>
 </div>
 )}
 </div>

 {/* Main Content Area */}
 <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
 {/* Tabs */}
 <div className="flex overflow-x-auto border-b border-slate-100 hide-scrollbar bg-slate-50/50">
 {TABS.map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? "border-[#0a1628] text-[#0a1628] bg-white" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
 >
 {tab.label}
 <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-[#0a1628] text-white" : "bg-slate-200 text-slate-600"}`}>
 {tab.count}
 </span>
 </button>
 ))}
 </div>

 <div className="p-0 overflow-x-auto">
 {loading ? (
 <div className="p-20 flex flex-col items-center justify-center text-slate-400">
 <div className="w-8 h-8 border-2 border-slate-200 border-t-[#0a1628] rounded-full animate-spin mb-4" />
 <p className="text-sm font-medium">Loading applications...</p>
 </div>
 ) : tabApplications.length === 0 ? (
 <div className="p-20 flex flex-col items-center justify-center text-slate-400">
 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
 <Users className="w-8 h-8 text-slate-300" />
 </div>
 <p className="text-sm font-medium text-slate-500">No applications found.</p>
 </div>
 ) : (
 <>
 {/* Mobile Cards View */}
 <div className="md:hidden flex flex-col gap-4 p-4">
 <div className="flex items-center justify-between">
 <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
 <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628]"
 checked={selectedApps.length === tabApplications.length && tabApplications.length > 0}
 onChange={handleSelectAll}
 />
 Select All {tabApplications.length > 0 && `(${tabApplications.length})`}
 </label>
 </div>
 {tabApplications.map(app => {
 const id = app.id || app._id;
 const name = `${app.firstName || app.first_name || ""} ${app.lastName || app.last_name || ""}`.trim();
 const status = app.status || "submitted";
 const isSelected = selectedApps.includes(id);

 return (
 <div key={id} className={`flex flex-col bg-white border rounded-2xl p-4 shadow-sm relative transition-all ${isSelected ? "border-blue-400 bg-blue-50/50 ring-2 ring-blue-100" : "border-slate-200"}`}>
 <div className="flex justify-between items-start mb-4">
 <div className="flex items-center gap-3">
 <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628]"
 checked={isSelected}
 onChange={() => setSelectedApps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
 />
 <AppNoChip value={app.appNo || app.app_no || "—"} />
 </div>
 <div className="action-dropdown">
 <button
 onClick={e => {
 if (dropdownOpen === id) { setDropdownOpen(null); return; }
 const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
 setDropdownPos({ top: r.bottom + 4, left: r.right - 180 });
 setDropdownOpen(id);
 }}
 className="p-1.5 text-slate-400 hover:text-[#0a1628] hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
 >
 <MoreVertical className="w-5 h-5" />
 </button>
 {dropdownOpen === id && (
 <div className="fixed z-50 w-48 bg-white border border-slate-200 rounded-xl shadow-sm py-1 animate-in fade-in zoom-in-95" style={{ top: dropdownPos.top, left: dropdownPos.left }}>
 <button onClick={() => { setViewModalApp(app); setDropdownOpen(null); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0a1628] font-medium transition-colors">
 <Eye className="w-4 h-4 text-slate-400" /> View Details
 </button>
 <button onClick={() => { setSelectedApp(app); setTimeout(() => window.print(), 100); setDropdownOpen(null); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0a1628] font-medium transition-colors">
 <Printer className="w-4 h-4 text-slate-400" /> Print Form
 </button>
 <button onClick={() => handleDirectDownload(app)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0a1628] font-medium transition-colors">
 <Download className="w-4 h-4 text-slate-400" /> Download PDF
 </button>
 <button onClick={() => { shareApplication(app); setDropdownOpen(null); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0a1628] font-medium transition-colors">
 <Share2 className="w-4 h-4 text-slate-400" /> Share Link
 </button>
 <div className="h-px bg-slate-100 my-1"></div>
 <button onClick={() => { handleDelete(id); setDropdownOpen(null); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">
 <Trash2 className="w-4 h-4 text-red-400" /> Delete Application
 </button>
 </div>
 )}
 </div>
 </div>
 
 <div className="flex items-center gap-4 mb-4">
 <Avatar name={name || "?"} />
 <div>
 <div className="font-bold text-[#0a1628] text-base">{name}</div>
 <div className="text-sm text-slate-500 font-medium mt-0.5">{app.fatherPhone || app.father_phone || "—"}</div>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
 <div>
 <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Class</div>
 <div className="font-semibold text-slate-800">{app.applyClass || app.apply_class}</div>
 </div>
 <div>
 <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Year</div>
 <div className="font-mono text-sm font-semibold text-slate-600">{app.academicYear || app.academic_year}</div>
 </div>
 <div>
 <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Date</div>
 <div className="font-mono text-sm font-semibold text-slate-600">
 {app.submissionDate || app.submission_date ? new Date(app.submissionDate || app.submission_date).toLocaleDateString("en-IN") : "—"}
 </div>
 </div>
 </div>

 <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
 <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
 <select
 value={status}
 onChange={e => handleStatusUpdate(id, e.target.value)}
 className={`text-xs font-bold rounded-full px-4 py-2 border-0 cursor-pointer outline-none transition-transform hover:scale-105 appearance-none text-center ${STATUS_CFG[status]?.bgClass} ${STATUS_CFG[status]?.textClass}`}
 >
 <option value="submitted">Submitted</option>
 <option value="reviewing">Reviewing</option>
 <option value="approved">Approved</option>
 <option value="rejected">Rejected</option>
 </select>
 </div>
 </div>
 );
 })}
 </div>

 {/* Desktop Table View */}
 <table className="hidden md:table w-full text-left border-collapse min-w-[800px]">
 <thead>
 <tr className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
 <th className="p-4 w-12 text-center">
 <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628]"
 checked={selectedApps.length === tabApplications.length && tabApplications.length > 0}
 onChange={handleSelectAll}
 />
 </th>
 <th className="p-4">App No.</th>
 <th className="p-4">Student Info</th>
 <th className="p-4">Class & Year</th>
 <th className="p-4">Status</th>
 <th className="p-4">Submitted Date</th>
 <th className="p-4 text-center w-16">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {tabApplications.map(app => {
 const id = app.id || app._id;
 const name = `${app.firstName || app.first_name || ""} ${app.lastName || app.last_name || ""}`.trim();
 const status = app.status || "submitted";
 const isSelected = selectedApps.includes(id);

 return (
 <tr key={id} className={`group transition-colors hover:bg-slate-50 ${isSelected ? "bg-blue-50/30" : ""}`}>
 <td className="p-4 text-center">
 <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628]"
 checked={isSelected}
 onChange={() => setSelectedApps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
 />
 </td>
 <td className="p-4">
 <AppNoChip value={app.appNo || app.app_no || "—"} />
 </td>
 <td className="p-4">
 <div className="flex items-center gap-3">
 <Avatar name={name || "?"} />
 <div>
 <div className="font-semibold text-[#0a1628] text-sm group-hover:text-blue-700 transition-colors">{name}</div>
 <div className="text-xs text-slate-500 font-medium mt-0.5">{app.fatherPhone || app.father_phone || "—"}</div>
 </div>
 </div>
 </td>
 <td className="p-4">
 <div className="inline-flex flex-col">
 <span className="text-sm font-bold text-[#0a1628] bg-slate-100 px-2.5 py-0.5 rounded-md inline-block mb-1">{app.applyClass || app.apply_class}</span>
 <span className="text-xs text-slate-400 font-mono tracking-wide">{app.academicYear || app.academic_year}</span>
 </div>
 </td>
 <td className="p-4">
 <select
 value={status}
 onChange={e => handleStatusUpdate(id, e.target.value)}
 className={`text-xs font-bold rounded-full px-3 py-1.5 border-0 cursor-pointer outline-none transition-transform hover:scale-105 appearance-none text-center ${STATUS_CFG[status]?.bgClass} ${STATUS_CFG[status]?.textClass}`}
 >
 <option value="submitted">Submitted</option>
 <option value="reviewing">Reviewing</option>
 <option value="approved">Approved</option>
 <option value="rejected">Rejected</option>
 </select>
 </td>
 <td className="p-4 text-sm text-slate-500 font-mono tracking-wide">
 {app.submissionDate || app.submission_date ? new Date(app.submissionDate || app.submission_date).toLocaleDateString("en-IN") : "—"}
 </td>
 <td className="p-4 text-center relative">
 <div className="action-dropdown" ref={dropdownRef}>
 <button
 onClick={e => {
 if (dropdownOpen === id) { setDropdownOpen(null); return; }
 const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
 setDropdownPos({ top: r.bottom + 4, left: r.right - 180 });
 setDropdownOpen(id);
 }}
 className="p-1.5 text-slate-400 hover:text-[#0a1628] hover:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a1628]"
 >
 <MoreVertical className="w-5 h-5" />
 </button>
 {dropdownOpen === id && (
 <div className="fixed z-50 w-48 bg-white border border-slate-200 rounded-xl shadow-sm py-1 animate-in fade-in zoom-in-95" style={{ top: dropdownPos.top, left: dropdownPos.left }}>
 <button onClick={() => { setViewModalApp(app); setDropdownOpen(null); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0a1628] font-medium transition-colors">
 <Eye className="w-4 h-4 text-slate-400" /> View Details
 </button>
 <button onClick={() => { setSelectedApp(app); setTimeout(() => window.print(), 100); setDropdownOpen(null); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0a1628] font-medium transition-colors">
 <Printer className="w-4 h-4 text-slate-400" /> Print Form
 </button>
 <button onClick={() => handleDirectDownload(app)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0a1628] font-medium transition-colors">
 <Download className="w-4 h-4 text-slate-400" /> Download PDF
 </button>
 <button onClick={() => { shareApplication(app); setDropdownOpen(null); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0a1628] font-medium transition-colors">
 <Share2 className="w-4 h-4 text-slate-400" /> Share Link
 </button>
 <div className="h-px bg-slate-100 my-1"></div>
 <button onClick={() => { handleDelete(id); setDropdownOpen(null); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">
 <Trash2 className="w-4 h-4 text-red-400" /> Delete Application
 </button>
 </div>
 )}
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </>
 )}
 </div>
 </div>
 </div>
 </div>
 </main>
 </div>

 <ConfirmDialog
 isOpen={confirmDialog.isOpen}
 title={confirmDialog.title}
 message={confirmDialog.message}
 onConfirm={confirmDialog.onConfirm}
 onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
 type={confirmDialog.type}
 />
 </>
 );
};

export default AdminPage;