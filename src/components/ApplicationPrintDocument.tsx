import React, { useEffect } from "react";
import { formatDate } from "../utils/formatters";
import logo from "../assets/horizontal-logo.png";

interface RawApplicationData {
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
	submissionDate?: string;
	submission_date?: string;
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
//
//  3. All wrapper elements that surround #printArea in the DOM are hidden via
//     visibility:hidden (already done) AND their heights are zeroed out so
//     they cannot push the page count up.
//
const PRINT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Libre+Franklin:wght@300;400;500;600&display=swap');

  @page {
    size: A4 portrait;
    margin: 0;
  }

  @media print {
    /* ── Lock the root to exactly one A4 page ────────────────────────── */
    html {
      margin:     0 !important;
      padding:    0 !important;
      width:      210mm !important;
      height:     297mm !important;
      max-height: 297mm !important;
      overflow:   hidden !important;
      background: white !important;
    }

    body {
      margin:     0 !important;
      padding:    0 !important;
      width:      210mm !important;
      height:     297mm !important;
      max-height: 297mm !important;
      overflow:   hidden !important;
      background: white !important;
    }

    /* ── Hide everything, then reveal only printArea ──────────────────── */
    body * {
      visibility: hidden !important;
    }

    #printArea,
    #printArea * {
      visibility: visible !important;
    }

    /* ── Pin printArea to the page origin ─────────────────────────────── */
    #printArea {
      position:   fixed !important;
      top:        0 !important;
      left:       0 !important;
      margin:     0 !important;
      padding:    0 !important;
      width:      210mm !important;
      height:     297mm !important;
      max-height: 297mm !important;
      overflow:   hidden !important;
      box-shadow: none !important;
      transform:  none !important;
      background: white !important;
    }

    .no-print {
      display: none !important;
    }
  }
`;

// Colour tokens
const C = {
	navy: "#1a3a6b",
	navyLight: "#e8f0fb",
	gold: "#e8c96a",
	text: "#111827",
	subtext: "#6b7280",
	border: "#d1d5db",
	borderDash: "#e5e7eb",
	bg: "#f9fafb",
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
				fontSize: 9,
				letterSpacing: 1,
				textTransform: "uppercase" as const,
				color: C.subtext,
				fontWeight: 300,
			}}
		>
			{label}
		</span>
		<div
			style={{
				fontFamily: font.sans,
				fontSize: value ? 11 : 9,
				fontStyle: value ? "normal" : "italic",
				color: value ? "#000000" : C.subtext,
				fontWeight: value ? 500 : 300,
				borderBottom: `1px solid #e5e7eb`,
				paddingBottom: 2,
				paddingTop: 1,
				minHeight: 14,
				lineHeight: 1.4,
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
			fontSize: 9,
			letterSpacing: 2,
			textTransform: "uppercase" as const,
			fontWeight: 600,
			color: C.navy,
			fontFamily: font.sans,
			margin: "4px 0 10px",
			borderRadius: "0 2px 2px 0",
		}}
	>
		{title}
	</div>
);

