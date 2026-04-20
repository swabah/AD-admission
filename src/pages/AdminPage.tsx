import { useState, useEffect } from "react";
import {
  deleteApplication,
  getAllApplications,
  updateApplicationStatus,
} from "../services/supabase";
import logo from "../assets/logo.jpg";
import InfoItem from "../components/InfoItem";
import StudentViewModal from "../components/StudentViewModal";
import ApplicationPrintDocument from "../components/ApplicationPrintDocument";
import { formatDate } from "../utils/formatters";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewModalApp, setViewModalApp] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const handleDropdownToggle = (appId, event) => {
    if (dropdownOpen === appId) {
      setDropdownOpen(null);
    } else {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right - 140 + window.scrollX,
      });
      setDropdownOpen(appId);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    if (adminKey === import.meta.env.VITE_ADMIN_KEY) {
      setIsAuthenticated(true);
      fetchApplications();
    } else {
      alert("Invalid admin key");
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await getAllApplications();
      setApplications(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    await updateApplicationStatus(id, status);
    fetchApplications();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this application?")) {
      await deleteApplication(id);
      fetchApplications();
    }
  };

  const shareApplication = async (app) => {
    const shareData = {
      title: `Application ${app.appNo}`,
      text: `Application from ${app.firstName} ${app.lastName} for ${app.applyClass}`,
      url: `${window.location.origin}/admin`,
    };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(JSON.stringify(shareData, null, 2));
      alert("Application details copied to clipboard!");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-login-logo">
            <img src={logo} alt="Ahlussuffa Logo" />
          </div>
          <h2>Admin Portal</h2>
          <p className="admin-login-subtitle">Access the admission dashboard</p>
          <div className="admin-login-form">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin key"
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={handleLogin}
            >
              Sign In →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedApp) {
    return (
      <div className="admin-print-view">
        <div style={{ marginBottom: 20 }}>
          <button
            type="button"
            className="btn btn-outline no-print"
            onClick={() => setSelectedApp(null)}
          >
            ← Back to Dashboard
          </button>
        </div>
        <ApplicationPrintDocument app={selectedApp} />
      </div>
    );
  }

  if (viewModalApp) {
    return (
      <StudentViewModal
        app={viewModalApp}
        onClose={() => setViewModalApp(null)}
      />
    );
  }

  const stats = [
    { icon: "📋", value: applications.length, label: "Total Applications" },
    {
      icon: "⏳",
      value: applications.filter((a) => !a.status || a.status === "submitted")
        .length,
      label: "Pending Review",
    },
    {
      icon: "🔍",
      value: applications.filter((a) => a.status === "reviewing").length,
      label: "Under Review",
    },
    {
      icon: "✅",
      value: applications.filter((a) => a.status === "approved").length,
      label: "Approved",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo-section">
            <div className="admin-logo">
              <img src={logo} alt="Ahlussuffa Logo" />
            </div>
            <div>
              <h1>Admin Dashboard</h1>
              <p className="admin-header-subtitle">
                Manage student admission applications
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
            onClick={fetchApplications}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {!loading && applications.length > 0 && (
        <div className="admin-stats">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="applications-table">
        <div className="table-header">
          <div className="table-title">All Applications</div>
          {!loading && (
            <div className="table-count">{applications.length} total</div>
          )}
        </div>

        {loading ? (
          <div className="state-message">
            <div className="state-icon">⏳</div>
            <div>Loading applications…</div>
          </div>
        ) : applications.length === 0 ? (
          <div className="state-message">
            <div className="state-icon">📭</div>
            <div>No applications submitted yet.</div>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>App No.</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id || app._id}>
                    <td>
                      <span className="app-no-chip">
                        {app.appNo || app.app_no}
                      </span>
                    </td>
                    <td>
                      <div className="student-name">
                        {app.firstName || app.first_name}{" "}
                        {app.lastName || app.last_name}
                      </div>
                      {(app.fatherPhone || app.father_phone) && (
                        <div className="student-meta">
                          {app.fatherPhone || app.father_phone}
                        </div>
                      )}
                    </td>
                    <td>{app.applyClass || app.apply_class}</td>
                    <td>{app.academicYear || app.academic_year}</td>
                    <td>
                      <select
                        value={app.status || "submitted"}
                        onChange={(e) =>
                          handleStatusUpdate(app.id || app._id, e.target.value)
                        }
                        className={`status-select status-${app.status || "submitted"}`}
                      >
                        <option value="submitted">Submitted</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}>
                      {app.submissionDate || app.submission_date
                        ? new Date(
                            app.submissionDate || app.submission_date,
                          ).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>
                    <td className="actions">
                      <div className="dropdown">
                        <button
                          type="button"
                          className="dropdown-toggle action-btn"
                          onClick={(e) =>
                            handleDropdownToggle(app.id || app._id, e)
                          }
                          title="Actions"
                        >
                          ⋯
                        </button>
                        {dropdownOpen === (app.id || app._id) && (
                          <div
                            className="dropdown-menu"
                            style={{
                              top: `${dropdownPos.top}px`,
                              left: `${dropdownPos.left}px`,
                            }}
                          >
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => {
                                setViewModalApp(app);
                                setDropdownOpen(null);
                              }}
                            >
                              👁 View Student
                            </button>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => {
                                setSelectedApp(app);
                                setTimeout(() => window.print(), 100);
                                setDropdownOpen(null);
                              }}
                            >
                              🖨 Print
                            </button>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => {
                                shareApplication(app);
                                setDropdownOpen(null);
                              }}
                            >
                              📤 Share
                            </button>
                            <button
                              type="button"
                              className="dropdown-item delete-item"
                              onClick={() => {
                                handleDelete(app.id || app._id);
                                setDropdownOpen(null);
                              }}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards View */}
            <div className="applications-cards">
              {applications.map((app) => (
                <div key={app.id || app._id} className="application-card">
                  <div className="card-header">
                    <span className="app-no-chip">
                      {app.appNo || app.app_no}
                    </span>
                    <select
                      value={app.status || "submitted"}
                      onChange={(e) =>
                        handleStatusUpdate(app.id || app._id, e.target.value)
                      }
                      className={`status-select status-${app.status || "submitted"}`}
                    >
                      <option value="submitted">Submitted</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="card-content">
                    <div className="card-info-row">
                      <span className="card-info-value">
                        {app.firstName || app.first_name}{" "}
                        {app.lastName || app.last_name}
                      </span>
                    </div>
                    <div className="card-info-row">
                      <span className="card-info-value">
                        {app.fatherName || app.father_name}
                      </span>
                    </div>
                    <div className="card-info-row">
                      <span className="card-info-value">
                        Class {app.applyClass || app.apply_class}
                        {app.stream && ` • ${app.stream}`}
                      </span>
                    </div>
                    <div className="card-info-row">
                      <span
                        className="card-info-value"
                        style={{ color: "var(--text-muted)", fontSize: 12 }}
                      >
                        {app.submissionDate || app.submission_date
                          ? new Date(
                              app.submissionDate || app.submission_date,
                            ).toLocaleDateString("en-IN")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <div className="dropdown">
                      <button
                        type="button"
                        className="dropdown-toggle action-btn"
                        onClick={(e) =>
                          handleDropdownToggle(app.id || app._id, e)
                        }
                        title="Actions"
                      >
                        ⋯
                      </button>
                      {dropdownOpen === (app.id || app._id) && (
                        <div
                          className="dropdown-menu"
                          style={{
                            top: `${dropdownPos.top}px`,
                            left: `${dropdownPos.left}px`,
                          }}
                        >
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                              setViewModalApp(app);
                              setDropdownOpen(null);
                            }}
                          >
                            👁 View Student
                          </button>
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                              setSelectedApp(app);
                              setTimeout(() => window.print(), 100);
                              setDropdownOpen(null);
                            }}
                          >
                            🖨 Print
                          </button>
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                              shareApplication(app);
                              setDropdownOpen(null);
                            }}
                          >
                            📤 Share
                          </button>
                          <button
                            type="button"
                            className="dropdown-item delete-item"
                            onClick={() => {
                              handleDelete(app.id || app._id);
                              setDropdownOpen(null);
                            }}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
