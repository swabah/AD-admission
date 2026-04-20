import { useState, useEffect, useRef } from "react";
import {
  deleteApplication,
  getAllApplications,
  updateApplicationStatus,
} from "../services/supabase";
import logo from "../assets/logo.jpg";
import StudentViewModal from "../components/StudentViewModal";
import ApplicationPrintDocument from "../components/ApplicationPrintDocument";

// ─── Design tokens ────────────────────────────────────────────────────────────
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
  green:      "#059669",
  greenBg:    "#d1fae5",
  amber:      "#d97706",
  amberBg:    "#fef3c7",
  purple:     "#7c3aed",
  purpleBg:   "#ede9fe",
  red:        "#dc2626",
  redBg:      "#fee2e2",
  blue:       "#2563eb",
  blueBg:     "#dbeafe",
  slate:      "#64748b",
  slateBg:    "#f1f5f9",
};

const font = {
  display: "'DM Serif Display', Georgia, serif",
  sans:    "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  mono:    "'JetBrains Mono', monospace",
};

const FONT_LINK = "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500&display=swap";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Ic = {
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Clock: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Eye: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Refresh: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Print: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Trash: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Share: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Dots: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>,
  SortAsc: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  SortDesc: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  Lock: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  ArrowLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Logout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  submitted: { label: "Submitted",  color: T.blue,   bg: T.blueBg,   dot: T.blue },
  reviewing: { label: "Reviewing",  color: T.purple, bg: T.purpleBg, dot: T.purple },
  approved:  { label: "Approved",   color: T.green,  bg: T.greenBg,  dot: T.green },
  rejected:  { label: "Rejected",   color: T.red,    bg: T.redBg,    dot: T.red },
};

// ─── Shared tiny components ───────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG.submitted;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontFamily: font.sans, fontSize: 11, fontWeight: 500,
      color: cfg.color, background: cfg.bg,
      padding: "3px 10px", borderRadius: 20,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
};

const AppNoChip = ({ value }: { value: string }) => (
  <span style={{
    fontFamily: font.mono, fontSize: 11, fontWeight: 500,
    background: T.navy, color: T.gold,
    padding: "3px 9px", borderRadius: 4,
    letterSpacing: 0.5, whiteSpace: "nowrap" as const,
  }}>
    {value}
  </span>
);

