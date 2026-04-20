/**
 * StudentViewModal Component
 * Displays student details in a modern modal with card-based layout
 */

import { formatDate } from "../utils/formatters";

// ─── Design tokens (matching AdminPage) ──────────────────────────────────────
const T = {
  navy:       "#0f2044",
  navyMid:    "#1a3a6b",
  navyLight:  "#e8f0fb",
  gold:       "#c8922a",
  goldLight:  "#fdf3e0",
  text:       "#111827",
  sub:        "#6b7280",
  border:     "#e5e7eb",
  bg:         "#f8f9fc",
  white:      "#ffffff",
};

const font = {
  display: "'DM Serif Display', Georgia, serif",
  sans:    "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  mono:    "'JetBrains Mono', monospace",
};

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface RawStudentData {
  appNo?: string; app_no?: string;
  firstName?: string; first_name?: string;
  lastName?: string; last_name?: string;
  dob?: string; gender?: string;
  bloodGroup?: string; blood_group?: string;
  nationality?: string; religion?: string; category?: string;
  aadhar?: string; studentPhone?: string; student_phone?: string;
  address?: string;
  applyClass?: string; apply_class?: string;
  academicYear?: string; academic_year?: string;
  stream?: string; medium?: string;
  prevSchool?: string; prev_school?: string;
  prevClass?: string; prev_class?: string;
  prevBoard?: string; prev_board?: string;
  prevPercentage?: string; prev_percentage?: string;
  achievements?: string;
  fatherName?: string; father_name?: string;
  fatherOcc?: string; father_occ?: string;
  fatherPhone?: string; father_phone?: string;
  fatherEmail?: string; father_email?: string;
  motherName?: string; mother_name?: string;
  motherOcc?: string; mother_occ?: string;
  motherPhone?: string; mother_phone?: string;
  motherEmail?: string; mother_email?: string;
  income?: string;
  emergencyName?: string; emergency_name?: string;
  emergencyPhone?: string; emergency_phone?: string;
  medical?: string; referral?: string; remarks?: string;
  photo?: string; status?: string;
  submissionDate?: string; submission_date?: string;
}

interface StudentViewModalProps {
  app: RawStudentData;
  onClose: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const Field = ({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <span style={{
      fontFamily: font.sans, fontSize: 10, fontWeight: 500,
      letterSpacing: 0.8, textTransform: "uppercase" as const,
      color: T.sub,
    }}>
      {label}
    </span>
    <span style={{
      fontFamily: mono ? font.mono : font.sans,
      fontSize: 13, fontWeight: 500, color: value ? T.text : T.sub,
      fontStyle: value ? "normal" : "italic",
    }}>
      {value || "Not provided"}
    </span>
  </div>
);

const Section = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
  <div style={{
    background: T.white, borderRadius: 14,
    border: `1px solid ${T.border}`,
    overflow: "hidden",
  }}>
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "14px 20px",
      borderBottom: `1px solid ${T.border}`,
      background: T.bg,
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{
        fontFamily: font.sans, fontSize: 13, fontWeight: 600,
        color: T.navyMid, letterSpacing: 0.3,
      }}>
        {title}
      </span>
    </div>
    <div className="modal-section-grid" style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
      gap: "14px 20px", padding: "18px 20px",
    }}>
      {children}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status?: string }) => {
  const cfg: Record<string, { label: string; color: string; bg: string }> = {
    submitted: { label: "Submitted", color: "#2563eb", bg: "#dbeafe" },
    reviewing: { label: "Reviewing", color: "#7c3aed", bg: "#ede9fe" },
    approved:  { label: "Approved",  color: "#059669", bg: "#d1fae5" },
    rejected:  { label: "Rejected",  color: "#dc2626", bg: "#fee2e2" },
  };
  const c = cfg[status || "submitted"] || cfg.submitted;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontFamily: font.sans, fontSize: 11, fontWeight: 500,
      color: c.color, background: c.bg,
      padding: "3px 10px", borderRadius: 20,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, display: "inline-block" }} />
      {c.label}
    </span>
  );
};

