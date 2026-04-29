import React, { useEffect } from "react";
import { formatDate } from "../utils/formatters";
import logo from "../assets/horizontal-logo.png";

export interface RawApplicationData {
	appNo?: string;
	app_no?: string;
	firstName?: string;
	first_name?: string;
	lastName?: string;
	last_name?: string;
	dob?: string;
	bloodGroup?: string;
	blood_group?: string;
	nationality?: string;
	aadhar?: string;
	studentPhone?: string;
	student_phone?: string;
	address?: string;
	applyClass?: string;
	apply_class?: string;
	academicYear?: string;
	academic_year?: string;
	stream?: string;
	prevSchool?: string;
	prev_school?: string;
	prevClass?: string;
	prev_class?: string;
	prevBoard?: string;
	prev_board?: string;
	prevPercentage?: string;
	prev_percentage?: string;
	achievements?: string;
	fatherName?: string;
	father_name?: string;
	fatherOcc?: string;
	father_occ?: string;
	fatherPhone?: string;
	father_phone?: string;
	fatherEmail?: string;
	father_email?: string;
	motherName?: string;
	mother_name?: string;
	motherOcc?: string;
	mother_occ?: string;
	motherPhone?: string;
	mother_phone?: string;
	motherEmail?: string;
	mother_email?: string;
	income?: string;
	emergencyName?: string;
	emergency_name?: string;
	emergencyPhone?: string;
	emergency_phone?: string;
	medical?: string;
	referral?: string;
	remarks?: string;
	photo?: string;
	photoUrl?: string;
	photo_url?: string;
	submissionDate?: string | Date;
	submission_date?: string | Date;
	status?: string;
}

interface ApplicationPrintDocumentProps {
	app: RawApplicationData;
	showStatus?: boolean;
}

// ─── Print / PDF styles ────────────────────────────────────────────────────
//
//  KEY FIXES applied here:
//
//  1. html & body are locked to exactly 297 mm height with overflow:hidden.
//     Without this the browser sees the full React page height and prints a
//     second blank page even though #printArea is position:fixed.
//
//  2. #printArea gets overflow:hidden + explicit 210×297 mm so the fixed
//     element never bleeds into a second page.
//  1. All wrapper elements that surround .printable-document in the DOM are hidden 
//     via visibility:hidden so they cannot push the page count up.
//
const PRINT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Libre+Franklin:wght@300;400;500;600&display=swap');

  @page {
    size: A4 portrait;
    margin: 0;
  }

  @media print {
    /* ── Show only printable content ──────────────────── */
    body * {
      visibility: hidden !important;
    }

    .printable-document,
    .printable-document *,
    .bulk-print-wrapper,
    .bulk-print-wrapper *,
    .single-print-wrapper,
    .single-print-wrapper * {
      visibility: visible !important;
    }

    /* ── Hide elements with no-print class ─────────────── */
    .no-print {
      display: none !important;
      height: 0 !important;
      overflow: hidden !important;
    }

    /* ── Ensure single print wrapper doesn't add height ── */
    .single-print-wrapper,
    .print-content-container {
      min-height: 0 !important;
      height: auto !important;
      background: white !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    .single-print-wrapper > div {
      padding: 0 !important;
      margin: 0 !important;
    }

    /* ── Document container ─────────────────────────────── */
    .printable-document {
      position:   relative !important;
      margin:     0 auto !important;
      width:      210mm !important;
      height:     296mm !important; /* Slightly less than 297 to avoid bleed */
      max-height: 296mm !important;
      overflow:   hidden !important;
      background: white !important;
      transform:  scale(1) !important;
      transform-origin: top center !important;
      box-sizing: border-box !important;
    }

    .no-print {
      display: none !important;
    }
  }
`;

// Colour tokens
const C = {
	navy: "#000000",
	navyLight: "#f9fafb",
	gold: "#ffffff",
	text: "#000000",
	subtext: "#000000",
	border: "#bbbbbb", // Slightly darker gray for better visibility
	borderDash: "#cccccc",
	bg: "#ffffff",
	white: "#ffffff",
};

const font = {
	sans: "'Libre Franklin', 'Segoe UI', Arial, sans-serif",
	serif: "'EB Garamond', Georgia, serif",
};

// ─── Sub-components ────────────────────────────────────────────────────────

interface FieldProps {
	label: string;
	value?: string | null;
	span?: 1 | 2;
}

const Field = ({ label, value, span = 1 }: FieldProps) => (
	<div
		style={{
			gridColumn: span === 2 ? "span 2" : undefined,
			display: "flex",
			flexDirection: "column",
			gap: 0,
		}}
	>
		<span
			style={{
				fontFamily: font.sans,
				fontSize: 10,
				letterSpacing: 0.5,
				textTransform: "uppercase" as const,
				color: "#000000",
				fontWeight: 600, // Thicker labels
			}}
		>
			{label}
		</span>
		<div
			style={{
				fontFamily: font.sans,
				fontSize: value ? 11.5 : 9.5,
				fontStyle: value ? "normal" : "italic",
				color: "#000000",
				fontWeight: value ? 600 : 300,
				borderBottom: `1px solid #bbbbbb`,
				paddingBottom: 2,
				paddingTop: 1,
				minHeight: 18,
				lineHeight: 1.2,
			}}
		>
			{value || "\u00A0"}
		</div>
	</div>
);

