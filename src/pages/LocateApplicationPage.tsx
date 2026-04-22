import { useState } from "react";
import { searchApplicationsByPhoneAndDob } from "../services/supabase";
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

  const handleDownloadPDF = () => {
    window.print();
  };

  if (selectedApp) {
    return (
      <div>
        <div className="no-print" style={{ 
          padding: "16px 24px", 
          background: "var(--navy)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <button 
            onClick={() => setSelectedApp(null)}
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
            ← Back to Results
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button 
              onClick={handlePrint}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: "#fff",
                background: "var(--gold)",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              🖨 Print
            </button>
            <button 
              onClick={handleDownloadPDF}
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
              ⬇ Download PDF
            </button>
          </div>
        </div>
        <ApplicationPrintDocument app={selectedApp} />
      </div>
    );
  }

  return (
    <div>
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
          <div className="school-sub">
            Where Faith Meets Knowledge · Kannur, Kerala
          </div>
          <div className="header-badge">
            <span className="header-badge-dot" />
            Find Your Application
          </div>
        </div>
      </header>

      <main style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto" }}>
        <div className="section-badge" style={{ textAlign: "center" }}>Application Lookup</div>
        <div className="section-heading" style={{ textAlign: "center", marginBottom: "16px" }}>
          Locate Your Application
        </div>
        <div className="section-sub" style={{ textAlign: "center", marginBottom: "32px" }}>
          Enter your mobile number and date of birth to find your submitted application
        </div>

        <form onSubmit={handleSearch} style={{
          background: "var(--card-bg)",
          borderRadius: "16px",
          padding: "32px",
          border: "1px solid var(--card-border)",
        }}>
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label>
              Mobile Number <span className="req">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              required
              style={{ width: "100%" }}
            />
            <small style={{ color: "var(--text-muted)", fontSize: "12px" }}>
              Enter father's, mother's, or student's phone number
            </small>
          </div>

          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label>
              Date of Birth <span className="req">*</span>
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                Searching…
              </>
            ) : (
              "🔍 Search Application"
            )}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: "24px",
            padding: "16px",
            background: "#fee2e2",
            borderRadius: "12px",
            color: "#dc2626",
            textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {applications.length > 0 && (
          <div style={{ marginTop: "32px" }}>
            <h3 style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "20px", 
              marginBottom: "20px",
              textAlign: "center"
            }}>
              Found {applications.length} Application{applications.length > 1 ? "s" : ""}
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {applications.map((app) => (
                <div 
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  style={{
                    background: "var(--card-bg)",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid var(--card-border)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "flex-start",
                    marginBottom: "12px"
                  }}>
                    <div>
                      <div style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "18px",
                        color: "var(--text)",
                        marginBottom: "4px"
                      }}>
                        {app.firstName} {app.lastName}
                      </div>
                      <div style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)"
                      }}>
                        {app.applyClass} · {app.academicYear}
                      </div>
                    </div>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      background: "var(--navy)",
                      color: "var(--gold)",
                      padding: "4px 10px",
                      borderRadius: "4px",
                    }}>
                      {app.appNo}
                    </span>
                  </div>
                  
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "8px",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    marginBottom: "12px"
                  }}>
                    <div>📞 {app.fatherPhone}</div>
                    <div>👨 {app.fatherName}</div>
                    <div>👩 {app.motherName}</div>
                    <div>📅 {new Date(app.submissionDate).toLocaleDateString()}</div>
                  </div>

                  <div style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "flex-end"
                  }}>
                    <span style={{
                      fontSize: "12px",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background: app.admissionType === "local" ? "#fef3c7" : "#dbeafe",
                      color: app.admissionType === "local" ? "#d97706" : "#2563eb",
                    }}>
                      {app.admissionType === "local" ? "Local / Re-admission" : "New Admission"}
                    </span>
                    <span style={{
                      fontSize: "12px",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background: "#d1fae5",
                      color: "#059669",
                      textTransform: "capitalize"
                    }}>
                      {app.status || "Submitted"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ 
          marginTop: "40px", 
          textAlign: "center",
          padding: "24px",
          background: "var(--navy-light)",
          borderRadius: "12px"
        }}>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "12px" }}>
            Need to submit a new application?
          </p>
          <a 
            href="/apply" 
            style={{
              display: "inline-block",
              padding: "10px 24px",
              background: "var(--navy)",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500
            }}
          >
            Go to Application Page
          </a>
        </div>
      </main>
    </div>
  );
};

export default LocateApplicationPage;
