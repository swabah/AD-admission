import { useState, useEffect, useCallback } from "react";
import {
	deleteApplication,
	getAllApplications,
	updateApplicationStatus,
	verifyAdminToken,
	logoutAdmin,
	type ApplicationData,
	supabase,
} from "../services/supabase";
import StudentViewModal, {
	type RawStudentData,
} from "../components/StudentViewModal";
import EditApplicationModal from "../components/EditApplicationModal";
import ApplicationPrintDocument from "../components/ApplicationPrintDocument";
import BulkApplicationPrintDocument from "../components/BulkApplicationPrintDocument";
import ConfirmDialog from "../components/ConfirmDialog";
import {
	LoginScreen,
	AdminSidebar,
	AdminTableSkeleton,
	AppNoChip,
	Avatar,
	AdminTopbar,
	AdminFilters,
	AdminSummaryStats,
} from "../components/admin";
import { Button } from "@/components/ui/button";
import { downloadApplicationPDF } from "../utils/pdfDownloader";
import {
	Users,
	Eye,
	Pencil,
	Check,
	X,
	Download,
	Printer,
	Trash2,
	Share2,
	MoreVertical,
	ArrowLeft,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import printLogo from "../assets/horizontal-logo.png";

// ─── Shared tiny components ───────────────────────────────────────────────────
const STATUS_CFG: Record<
	string,
	{ label: string; textClass: string; bgClass: string; dotClass: string }
> = {
	submitted: {
		label: "Submitted",
		textClass: "text-blue-600",
		bgClass: "bg-blue-100",
		dotClass: "bg-blue-600",
	},
	reviewing: {
		label: "Reviewing",
		textClass: "text-purple-600",
		bgClass: "bg-purple-100",
		dotClass: "bg-purple-600",
	},
	approved: {
		label: "Approved",
		textClass: "text-emerald-600",
		bgClass: "bg-emerald-100",
		dotClass: "bg-emerald-600",
	},
	rejected: {
		label: "Rejected",
		textClass: "text-red-600",
		bgClass: "bg-red-100",
		dotClass: "bg-red-600",
	},
	deleted: {
		label: "Deleted",
		textClass: "text-slate-500",
		bgClass: "bg-slate-100/80",
		dotClass: "bg-slate-500",
	},
};

// Internal components moved to src/components/admin

// ─── Main AdminPage ───────────────────────────────────────────────────────────
const AdminPage = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [applications, setApplications] = useState<ApplicationData[]>([]);
	const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(null);
	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(true);
	const [viewModalApp, setViewModalApp] = useState<ApplicationData | null>(
		null,
	);
	const [downloadingApp, setDownloadingApp] = useState<ApplicationData | null>(
		null,
	);
	const [editModalApp, setEditModalApp] = useState<ApplicationData | null>(null);
	const [activeTab, setActiveTab] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [bulkDownloadApps, setBulkDownloadApps] = useState<ApplicationData[]>(
		[],
	);
	const [bulkPrintReady, setBulkPrintReady] = useState(false);
	const [classFilter, setClassFilter] = useState("all");
	const [departmentFilter, setDepartmentFilter] = useState("all");
	const [sortBy, setSortBy] = useState("date");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [selectedApps, setSelectedApps] = useState<string[]>([]);
	
	// Reset bulk print ready state when selection or tab changes
	useEffect(() => {
		setBulkPrintReady(false);
	}, [selectedApps, activeTab]);

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [processingAction, setProcessingAction] = useState<string | null>(null);
	const [confirmDialog, setConfirmDialog] = useState<{
		isOpen: boolean;
		title: string;
		message: string;
		onConfirm: () => void;
		type: "danger" | "warning" | "info";
	}>({
		isOpen: false,
		title: "",
		message: "",
		onConfirm: () => {},
		type: "danger",
	});


	const fetchApplications = useCallback(async (page = 1) => {
		setLoading(true);
		try {
			const result = await getAllApplications({ 
				page, 
				pageSize: 100,
				includeDeleted: true // Always include so we can filter for "Deleted" tab
			});
			if (page === 1) {
				setApplications(result.data);
			} else {
				setApplications((prev) => [...prev, ...result.data]);
			}
			setTotalCount(result.totalCount);
			setHasMore(result.hasMore);
			setCurrentPage(page);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}, []);

	// Check for existing auth token on mount
	useEffect(() => {
		const checkAuth = async () => {
			const valid = await verifyAdminToken();
			if (valid) {
				setIsAuthenticated(true);
				fetchApplications();
			} else {
				setLoading(false);
			}
		};
		checkAuth();
	}, [fetchApplications]);

	// Listen for auth state changes
	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN" && session) {
				setIsAuthenticated(true);
				fetchApplications();
			} else if (event === "SIGNED_OUT") {
				setIsAuthenticated(false);
				setApplications([]);
			}
		});
		return () => subscription.unsubscribe();
	}, [fetchApplications]);

	const handleLogin = () => {
		setIsAuthenticated(true);
		fetchApplications(1);
	};

	const handleLogout = async () => {
		await logoutAdmin();
		setIsAuthenticated(false);
		setApplications([]);
	};

	const handleStatusUpdate = async (id: string, status: string) => {
		await updateApplicationStatus(id, status);
		fetchApplications();
	};

	const handleRestore = async (id: string) => {
		setProcessingAction(`restore-${id}`);
		try {
			await updateApplicationStatus(id, "submitted");
			fetchApplications();
		} catch (error) {
			console.error("Error restoring application:", error);
		} finally {
			setProcessingAction(null);
		}
	};

	const handleDelete = (id: string, photoUrl?: string | null) => {
		const app = applications.find(a => a.id === id);
		const isCurrentlyDeleted = app?.status === 'deleted';

		setConfirmDialog({
			isOpen: true,
			title: isCurrentlyDeleted ? "Permanently Delete" : "Move to Trash",
			message: isCurrentlyDeleted
				? "This application is already in the deleted tab. This action will permanently remove it and its photo from the database. This cannot be undone."
				: "Are you sure you want to move this application to trash? You can still find it in the Deleted filter.",
			onConfirm: async () => {
				try {
					await deleteApplication(id, photoUrl, isCurrentlyDeleted);
					fetchApplications(1);
					setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
				} catch (error) {
					console.error("Error deleting application:", error);
					alert("Failed to delete application. Please try again.");
				}
			},
			type: "danger",
		});
	};

	const shareApplication = async (app: ApplicationData) => {
		const name = `${app.firstName} ${app.lastName}`;
		const shareData = {
			title: `Application: ${name}`,
			text: `*Ahlussuffa Admission Portal*\n\n*Student Details:*\n- Name: ${name}\n- DOB: ${app.dob}\n- Phone: ${app.fatherPhone}\n- Application No: ${app.appNo}\n- Applying for: ${app.applyClass}\n- Academic Year: ${app.academicYear}\n- Current Status: ${app.status?.toUpperCase()}\n\nYou can track your application status using the link below:`,
			url: `${window.location.origin}/locate`,
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
			} catch (err) {
				console.error("Share failed:", err);
			}
		} else {
			const fullText = `${shareData.text}\n\n${shareData.url}`;
			navigator.clipboard.writeText(fullText);
			alert("Application details and link copied to clipboard!");
		}
	};

	const preloadImage = (url: string): Promise<void> => {
		return new Promise((resolve) => {
			if (!url) {
				resolve();
				return;
			}
			const img = new Image();
			img.onload = () => resolve();
			img.onerror = () => resolve(); // Resolve anyway to not block
			img.src = url;
		});
	};

	const handlePrint = async (app: ApplicationData) => {
		const id = app.id!;
		setProcessingAction(`print-${id}`);

		try {
			// Ensure photo and logo are preloaded
			const photo = app.photo || app.photoUrl;
			const preloads = [preloadImage(printLogo)];
			if (photo) preloads.push(preloadImage(photo));
			await Promise.all(preloads);

			setSelectedApp(app);
			
			// Use requestAnimationFrame to ensure the component is rendered
			await new Promise((resolve) => {
				requestAnimationFrame(() => {
					// Small delay to ensure styles are applied
					setTimeout(() => {
						window.print();
						resolve(null);
					}, 800);
				});
			});
		} catch (err) {
			console.error("Print failed:", err);
		} finally {
			setProcessingAction(null);
		}
	};

	const handleDirectDownload = async (app: ApplicationData) => {
		const id = app.id!;
		setProcessingAction(`download-${id}`);
		setDownloadingApp(app);

		try {
			// Ensure photo and logo are preloaded
			const photo = app.photo || app.photoUrl;
			const preloads = [preloadImage(printLogo)];
			if (photo) preloads.push(preloadImage(photo));
			await Promise.all(preloads);

			// Use requestAnimationFrame to ensure the component is rendered before generating PDF
			await new Promise((resolve) => {
				requestAnimationFrame(async () => {
					// Small delay to ensure DOM is ready
					await new Promise((r) => setTimeout(r, 500));
					const name = `${app.firstName || ""} ${app.lastName || ""}`.trim();
					try {
						await downloadApplicationPDF(app.appNo || "application", name);
					} catch (error) {
						console.error("PDF download failed:", error);
						alert("Failed to download PDF. Please try again.");
					}
					resolve(null);
				});
			});
		} finally {
			setDownloadingApp(null);
			setProcessingAction(null);
		}
	};

	const exportData = () => {
		const appsToExport = selectedApps.length > 0 
			? applications.filter(app => selectedApps.includes(app.id!))
			: tabApplications;

		if (!appsToExport.length) return;

		const rows = appsToExport.map((app) => ({
			"Application No": app.appNo || "",
			"Full Name": `${app.firstName || ""} ${app.lastName || ""}`.trim(),
			"Date of Birth": app.dob ? new Date(app.dob).toLocaleDateString("en-IN") : "",
			"Applied Class": app.applyClass || "",
			"Academic Year": app.academicYear || "",
			"Department": app.stream || "",
			"Current Status": (app.status || "submitted").toUpperCase(),
			"Submission Date": app.submissionDate 
				? new Date(app.submissionDate as string).toLocaleDateString("en-IN") 
				: "",
			"Father Name": app.fatherName || "",
			"Father Phone": app.fatherPhone || "",
			"Mother Name": app.motherName || "",
			"Mother Phone": app.motherPhone || "",
			"Residential Address": app.address?.replace(/\n/g, " ") || "",
			"Nationality": app.nationality || "",
			"Aadhar No": app.aadhar || "",
			"Previous School": app.prevSchool || "",
			"Previous Class": app.prevClass || "",
			"Result %": app.prevPercentage || "",
			"Family Income": app.income || "",
			"Medical Info": app.medical || "",
			"Referral Source": app.referral || "",
			"Admin Remarks": app.remarks || "",
		}));

		const headers = Object.keys(rows[0]);
		const csvContent = [
			headers.join(","),
			...rows.map((row) =>
				headers
					.map((header) => {
						const val = (row as any)[header];
						// Escape quotes and wrap in quotes if contains comma/newline
						const escaped = String(val ?? "").replace(/"/g, '""');
						return `"${escaped}"`;
					})
					.join(","),
			),
		].join("\r\n");

		// Add UTF-8 BOM for Excel
		const BOM = "\uFEFF";
		const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
		
		const filename = selectedApps.length > 0 
			? `selected_applications_${new Date().toISOString().split("T")[0]}.csv`
			: `applications_${activeTab}_${new Date().toISOString().split("T")[0]}.csv`;

		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = filename;
		link.click();
		URL.revokeObjectURL(link.href);
	};

	const handleBulkPrint = async () => {
		const appsToPrint = selectedApps.length > 0 
			? applications.filter(app => selectedApps.includes(app.id!))
			: tabApplications;

		if (!appsToPrint.length) return;

		// If already ready, just print
		if (bulkPrintReady) {
			window.print();
			// We don't reset here immediately so the user can print again if they want
			// but selection changes will reset it.
			return;
		}

		if (appsToPrint.length > 50) {
			if (
				!confirm(
					`You are about to print ${appsToPrint.length} applications. This might take a while. Continue?`,
				)
			)
				return;
		}

		setProcessingAction("bulk-print");
		setBulkDownloadApps(appsToPrint); // Render the area

		try {
			// Preload global assets
			await preloadImage(printLogo);

			// Preload all student photos
			const photoPreloads = appsToPrint
				.map((app) => app.photo || app.photoUrl)
				.filter(Boolean)
				.map((url) => preloadImage(url as string));

			if (photoPreloads.length > 0) {
				await Promise.all(photoPreloads);
			}

			// Wait for components to render
			await new Promise((resolve) => {
				requestAnimationFrame(() => {
					setTimeout(resolve, 1500);
				});
			});

			setBulkPrintReady(true);
		} catch (err) {
			console.error("Bulk print preparation failed:", err);
			alert("Failed to prepare documents for printing.");
		} finally {
			setProcessingAction(null);
		}
	};

	const uniqueClasses = [
		...new Set(applications.map((a) => a.applyClass).filter(Boolean)),
	];

	const filtered = applications
		.filter((app) => {
			const name = `${app.firstName || ""} ${app.lastName || ""}`.toLowerCase();
			const appNo = (app.appNo || "").toLowerCase();
			const father = (app.fatherName || "").toLowerCase();
			const q = searchTerm.toLowerCase();
			const matchSearch =
				!q || name.includes(q) || appNo.includes(q) || father.includes(q);
			const matchStatus =
				statusFilter === "all"
					? app.status !== "deleted"
					: app.status === statusFilter;
			const matchClass =
				classFilter === "all" || app.applyClass === classFilter;
			const matchDepartment =
				departmentFilter === "all" || app.stream === departmentFilter;
			return matchSearch && matchStatus && matchClass && matchDepartment;
		})
		.sort((a, b) => {
			let av: string | Date, bv: string | Date;
			if (sortBy === "date") {
				av = new Date(a.submissionDate as string);
				bv = new Date(b.submissionDate as string);
			} else if (sortBy === "name") {
				av = `${a.firstName}`;
				bv = `${b.firstName}`;
			} else if (sortBy === "class") {
				av = a.applyClass;
				bv = b.applyClass;
			} else {
				av = a.status || "submitted";
				bv = b.status || "submitted";
			}
			return sortOrder === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
		});

	const tabApplications =
		activeTab === "all"
			? filtered
			: filtered.filter((app) => {
					if (activeTab === "submitted")
						return !app.status || app.status === "submitted";
					return app.status === activeTab;
				});

	const TABS = [
		{ id: "all", label: "All", count: applications.filter(a => a.status !== 'deleted').length },
		{ id: "submitted", label: "Pending", count: applications.filter(a => !a.status || a.status === 'submitted').length },
		{ id: "reviewing", label: "Reviewing", count: applications.filter(a => a.status === 'reviewing').length },
		{ id: "approved", label: "Approved", count: applications.filter(a => a.status === 'approved').length },
		{ id: "rejected", label: "Rejected", count: applications.filter(a => a.status === 'rejected').length },
		{ id: "deleted", label: "Trash", count: applications.filter(a => a.status === 'deleted').length },
	];

	const handleSelectAll = () => {
		setSelectedApps(
			selectedApps.length === tabApplications.length &&
				tabApplications.length > 0
				? []
				: tabApplications
						.map((a) => a.id)
						.filter((id): id is string => Boolean(id)),
		);
	};

	const handleBulkStatus = async (status: string) => {
		if (
			!selectedApps.length ||
			!confirm(`Update ${selectedApps.length} applications to "${status}"?`)
		)
			return;
		setProcessingAction(`bulk-${status}`);
		try {
			await Promise.all(
				selectedApps.map((id) => updateApplicationStatus(id, status)),
			);
			setSelectedApps([]);
			fetchApplications();
		} finally {
			setProcessingAction(null);
		}
	};

	const handleBulkDelete = () => {
		if (!selectedApps.length) return;
		setConfirmDialog({
			isOpen: true,
			title: "Delete Multiple Applications",
			message: `Are you sure you want to delete ${selectedApps.length} application(s) permanently? This action cannot be undone.`,
			onConfirm: async () => {
				try {
					await Promise.all(selectedApps.map((id) => deleteApplication(id)));
					setSelectedApps([]);
					fetchApplications();
					setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
				} catch (error) {
					console.error("Error in bulk delete:", error);
					alert("Failed to delete some applications. Please try again.");
				}
			},
			type: "danger",
		});
	};

	if (!isAuthenticated)
		return <LoginScreen onLogin={handleLogin} onLoading={() => {}} />;

	if (selectedApp)
		return (
			<div className="font-sans min-h-screen bg-[#faf8f5] single-print-wrapper">
				<div className="no-print sticky top-0 z-50 bg-[#0a1628] border-b border-[#c8922a]/30 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm backdrop-blur-md">
					<button
						type="button"
						onClick={() => setSelectedApp(null)}
						className="inline-flex items-center gap-2 text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2 transition-all"
					>
						<ArrowLeft className="w-4 h-4" /> Back to Dashboard
					</button>
					<button
						type="button"
						onClick={() => window.print()}
						className="inline-flex items-center gap-2 text-sm text-white bg-[#c8922a] hover:bg-[#b07d20] rounded-xl px-4 py-2 transition-all"
					>
						<Printer className="w-4 h-4" /> Print
					</button>
				</div>
				<div className="print-content-container">
					<ApplicationPrintDocument app={selectedApp} />
				</div>
			</div>
		);

	return (
		<>
			<StudentViewModal
				app={viewModalApp as RawStudentData}
				open={!!viewModalApp}
				onOpenChange={(open) => !open && setViewModalApp(null)}
			/>
			<EditApplicationModal
				app={editModalApp}
				open={!!editModalApp}
				onOpenChange={(open) => !open && setEditModalApp(null)}
				onSuccess={() => fetchApplications(currentPage)}
			/>
			{downloadingApp && (
				<div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
					<ApplicationPrintDocument app={downloadingApp} />
				</div>
			)}
			<div className="flex min-h-screen font-sans bg-slate-50 text-slate-800 no-print">
				{/* Sidebar */}
				<AdminSidebar
					applications={applications}
					onExport={exportData}
					onExportPDF={handleBulkPrint}
					onRefresh={() => fetchApplications(1)}
					onLogout={handleLogout}
					mobileMenuOpen={mobileMenuOpen}
					bulkPrintReady={bulkPrintReady}
					processingAction={processingAction}
				/>

				{/* Mobile Overlay */}
				{mobileMenuOpen && (
					<button
						type="button"
						className="fixed inset-0 bg-[#0a1628]/50 backdrop-blur-sm z-30 lg:hidden cursor-pointer"
						onClick={() => setMobileMenuOpen(false)}
						aria-label="Close mobile menu"
					/>
				)}

				{/* Main Area */}
				<main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
					<AdminTopbar
						onMenuClick={() => setMobileMenuOpen(true)}
						onExportCSV={exportData}
						onExportPDF={handleBulkPrint}
						onRefresh={() => fetchApplications(1)}
						isLoading={loading}
						processingAction={processingAction}
						bulkPrintReady={bulkPrintReady}
					/>

					<div className="flex-1 overflow-y-auto bg-slate-50">
						<div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
							<AdminSummaryStats
								applications={applications}
								isLoading={loading}
							/>

							<div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
								<div className="p-4 lg:p-6 border-b border-slate-100 bg-white sticky top-0 z-20">
									<AdminFilters
										searchTerm={searchTerm}
										onSearchChange={setSearchTerm}
										statusFilter={statusFilter}
										onStatusChange={(s) => {
											setStatusFilter(s);
											setActiveTab(s);
										}}
										classFilter={classFilter}
										onClassChange={setClassFilter}
										departmentFilter={departmentFilter}
										onDepartmentChange={setDepartmentFilter}
										sortBy={sortBy}
										onSortByChange={setSortBy}
										sortOrder={sortOrder}
										onSortOrderToggle={() =>
											setSortOrder((s) => (s === "asc" ? "desc" : "asc"))
										}
										uniqueClasses={uniqueClasses}
										onDropdownClose={() => setDropdownOpen(null)}
										onRestore={handleRestore}
									/>
								</div>

								{/* Bulk Actions */}
								{selectedApps.length > 0 && (
									<div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl animate-in slide-in-from-top-2 overflow-x-auto">
										<span className="text-sm font-bold text-blue-800 whitespace-nowrap px-2">
											{selectedApps.length} selected
										</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											loading={processingAction === "bulk-approved"}
											disabled={processingAction !== null}
											onClick={() => handleBulkStatus("approved")}
											className="flex items-center gap-1.5 bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm font-semibold shadow-sm whitespace-nowrap"
										>
											<Check className="w-4 h-4" /> Approve
										</Button>
										<Button
											type="button"
											variant="outline"
											size="sm"
											loading={processingAction === "bulk-rejected"}
											disabled={processingAction !== null}
											onClick={() => handleBulkStatus("rejected")}
											className="flex items-center gap-1.5 bg-white border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-sm font-semibold shadow-sm whitespace-nowrap"
										>
											<X className="w-4 h-4" /> Reject
										</Button>
										<button
											type="button"
											onClick={handleBulkDelete}
											className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
										>
											<Trash2 className="w-4 h-4" /> Delete
										</button>

										<div className="h-6 w-px bg-blue-200 mx-1 shrink-0" />

										<Button
											type="button"
											variant="outline"
											size="sm"
											loading={processingAction === "bulk-print"}
											disabled={processingAction !== null && processingAction !== "bulk-print"}
											onClick={handleBulkPrint}
											className={`flex items-center gap-1.5 bg-white border-blue-200 rounded-lg text-sm font-semibold shadow-sm whitespace-nowrap transition-all ${bulkPrintReady ? "text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100" : "text-blue-700 hover:bg-blue-50"}`}
										>
											<Printer className="w-4 h-4" /> 
											{processingAction === "bulk-print" ? "Cooking..." : bulkPrintReady ? "Ready to Print" : "Bulk Print"}
										</Button>
										<button
											type="button"
											onClick={() => setSelectedApps([])}
											className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 bg-transparent hover:bg-slate-200/50 rounded-lg transition-colors ml-auto whitespace-nowrap"
										>
											Clear
										</button>
									</div>
								)}
							</div>

							{/* Main Content Area */}
							<div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
								{/* Tabs */}
								<div className="flex overflow-x-auto border-b border-slate-100 hide-scrollbar bg-slate-50/50">
									{TABS.map((tab) => (
										<button
											type="button"
											key={tab.id}
											onClick={() => {
												setActiveTab(tab.id);
												setStatusFilter(tab.id);
											}}
											className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? "border-[#0a1628] text-[#0a1628] bg-white" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
										>
											{tab.label}
											<span
												className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-[#0a1628] text-white" : "bg-slate-200 text-slate-600"}`}
											>
												{tab.count}
											</span>
										</button>
									))}
								</div>

								<div className="p-0 overflow-x-auto">
									{loading ? (
										<AdminTableSkeleton />
									) : tabApplications.length === 0 ? (
										<div className="p-20 flex flex-col items-center justify-center text-slate-400">
											<div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
												<Users className="w-8 h-8 text-slate-300" />
											</div>
											<p className="text-sm font-medium text-slate-500">
												No applications found.
											</p>
										</div>
									) : (
										<>
											{/* Mobile Cards View */}
											<div className="md:hidden flex flex-col gap-4 p-4">
												<div className="flex items-center justify-between">
													<label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
														<input
															type="checkbox"
															className="w-5 h-5 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628]"
															checked={
																selectedApps.length ===
																	tabApplications.length &&
																tabApplications.length > 0
															}
															onChange={handleSelectAll}
														/>
														Select All{" "}
														{tabApplications.length > 0 &&
															`(${tabApplications.length})`}
													</label>
												</div>
												{tabApplications.map((app) => {
													const id = app.id;
													if (!id) return null;
													const name =
														`${app.firstName || ""} ${app.lastName || ""}`.trim();
													const status = app.status || "submitted";
													const isSelected = selectedApps.includes(id);

													return (
														<div
															key={id}
															className={`flex flex-col bg-white border rounded-2xl p-4 shadow-sm relative transition-all ${isSelected ? "border-blue-400 bg-blue-50/50 ring-2 ring-blue-100" : "border-slate-200"}`}
														>
															<div className="flex justify-between items-start mb-4">
																<div className="flex items-center gap-3">
																	<input
																		type="checkbox"
																		className="w-5 h-5 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628]"
																		checked={isSelected}
																		onChange={() =>
																			setSelectedApps((prev) =>
																				prev.includes(id)
																					? prev.filter((x) => x !== id)
																					: [...prev, id],
																			)
																		}
																	/>
																	<AppNoChip value={app.appNo || "—"} />
																</div>
																<DropdownMenu>
																	<DropdownMenuTrigger asChild>
																		<button
																			type="button"
																			className="p-1.5 text-slate-400 hover:text-[#0a1628] hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
																		>
																			<MoreVertical className="w-5 h-5" />
																		</button>
																	</DropdownMenuTrigger>
																	<DropdownMenuContent
																		align="end"
																		className="w-48 rounded-xl"
																	>
																		<DropdownMenuItem
																			onClick={() => setViewModalApp(app)}
																			className="gap-2 py-2.5 font-medium cursor-pointer"
																		>
																			<Eye className="w-4 h-4 text-slate-400" />{" "}
																			View Details
																		</DropdownMenuItem>
																		<DropdownMenuItem
																			onClick={() => setEditModalApp(app)}
																			className="gap-2 py-2.5 font-medium cursor-pointer"
																		>
																			<Pencil className="w-4 h-4 text-slate-400" />{" "}
																			Edit Details
																		</DropdownMenuItem>
																		<DropdownMenuItem
																			onClick={() => handlePrint(app)}
																			disabled={processingAction !== null}
																			className="gap-2 py-2.5 font-medium cursor-pointer"
																		>
																			<Printer className="w-4 h-4 text-slate-400" />{" "}
																			{processingAction === `print-${id}`
																				? "Preparing..."
																				: "Print Form"}
																		</DropdownMenuItem>
																		<DropdownMenuItem
																			onClick={() => handleDirectDownload(app)}
																			disabled={processingAction !== null}
																			className="gap-2 py-2.5 font-medium cursor-pointer"
																		>
																			<Download className="w-4 h-4 text-slate-400" />{" "}
																			{processingAction === `download-${id}`
																				? "Downloading..."
																				: "Download PDF"}
																		</DropdownMenuItem>
																		<DropdownMenuItem
																			onClick={() => shareApplication(app)}
																			className="gap-2 py-2.5 font-medium cursor-pointer"
																		>
																			<Share2 className="w-4 h-4 text-slate-400" />{" "}
																			Share Link
																		</DropdownMenuItem>
																		<DropdownMenuSeparator />
																		{status === "deleted" ? (
																			<>
																				<DropdownMenuItem
																					onClick={() => handleRestore(id)}
																					className="gap-2 py-2.5 font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
																				>
																					<ArrowLeft className="w-4 h-4 text-emerald-400" />{" "}
																					Restore from Trash
																				</DropdownMenuItem>
																				<DropdownMenuItem
																					onClick={() =>
																						handleDelete(id, app.photoUrl)
																					}
																					className="gap-2 py-2.5 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
																				>
																					<Trash2 className="w-4 h-4 text-red-400" />{" "}
																					Delete Permanently
																				</DropdownMenuItem>
																			</>
																		) : (
																			<DropdownMenuItem
																				onClick={() =>
																					handleDelete(id, app.photoUrl)
																				}
																				className="gap-2 py-2.5 font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
																			>
																				<Trash2 className="w-4 h-4 text-slate-400" />{" "}
																				Move to Trash
																			</DropdownMenuItem>
																		)}
																	</DropdownMenuContent>
																</DropdownMenu>
															</div>

															<div className="flex items-center gap-4 mb-4">
																<Avatar name={name || "?"} />
																<div>
																	<div className="font-bold text-[#0a1628] text-base">
																		{name}
																	</div>
																	<div className="text-sm text-slate-500 font-medium mt-0.5">
																		{app.fatherPhone || "—"}
																	</div>
																</div>
															</div>

															<div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
																<div>
																	<div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
																		Class
																	</div>
																	<div className="font-semibold text-slate-800">
																		{app.applyClass}
																	</div>
																</div>
																<div>
																	<div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
																		Year
																	</div>
																	<div className="font-mono text-sm font-semibold text-slate-600">
																		{app.academicYear}
																	</div>
																</div>
																<div>
																	<div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
																		Date
																	</div>
																	<div className="font-mono text-sm font-semibold text-slate-600">
																		{app.submissionDate
																			? new Date(
																					app.submissionDate as string,
																				).toLocaleDateString("en-IN")
																			: "—"}
																	</div>
																</div>
															</div>

															<div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
																<span className="text-xs font-bold text-slate-400 uppercase">
																	Status
																</span>
																<select
																	value={status}
																	onChange={(e) =>
																		handleStatusUpdate(id, e.target.value)
																	}
																	className={`text-xs font-bold rounded-full px-4 py-2 border-0 cursor-pointer outline-none transition-transform hover:scale-105 appearance-none text-center ${STATUS_CFG[status]?.bgClass} ${STATUS_CFG[status]?.textClass}`}
																>
																	<option value="submitted">Submitted</option>
																	<option value="reviewing">Reviewing</option>
																	<option value="approved">Approved</option>
																	<option value="rejected">Rejected</option>
																	{status === "deleted" && (
																		<option value="deleted">Deleted</option>
																	)}
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
															<input
																type="checkbox"
																className="w-4 h-4 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628]"
																checked={
																	selectedApps.length ===
																		tabApplications.length &&
																	tabApplications.length > 0
																}
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
													{tabApplications.map((app) => {
														const id = app.id;
														if (!id) return null;
														const name =
															`${app.firstName || ""} ${app.lastName || ""}`.trim();
														const status = app.status || "submitted";
														const isSelected = selectedApps.includes(id);

														return (
															<tr
																key={id}
																className={`group transition-colors hover:bg-slate-50 ${isSelected ? "bg-blue-50/30" : ""}`}
															>
																<td className="p-4 text-center">
																	<input
																		type="checkbox"
																		className="w-4 h-4 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628]"
																		checked={isSelected}
																		onChange={() =>
																			setSelectedApps((prev) =>
																				prev.includes(id)
																					? prev.filter((x) => x !== id)
																					: [...prev, id],
																			)
																		}
																	/>
																</td>
																<td className="p-4">
																	<AppNoChip value={app.appNo || "—"} />
																</td>
																<td className="p-4">
																	<div className="flex items-center gap-3">
																		<Avatar name={name || "?"} />
																		<div>
																			<div className="font-semibold text-[#0a1628] text-sm group-hover:text-blue-700 transition-colors">
																				{name}
																			</div>
																			<div className="text-xs text-slate-500 font-medium mt-0.5">
																				{app.fatherPhone || "—"}
																			</div>
																		</div>
																	</div>
																</td>
																<td className="p-4">
																	<div className="inline-flex flex-col">
																		<span className="text-sm font-bold text-[#0a1628] bg-slate-100 px-2.5 py-0.5 rounded-md inline-block mb-1">
																			{app.applyClass}
																		</span>
																		<span className="text-xs text-slate-400 font-mono tracking-wide">
																			{app.academicYear}
																		</span>
																	</div>
																</td>
																<td className="p-4">
																	<select
																		value={status}
																		onChange={(e) =>
																			handleStatusUpdate(id, e.target.value)
																		}
																		className={`text-xs font-bold rounded-full px-3 py-1.5 border-0 cursor-pointer outline-none transition-transform hover:scale-105 appearance-none text-center ${STATUS_CFG[status]?.bgClass} ${STATUS_CFG[status]?.textClass}`}
																	>
																		<option value="submitted">Submitted</option>
																		<option value="reviewing">Reviewing</option>
																		<option value="approved">Approved</option>
																		<option value="rejected">Rejected</option>
																		{status === "deleted" && (
																			<option value="deleted">Deleted</option>
																		)}
																	</select>
																</td>
																<td className="p-4 text-sm text-slate-500 font-mono tracking-wide">
																	{app.submissionDate
																		? new Date(
																				app.submissionDate as string,
																			).toLocaleDateString("en-IN")
																		: "—"}
																</td>
																<td className="p-4 text-center relative">
																	<DropdownMenu>
																		<DropdownMenuTrigger asChild>
																			<button
																				type="button"
																				className="p-1.5 text-slate-400 hover:text-[#0a1628] hover:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a1628]"
																			>
																				<MoreVertical className="w-5 h-5" />
																			</button>
																		</DropdownMenuTrigger>
																		<DropdownMenuContent
																			align="end"
																			className="w-48 rounded-xl"
																		>
																			<DropdownMenuItem
																				onClick={() => setViewModalApp(app)}
																				className="gap-2 py-2.5 font-medium cursor-pointer"
																			>
																				<Eye className="w-4 h-4 text-slate-400" />{" "}
																				View Details
																			</DropdownMenuItem>
																			<DropdownMenuItem
																				onClick={() => setEditModalApp(app)}
																				className="gap-2 py-2.5 font-medium cursor-pointer"
																			>
																				<Pencil className="w-4 h-4 text-slate-400" />{" "}
																				Edit Details
																			</DropdownMenuItem>
																			<DropdownMenuItem
																				onClick={() => handlePrint(app)}
																				disabled={processingAction !== null}
																				className="gap-2 py-2.5 font-medium cursor-pointer"
																			>
																				<Printer className="w-4 h-4 text-slate-400" />{" "}
																				{processingAction === `print-${id}`
																					? "Preparing..."
																					: "Print Form"}
																			</DropdownMenuItem>
																			<DropdownMenuItem
																				onClick={() =>
																					handleDirectDownload(app)
																				}
																				disabled={processingAction !== null}
																				className="gap-2 py-2.5 font-medium cursor-pointer"
																			>
																				<Download className="w-4 h-4 text-slate-400" />{" "}
																				{processingAction === `download-${id}`
																					? "Downloading..."
																					: "Download PDF"}
																			</DropdownMenuItem>
																			<DropdownMenuItem
																				onClick={() => shareApplication(app)}
																				className="gap-2 py-2.5 font-medium cursor-pointer"
																			>
																				<Share2 className="w-4 h-4 text-slate-400" />{" "}
																				Share Link
																			</DropdownMenuItem>
																			<DropdownMenuSeparator />
																			{status === "deleted" ? (
																				<>
																					<DropdownMenuItem
																						onClick={() => handleRestore(id)}
																						className="gap-2 py-2.5 font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
																					>
																						<ArrowLeft className="w-4 h-4 text-emerald-400" />{" "}
																						Restore from Trash
																					</DropdownMenuItem>
																					<DropdownMenuItem
																						onClick={() =>
																							handleDelete(id, app.photoUrl)
																						}
																						className="gap-2 py-2.5 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
																					>
																						<Trash2 className="w-4 h-4 text-red-400" />{" "}
																						Delete Permanently
																					</DropdownMenuItem>
																				</>
																			) : (
																				<DropdownMenuItem
																					onClick={() =>
																						handleDelete(id, app.photoUrl)
																					}
																					className="gap-2 py-2.5 font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
																				>
																					<Trash2 className="w-4 h-4 text-slate-400" />{" "}
																					Move to Trash
																				</DropdownMenuItem>
																			)}
																		</DropdownMenuContent>
																	</DropdownMenu>
																</td>
															</tr>
														);
													})}
												</tbody>
											</table>

											{/* Pagination */}
											{hasMore && (
												<div className="p-4 border-t border-slate-100 flex justify-center">
													<Button
														type="button"
														variant="secondary"
														onClick={() => fetchApplications(currentPage + 1)}
														loading={loading}
														disabled={loading}
														className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl"
													>
														<Download className="w-4 h-4" />
														Load More ({totalCount - applications.length}{" "}
														remaining)
													</Button>
												</div>
											)}
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>

			{/* Bulk Download Area (Hidden) */}
			{bulkDownloadApps.length > 0 && (
				<div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none bulk-print-wrapper">
					<BulkApplicationPrintDocument applications={bulkDownloadApps} />
				</div>
			)}

			<ConfirmDialog
				isOpen={confirmDialog.isOpen}
				title={confirmDialog.title}
				message={confirmDialog.message}
				onConfirm={confirmDialog.onConfirm}
				onCancel={() =>
					setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
				}
				type={confirmDialog.type}
			/>
		</>
	);
};

export default AdminPage;