interface SectionHeaderProps {
	title: string;
}
const SectionHeader = ({ title }: SectionHeaderProps) => (
	<div
		style={{
			background: C.navyLight,
			borderLeft: `4px solid ${C.navy}`,
			padding: "4px 8px",
			fontSize: 10.5,
			letterSpacing: 2,
			textTransform: "uppercase" as const,
			fontWeight: 700,
			color: C.navy,
			fontFamily: font.sans,
			margin: "4px 0 8px",
			borderRadius: "0 2px 2px 0",
			borderBottom: "1px solid #bbbbbb",
		}}
	>
		{title}
	</div>
);

interface FormGridProps {
	children: React.ReactNode;
	cols?: 2 | 3 | 4;
}
const FormGrid = ({ children, cols = 3 }: FormGridProps) => (
	<div
		style={{
			display: "grid",
			gridTemplateColumns: `repeat(${cols}, 1fr)`,
			gap: "6px 12px",
			padding: "4px 0",
			marginBottom: 2,
		}}
	>
		{children}
	</div>
);

interface SigBlockProps {
	label: string;
}
const SigBlock = ({ label }: SigBlockProps) => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			gap: 2,
		}}
	>
		<div
			style={{
				width: "100%",
				height: 26,
				borderBottom: `1px solid #bbbbbb`,
			}}
		/>
		<span
			style={{
				fontFamily: font.sans,
				fontSize: 10,
				letterSpacing: 1,
				textTransform: "uppercase" as const,
				color: C.subtext,
				textAlign: "center",
			}}
		>
			{label}
		</span>
	</div>
);

// ─── Main component ────────────────────────────────────────────────────────