// ─── Main component ──────────────────────────────────────────────────────────
const StudentViewModal = ({ app, onClose }: StudentViewModalProps) => {
  const d = {
    appNo:         app.appNo         || app.app_no          || "",
    firstName:     app.firstName     || app.first_name      || "",
    lastName:      app.lastName      || app.last_name       || "",
    dob:           app.dob,
    gender:        app.gender,
    bloodGroup:    app.bloodGroup    || app.blood_group,
    nationality:   app.nationality,
    religion:      app.religion,
    category:      app.category,
    aadhar:        app.aadhar,
    studentPhone:  app.studentPhone  || app.student_phone,
    address:       app.address,
    applyClass:    app.applyClass    || app.apply_class     || "",
    academicYear:  app.academicYear  || app.academic_year   || "",
    stream:        app.stream,
    medium:        app.medium,
    prevSchool:    app.prevSchool    || app.prev_school,
    prevClass:     app.prevClass     || app.prev_class,
    prevBoard:     app.prevBoard     || app.prev_board,
    prevPercentage:app.prevPercentage|| app.prev_percentage,
    achievements:  app.achievements,
    fatherName:    app.fatherName    || app.father_name     || "",
    fatherOcc:     app.fatherOcc     || app.father_occ,
    fatherPhone:   app.fatherPhone   || app.father_phone    || "",
    fatherEmail:   app.fatherEmail   || app.father_email,
    motherName:    app.motherName    || app.mother_name     || "",
    motherOcc:     app.motherOcc     || app.mother_occ,
    motherPhone:   app.motherPhone   || app.mother_phone,
    motherEmail:   app.motherEmail   || app.mother_email,
    income:        app.income,
    emergencyName: app.emergencyName || app.emergency_name,
    emergencyPhone:app.emergencyPhone|| app.emergency_phone,
    medical:       app.medical,
    referral:      app.referral,
    remarks:       app.remarks,
    photo:         app.photo,
    status:        app.status,
    submissionDate:app.submissionDate|| app.submission_date,
  };

  const fullName = `${d.firstName} ${d.lastName}`.trim();
  const initials = fullName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const hue = fullName.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

  return (
    <>
      <style>{`
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .modal-overlay-new { animation: modalFadeIn 0.2s ease forwards; }
        .modal-card-new { animation: modalSlideUp 0.3s ease forwards; }
        .modal-scroll::-webkit-scrollbar { width: 6px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        .modal-scroll::-webkit-scrollbar-thumb:hover { background: ${T.sub}; }
        @media (max-width: 640px) {
          .modal-card-new { border-radius: 0 !important; max-height: 100vh !important; }
          .modal-header-inner { padding: 16px !important; gap: 12px !important; }
          .modal-header-inner .modal-avatar { width: 48px !important; height: 48px !important; font-size: 16px !important; border-radius: 10px !important; }
          .modal-header-inner .modal-name { font-size: 17px !important; }
          .modal-body-inner { padding: 14px 16px 20px !important; gap: 12px !important; }
          .modal-section-grid { grid-template-columns: 1fr !important; gap: 10px 0 !important; }
        }
      `}</style>

      <div
        className="modal-overlay-new"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(15,32,68,0.45)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          padding: "24px 0 0",
        }}
      >
        <div
          className="modal-card-new modal-scroll"
          onClick={e => e.stopPropagation()}
          style={{
            background: T.bg, borderRadius: 20,
            width: "100%", maxWidth: 720, maxHeight: "90vh",
            overflow: "auto",
            boxShadow: "0 24px 64px rgba(15,32,68,0.18)",
            border: `1px solid ${T.border}`,
          }}
        >
          {/* ── Header ── */}
          <div className="modal-header-inner" style={{
            background: T.navy, borderRadius: "20px 20px 0 0",
            padding: "24px 28px",
            display: "flex", alignItems: "center", gap: 18,
            position: "sticky", top: 0, zIndex: 2,
          }}>
            {/* Avatar / Photo */}
            {d.photo ? (
              <div className="modal-avatar" style={{
                width: 64, height: 64, borderRadius: 14,
                overflow: "hidden", flexShrink: 0,
                border: `2px solid ${T.gold}`,
              }}>
                <img src={d.photo} alt="Student" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div className="modal-avatar" style={{
                width: 64, height: 64, borderRadius: 14,
                background: `hsl(${hue}, 55%, 35%)`,
                color: `hsl(${hue}, 55%, 88%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: font.display, fontSize: 22, flexShrink: 0,
                border: `2px solid ${T.gold}`,
              }}>
                {initials}
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="modal-name" style={{ fontFamily: font.display, fontSize: 22, color: T.white, lineHeight: 1.2 }}>
                {fullName}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" as const }}>
                <span style={{
                  fontFamily: font.mono, fontSize: 11, fontWeight: 500,
                  background: T.gold, color: T.navy,
                  padding: "2px 8px", borderRadius: 4,
                }}>
                  {d.appNo}
                </span>
                <span style={{
                  fontFamily: font.sans, fontSize: 12, color: "rgba(255,255,255,0.7)",
                }}>
                  Class {d.applyClass} · {d.academicYear}
                </span>
                <StatusBadge status={d.status} />
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(255,255,255,0.1)", border: "none",
                color: "rgba(255,255,255,0.7)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
            >
              ✕
            </button>
          </div>

          {/* ── Body ── */}
          <div className="modal-body-inner" style={{ padding: "20px 24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Personal Information */}
            <Section title="Personal Information" icon="👤">
              <Field label="Application No" value={d.appNo} mono />
              <Field label="Full Name" value={fullName} />
              <Field label="Date of Birth" value={d.dob} />
              <Field label="Gender" value={d.gender} />
              <Field label="Blood Group" value={d.bloodGroup} />
              <Field label="Nationality" value={d.nationality} />
              <Field label="Religion" value={d.religion} />
              <Field label="Category" value={d.category} />
              <Field label="Aadhar Number" value={d.aadhar} mono />
              <Field label="Phone" value={d.studentPhone} mono />
              <Field label="Address" value={d.address} />
            </Section>

            {/* Academic Information */}
            <Section title="Academic Information" icon="🎓">
              <Field label="Applying for Class" value={d.applyClass} />
              <Field label="Academic Year" value={d.academicYear} />
              <Field label="Stream" value={d.stream} />
              <Field label="Medium" value={d.medium} />
              <Field label="Previous School" value={d.prevSchool} />
              <Field label="Previous Class" value={d.prevClass} />
              <Field label="Previous Board" value={d.prevBoard} />
              <Field label="Previous Percentage" value={d.prevPercentage} />
              <Field label="Achievements" value={d.achievements} />
            </Section>

            {/* Parent Information */}
            <Section title="Parent / Guardian Information" icon="👨‍👩‍👦">
              <Field label="Father's Name" value={d.fatherName} />
              <Field label="Father's Occupation" value={d.fatherOcc} />
              <Field label="Father's Phone" value={d.fatherPhone} mono />
              <Field label="Father's Email" value={d.fatherEmail} />
              <Field label="Mother's Name" value={d.motherName} />
              <Field label="Mother's Occupation" value={d.motherOcc} />
              <Field label="Mother's Phone" value={d.motherPhone} mono />
              <Field label="Mother's Email" value={d.motherEmail} />
              <Field label="Annual Family Income" value={d.income} />
            </Section>

            {/* Emergency & Additional */}
            <Section title="Emergency & Additional" icon="🚑">
              <Field label="Emergency Contact" value={d.emergencyName} />
              <Field label="Emergency Phone" value={d.emergencyPhone} mono />
              <Field label="Medical Conditions" value={d.medical} />
              <Field label="Referral" value={d.referral} />
              <Field label="Remarks" value={d.remarks} />
              <Field label="Submission Date" value={formatDate(d.submissionDate, "full")} />
            </Section>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentViewModal;
