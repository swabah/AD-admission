import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	getApplicationById,
	updateApplicationStatus,
} from "../services/supabase";
import logo from "../assets/logo.jpg";
import ApplicationPrintDocument from "../components/ApplicationPrintDocument";
import { downloadApplicationPDF } from "../utils/pdfDownloader";
import ViewDetailItem from "../components/ViewDetailItem";

interface Application {
	id: string;
	appNo: string;
	firstName: string;
	lastName: string;
	dob: string;
	gender?: string;
	bloodGroup?: string;
	nationality?: string;
	aadhar?: string;
	studentPhone?: string;
	address: string;
	applyClass: string;
	academicYear: string;
	stream?: string;
	prevSchool?: string;
	prevClass?: string;
	prevBoard?: string;
	prevPercentage?: string;
	achievements?: string;
	fatherName: string;
	fatherOcc?: string;
	fatherPhone: string;
	fatherEmail?: string;
	motherName: string;
	motherOcc?: string;
	motherPhone?: string;
	motherEmail?: string;
	income?: string;
	emergencyName?: string;
	emergencyPhone?: string;
	medical?: string;
	referral?: string;
	remarks?: string;
	photo?: string;
	submissionDate: string;
	status?: string;
	admissionType?: string;
}

const STATUS_OPTIONS = [
	{ value: "submitted", label: "Submitted", color: "#2563eb", bg: "#dbeafe" },
	{
		value: "reviewing",
		label: "Under Review",
		color: "#7c3aed",
		bg: "#ede9fe",
	},
	{ value: "approved", label: "Approved", color: "#059669", bg: "#d1fae5" },
	{ value: "rejected", label: "Rejected", color: "#dc2626", bg: "#fee2e2" },
];

