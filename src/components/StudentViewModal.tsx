import { formatDate } from "../utils/formatters";
import { User, GraduationCap, Users, AlertCircle, X } from "lucide-react";

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
  <div className="flex flex-col gap-1 bg-slate-50 p-3 rounded-xl border border-slate-100 h-full">
    <span className="font-sans text-[10px] font-bold tracking-wider uppercase text-slate-400">
      {label}
    </span>
    <span className={`${mono ? 'font-mono' : 'font-sans'} text-[13px] font-semibold ${value ? 'text-[#0a1628]' : 'text-slate-400 italic'}`}>
      {value || "Not provided"}
    </span>
  </div>
);

const Section = ({ title, icon: Icon, children, className = "" }: { title: string; icon: any; children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}>
    <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50/50">
      <Icon className="w-5 h-5 text-[#c8922a]" />
      <span className="font-sans text-[13px] font-bold text-[#0a1628] tracking-wide uppercase">
        {title}
      </span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
      {children}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status?: string }) => {
  const cfg: Record<string, { label: string; textClass: string; bgClass: string; dotClass: string }> = {
    submitted: { label: "Submitted", textClass: "text-blue-600", bgClass: "bg-blue-100", dotClass: "bg-blue-600" },
    reviewing: { label: "Reviewing", textClass: "text-purple-600", bgClass: "bg-purple-100", dotClass: "bg-purple-600" },
    approved:  { label: "Approved", textClass: "text-emerald-600", bgClass: "bg-emerald-100", dotClass: "bg-emerald-600" },
    rejected:  { label: "Rejected", textClass: "text-red-600", bgClass: "bg-red-100", dotClass: "bg-red-600" },
  };
  const c = cfg[status || "submitted"] || cfg.submitted;
  return (
    <span className={`inline-flex items-center gap-1.5 font-sans text-xs font-bold px-3 py-1 rounded-full shadow-sm ${c.textClass} ${c.bgClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dotClass}`} />
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
    <div
      className="fixed inset-0 z-[1000] bg-[#0a1628]/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#faf8f5] w-full max-w-5xl h-[100dvh] sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/50 animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-4 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0a1628] to-[#132238] p-6 sm:p-8 flex items-center gap-5 sm:gap-6 relative z-10 shrink-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djI2SDI0VjM0SDJWMjRoMjJWMEgzNnYyNGgyMnYxMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-[0.03]"></div>
          
          {d.photo ? (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#c8922a] overflow-hidden shrink-0 shadow-lg relative z-10 bg-[#0a1628]">
              <img src={d.photo} alt="Student" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#c8922a] shrink-0 flex items-center justify-center font-display text-2xl sm:text-3xl font-bold shadow-lg relative z-10"
              style={{ background: `hsl(${hue}, 55%, 35%)`, color: `hsl(${hue}, 55%, 88%)` }}
            >
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0 relative z-10">
            <h2 className="font-display text-2xl sm:text-3xl text-white font-bold leading-tight truncate">{fullName}</h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
              <span className="font-mono text-xs font-bold bg-[#c8922a] text-[#0a1628] px-2.5 py-1 rounded shadow-sm">
                {d.appNo}
              </span>
              <span className="font-sans text-xs font-semibold text-white/80 bg-white/10 px-2.5 py-1 rounded backdrop-blur-sm">
                Class {d.applyClass} · {d.academicYear}
              </span>
              <StatusBadge status={d.status} />
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center shrink-0 transition-all border border-white/10 relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Bento Grid) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 hide-scrollbar bg-[#faf8f5]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Personal Information */}
            <Section title="Personal Info" icon={User} className="md:col-span-2">
              <Field label="Application No" value={d.appNo} mono />
              <Field label="Full Name" value={fullName} />
              <Field label="Date of Birth" value={d.dob} />
              <Field label="Gender" value={d.gender} />
              <Field label="Blood Group" value={d.bloodGroup} />
              <Field label="Nationality" value={d.nationality} />
              <Field label="Religion" value={d.religion} />
              <Field label="Category" value={d.category} />
              <Field label="Aadhar" value={d.aadhar} mono />
              <Field label="Phone" value={d.studentPhone} mono />
              <div className="col-span-2">
                <Field label="Address" value={d.address} />
              </div>
            </Section>

            {/* Academic Information */}
            <Section title="Academic Details" icon={GraduationCap}>
              <Field label="Applying Class" value={d.applyClass} />
              <Field label="Academic Year" value={d.academicYear} />
              <Field label="Stream" value={d.stream} />
              <Field label="Medium" value={d.medium} />
              <div className="col-span-2">
                <Field label="Previous School" value={d.prevSchool} />
              </div>
              <Field label="Prev Class" value={d.prevClass} />
              <Field label="Prev Board" value={d.prevBoard} />
              <Field label="Percentage" value={d.prevPercentage} />
              <div className="col-span-2 sm:col-span-3 md:col-span-3">
                <Field label="Achievements" value={d.achievements} />
              </div>
            </Section>

            {/* Emergency & Additional */}
            <Section title="Emergency & Other" icon={AlertCircle}>
              <div className="col-span-2">
                <Field label="Emergency Contact" value={d.emergencyName} />
              </div>
              <Field label="Emergency Phone" value={d.emergencyPhone} mono />
              <div className="col-span-2 sm:col-span-3 md:col-span-3">
                <Field label="Medical Conditions" value={d.medical} />
              </div>
              <Field label="Referral" value={d.referral} />
              <Field label="Submission Date" value={formatDate(d.submissionDate, "full")} />
              <div className="col-span-2 sm:col-span-3 md:col-span-3">
                <Field label="Remarks" value={d.remarks} />
              </div>
            </Section>

            {/* Parent Information */}
            <Section title="Parent / Guardian Info" icon={Users} className="md:col-span-2">
              <div className="col-span-2 sm:col-span-1">
                <Field label="Father's Name" value={d.fatherName} />
              </div>
              <Field label="Father's Phone" value={d.fatherPhone} mono />
              <Field label="Father's Occ" value={d.fatherOcc} />
              <Field label="Father's Email" value={d.fatherEmail} />
              
              <div className="col-span-2 sm:col-span-1">
                <Field label="Mother's Name" value={d.motherName} />
              </div>
              <Field label="Mother's Phone" value={d.motherPhone} mono />
              <Field label="Mother's Occ" value={d.motherOcc} />
              <Field label="Mother's Email" value={d.motherEmail} />
              
              <div className="col-span-2 sm:col-span-4">
                <Field label="Annual Family Income" value={d.income} />
              </div>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentViewModal;
