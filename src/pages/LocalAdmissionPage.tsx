import { useState, useRef, type ChangeEvent } from "react";
import React from "react";
import { addApplication } from "../services/supabase";
import logo from "../assets/logo.jpg";
import ApplicationPrintDocument from "../components/ApplicationPrintDocument";
import { validatePhoto } from "../utils/formValidation";
import { formatApplicationNo } from "../utils/formatters";

interface FormData {
  firstName: string;
  lastName: string;
  dob: string;
  studentPhone: string;
  applyClass: string;
  academicYear: string;
  prevClass: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  address: string;
  agreeCheck: boolean;
}

interface FormErrors {
  [key: string]: string | null;
}

const LocalAdmissionPage = () => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoDataURL, setPhotoDataURL] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    dob: "",
    studentPhone: "",
    applyClass: "",
    academicYear: "",
    prevClass: "",
    fatherName: "",
    fatherPhone: "",
    motherName: "",
    motherPhone: "",
    address: "",
    agreeCheck: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoInfo, setPhotoInfo] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [appNo, setAppNo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const compressImage = (
    file: File,
    callback: (compressedDataURL: string) => void,
  ) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const maxWidth = 1200;
        const maxHeight = 1600;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }

        let quality = 0.9;
        let compressedDataURL = canvas.toDataURL("image/jpeg", quality);

        while (compressedDataURL.length > 2 * 1024 * 1024 && quality > 0.1) {
          quality -= 0.1;
          compressedDataURL = canvas.toDataURL("image/jpeg", quality);
        }

        callback(compressedDataURL);
      };
    };

    reader.readAsDataURL(file);
  };

  const previewPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    setPhotoInfo(null);

    const validationError = validatePhoto(file);
    if (validationError) {
      setPhotoError(validationError);
      e.target.value = "";
      return;
    }

    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB > 2) {
      setPhotoInfo("Compressing image, please wait…");
      compressImage(file, (compressedDataURL) => {
        const finalMB = (compressedDataURL.length / (1024 * 1024)).toFixed(1);
        setPhotoDataURL(compressedDataURL);
        setPhotoInfo(`Photo ready — compressed to ${finalMB} MB`);
      });
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotoDataURL(ev.target?.result as string);
        setPhotoInfo(`Photo uploaded (${fileSizeInMB.toFixed(1)} MB)`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: null }));
  };

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.applyClass) newErrors.applyClass = "Class is required";
    if (!formData.academicYear) newErrors.academicYear = "Academic year is required";
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required";
    if (!formData.fatherPhone.trim()) newErrors.fatherPhone = "Father's phone is required";
    if (!formData.motherName.trim()) newErrors.motherName = "Mother's name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.agreeCheck) newErrors.agreeCheck = "Please agree to the declaration";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async () => {
    setSubmitError(null);
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsSubmitting(true);
    const newAppNo = formatApplicationNo();
    setAppNo(newAppNo);
    try {
      await addApplication({
        ...formData,
        appNo: newAppNo,
        submissionDate: new Date(),
        photo: photoDataURL,
        admissionType: "local",
      } as any);
      setShowPreview(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error submitting application: ", error);
      setSubmitError(
        "We couldn't submit your application right now. Please check your connection and try again.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareApplication = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Application",
          text: `Application No: ${appNo}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share canceled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div>
      <div id="formPage" className={`screen ${!showPreview ? "active" : ""}`}>
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
              Local Student Re-admission · 2026–27
            </div>
          </div>
        </header>

        <main>
          <div className="form-section active">
            <div className="section-badge">Re-admission Form</div>
            <div className="section-heading">Student Information</div>
            <div className="section-sub">
              For existing students continuing their studies. Please provide updated information.
            </div>

            <div
              style={{
                display: "flex",
                gap: "28px",
                flexWrap: "wrap",
                alignItems: "flex-start",
                marginBottom: "24px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--text-muted)",
                    marginBottom: "7px",
                  }}
                >
                  Student Photo
                </label>
                <div
                  className={`photo-box ${photoError ? "photo-box--error" : ""}`}
                  onClick={() => photoInputRef.current?.click()}
                >
                  {photoDataURL ? (
                    <img src={photoDataURL} alt="Photo preview" />
                  ) : (
                    <div className="photo-hint">
                      <div className="cam-icon">📷</div>
                      Upload Photo
                      <small>JPG, PNG, WebP · max 5 MB</small>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="photoInput"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={previewPhoto}
                  ref={photoInputRef}
                  style={{ display: "none" }}
                />
                {photoError && (
                  <div className="photo-feedback photo-feedback--error">
                    <span className="photo-feedback-icon">⚠</span>
                    {photoError}
                  </div>
                )}
                {photoInfo && !photoError && (
                  <div className="photo-feedback photo-feedback--success">
                    <span className="photo-feedback-icon">✓</span>
                    {photoInfo}
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: "260px" }}>
                <div className="form-grid col-2">
                  <div className="form-group">
                    <label>
                      First Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="e.g. Muhammad"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? "error" : ""}
                    />
                    <div className={`err-msg ${errors.firstName ? "show" : ""}`}>
                      {errors.firstName}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>
                      Last Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="e.g. Ibrahim"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? "error" : ""}
                    />
                    <div className={`err-msg ${errors.lastName ? "show" : ""}`}>
                      {errors.lastName}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>
                      Date of Birth <span className="req">*</span>
                    </label>
                    <input
                      type="date"
                      id="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className={errors.dob ? "error" : ""}
                    />
                    <div className={`err-msg ${errors.dob ? "show" : ""}`}>
                      {errors.dob}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Student Phone</label>
                    <input
                      type="tel"
                      id="studentPhone"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.studentPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="divider" />

            <div className="form-grid col-2">
              <div className="form-group">
                <label>
                  Applying for Class <span className="req">*</span>
                </label>
                <select
                  id="applyClass"
                  value={formData.applyClass}
                  onChange={handleInputChange}
                  className={errors.applyClass ? "error" : ""}
                >
                  <option value="">Select class</option>
                  {[8, 9, 10].map((cls) => (
                    <option key={cls}>Class {cls}</option>
                  ))}
                  <option value="Plus One">Plus One</option>
                  <option value="Plus Two">Plus Two</option>
                  <option value="Degree 1st Year">Degree 1st Year</option>
                  <option value="Degree 2nd Year">Degree 2nd Year</option>
                  <option value="Degree 3rd Year">Degree 3rd Year</option>
                  <option value="Degree 4th Year">Degree 4th Year</option>
                </select>
                <div className={`err-msg ${errors.applyClass ? "show" : ""}`}>
                  {errors.applyClass}
                </div>
              </div>
              <div className="form-group">
                <label>
                  Academic Year <span className="req">*</span>
                </label>
                <select
                  id="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  className={errors.academicYear ? "error" : ""}
                >
                  <option value="">Select year</option>
                  <option>2026–27</option>
                  <option>2027–28</option>
                  <option>2028–29</option>
                </select>
                <div className={`err-msg ${errors.academicYear ? "show" : ""}`}>
                  {errors.academicYear}
                </div>
              </div>
              <div className="form-group">
                <label>Previous Class (Last Academic Year)</label>
                <input
                  type="text"
                  id="prevClass"
                  placeholder="e.g. Class 7"
                  value={formData.prevClass}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group full">
                <label>
                  Residential Address <span className="req">*</span>
                </label>
                <textarea
                  id="address"
                  placeholder="House No., Street, Area, City, State, PIN"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? "error" : ""}
                />
                <div className={`err-msg ${errors.address ? "show" : ""}`}>
                  {errors.address}
                </div>
              </div>
            </div>

            <div className="divider" />

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
                  display: "inline-block",
                  borderRadius: 2,
                }}
              />
              Parent Contact Details
            </div>
            <div className="form-grid col-2">
              <div className="form-group">
                <label>
                  Father's Full Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="fatherName"
                  placeholder="Full name"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  className={errors.fatherName ? "error" : ""}
                />
                <div className={`err-msg ${errors.fatherName ? "show" : ""}`}>
                  {errors.fatherName}
                </div>
              </div>
              <div className="form-group">
                <label>
                  Father's Phone <span className="req">*</span>
                </label>
                <input
                  type="tel"
                  id="fatherPhone"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.fatherPhone}
                  onChange={handleInputChange}
                  className={errors.fatherPhone ? "error" : ""}
                />
                <div className={`err-msg ${errors.fatherPhone ? "show" : ""}`}>
                  {errors.fatherPhone}
                </div>
              </div>
              <div className="form-group">
                <label>
                  Mother's Full Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="motherName"
                  placeholder="Full name"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  className={errors.motherName ? "error" : ""}
                />
                <div className={`err-msg ${errors.motherName ? "show" : ""}`}>
                  {errors.motherName}
                </div>
              </div>
              <div className="form-group">
                <label>Mother's Phone</label>
                <input
                  type="tel"
                  id="motherPhone"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.motherPhone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="admit-declaration-form">
              <strong>Declaration:</strong> I hereby declare that all the
              information provided in this re-admission application is true and correct to
              the best of my knowledge. I agree to abide by the rules and
              regulations of the institution.
            </div>
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <input
                type="checkbox"
                id="agreeCheck"
                style={{
                  width: 17,
                  height: 17,
                  accentColor: "var(--navy)",
                  marginTop: "2px",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
                checked={formData.agreeCheck}
                onChange={handleInputChange}
              />
              <label
                htmlFor="agreeCheck"
                style={{
                  fontSize: "13.5px",
                  textTransform: "none",
                  letterSpacing: 0,
                  fontWeight: 400,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                I agree to the declaration above <span className="req">*</span>
              </label>
            </div>
            <div className={`err-msg ${errors.agreeCheck ? "show" : ""}`}>
              {errors.agreeCheck}
            </div>

            {submitError && (
              <div className="submit-error-banner">
                <span className="submit-error-icon">⚠</span>
                <div>
                  <strong>Submission failed</strong>
                  <p>{submitError}</p>
                </div>
                <button
                  className="submit-error-close"
                  onClick={() => setSubmitError(null)}
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
            )}

            <div className="nav-btns">
              <div />
              <button
                className="btn btn-gold"
                onClick={submitForm}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="btn-spinner" />
                    Submitting…
                  </>
                ) : (
                  "Review & Submit ✓"
                )}
              </button>
            </div>
          </div>
        </main>
      </div>

      <div
        id="previewPage"
        className={`screen ${showPreview ? "active" : ""}`}
        style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px 60px" }}
      >
        <div className="preview-header no-print">
          <h2>Re-admission Application Preview</h2>
          <div className="preview-actions">
            <button
              className="btn btn-outline"
              style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              onClick={() => {
                setShowPreview(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              ✎ Edit
            </button>
            <button className="btn btn-primary" onClick={() => window.print()}>
              🖨 Print / PDF
            </button>
            <button className="btn btn-gold" onClick={shareApplication}>
              📤 Share
            </button>
          </div>
        </div>

        <ApplicationPrintDocument
          app={{
            ...formData,
            appNo,
            photo: photoDataURL ?? undefined,
            submissionDate: new Date().toISOString(),
          }}
        />
      </div>
    </div>
  );
};

export default LocalAdmissionPage;