const ApplicationPrintDocument = ({
	app,
	showStatus = false,
}: ApplicationPrintDocumentProps) => {
	// Inject / refresh print styles on mount and remove on unmount
	useEffect(() => {
		const existing = document.getElementById("asd-print-styles");
		if (existing) existing.remove();
		const el = document.createElement("style");
		el.id = "asd-print-styles";
		el.textContent = PRINT_STYLES;
		document.head.appendChild(el);
		return () => {
			el.parentNode?.removeChild(el);
		};
	}, []);

	// Normalise field aliases (camelCase from live form OR snake_case from Supabase)
	const d = {
		appNo:          app.appNo          || app.app_no          || "",
		firstName:      app.firstName      || app.first_name      || "",
		lastName:       app.lastName       || app.last_name       || "",
		dob:            app.dob,
		bloodGroup:     app.bloodGroup     || app.blood_group,
		nationality:    app.nationality,
		aadhar:         app.aadhar,
		studentPhone:   app.studentPhone   || app.student_phone,
		address:        app.address,
		applyClass:     app.applyClass     || app.apply_class     || "",
		academicYear:   app.academicYear   || app.academic_year   || "",
		stream:         app.stream,
		prevSchool:     app.prevSchool     || app.prev_school,
		prevClass:      app.prevClass      || app.prev_class,
		prevBoard:      app.prevBoard      || app.prev_board,
		prevPercentage: app.prevPercentage || app.prev_percentage,
		achievements:   app.achievements,
		fatherName:     app.fatherName     || app.father_name     || "",
		fatherOcc:      app.fatherOcc      || app.father_occ,
		fatherPhone:    app.fatherPhone    || app.father_phone    || "",
		fatherEmail:    app.fatherEmail    || app.father_email,
		motherName:     app.motherName     || app.mother_name     || "",
		motherOcc:      app.motherOcc      || app.mother_occ,
		motherPhone:    app.motherPhone    || app.mother_phone,
		motherEmail:    app.motherEmail    || app.mother_email,
		income:         app.income,
		emergencyName:  app.emergencyName  || app.emergency_name,
		emergencyPhone: app.emergencyPhone || app.emergency_phone,
		medical:        app.medical,
		remarks:        app.remarks,
		photo:          app.photo          || app.photoUrl        || app.photo_url       || "",
		submissionDate: app.submissionDate || app.submission_date,
		status:         app.status         || "submitted",
	};

	const fullName    = `${d.firstName} ${d.lastName}`.trim();
	const academicYear = d.academicYear || String(new Date().getFullYear());

	// Responsive scale for on-screen preview only (never used in PDF/print)
	const [scale, setScale] = React.useState(1);
	React.useEffect(() => {
		const calcScale = () => {
			const pageWidth = 793; // 210 mm at 96 dpi
			if (window.innerWidth < 850) {
				setScale(Math.min(1, (window.innerWidth - 32) / pageWidth));
			} else {
				setScale(1);
			}
		};
		calcScale();
		window.addEventListener("resize", calcScale);
		return () => window.removeEventListener("resize", calcScale);
	}, []);

	return (
		<div
			style={{
				width:           "100%",
				display:         "flex",
				justifyContent:  "center",
				// Compensate for the CSS scale so the surrounding page
				// doesn't leave a huge gap at the bottom on mobile
				paddingBottom:   scale < 1 ? 16 : 0,
			}}
		>
			<div
				id="printArea"
				className="printable-document"
				style={{
					width:           "210mm",
					height:          "297mm",
					overflow:        "hidden",
					background:      C.white,
					fontFamily:      font.sans,
					fontSize:        9.5,
					color:           C.text,
					padding:         "4mm 6mm", // Maximized content area
					boxSizing:       "border-box" as const,
					boxShadow:       "none", // Removed shadow for clarity
					flexShrink:      0,
					position:        "relative",
					display:         "flex",
					flexDirection:   "column",
					// Scale for on-screen preview; reset to none in PRINT_STYLES
					transform:       `scale(${scale})`,
					transformOrigin: "top center",
					// Pull the element up to remove the whitespace the scale creates
					marginBottom:    scale < 1
						? `calc(-297mm * (1 - ${scale}))`
						: "0",
				}}
			>
				{/* ── HEADER ──────────────────────────────────────────────── */}
				<div
					style={{
						borderBottom: `1px solid ${C.border}`,
						padding: "0 0 12px 0",
						display: "grid",
						gridTemplateColumns: "1fr auto",
						alignItems: "center",
						gap: 12,
					}}
				>
					{/* Left: logo + meta */}
					<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
						<div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 2 }}>
							<img
								src={logo}
								alt="Ahlussuffa Dars Logo"
								style={{ height: 60, objectFit: "contain", alignSelf: "flex-start" }}
							/>
							<div
								style={{
									fontFamily: font.sans,
									fontSize: 12,
									letterSpacing: 0.3,
									color: "#000000",
									fontWeight: "bold",
									marginTop: 4,
									lineHeight: 1.5,
								}}
							>
								Ahlussuffa Campus, Parappram, Pinarayi, Kerala
								<br />
								+91 99611 59173 &nbsp;&middot;&nbsp; ahlussuffa.igs@gmail.com
							</div>
						</div>

						<div style={{ display: "flex", gap: 16, marginTop: 4 }}>
							{/* App No */}
							<div style={{ display: "flex", alignItems: "center", gap: 6, height: "20px" }}>
								<span style={{ fontFamily: font.sans, fontSize: 10, letterSpacing: 0.3, textTransform: "uppercase", color: "#000000", fontWeight: 700, lineHeight: "20px" }}>
									App No.
								</span>
								<span
									style={{
										display: "inline-block", height: "20px", lineHeight: "20px",
										background: "#000000", color: "#ffffff",
										fontFamily: font.sans, fontSize: 10, fontWeight: 700,
										letterSpacing: 0.5, padding: "0 6px", borderRadius: 2, verticalAlign: "middle",
									}}
								>
									{d.appNo || "PENDING"}
								</span>
							</div>

							{/* Submitted date */}
							<div style={{ display: "flex", alignItems: "center", gap: 6, height: "20px" }}>
								<span style={{ fontFamily: font.sans, fontSize: 10, letterSpacing: 0.3, textTransform: "uppercase", color: "#000000", fontWeight: 700, lineHeight: "20px" }}>
									Date :
								</span>
								<span style={{ fontFamily: font.sans, fontSize: 10, fontWeight: "bold", letterSpacing: 0.3, textTransform: "uppercase", color: "#000000", lineHeight: "20px" }}>
									{formatDate(d.submissionDate, "full") || "—"}
								</span>
							</div>

							{/* Status badge */}
							{showStatus && (
								<div style={{ display: "flex", alignItems: "center", gap: 6, height: "20px" }}>
									<span style={{ fontFamily: font.sans, fontSize: 10, letterSpacing: 0.3, textTransform: "uppercase", color: "#000000", fontWeight: 700, lineHeight: "20px" }}>
										Status :
									</span>
									<span
										style={{
											display: "inline-block", height: "20px", lineHeight: "20px",
											background:
												d.status === "approved" ? "#10b981"
												: d.status === "rejected" ? "#ef4444"
												: d.status === "reviewing" ? "#f59e0b"
												: "#000000",
											color: "#ffffff",
											fontFamily: font.sans, fontSize: 10, fontWeight: 700,
											letterSpacing: 0.5, padding: "0 4px", borderRadius: 2,
											textTransform: "uppercase", verticalAlign: "middle",
										}}
									>
										{d.status}
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Right: photo box */}
					<div style={{ display: "flex", justifyContent: "flex-end" }}>
						<div
							style={{
								width: 90, height: 115,
								borderRadius: "10%",
								background: C.bg,
								display: "flex", flexDirection: "column",
								alignItems: "center", justifyContent: "center",
								gap: 1, overflow: "hidden",
							}}
						>
							{d.photo ? (
								<img src={d.photo} alt="Student" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
							) : (
								<>
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-label="Student Photo Placeholder">
										<circle cx="12" cy="8" r="4" fill="#000000" />
										<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
									</svg>
									<span style={{ fontFamily: font.sans, fontSize: 8, color: "#000000", fontWeight: "bold", letterSpacing: 0.5, textTransform: "uppercase" }}>
										Photo
									</span>
								</>
							)}
						</div>
					</div>
				</div>

				{/* ── TITLE BAND ───────────────────────────────────────────── */}
				<div
					style={{
						background: C.navy, color: C.white,
						textAlign: "center", padding: "3px 14px",
						borderBottom: `1px solid #bbbbbb`,
						borderTop:    `1px solid #bbbbbb`,
						marginTop: 8,
						marginBottom: 2,
					}}
				>
					Admission Form · {academicYear}
				</div>

				{/* ── BODY ─────────────────────────────────────────────────── */}
				<div style={{ padding: "4px 0", flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 4 }}>

					{/* Personal Information */}
					<SectionHeader title="Personal Information" />
					<FormGrid cols={3}>
						<Field label="Full Name"           value={fullName}                           span={2} />
						<Field label="Date of Birth"       value={formatDate(d.dob, "full")}                   />
						<Field label="Blood Group"         value={d.bloodGroup}                                 />
						<Field label="Nationality"         value={d.nationality}                                />
						<Field label="Aadhaar Number"      value={d.aadhar}                                     />
						<Field label="Phone"               value={d.studentPhone}                               />
						<Field label="Residential Address" value={d.address}                          span={2} />
					</FormGrid>

					{/* Academic Details */}
					<SectionHeader title="Academic Details" />
					<FormGrid cols={3}>
						<Field label="Applying for Class" value={d.applyClass}     />
						<Field label="Academic Year"      value={d.academicYear}   />
						<Field label="Stream / Section"   value={d.stream}         />
						<Field label="Previous School"    value={d.prevSchool}     span={2} />
						<Field label="Previous Class"     value={d.prevClass}      />
						<Field label="Board"              value={d.prevBoard}      />
						<Field label="Result (%)"         value={d.prevPercentage} />
						<Field label="Achievements"       value={d.achievements}   />
					</FormGrid>

					{/* Parent / Guardian */}
					<SectionHeader title="Parent / Guardian Information" />
					<FormGrid cols={3}>
						<Field label="Father's Name"         value={d.fatherName}     />
						<Field label="Father's Occupation"   value={d.fatherOcc}      />
						<Field label="Father's Phone"        value={d.fatherPhone}    />
						<Field label="Father's Email"        value={d.fatherEmail}    />
						<Field label="Mother's Name"         value={d.motherName}     />
						<Field label="Mother's Occupation"   value={d.motherOcc}      />
						<Field label="Mother's Phone"        value={d.motherPhone}    />
						<Field label="Mother's Email"        value={d.motherEmail}    />
						<Field label="Annual Family Income"  value={d.income}         />
						<Field label="Emergency Contact"     value={d.emergencyName}  />
						<Field label="Emergency Phone"       value={d.emergencyPhone} />
						<Field label="Medical / Allergies"   value={d.medical}        />
						{d.remarks && <Field label="Remarks" value={d.remarks}        span={2} />}
					</FormGrid>

					{/* Declaration */}
					<SectionHeader title="Declaration" />
					<div
						style={{
							borderLeft:   `3px solid #bbbbbb`,
							padding:      "6px 12px",
							background:   "#ffffff",
							borderRadius: 0,
						}}
					>
						<p
							style={{
								fontFamily: font.sans, fontSize: 10,
								lineHeight: 1.2, margin: 0,
								color: "#000000", fontStyle: "normal",
								fontWeight: 500,
							}}
						>
							I hereby declare that all information furnished in this application is true, complete
							and correct to the best of my knowledge and belief. I agree to abide by the rules,
							regulations and discipline of Ahlussuffa Institution.
						</p>
					</div>

					{/* Signatures */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gap: "0 12px",
							marginTop: 10,
							paddingBottom: 0,
						}}
					>
						<SigBlock label="Parent Signature" />
						<SigBlock label="Applicant Signature" />
						<SigBlock label="Date" />
					</div>
				</div>

				{/* ── FOOTER ───────────────────────────────────────────────── */}
				<div
					style={{
						borderTop: `1px solid ${C.border}`,
						padding: "6px 0 0 0",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						fontFamily: font.sans,
						fontSize: 9,
						fontWeight: 500,
						color: "#000000",
						marginTop: "auto",
					}}
				>
					<span>Ahlussuffa Campus, Parappram, Kerala</span>
					<span style={{ fontFamily: font.serif, fontStyle: "italic", fontSize: 9, color: C.text }}>
						ahlussuffa.igs@gmail.com
					</span>
					<span>Computer-generated · Valid with seal</span>
				</div>
			</div>
		</div>
	);
};

export default ApplicationPrintDocument;