interface FormGridProps {
	children: React.ReactNode;
	cols?: 2 | 3;
}
const FormGrid = ({ children, cols = 2 }: FormGridProps) => (
	<div
		style={{
			display: "grid",
			gridTemplateColumns: `repeat(${cols}, 1fr)`,
			gap: "4px 12px",
			padding: "10px 0",
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
				height: 22,
				borderBottom: `1px solid ${C.border}`,
			}}
		/>
		<span
			style={{
				fontFamily: font.sans,
				fontSize: 9,
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
		photo:          app.photo          || app.photoUrl        || "",
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
				style={{
					width:           "210mm",
					height:          "297mm",
					overflow:        "hidden",
					background:      C.white,
					fontFamily:      font.sans,
					fontSize:        7.5,
					color:           C.text,
					padding:         "0 10px",
					boxSizing:       "border-box" as const,
					boxShadow:       scale < 1 ? "0 4px 32px rgba(0,0,0,0.10)" : "0 4px 32px rgba(0,0,0,0.10)",
					flexShrink:      0,
					position:        "relative",
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
						padding: "20px 14px 10px",
						display: "grid",
						gridTemplateColumns: "1fr auto",
						alignItems: "center",
						gap: 12,
					}}
				>
					{/* Left: logo + meta */}
					<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
						<div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 4 }}>
							<img
								src={logo}
								alt="Ahlussuffa Dars Logo"
								style={{ height: 48, objectFit: "contain", alignSelf: "flex-start" }}
							/>
							<div
								style={{
									fontFamily: font.sans,
									fontSize: 9,
									letterSpacing: 0.5,
									color: C.subtext,
									fontWeight: "bold",
									marginTop: 4,
									lineHeight: 1.4,
								}}
							>
								Ahlussuffa Campus, Parappram, Pinarayi, Kerala
								<br />
								+91 99611 59173 &nbsp;&middot;&nbsp; ahlussuffa.igs@gmail.com
							</div>
						</div>

						<div style={{ display: "flex", gap: 16, marginTop: 2 }}>
							{/* App No */}
							<div style={{ display: "flex", alignItems: "center", gap: 6, height: "18px" }}>
								<span style={{ fontFamily: font.sans, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", color: C.subtext, fontWeight: 500, lineHeight: "18px" }}>
									Application No.
								</span>
								<span
									style={{
										display: "inline-block", height: "18px", lineHeight: "18px",
										background: C.navy, color: C.gold,
										fontFamily: font.sans, fontSize: 10, fontWeight: 500,
										letterSpacing: 1, padding: "0 6px", borderRadius: 2, verticalAlign: "middle",
									}}
								>
									{d.appNo || "PENDING"}
								</span>
							</div>

							{/* Submitted date */}
							<div style={{ display: "flex", alignItems: "center", gap: 6, height: "18px" }}>
								<span style={{ fontFamily: font.sans, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", color: C.subtext, fontWeight: 500, lineHeight: "18px" }}>
									Submitted :
								</span>
								<span style={{ fontFamily: font.sans, fontSize: 10, fontWeight: "bold", letterSpacing: 0.5, textTransform: "uppercase", color: C.text, lineHeight: "18px" }}>
									{formatDate(d.submissionDate, "full") || "—"}
								</span>
							</div>

							{/* Status badge */}
							{showStatus && (
								<div style={{ display: "flex", alignItems: "center", gap: 6, height: "18px" }}>
									<span style={{ fontFamily: font.sans, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", color: C.subtext, fontWeight: 500, lineHeight: "18px" }}>
										Status :
									</span>
									<span
										style={{
											display: "inline-block", height: "18px", lineHeight: "18px",
											background:
												d.status === "approved" ? "#10b981"
												: d.status === "rejected" ? "#ef4444"
												: d.status === "reviewing" ? "#f59e0b"
												: C.border,
											color: C.white,
											fontFamily: font.sans, fontSize: 10, fontWeight: 500,
											letterSpacing: 1, padding: "0 6px", borderRadius: 2,
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
								width: 96, height: 120,
								border: `1px solid ${C.border}`,
								borderRadius: "20%",
								background: C.bg,
								display: "flex", flexDirection: "column",
								alignItems: "center", justifyContent: "center",
								gap: 2, overflow: "hidden",
							}}
						>
							{d.photo ? (
								<img src={d.photo} alt="Student" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
							) : (
								<>
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
										<circle cx="12" cy="8" r="4" fill={C.border} />
										<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={C.border} strokeWidth="1.5" strokeLinecap="round" />
									</svg>
									<span style={{ fontFamily: font.sans, fontSize: 7, color: C.subtext, letterSpacing: 0.5, textTransform: "uppercase" }}>
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
						textAlign: "center", padding: "4px 14px",
						fontFamily: font.sans, fontSize: 9,
						margin: "0 10px", letterSpacing: 2,
						textTransform: "uppercase", fontWeight: 500,
						borderBottom: `2px solid ${C.gold}`,
						borderTop:    `2px solid ${C.gold}`,
					}}
				>
					Student Admission Application Form · Academic Year {academicYear}
				</div>

				{/* ── BODY ─────────────────────────────────────────────────── */}
				<div style={{ padding: "20px 14px 10px" }}>

					{/* Personal Information */}
					<SectionHeader title="Personal Information" />
					<FormGrid>
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
					<FormGrid>
						<Field label="Applying for Class" value={d.applyClass}     />
						<Field label="Academic Year"      value={d.academicYear}   />
						<Field label="Stream / Section"   value={d.stream}         />
						<Field label="Previous School"    value={d.prevSchool}     />
						<Field label="Previous Class"     value={d.prevClass}      />
						<Field label="Board"              value={d.prevBoard}      />
						<Field label="Result (%)"         value={d.prevPercentage} />
						<Field label="Achievements"       value={d.achievements}   />
					</FormGrid>

					{/* Parent / Guardian */}
					<SectionHeader title="Parent / Guardian Information" />
					<FormGrid>
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
							border:       `0.5px solid ${C.border}`,
							padding:      "6px 8px",
							background:   C.bg,
							borderRadius: 2,
						}}
					>
						<p
							style={{
								fontFamily: font.sans, fontSize: 10,
								lineHeight: 1.3, margin: 0,
								color: C.subtext, fontStyle: "italic",
							}}
						>
							I hereby declare that all information furnished in this application is true, complete
							and correct to the best of my knowledge and belief. I agree to abide by the rules,
							regulations and discipline of Ahlussuffa Institution. I understand that any false
							statement may result in disqualification of my application.
						</p>
					</div>

					{/* Signatures */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gap: "0 12px",
							marginTop: 32,
							paddingBottom: 2,
						}}
					>
						<SigBlock label="Parent / Guardian Signature" />
						<SigBlock label="Applicant's Signature" />
						<SigBlock label="Date" />
					</div>
				</div>

				{/* ── FOOTER ───────────────────────────────────────────────── */}
				<div
					style={{
						position: "absolute",
						bottom: "4px",
						left: "14px",
						right: "14px",
						borderTop: `1px solid ${C.border}`,
						padding: "4px 0",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						fontFamily: font.sans,
						fontSize: 7,
						color: C.subtext,
					}}
				>
					<span>Ahlussuffa Campus, Parappram, Kerala</span>
					<span style={{ fontFamily: font.serif, fontStyle: "italic", fontSize: 8, color: C.text }}>
						ahlussuffa.igs@gmail.com
					</span>
					<span>Computer-generated · Valid upon official seal</span>
				</div>
			</div>
		</div>
	);
};

export default ApplicationPrintDocument;