const Avatar = ({ name }: { name: string }) => {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
      background: `hsl(${hue}, 55%, 88%)`,
      color: `hsl(${hue}, 55%, 30%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: font.sans, fontSize: 12, fontWeight: 600,
    }}>
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
    <>
      <style>{`
        @import url('${FONT_LINK}');
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .login-card { animation: fadeUp 0.5s ease forwards; }
        .shake { animation: shake 0.4s ease; }
      `}</style>
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: T.bg, fontFamily: font.sans,
      }}>
        {/* Decorative background */}
        <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: T.navyLight, opacity: 0.6 }} />
          <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: T.goldLight, opacity: 0.8 }} />
        </div>

        <div className="login-card" style={{
          position: "relative", zIndex: 1,
          background: T.white, borderRadius: 20,
          border: `1px solid ${T.border}`,
          padding: "48px 40px 40px",
          width: "100%", maxWidth: 400,
          boxShadow: "0 8px 48px rgba(15,32,68,0.10)",
        }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: T.navy, margin: "0 auto 16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `3px solid ${T.gold}`,
              overflow: "hidden",
            }}>
              <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ fontFamily: font.display, fontSize: 22, color: T.navy, marginBottom: 4 }}>
              Admin Portal
            </div>
            <div style={{ fontFamily: font.sans, fontSize: 13, color: T.sub }}>
              Ahlussuffa Dars · Admission System
            </div>
          </div>

          {/* Input */}
          <div className={shake ? "shake" : ""}>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.sub }}>
                <Ic.Lock />
              </div>
              <input
                type="password"
                value={key}
                placeholder="Enter admin key"
                onChange={e => setKey(e.target.value)}
                onKeyDown={e => e.key === "Enter" && attempt()}
                style={{
                  width: "100%", boxSizing: "border-box" as const,
                  padding: "12px 16px 12px 44px",
                  fontFamily: font.sans, fontSize: 14,
                  border: `1.5px solid ${T.border}`, borderRadius: 10,
                  outline: "none", background: T.bg, color: T.text,
                }}
              />
            </div>
            <button
              onClick={attempt}
              style={{
                width: "100%", padding: "13px",
                background: T.navy, color: T.white,
                fontFamily: font.sans, fontSize: 14, fontWeight: 500,
                border: "none", borderRadius: 10, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              Sign In
              <Ic.ChevronRight />
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 20, fontFamily: font.sans, fontSize: 11, color: T.sub }}>
            Authorised personnel only
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Ic, accent, trend }: {
  label: string; value: number; icon: () => React.ReactNode; accent: string; trend?: string;
}) => (
  <div style={{
    background: T.white, borderRadius: 14, padding: "18px 20px",
    border: `1px solid ${T.border}`,
    borderTop: `3px solid ${accent}`,
    display: "flex", flexDirection: "column", gap: 10,
    boxShadow: "0 2px 8px rgba(15,32,68,0.04)",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: accent + "15", color: accent,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 2px 8px ${accent}20`,
      }}>
        <Ic />
      </div>
      {trend && (
        <span style={{ fontFamily: font.sans, fontSize: 12, color: T.green, fontWeight: 600 }}>
          {trend}
        </span>
      )}
    </div>
    <div>
      <div className="stat-card-value" style={{ fontFamily: font.display, fontSize: 32, color: T.text, lineHeight: 1, fontWeight: 500 }}>
        {value}
      </div>
      <div className="stat-card-label" style={{ fontFamily: font.sans, fontSize: 13, color: T.sub, marginTop: 6, letterSpacing: 0.3, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  </div>
);

// ─── Main AdminPage ───────────────────────────────────────────────────────────
const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated]   = useState(false);
  const [applications, setApplications]         = useState<any[]>([]);
  const [selectedApp, setSelectedApp]           = useState<any>(null);
  const [loading, setLoading]                   = useState(true);
  const [viewModalApp, setViewModalApp]         = useState<any>(null);
  const [dropdownOpen, setDropdownOpen]         = useState<string | null>(null);
  const [dropdownPos, setDropdownPos]           = useState({ top: 0, left: 0 });
  const [activeTab, setActiveTab]               = useState("all");
  const [searchTerm, setSearchTerm]             = useState("");
  const [statusFilter, setStatusFilter]         = useState("all");
  const [classFilter, setClassFilter]           = useState("all");
  const [sortBy, setSortBy]                     = useState("date");
  const [sortOrder, setSortOrder]               = useState<"asc"|"desc">("desc");
  const [selectedApps, setSelectedApps]         = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Font injection
  useEffect(() => {
    const existing = document.getElementById("admin-fonts");
    if (!existing) {
      const link = document.createElement("link");
      link.id = "admin-fonts";
      link.rel = "stylesheet";
      link.href = FONT_LINK;
      document.head.appendChild(link);
    }
  }, []);

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

  const handleDelete = async (id: string) => {
    if (confirm("Delete this application? This cannot be undone.")) {
      await deleteApplication(id);
      fetchApplications();
    }
  };

  const shareApplication = async (app: any) => {
    const shareData = { title: `Application ${app.appNo || app.app_no}`, text: `${app.firstName || app.first_name} ${app.lastName || app.last_name}`, url: window.location.href };
    if (navigator.share) await navigator.share(shareData);
    else { navigator.clipboard.writeText(JSON.stringify(shareData, null, 2)); alert("Copied!"); }
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
      const matchClass  = classFilter  === "all" || (app.applyClass || app.apply_class) === classFilter;
      return matchSearch && matchStatus && matchClass;
    })
    .sort((a, b) => {
      let av: any, bv: any;
      if (sortBy === "date")   { av = new Date(a.submissionDate || a.submission_date); bv = new Date(b.submissionDate || b.submission_date); }
      else if (sortBy === "name")  { av = `${a.firstName || a.first_name}`; bv = `${b.firstName || b.first_name}`; }
      else if (sortBy === "class") { av = a.applyClass || a.apply_class; bv = b.applyClass || b.apply_class; }
      else                        { av = a.status; bv = b.status; }
      return sortOrder === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const tabApplications = activeTab === "all" ? filtered : filtered.filter(app => {
    if (activeTab === "pending") return !app.status || app.status === "submitted";
    return app.status === activeTab;
  });

  const stats = [
    { label: "Total Applications", value: applications.length,                                                            icon: Ic.Users,  accent: T.blue },
    { label: "Pending Review",     value: applications.filter(a => !a.status || a.status === "submitted").length,         icon: Ic.Clock,  accent: T.amber },
    { label: "Under Review",       value: applications.filter(a => a.status === "reviewing").length,                      icon: Ic.Eye,    accent: T.purple },
    { label: "Approved",           value: applications.filter(a => a.status === "approved").length,                       icon: Ic.Check,  accent: T.green },
  ];

  const TABS = [
    { id: "all",       label: "All",        count: filtered.length },
    { id: "pending",   label: "Pending",    count: applications.filter(a => !a.status || a.status === "submitted").length },
    { id: "reviewing", label: "Reviewing",  count: applications.filter(a => a.status === "reviewing").length },
    { id: "approved",  label: "Approved",   count: applications.filter(a => a.status === "approved").length },
    { id: "rejected",  label: "Rejected",   count: applications.filter(a => a.status === "rejected").length },
  ];

  const handleSelectAll = () => {
    setSelectedApps(selectedApps.length === tabApplications.length && tabApplications.length > 0 ? [] : tabApplications.map(a => a.id || a._id));
  };

  const handleBulkStatus = async (status: string) => {
    if (!selectedApps.length || !confirm(`Update ${selectedApps.length} applications to "${status}"?`)) return;
    await Promise.all(selectedApps.map(id => updateApplicationStatus(id, status)));
    setSelectedApps([]); fetchApplications();
  };

  const handleBulkDelete = async () => {
    if (!selectedApps.length || !confirm(`Delete ${selectedApps.length} applications permanently?`)) return;
    await Promise.all(selectedApps.map(id => deleteApplication(id)));
    setSelectedApps([]); fetchApplications();
  };

  // ── Login gate ──
  if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;

  // ── Print view ──
  if (selectedApp) return (
    <div style={{ fontFamily: font.sans }}>
      <div style={{ padding: "16px 24px" }} className="no-print">
        <button onClick={() => setSelectedApp(null)} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: font.sans, fontSize: 13, color: T.navyMid,
          background: "none", border: `1px solid ${T.border}`, borderRadius: 8,
          padding: "8px 14px", cursor: "pointer",
        }}>
          <Ic.ArrowLeft /> Back to Dashboard
        </button>
      </div>
      <ApplicationPrintDocument app={selectedApp} />
    </div>
  );

  // ── View modal ──
  if (viewModalApp) return <StudentViewModal app={viewModalApp} onClose={() => setViewModalApp(null)} />;

  // ── Main dashboard ──
  return (
    <>
      <style>{`
        @import url('${FONT_LINK}');
        * { box-sizing: border-box; }
        body { margin: 0; background: ${T.bg}; }

        .admin-root { display: flex; min-height: 100vh; font-family: ${font.sans}; background: ${T.bg}; }

        /* ── Sidebar ── */
        .sidebar {
          width: 260px; flex-shrink: 0;
          background: linear-gradient(180deg, ${T.navy} 0%, #1a2d4d 100%);
          display: flex; flex-direction: column;
          position: sticky; top: 0; height: 100vh;
          overflow-y: auto; box-shadow: 4px 0 24px rgba(15,32,68,0.15);
        }
        .sidebar-brand {
          padding: 28px 24px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sidebar-logo {
          width: 44px; height: 44px; border-radius: 12px;
          overflow: hidden; border: 2.5px solid ${T.gold};
          margin-bottom: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .sidebar-logo img { width: 100%; height: 100%; object-fit: cover; }
        .sidebar-name { font-family: ${font.display}; font-size: 18px; color: #fff; line-height: 1.2; font-weight: 500; }
        .sidebar-sub  { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 3px; letter-spacing: 0.3px; }

        .sidebar-stats { padding: 20px 16px; display: flex; flex-direction: column; gap: 8px; }
        .sidebar-stat {
          display: flex; align-items: center; gap: 12px; padding: 12px 14px;
          border-radius: 12px; cursor: pointer; transition: all 0.2s ease;
          background: rgba(255,255,255,0.02);
        }
        .sidebar-stat:hover { background: rgba(255,255,255,0.08); transform: translateX(4px); }
        .sidebar-stat-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        .sidebar-stat-val  { font-family: ${font.display}; font-size: 20px; color: #fff; line-height: 1; font-weight: 500; }
        .sidebar-stat-lbl  { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 2px; letter-spacing: 0.4px; }

        .sidebar-actions { padding: 16px; margin-top: auto; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 6px; }
        .sidebar-action-btn {
          display: flex; align-items: center; gap: 10px; width: 100%;
          padding: 10px 14px; border-radius: 10px; border: none; background: none;
          color: rgba(255,255,255,0.65); font-family: ${font.sans}; font-size: 13px;
          cursor: pointer; text-align: left; transition: all 0.2s ease;
        }
        .sidebar-action-btn:hover { background: rgba(255,255,255,0.1); color: #fff; transform: translateX(2px); }

        /* ── Main ── */
        .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

        /* ── Top bar ── */
        .topbar {
          background: ${T.white}; border-bottom: 1px solid ${T.border};
          padding: 0 32px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 10;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .topbar-title { font-family: ${font.display}; font-size: 22px; color: ${T.navy}; letter-spacing: -0.3px; }
        .topbar-actions { display: flex; gap: 10px; }
        .topbar-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 10px; font-family: ${font.sans}; font-size: 13px;
          cursor: pointer; border: 1px solid ${T.border}; background: ${T.white}; color: ${T.text};
          transition: all 0.2s ease; font-weight: 500;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .topbar-btn:hover { background: ${T.bg}; border-color: #d1d5db; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,0.04); }
        .topbar-btn:active { transform: translateY(0); }

        /* Mobile topbar */
        .mobile-topbar {
          display: none; background: linear-gradient(90deg, ${T.navy} 0%, #1a2d4d 100%);
          padding: 0 16px; height: 56px;
          align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 20;
          box-shadow: 0 2px 12px rgba(0,0,0,0.12);
        }
        .mobile-topbar-title { font-family: ${font.display}; font-size: 18px; color: #fff; font-weight: 500; }
        .mobile-menu-btn { background: none; border: none; color: rgba(255,255,255,0.8); cursor: pointer; padding: 6px; display: flex; border-radius: 8px; transition: all 0.15s; }
        .mobile-menu-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

        /* ── Stats grid ── */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 28px 32px 0; }

        /* ── Controls ── */
        .controls { padding: 24px 32px 0; display: flex; flex-direction: column; gap: 14px; }
        .controls-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
        .search-wrap { position: relative; flex: 1; min-width: 260px; }
        .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: ${T.sub}; pointer-events: none; }
        .search-input {
          width: 100%; padding: 11px 14px 11px 40px;
          border: 1px solid ${T.border}; border-radius: 10px;
          font-family: ${font.sans}; font-size: 14px; color: ${T.text}; background: ${T.white};
          outline: none; transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .search-input:hover { border-color: #d1d5db; }
        .search-input:focus { border-color: ${T.navyMid}; box-shadow: 0 0 0 3px ${T.navyLight}; }
        .filter-select {
          padding: 10px 14px; border: 1px solid ${T.border}; border-radius: 10px;
          font-family: ${font.sans}; font-size: 14px; color: ${T.text}; background: ${T.white};
          cursor: pointer; outline: none; transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .filter-select:hover { border-color: #d1d5db; }
        .filter-select:focus { border-color: ${T.navyMid}; box-shadow: 0 0 0 3px ${T.navyLight}; }
        .sort-btn {
          width: 40px; height: 40px; border: 1px solid ${T.border}; border-radius: 10px;
          background: ${T.white}; color: ${T.sub}; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .sort-btn:hover { background: ${T.bg}; border-color: #d1d5db; transform: translateY(-1px); }

        /* ── Bulk bar ── */
        .bulk-bar {
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
          background: ${T.navyLight}; border: 1px solid ${T.navyMid}30;
          border-radius: 12px; padding: 12px 18px;
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .bulk-count { font-family: ${font.sans}; font-size: 14px; font-weight: 600; color: ${T.navyMid}; margin-right: 4px; }
        .bulk-btn {
          padding: 7px 14px; border-radius: 8px; font-family: ${font.sans}; font-size: 13px; font-weight: 500;
          cursor: pointer; border: 1px solid ${T.border}; background: ${T.white}; color: ${T.text};
          display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .bulk-btn:hover { background: ${T.bg}; border-color: #d1d5db; transform: translateY(-1px); }
        .bulk-btn.danger { color: ${T.red}; border-color: ${T.red}30; }
        .bulk-btn.danger:hover { background: ${T.redBg}; border-color: ${T.red}50; }
        .bulk-btn.clear { background: none; border: none; color: ${T.sub}; font-size: 13px; padding: 7px 10px; }
        .bulk-btn.clear:hover { color: ${T.text}; background: rgba(0,0,0,0.04); }

        /* ── Tabs ── */
        .tabs-bar { padding: 20px 32px 0; }
        .tabs { display: flex; gap: 4px; border-bottom: 1px solid ${T.border}; padding-bottom: 1px; }
        .tab-btn {
          padding: 10px 18px; border: none; background: none; cursor: pointer;
          font-family: ${font.sans}; font-size: 14px; color: ${T.sub};
          display: flex; align-items: center; gap: 8px;
          border-bottom: 2px solid transparent; margin-bottom: -2px;
          transition: all 0.2s ease; border-radius: 8px 8px 0 0;
          white-space: nowrap; font-weight: 500;
        }
        .tab-btn:hover { color: ${T.text}; background: ${T.bg}; }
        .tab-btn.active { color: ${T.navyMid}; border-bottom-color: ${T.navyMid}; background: ${T.navyLight}; }
        .tab-count {
          font-size: 11px; padding: 2px 8px; border-radius: 20px;
          background: ${T.bg}; color: ${T.sub}; font-weight: 500;
        }
        .tab-btn.active .tab-count { background: ${T.navyMid}15; color: ${T.navyMid}; }

        /* ── Table ── */
        .table-wrap { padding: 20px 32px 32px; flex: 1; }
        .table-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 16px;
        }
        .table-title { font-family: ${font.display}; font-size: 18px; color: ${T.text}; display: flex; align-items: center; gap: 10px; font-weight: 500; }
        .table-total { font-family: ${font.sans}; font-size: 13px; color: ${T.sub}; background: ${T.bg}; padding: "3px 10px"; border-radius: 20px; font-weight: 500; }
        .select-all-lbl { display: flex; align-items: center; gap: 8px; font-family: ${font.sans}; font-size: 13px; color: ${T.sub}; cursor: pointer; user-select: none; }

        table { width: 100%; border-collapse: separate; border-spacing: 0; background: ${T.white}; border-radius: 16px; overflow: hidden; border: 1px solid ${T.border}; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
        thead tr { background: ${T.bg}; }
        th {
          padding: 14px 16px; text-align: left;
          font-family: ${font.sans}; font-size: 11px; font-weight: 600;
          color: ${T.sub}; letter-spacing: 0.6px; text-transform: uppercase;
          border-bottom: 1px solid ${T.border};
        }
        th:first-child { border-top-left-radius: 16px; }
        th:last-child { border-top-right-radius: 16px; }
        th.center, td.center { text-align: center; }
        td {
          padding: 14px 16px; font-family: ${font.sans}; font-size: 14px; color: ${T.text};
          border-bottom: 1px solid ${T.border};
          vertical-align: middle;
          transition: background 0.15s ease;
        }
        tr:last-child td { border-bottom: none; }
        tr:last-child td:first-child { border-bottom-left-radius: 16px; }
        tr:last-child td:last-child { border-bottom-right-radius: 16px; }
        tbody tr:hover td { background: ${T.navyLight}60; }
        tr.selected td { background: ${T.navyLight}; }

        .student-name { font-weight: 600; color: ${T.text}; font-size: 14px; }
        .student-meta { font-size: 12px; color: ${T.sub}; margin-top: 3px; }
        .class-badge { font-size: 12px; font-weight: 600; color: ${T.navyMid}; background: ${T.navyLight}; padding: "3px 10px"; border-radius: 8px; }
        .date-cell { font-family: ${font.mono}; font-size: 13px; color: ${T.sub}; }

        /* Status select */
        .status-select {
          padding: 5px 10px; border-radius: 20px; font-family: ${font.sans}; font-size: 12px; font-weight: 600;
          border: none; cursor: pointer; outline: none; appearance: none; text-align: center;
          transition: all 0.2s ease;
        }
        .status-select:hover { transform: scale(1.05); }
        .status-submitted { background: ${T.blueBg};   color: ${T.blue}; }
        .status-reviewing  { background: ${T.purpleBg}; color: ${T.purple}; }
        .status-approved   { background: ${T.greenBg};  color: ${T.green}; }
        .status-rejected   { background: ${T.redBg};    color: ${T.red}; }

        /* Dropdown */
        .action-dropdown { position: relative; }
        .dots-btn {
          width: 32px; height: 32px; border-radius: 8px; border: 1px solid ${T.border};
          background: ${T.white}; cursor: pointer; color: ${T.sub};
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .dots-btn:hover { background: ${T.bg}; color: ${T.text}; border-color: #d1d5db; transform: translateY(-1px); }
        .dropdown-menu {
          position: fixed; z-index: 100;
          background: ${T.white}; border: 1px solid ${T.border}; border-radius: 12px;
          padding: 6px; min-width: 180px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          animation: dropdownIn 0.15s ease;
        }
        @keyframes dropdownIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        .dropdown-item {
          display: flex; align-items: center; gap: 10px; width: 100%;
          padding: 10px 14px; border-radius: 8px; border: none; background: none;
          font-family: ${font.sans}; font-size: 14px; color: ${T.text};
          cursor: pointer; text-align: left; transition: all 0.15s;
        }
        .dropdown-item:hover { background: ${T.bg}; }
        .dropdown-item.danger { color: ${T.red}; }
        .dropdown-item.danger:hover { background: ${T.redBg}; }
        .dropdown-divider { height: 1px; background: ${T.border}; margin: 6px 0; }

        /* Empty / loading */
        .state-container { padding: 72px 0; text-align: center; background: ${T.white}; border-radius: 16px; border: 1px solid ${T.border}; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
        .state-icon { width: 56px; height: 56px; border-radius: 50%; background: ${T.bg}; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: ${T.sub}; }
        .state-label { font-family: ${font.sans}; font-size: 15px; color: ${T.sub}; font-weight: 500; }

        /* Mobile cards */
        .cards-mobile { display: none; flex-direction: column; gap: 12px; }
        .app-card { background: ${T.white}; border: 1px solid ${T.border}; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); transition: all 0.2s ease; }
        .app-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); transform: translateY(-2px); }
        .app-card-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid ${T.border}; background: ${T.bg}; }
        .app-card-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 10px; }
        .app-card-row { display: flex; justify-content: space-between; align-items: center; }
        .app-card-lbl { font-size: 12px; color: ${T.sub}; font-weight: 500; }
        .app-card-val { font-size: 14px; font-weight: 600; color: ${T.text}; }
        .app-card-actions { display: flex; border-top: 1px solid ${T.border}; background: ${T.bg}; }
        .app-card-act { flex: 1; padding: 12px; border: none; background: none; font-family: ${font.sans}; font-size: 13px; color: ${T.sub}; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s ease; font-weight: 500; }
        .app-card-act:hover { background: ${T.navyLight}; color: ${T.navyMid}; }
        .app-card-act + .app-card-act { border-left: 1px solid ${T.border}; }
        .app-card-act.danger:hover { background: ${T.redBg}; color: ${T.red}; }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 28px; height: 28px; border: 2.5px solid ${T.border}; border-top-color: ${T.navyMid}; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }

        /* Mobile overlay */
        .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(15,32,68,0.5); z-index: 30; backdrop-filter: blur(4px); }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .sidebar { display: none; transform: translateX(-100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
          .sidebar.open { display: flex; position: fixed; z-index: 40; left: 0; top: 0; height: 100vh; width: 280px; transform: translateX(0); box-shadow: 4px 0 32px rgba(0,0,0,0.2); }
          .mobile-topbar { display: flex; }
          .topbar { display: none; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); padding: 20px 20px 0; gap: 14px; }
          .stat-card { padding: "16px 18px"; }
          .controls { padding: 16px 20px 0; }
          .controls-row { flex-wrap: wrap; }
          .search-wrap { min-width: 100%; order: -1; }
          .search-input { padding: 12px 14px 12px 42px; }
          .filter-select { flex: 1; min-width: 0; font-size: 14px; padding: 10px 12px; }
          .sort-btn { width: 40px; height: 40px; }
          .tabs-bar { padding: 16px 0 0; }
          .tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; padding: 0 20px; scrollbar-width: none; gap: 4px; }
          .tabs::-webkit-scrollbar { display: none; }
          .tab-btn { padding: 10px 16px; font-size: 14px; }
          .table-wrap { padding: 16px 20px 24px; }
          .table-desktop { display: none; }
          .cards-mobile { display: flex; }
          .mobile-overlay { display: block; }
          .bulk-bar { padding: 12px 16px; gap: 8px; }
          .bulk-btn { padding: 8px 12px; font-size: 13px; }
        }
        @media (max-width: 520px) {
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .stat-card-value { font-size: 24px !important; }
          .stat-card-label { font-size: 12px !important; }
          .controls-row { flex-direction: column; align-items: stretch; gap: 10px; }
          .filter-select { flex: unset; width: 100%; }
          .app-card-header { padding: 12px 14px; }
          .app-card-body { padding: 12px 14px; gap: 8px; }
          .app-card-act { padding: 12px 8px; font-size: 12px; }
          .mobile-topbar { height: 52px; }
          .mobile-topbar-title { font-size: 17px; }
          .tabs { padding: 0 16px; }
          .tab-btn { padding: 8px 12px; font-size: 13px; }
          .table-wrap { padding: 12px 16px 20px; }
        }

        input[type="checkbox"] { accent-color: ${T.navyMid}; width: 16px; height: 16px; cursor: pointer; }
      `}</style>

      <div className="admin-root">

        {/* ── Sidebar ── */}
        <aside className={`sidebar ${mobileMenuOpen ? "open" : ""}`}>
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <img src={logo} alt="Logo" />
            </div>
            <div className="sidebar-name">Ahlussuffa Dars</div>
            <div className="sidebar-sub">Admission Portal</div>
          </div>

          <div className="sidebar-stats">
            {stats.map(s => (
              <div className="sidebar-stat" key={s.label} onClick={() => {}}>
                <div className="sidebar-stat-icon" style={{ background: s.accent + "22", color: s.accent }}>
                  <s.icon />
                </div>
                <div>
                  <div className="sidebar-stat-val">{s.value}</div>
                  <div className="sidebar-stat-lbl">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-actions">
            <button className="sidebar-action-btn" onClick={exportData}>
              <Ic.Download /> Export CSV
            </button>
            <button className="sidebar-action-btn" onClick={fetchApplications}>
              <Ic.Refresh /> Refresh
            </button>
            <button className="sidebar-action-btn" onClick={() => setIsAuthenticated(false)} style={{ marginTop: 8, color: "rgba(255,255,255,0.4)" }}>
              <Ic.Logout /> Sign Out
            </button>
          </div>
        </aside>

        {/* ── Mobile overlay ── */}
        {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />}

        {/* ── Main content ── */}
        <main className="main">

          {/* Mobile top bar */}
          <div className="mobile-topbar">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Ic.Menu />
            </button>
            <span className="mobile-topbar-title">Admin Dashboard</span>
            <button className="mobile-menu-btn" onClick={fetchApplications}>
              <Ic.Refresh />
            </button>
          </div>

          {/* Desktop top bar */}
          <div className="topbar">
            <div className="topbar-title">Admin Dashboard</div>
            <div className="topbar-actions">
              <button className="topbar-btn" onClick={exportData}>
                <Ic.Download /> Export
              </button>
              <button className="topbar-btn" onClick={fetchApplications}>
                <Ic.Refresh /> Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            {stats.map(s => (
              <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} accent={s.accent} />
            ))}
          </div>

          {/* Controls */}
          <div className="controls">
            <div className="controls-row">
              <div className="search-wrap">
                <span className="search-icon"><Ic.Search /></span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by name, app no, or father's name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select className="filter-select" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
                  <option value="all">All Classes</option>
                  {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="class">Class</option>
                  <option value="status">Status</option>
                </select>
                <button className="sort-btn" onClick={() => setSortOrder(s => s === "asc" ? "desc" : "asc")} title="Toggle sort order">
                  {sortOrder === "asc" ? <Ic.SortAsc /> : <Ic.SortDesc />}
                </button>
              </div>
            </div>

            {/* Bulk actions */}
            {selectedApps.length > 0 && (
              <div className="bulk-bar">
                <span className="bulk-count">{selectedApps.length} selected</span>
                <button className="bulk-btn" onClick={() => handleBulkStatus("approved")}>
                  <Ic.Check /> Approve
                </button>
                <button className="bulk-btn" onClick={() => handleBulkStatus("rejected")}>
                  <Ic.X /> Reject
                </button>
                <button className="bulk-btn danger" onClick={handleBulkDelete}>
                  <Ic.Trash /> Delete
                </button>
                <button className="bulk-btn clear" onClick={() => setSelectedApps([])}>
                  Clear selection
                </button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="tabs-bar">
            <div className="tabs">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  <span className="tab-count">{tab.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="table-wrap">
            <div className="table-header">
              <div className="table-title">
                {TABS.find(t => t.id === activeTab)?.label}
                <span style={{ fontFamily: font.sans, fontSize: 12, color: T.sub, background: T.bg, padding: "2px 8px", borderRadius: 12 }}>
                  {tabApplications.length}
                </span>
              </div>
              <label className="select-all-lbl">
                <input
                  type="checkbox"
                  checked={selectedApps.length === tabApplications.length && tabApplications.length > 0}
                  onChange={handleSelectAll}
                />
                Select all
              </label>
            </div>

            {loading ? (
              <div className="state-container">
                <div className="spinner" />
                <div className="state-label">Loading applications…</div>
              </div>
            ) : tabApplications.length === 0 ? (
              <div className="state-container">
                <div className="state-icon"><Ic.Users /></div>
                <div className="state-label">No applications found</div>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="table-desktop">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}>
                          <input type="checkbox"
                            checked={selectedApps.length === tabApplications.length && tabApplications.length > 0}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th>App No.</th>
                        <th>Student</th>
                        <th>Class</th>
                        <th>Year</th>
                        <th>Status</th>
                        <th>Submitted</th>
                        <th style={{ width: 50 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabApplications.map(app => {
                        const id = app.id || app._id;
                        const name = `${app.firstName || app.first_name || ""} ${app.lastName || app.last_name || ""}`.trim();
                        const status = app.status || "submitted";
                        return (
                          <tr key={id} className={selectedApps.includes(id) ? "selected" : ""}>
                            <td>
                              <input type="checkbox"
                                checked={selectedApps.includes(id)}
                                onChange={() => setSelectedApps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                              />
                            </td>
                            <td><AppNoChip value={app.appNo || app.app_no || "—"} /></td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <Avatar name={name || "?"} />
                                <div>
                                  <div className="student-name">{name}</div>
                                  {(app.fatherPhone || app.father_phone) && (
                                    <div className="student-meta">{app.fatherPhone || app.father_phone}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span style={{ fontSize: 12, fontWeight: 500, color: T.navyMid, background: T.navyLight, padding: "2px 8px", borderRadius: 6 }}>
                                {app.applyClass || app.apply_class}
                              </span>
                            </td>
                            <td style={{ fontFamily: font.mono, fontSize: 12, color: T.sub }}>
                              {app.academicYear || app.academic_year}
                            </td>
                            <td>
                              <select
                                value={status}
                                onChange={e => handleStatusUpdate(id, e.target.value)}
                                className={`status-select status-${status}`}
                              >
                                <option value="submitted">Submitted</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </td>
                            <td className="date-cell">
                              {app.submissionDate || app.submission_date
                                ? new Date(app.submissionDate || app.submission_date).toLocaleDateString("en-IN")
                                : "—"}
                            </td>
                            <td>
                              <div className="action-dropdown" ref={dropdownRef}>
                                <button
                                  className="dots-btn"
                                  onClick={e => {
                                    if (dropdownOpen === id) { setDropdownOpen(null); return; }
                                    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                    setDropdownPos({ top: r.bottom + 4, left: r.right - 160 });
                                    setDropdownOpen(id);
                                  }}
                                >
                                  <Ic.Dots />
                                </button>
                                {dropdownOpen === id && (
                                  <div className="dropdown-menu" style={{ top: dropdownPos.top, left: dropdownPos.left }}>
                                    <button className="dropdown-item" onClick={() => { setViewModalApp(app); setDropdownOpen(null); }}>
                                      <Ic.Eye /> View Details
                                    </button>
                                    <button className="dropdown-item" onClick={() => { setSelectedApp(app); setTimeout(() => window.print(), 100); setDropdownOpen(null); }}>
                                      <Ic.Print /> Print Form
                                    </button>
                                    <button className="dropdown-item" onClick={() => { shareApplication(app); setDropdownOpen(null); }}>
                                      <Ic.Share /> Share
                                    </button>
                                    <div className="dropdown-divider" />
                                    <button className="dropdown-item danger" onClick={() => { handleDelete(id); setDropdownOpen(null); }}>
                                      <Ic.Trash /> Delete
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
                </div>

                {/* Mobile cards */}
                <div className="cards-mobile">
                  {tabApplications.map(app => {
                    const id = app.id || app._id;
                    const name = `${app.firstName || app.first_name || ""} ${app.lastName || app.last_name || ""}`.trim();
                    const status = app.status || "submitted";
                    return (
                      <div key={id} className="app-card">
                        <div className="app-card-header">
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <input type="checkbox"
                              checked={selectedApps.includes(id)}
                              onChange={() => setSelectedApps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                            />
                            <AppNoChip value={app.appNo || app.app_no || "—"} />
                          </div>
                          <select
                            value={status}
                            onChange={e => handleStatusUpdate(id, e.target.value)}
                            className={`status-select status-${status}`}
                          >
                            <option value="submitted">Submitted</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        <div className="app-card-body">
                          <div className="app-card-row">
                            <span className="app-card-lbl">Student</span>
                            <span className="app-card-val">{name}</span>
                          </div>
                          <div className="app-card-row">
                            <span className="app-card-lbl">Father</span>
                            <span className="app-card-val">{app.fatherName || app.father_name || "—"}</span>
                          </div>
                          <div className="app-card-row">
                            <span className="app-card-lbl">Class</span>
                            <span className="app-card-val">{app.applyClass || app.apply_class} · {app.academicYear || app.academic_year}</span>
                          </div>
                          <div className="app-card-row">
                            <span className="app-card-lbl">Submitted</span>
                            <span className="app-card-val" style={{ fontFamily: font.mono, fontSize: 12 }}>
                              {app.submissionDate || app.submission_date ? new Date(app.submissionDate || app.submission_date).toLocaleDateString("en-IN") : "—"}
                            </span>
                          </div>
                        </div>
                        <div className="app-card-actions">
                          <button className="app-card-act" onClick={() => setViewModalApp(app)}>
                            <Ic.Eye /> View
                          </button>
                          <button className="app-card-act" onClick={() => { setSelectedApp(app); setTimeout(() => window.print(), 100); }}>
                            <Ic.Print /> Print
                          </button>
                          <button className="app-card-act" onClick={() => shareApplication(app)}>
                            <Ic.Share /> Share
                          </button>
                          <button className="app-card-act danger" onClick={() => handleDelete(id)}>
                            <Ic.Trash />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminPage