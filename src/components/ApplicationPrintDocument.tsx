import logo from "../assets/logo.jpg";
import { formatDate } from "../utils/formatters";

interface RawApplicationData {
  appNo?: string; app_no?: string;
  firstName?: string; first_name?: string;
  lastName?: string; last_name?: string;
  dob?: string; gender?: string;
  bloodGroup?: string; blood_group?: string;
  nationality?: string; aadhar?: string;
  studentPhone?: string; student_phone?: string;
  address?: string;
  applyClass?: string; apply_class?: string;
  academicYear?: string; academic_year?: string;
  stream?: string;
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
  photo?: string;
  submissionDate?: string; submission_date?: string;
}

interface ApplicationPrintDocumentProps {
  app: RawApplicationData;
}

const s = {
  page: {
    width: "210mm",
    minHeight: "297mm",
    margin: "0 auto",
    background: "#fff",
    fontFamily: "'Arial', 'Helvetica', sans-serif",
    fontSize: "8.5pt",
    color: "#111",
    display: "flex",
    flexDirection: "column" as const,
    boxSizing: "border-box" as const,
  },
  header: {
    background: "#0a1628",
    padding: "10px 14px 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
  },
  logoBox: {
    width: "46px",
    height: "46px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(200,146,42,0.5)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px",
    flexShrink: 0,
  },
  logoImg: { width: "100%", height: "100%", objectFit: "contain" as const, filter: "brightness(0) invert(1)" },
  schoolBlock: { color: "#fff" },
  schoolName: { fontFamily: "'Georgia', serif", fontSize: "15pt", fontWeight: "bold" as const, lineHeight: 1.1 },
  schoolSub: { fontSize: "7pt", color: "rgba(255,255,255,0.65)", letterSpacing: "0.04em", textTransform: "uppercase" as const },
  formTitle: { fontSize: "9pt", color: "#c8922a", fontWeight: "bold" as const, marginTop: "3px", letterSpacing: "0.06em", textTransform: "uppercase" as const },
  headerMeta: { color: "#fff", textAlign: "right" as const, fontSize: "7.5pt" },
  metaLabel: { color: "rgba(255,255,255,0.6)", fontSize: "7pt" },
  metaVal: { fontWeight: "bold" as const, fontSize: "9pt" },
  goldBar: { height: "3px", background: "linear-gradient(90deg, transparent, #c8922a, #e8b86d, #c8922a, transparent)" },
  photoBox: {
    width: "72px",
    height: "88px",
    border: "1.5px solid rgba(255,255,255,0.3)",
    borderRadius: "4px",
    background: "rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  body: { padding: "10px 14px", flex: 1, display: "flex", flexDirection: "column" as const, gap: "7px" },
  sectionHead: {
    background: "#0a1628",
    color: "#fff",
    fontSize: "7pt",
    fontWeight: "bold" as const,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    padding: "3px 7px",
    borderRadius: "2px",
    marginBottom: "4px",
  },
  row: { display: "flex", gap: "10px", marginBottom: "3px", alignItems: "flex-end" },
  field: { display: "flex", flexDirection: "column" as const, flex: 1 },
  label: { fontSize: "6.5pt", color: "#666", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "1px" },
  value: {
    borderBottom: "1px dotted #999",
    minHeight: "14px",
    paddingBottom: "1px",
    fontSize: "8.5pt",
    color: "#111",
    lineHeight: 1.3,
  },
  valueEmpty: {
    borderBottom: "1px dotted #bbb",
    minHeight: "14px",
    paddingBottom: "1px",
    fontSize: "8.5pt",
    color: "#ccc",
  },
  declaration: {
    borderTop: "1px solid #ddd",
    paddingTop: "6px",
    marginTop: "4px",
    fontSize: "7.5pt",
    color: "#333",
    lineHeight: 1.5,
  },
  sigRow: { display: "flex", gap: "16px", marginTop: "18px" },
  sigBlock: { flex: 1, textAlign: "center" as const },
  sigLine: { borderTop: "1px solid #333", paddingTop: "3px", fontSize: "7pt", color: "#555" },
  officeBox: {
    border: "1.5px solid #0a1628",
    borderRadius: "4px",
    marginTop: "8px",
    overflow: "hidden",
  },
  officeHead: {
    background: "#0a1628",
    color: "#fff",
    padding: "3px 8px",
    fontSize: "7pt",
    fontWeight: "bold" as const,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  officeBody: { padding: "6px 8px", display: "flex", gap: "12px" },
  footer: {
    padding: "5px 14px",
    borderTop: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "6.5pt",
    color: "#999",
  },
};

const Field = ({ label, value, flex = 1 }: { label: string; value?: string | null; flex?: number }) => (
  <div style={{ ...s.field, flex }}>
    <span style={s.label}>{label}</span>
    <span style={value ? s.value : s.valueEmpty}>{value || ""}</span>
  </div>
);

const ApplicationPrintDocument = ({ app }: ApplicationPrintDocumentProps) => {
  const d = {
    appNo: app.appNo || app.app_no || "",
    firstName: app.firstName || app.first_name || "",
    lastName: app.lastName || app.last_name || "",
    dob: app.dob, gender: app.gender,
    bloodGroup: app.bloodGroup || app.blood_group,
    nationality: app.nationality,
    aadhar: app.aadhar,
    studentPhone: app.studentPhone || app.student_phone,
    address: app.address,
    applyClass: app.applyClass || app.apply_class || "",
    academicYear: app.academicYear || app.academic_year || "",
    stream: app.stream,
    prevSchool: app.prevSchool || app.prev_school,
    prevClass: app.prevClass || app.prev_class,
    prevBoard: app.prevBoard || app.prev_board,
    prevPercentage: app.prevPercentage || app.prev_percentage,
    achievements: app.achievements,
    fatherName: app.fatherName || app.father_name || "",
    fatherOcc: app.fatherOcc || app.father_occ,
    fatherPhone: app.fatherPhone || app.father_phone || "",
    fatherEmail: app.fatherEmail || app.father_email,
    motherName: app.motherName || app.mother_name || "",
    motherOcc: app.motherOcc || app.mother_occ,
    motherPhone: app.motherPhone || app.mother_phone,
    motherEmail: app.motherEmail || app.mother_email,
    income: app.income,
    emergencyName: app.emergencyName || app.emergency_name,
    emergencyPhone: app.emergencyPhone || app.emergency_phone,
    medical: app.medical,
    referral: app.referral,
    remarks: app.remarks,
    photo: app.photo,
    submissionDate: app.submissionDate || app.submission_date,
  };

  const fullName = `${d.firstName} ${d.lastName}`.trim();

  return (
    <div id="printArea" style={s.page}>

      {/* ── HEADER ── */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.logoBox}>
            <img src={logo} alt="Logo" style={s.logoImg} />
          </div>
          <div style={s.schoolBlock}>
            <div style={s.schoolName}>Ahlussuffa</div>
            <div style={s.schoolSub}>Where Faith Meets Knowledge · Kannur, Kerala</div>
            <div style={s.formTitle}>Student Admission Form</div>
          </div>
        </div>

        <div style={s.headerMeta}>
          <div style={s.metaLabel}>Application No.</div>
          <div style={s.metaVal}>{d.appNo || "—"}</div>
          <div style={{ ...s.metaLabel, marginTop: "4px" }}>Date</div>
          <div style={{ color: "#fff", fontSize: "7.5pt" }}>{formatDate(d.submissionDate, "full") || "—"}</div>
        </div>

        <div style={s.photoBox}>
          {d.photo
            ? <img src={d.photo} alt="Student" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: "6pt", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>Photo</span>
          }
        </div>
      </div>

      <div style={s.goldBar} />

      {/* ── BODY ── */}
      <div style={s.body}>

        {/* Personal */}
        <div>
          <div style={s.sectionHead}>▸ Personal Information</div>
          <div style={s.row}>
            <Field label="Full Name" value={fullName} flex={2} />
            <Field label="Date of Birth" value={formatDate(d.dob, "full")} />
            <Field label="Gender" value={d.gender} />
          </div>
          <div style={s.row}>
            <Field label="Blood Group" value={d.bloodGroup} />
            <Field label="Nationality" value={d.nationality} />
            <Field label="Aadhar Number" value={d.aadhar} />
            <Field label="Phone" value={d.studentPhone} />
          </div>
          <div style={s.row}>
            <Field label="Residential Address" value={d.address} flex={4} />
          </div>
        </div>

        {/* Academic */}
        <div>
          <div style={s.sectionHead}>▸ Academic Details</div>
          <div style={s.row}>
            <Field label="Applying for Class" value={d.applyClass} />
            <Field label="Academic Year" value={d.academicYear} />
            <Field label="Stream / Section" value={d.stream} />
          </div>
          <div style={s.row}>
            <Field label="Previous School" value={d.prevSchool} flex={2} />
            <Field label="Previous Class" value={d.prevClass} />
            <Field label="Board" value={d.prevBoard} />
            <Field label="Result (%)" value={d.prevPercentage} />
          </div>
          {d.achievements && (
            <div style={s.row}>
              <Field label="Achievements / Extracurricular" value={d.achievements} flex={4} />
            </div>
          )}
        </div>

        {/* Parent */}
        <div>
          <div style={s.sectionHead}>▸ Parent / Guardian Information</div>
          <div style={s.row}>
            <Field label="Father's Name" value={d.fatherName} flex={2} />
            <Field label="Occupation" value={d.fatherOcc} />
            <Field label="Phone" value={d.fatherPhone} />
            <Field label="Email" value={d.fatherEmail} />
          </div>
          <div style={s.row}>
            <Field label="Mother's Name" value={d.motherName} flex={2} />
            <Field label="Occupation" value={d.motherOcc} />
            <Field label="Phone" value={d.motherPhone} />
            <Field label="Email" value={d.motherEmail} />
          </div>
          <div style={s.row}>
            <Field label="Annual Family Income" value={d.income} />
            <Field label="Emergency Contact Name" value={d.emergencyName} />
            <Field label="Emergency Phone" value={d.emergencyPhone} />
          </div>
          {(d.medical || d.remarks) && (
            <div style={s.row}>
              {d.medical && <Field label="Medical / Allergies" value={d.medical} flex={2} />}
              {d.remarks && <Field label="Remarks" value={d.remarks} flex={2} />}
            </div>
          )}
        </div>

        {/* Declaration */}
        <div style={s.declaration}>
          <strong style={{ fontSize: "7.5pt", textTransform: "uppercase", letterSpacing: "0.06em" }}>Declaration</strong>
          <p style={{ margin: "3px 0 0" }}>
            I hereby declare that all information furnished in this application is true, complete and correct to the best of my
            knowledge and belief. I agree to abide by the rules, regulations and discipline of Ahlussuffa institution. I understand
            that any false statement may result in disqualification of my application.
          </p>
        </div>

        {/* Signatures */}
        <div style={s.sigRow}>
          <div style={s.sigBlock}>
            <div style={s.sigLine}>Parent / Guardian Signature</div>
          </div>
          <div style={s.sigBlock}>
            <div style={s.sigLine}>Applicant's Signature</div>
          </div>
          <div style={s.sigBlock}>
            <div style={s.sigLine}>Date</div>
          </div>
        </div>

        {/* Office Use Only */}
        <div style={s.officeBox}>
          <div style={s.officeHead}>
            <span>★</span>
            <span>For Office Use Only</span>
          </div>
          <div style={s.officeBody}>
            <Field label="Admission Status" value="" />
            <Field label="Admission No." value="" />
            <Field label="Class Assigned" value="" />
            <Field label="Fee Received (₹)" value="" />
            <Field label="Verified By" value="" />
            <Field label="Date" value="" />
          </div>
          <div style={{ padding: "0 8px 6px", display: "flex", gap: "10px" }}>
            <Field label="Remarks" value="" flex={3} />
            <Field label="Authorised Signature" value="" flex={1} />
          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <div style={s.footer}>
        <span>Ahlussuffa — Where Faith Meets Knowledge · Kannur, Kerala</span>
        <span>This is a computer-generated document.</span>
      </div>

    </div>
  );
};

export default ApplicationPrintDocument;