const AdminApplicationView = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [application, setApplication] = useState<Application | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showPrintView, setShowPrintView] = useState(false);
	const [updatingStatus, setUpdatingStatus] = useState(false);

	useEffect(() => {
		const fetchApplication = async () => {
			if (!id) {
				setError("No application ID provided");
				setLoading(false);
				return;
			}
			try {
				const data = await getApplicationById(id);
				// Convert snake_case to camelCase
				const formatted: Application = {
					...data,
					// Ensure all camelCase fields are explicitly assigned if needed, 
					// but since getApplicationById already returns them, we just spread.
					// We add explicit mappings for any potential mismatches or missing fields.
					id: data.id || id,
					appNo: data.appNo,
					firstName: data.firstName,
					lastName: data.lastName,
					dob: data.dob,
					bloodGroup: data.bloodGroup,
					nationality: data.nationality,
					aadhar: data.aadhar,
					studentPhone: data.studentPhone,
					address: data.address,
					applyClass: data.applyClass,
					academicYear: data.academicYear,
					stream: data.stream,
					prevSchool: data.prevSchool,
					prevClass: data.prevClass,
					prevBoard: data.prevBoard,
					prevPercentage: data.prevPercentage,
					achievements: data.achievements,
					fatherName: data.fatherName,
					fatherOcc: data.fatherOcc,
					fatherPhone: data.fatherPhone,
					fatherEmail: data.fatherEmail,
					motherName: data.motherName,
					motherOcc: data.motherOcc,
					motherPhone: data.motherPhone,
					motherEmail: data.motherEmail,
					emergencyName: data.emergencyName,
					emergencyPhone: data.emergencyPhone,
					income: data.income,
					medical: data.medical,
					referral: data.referral,
					remarks: data.remarks,
					submissionDate: data.submissionDate,
					admissionType: data.admissionType,
					status: data.status,
					photo: data.photo || data.photoUrl,
				};
				setApplication(formatted);
			} catch (err) {
				console.error("Error fetching application:", err);
				setError("Failed to load application");
			} finally {
				setLoading(false);
			}
		};

		fetchApplication();
	}, [id]);

	const handleStatusChange = async (newStatus: string) => {
		if (!application || !id) return;
		setUpdatingStatus(true);
		try {
			await updateApplicationStatus(id, newStatus);
			setApplication({ ...application, status: newStatus });
		} catch (err) {
			console.error("Error updating status:", err);
			alert("Failed to update status");
		} finally {
			setUpdatingStatus(false);
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
			img.onerror = () => resolve();
			img.src = url;
		});
	};

	const handlePrint = async () => {
		if (!application) return;
		setUpdatingStatus(true); // Reusing for loading state
		try {
			// Preload logo and student photo
			const photo = application.photo;
			const preloads = [preloadImage(logo)];
			if (photo) preloads.push(preloadImage(photo));
			await Promise.all(preloads);

			setShowPrintView(true);
			// Delay to ensure print component is rendered and styles applied
			setTimeout(() => {
				window.print();
				setUpdatingStatus(false);
			}, 500);
		} catch (err) {
			console.error("Print prep failed:", err);
			setUpdatingStatus(false);
		}
	};

	if (loading) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "var(--bg)",
				}}
			>
				<div style={{ textAlign: "center" }}>
					<span className="btn-spinner" style={{ width: 40, height: 40 }} />
					<p style={{ marginTop: 16, color: "var(--text-secondary)" }}>
						Loading application...
					</p>
				</div>
			</div>
		);
	}

	if (error || !application) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "var(--bg)",
					padding: "20px",
				}}
			>
				<div
					style={{
						textAlign: "center",
						maxWidth: 400,
						padding: "40px",
						background: "var(--card-bg)",
						borderRadius: "16px",
						border: "1px solid var(--card-border)",
					}}
				>
					<div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
					<h2 style={{ marginBottom: 16, color: "var(--text)" }}>
						Application Not Found
					</h2>
					<p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
						{error ||
							"The application you're looking for doesn't exist or has been removed."}
					</p>
					<button
						type="button"
						onClick={() => navigate("/admin")}
						className="btn btn-primary"
					>
						← Back to Admin Dashboard
					</button>
				</div>
			</div>
		);
	}

	if (showPrintView) {
		return (
			<div>
				<div
					className="no-print"
					style={{
						padding: "16px 24px",
						background: "var(--navy)",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<button
						type="button"
						onClick={() => setShowPrintView(false)}
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							fontSize: 14,
							color: "#fff",
							background: "rgba(255,255,255,0.1)",
							border: "1px solid rgba(255,255,255,0.2)",
							borderRadius: 8,
							padding: "8px 14px",
							cursor: "pointer",
						}}
					>
						← Back to View
					</button>
					<div style={{ display: "flex", gap: 10 }}>
						<button
							type="button"
							onClick={() =>
								downloadApplicationPDF(
									application?.appNo,
									`${application?.firstName || ""} ${application?.lastName || ""}`.trim(),
								)
							}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								fontSize: 14,
								color: "var(--navy)",
								background: "#fff",
								border: "none",
								borderRadius: 8,
								padding: "8px 16px",
								cursor: "pointer",
							}}
						>
							🖨 Download PDF
						</button>
					</div>
				</div>
				<ApplicationPrintDocument app={application} />
			</div>
		);
	}

	const currentStatus =
		STATUS_OPTIONS.find((s) => s.value === application.status) ||
		STATUS_OPTIONS[0];

	return (
		<div className="admin-application-view">
			<header>
				<div className="header-decor-ring header-decor-ring--tl" />
				<div className="header-decor-ring header-decor-ring--br" />
				<div className="header-decor-dots" aria-hidden="true">
					{Array.from({ length: 20 }).map((_, i) => (
						<span key={i} className="header-dot" />
					))}
				</div>
				<div className="header-inner">
					<div className="logo-circle">
						<img src={logo} alt="Ahlussuffa Logo" />
					</div>
					<div className="school-name">Ahlussuffa Dars</div>
					<div className="school-sub">Admin Portal · Application View</div>
					<div className="header-badge">
						<span className="header-badge-dot" />
						App No: {application.appNo}
					</div>
				</div>
			</header>

			<div
				style={{
					position: "sticky",
					top: 0,
					zIndex: 100,
					background: "var(--card-bg)",
					borderBottom: "1px solid var(--card-border)",
					padding: "16px 24px",
					display: "flex",
					flexWrap: "wrap",
					gap: "12px",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						gap: "12px",
						alignItems: "center",
						flexWrap: "wrap",
					}}
				>
					<button
						type="button"
						onClick={() => navigate("/admin")}
						className="btn btn-outline"
						style={{ fontSize: 14 }}
					>
						← Back to Dashboard
					</button>

					<span
						style={{
							fontFamily: "var(--font-mono)",
							fontSize: 14,
							background: "var(--navy)",
							color: "var(--gold)",
							padding: "6px 12px",
							borderRadius: 4,
						}}
					>
						{application.appNo}
					</span>

					<span
						style={{
							fontSize: 12,
							padding: "4px 12px",
							borderRadius: 20,
							background:
								application.admissionType === "local" ? "#fef3c7" : "#dbeafe",
							color:
								application.admissionType === "local" ? "#d97706" : "#2563eb",
							fontWeight: 500,
						}}
					>
						{application.admissionType === "local"
							? "Local / Re-admission"
							: "New Admission"}
					</span>
				</div>

				<div
					style={{
						display: "flex",
						gap: "12px",
						alignItems: "center",
						flexWrap: "wrap",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
							Status:
						</span>
						<select
							value={application.status || "submitted"}
							onChange={(e) => handleStatusChange(e.target.value)}
							disabled={updatingStatus}
							style={{
								padding: "6px 12px",
								borderRadius: 20,
								border: `1px solid ${currentStatus.color}40`,
								background: currentStatus.bg,
								color: currentStatus.color,
								fontSize: 13,
								fontWeight: 500,
								cursor: "pointer",
							}}
						>
							{STATUS_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>

					<button
						type="button"
						onClick={handlePrint}
						disabled={updatingStatus}
						className="btn btn-primary"
						style={{ fontSize: 14 }}
					>
						{updatingStatus ? "⌛ Preparing..." : "🖨 Print / PDF"}
					</button>
				</div>
			</div>

			<main
				style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto" }}
			>
				{/* Student Information Section */}
				<div
					style={{
						background: "var(--card-bg)",
						borderRadius: "16px",
						padding: "28px",
						border: "1px solid var(--card-border)",
						marginBottom: "24px",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-start",
							flexWrap: "wrap",
							gap: "20px",
							marginBottom: "24px",
						}}
					>
						<div>
							<div className="section-badge">Step 1 of 3</div>
							<div className="section-heading">Personal Information</div>
						</div>
						{application.photo && (
							<img
								src={application.photo}
								alt="Student"
								style={{
									width: 120,
									height: 150,
									objectFit: "cover",
									borderRadius: 8,
									border: "2px solid var(--card-border)",
								}}
							/>
						)}
					</div>

					<div className="form-grid col-2">
						<ViewDetailItem label="First Name" value={application.firstName} />
						<ViewDetailItem label="Last Name" value={application.lastName} />
						<ViewDetailItem label="Date of Birth" value={application.dob} />
						<ViewDetailItem label="Blood Group" value={application.bloodGroup} />
						<ViewDetailItem label="Nationality" value={application.nationality} />
						<ViewDetailItem label="Student Phone" value={application.studentPhone} />
						<ViewDetailItem
							label="Aadhar Number"
							value={application.aadhar}
							fullWidth
						/>
						<ViewDetailItem
							label="Residential Address"
							value={application.address}
							fullWidth
						/>
					</div>
				</div>

				{/* Academic Details Section */}
				<div
					style={{
						background: "var(--card-bg)",
						borderRadius: "16px",
						padding: "28px",
						border: "1px solid var(--card-border)",
						marginBottom: "24px",
					}}
				>
					<div className="section-badge">Step 2 of 3</div>
					<div className="section-heading">Academic Details</div>

					<div className="form-grid col-2">
						<ViewDetailItem
							label="Applying for Class"
							value={application.applyClass}
						/>
						<ViewDetailItem label="Academic Year" value={application.academicYear} />
						<ViewDetailItem label="Stream / Section" value={application.stream} />
						<ViewDetailItem label="Previous School" value={application.prevSchool} />
						<ViewDetailItem label="Previous Class" value={application.prevClass} />
						<ViewDetailItem label="Previous Board" value={application.prevBoard} />
						<ViewDetailItem
							label="Percentage / Grade"
							value={application.prevPercentage}
						/>
						<ViewDetailItem
							label="Achievements"
							value={application.achievements}
							fullWidth
						/>
					</div>
				</div>

				{/* Parent Information Section */}
				<div
					style={{
						background: "var(--card-bg)",
						borderRadius: "16px",
						padding: "28px",
						border: "1px solid var(--card-border)",
						marginBottom: "24px",
					}}
				>
					<div className="section-badge">Step 3 of 3</div>
					<div className="section-heading">Parent & Guardian Info</div>

					<div
						style={{
							fontSize: "11px",
							fontWeight: 600,
							textTransform: "uppercase",
							letterSpacing: "0.08em",
							color: "var(--text-muted)",
							marginBottom: "14px",
							display: "flex",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<span
							style={{
								width: 2,
								height: 12,
								background: "var(--gold)",
								borderRadius: 2,
							}}
						/>
						Father's Details
					</div>
					<div className="form-grid col-2" style={{ marginBottom: "20px" }}>
						<ViewDetailItem label="Father's Name" value={application.fatherName} />
						<ViewDetailItem
							label="Father's Occupation"
							value={application.fatherOcc}
						/>
						<ViewDetailItem label="Father's Phone" value={application.fatherPhone} />
						<ViewDetailItem label="Father's Email" value={application.fatherEmail} />
					</div>

					<div
						style={{
							fontSize: "11px",
							fontWeight: 600,
							textTransform: "uppercase",
							letterSpacing: "0.08em",
							color: "var(--text-muted)",
							marginBottom: "14px",
							display: "flex",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<span
							style={{
								width: 2,
								height: 12,
								background: "var(--gold)",
								borderRadius: 2,
							}}
						/>
						Mother's Details
					</div>
					<div className="form-grid col-2" style={{ marginBottom: "20px" }}>
						<ViewDetailItem label="Mother's Name" value={application.motherName} />
						<ViewDetailItem
							label="Mother's Occupation"
							value={application.motherOcc}
						/>
						<ViewDetailItem label="Mother's Phone" value={application.motherPhone} />
						<ViewDetailItem label="Mother's Email" value={application.motherEmail} />
					</div>

					<div
						style={{
							fontSize: "11px",
							fontWeight: 600,
							textTransform: "uppercase",
							letterSpacing: "0.08em",
							color: "var(--text-muted)",
							marginBottom: "14px",
							display: "flex",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<span
							style={{
								width: 2,
								height: 12,
								background: "var(--gold)",
								borderRadius: 2,
							}}
						/>
						Additional Details
					</div>
					<div className="form-grid col-2">
						<ViewDetailItem label="Annual Family Income" value={application.income} />
						<ViewDetailItem
							label="How did you hear about us?"
							value={application.referral}
						/>
						<ViewDetailItem
							label="Emergency Contact Name"
							value={application.emergencyName}
						/>
						<ViewDetailItem
							label="Emergency Contact Phone"
							value={application.emergencyPhone}
						/>
						<ViewDetailItem
							label="Medical Conditions"
							value={application.medical}
							fullWidth
						/>
						<ViewDetailItem
							label="Additional Remarks"
							value={application.remarks}
							fullWidth
						/>
					</div>
				</div>

				{/* Submission Info */}
				<div
					style={{
						background:
							"linear-gradient(135deg, var(--navy-light) 0%, #e8f0fb 100%)",
						borderRadius: "16px",
						padding: "24px",
						border: "1px solid var(--card-border)",
						textAlign: "center",
					}}
				>
					<p
						style={{
							fontSize: "14px",
							color: "var(--text-secondary)",
							marginBottom: "8px",
						}}
					>
						Application submitted on{" "}
						{new Date(application.submissionDate).toLocaleString()}
					</p>
					<p
						style={{
							fontSize: "13px",
							color: "var(--text-muted)",
							marginBottom: "16px",
						}}
					>
						Application Number: <strong>{application.appNo}</strong>
					</p>
					<div
						style={{
							display: "flex",
							gap: "12px",
							justifyContent: "center",
							flexWrap: "wrap",
						}}
					>
						<button onClick={handlePrint} className="btn btn-primary">
							🖨 Print / Download PDF
						</button>
						<button
							onClick={() => navigate("/admin")}
							className="btn btn-outline"
						>
							← Back to Dashboard
						</button>
					</div>
				</div>
			</main>
		</div>
	);
};

// Internal components moved to src/components

export default AdminApplicationView;
