import { useState, useRef, type ChangeEvent } from "react";
import React from "react";
import { addApplication } from "../services/supabase";
import logo from "../assets/logo.jpg";
import InfoItem from "../components/InfoItem";
import PhotoUploadSection from "../components/PhotoUploadSection";
import ApplicationPrintDocument from "../components/ApplicationPrintDocument";
import { validateStep, validatePhoto } from "../utils/formValidation";
import { formatDate, formatApplicationNo } from "../utils/formatters";

interface FormData {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  nationality: string;
  aadhar: string;
  studentPhone: string;
  address: string;
  applyClass: string;
  academicYear: string;
  stream: string;
  prevSchool: string;
  prevClass: string;
  prevBoard: string;
  prevPercentage: string;
  achievements: string;
  fatherName: string;
  fatherOcc: string;
  fatherPhone: string;
  fatherEmail: string;
  motherName: string;
  motherOcc: string;
  motherPhone: string;
  motherEmail: string;
  income: string;
  emergencyName: string;
  emergencyPhone: string;
  medical: string;
  referral: string;
  remarks: string;
  agreeCheck: boolean;
}

interface FormErrors {
  [key: string]: string | null;
}

interface FormState extends FormData {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  nationality: string;
  aadhar: string;
  studentPhone: string;
  address: string;
  applyClass: string;
  academicYear: string;
  stream: string;
  prevSchool: string;
  prevClass: string;
  prevBoard: string;
  prevPercentage: string;
  achievements: string;
  fatherName: string;
  fatherOcc: string;
  fatherPhone: string;
  fatherEmail: string;
  motherName: string;
  motherOcc: string;
  motherPhone: string;
  motherEmail: string;
  income: string;
  emergencyName: string;
  emergencyPhone: string;
  medical: string;
  referral: string;
  remarks: string;
  agreeCheck: boolean;
}

const ApplyPage = () => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [photoDataURL, setPhotoDataURL] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    nationality: "Indian",
    aadhar: "",
    studentPhone: "",
    address: "",
    applyClass: "",
    academicYear: "",
    stream: "",
    prevSchool: "",
    prevClass: "",
    prevBoard: "",
    prevPercentage: "",
    achievements: "",
    fatherName: "",
    fatherOcc: "",
    fatherPhone: "",
    fatherEmail: "",
    motherName: "",
    motherOcc: "",
    motherPhone: "",
    motherEmail: "",
    income: "",
    emergencyName: "",
    emergencyPhone: "",
    medical: "",
    referral: "",
    remarks: "",
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

        // Scale down image if needed
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

        // Compress to JPEG with quality adjustment
        let quality = 0.9;
        let compressedDataURL = canvas.toDataURL("image/jpeg", quality);

        // Keep reducing quality until under 2MB
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

  const validate = (step: number) => {
    const newErrors = validateStep(step, formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (from: number) => {
    if (!validate(from)) return;
    setCurrentStep(from + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = (from: number) => {
    setCurrentStep(from - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goTo = (step: number) => {
    if (step > currentStep) return;
    setCurrentStep(step);
  };

  const submitForm = async () => {
    setSubmitError(null);
    if (!validate(3)) {
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
      });
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

  const stepLabels = ["Personal", "Academic", "Parent & More"];

  return (
    <div>
      {/* Form Page */}
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
            <div className="school-name">Ahlussuffa</div>
            <div className="school-sub">
              Where Faith Meets Knowledge · Kannur, Kerala
            </div>
            <div className="header-badge">
              <span className="header-badge-dot" />
              Admissions Open · 2025–26
            </div>
          </div>
        </header>

        {/* Sticky Progress Bar */}
        <div className="progress-bar">
          {[1, 2, 3].map((step, index) => (
            <React.Fragment key={step}>
              <button
                type="button"
                className={`step-pill ${currentStep === step ? "active" : ""}`}
                onClick={() => goTo(step)}
              >
                <div
                  className={`step-dot ${currentStep === step ? "active" : currentStep > step ? "done" : ""}`}
                >
                  <span>{step}</span>
                </div>
                <div className="step-label">{stepLabels[index]}</div>
              </button>
              {index < 2 && (
                <div
                  className={`step-line ${currentStep > step ? "done" : ""}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <main>
          {/* Step 1 – Personal Information */}
          <div
            className={`form-section ${currentStep === 1 ? "active" : ""}`}
            id="sec1"
          >
            <div className="section-badge">Step 1 of 3</div>
            <div className="section-heading">Personal Information</div>
            <div className="section-sub">
              Please provide the student's personal details accurately.
            </div>

            <div
              style={{
                display: "flex",
                gap: "28px",
                flexWrap: "wrap",
                alignItems: "flex-start",
                marginBottom: "8px",
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
                      placeholder="e.g. Arjun"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? "error" : ""}
                    />
                    <div
                      className={`err-msg ${errors.firstName ? "show" : ""}`}
                    >
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
                      placeholder="e.g. Kumar"
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
                    <label>
                      Gender <span className="req">*</span>
                    </label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={errors.gender ? "error" : ""}
                    >
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                    <div className={`err-msg ${errors.gender ? "show" : ""}`}>
                      {errors.gender}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Blood Group</label>
                    <select
                      id="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option>A+</option>
                      <option>A−</option>
                      <option>B+</option>
                      <option>B−</option>
                      <option>O+</option>
                      <option>O−</option>
                      <option>AB+</option>
                      <option>AB−</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nationality</label>
                    <input
                      type="text"
                      id="nationality"
                      placeholder="Indian"
                      value={formData.nationality}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="divider" />
            <div className="form-grid col-2">
              <div className="form-group">
                <label>Aadhar Number</label>
                <input
                  type="text"
                  id="aadhar"
                  placeholder="XXXX XXXX XXXX"
                  maxLength={14}
                  value={formData.aadhar}
                  onChange={handleInputChange}
                />
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

            <div className="nav-btns">
              <div />
              <button className="btn btn-primary" onClick={() => nextStep(1)}>
                Next: Academic Info →
              </button>
            </div>
          </div>

          {/* Step 2 – Academic Details */}
          <div
            className={`form-section ${currentStep === 2 ? "active" : ""}`}
            id="sec2"
          >
            <div className="section-badge">Step 2 of 3</div>
            <div className="section-heading">Academic Details</div>
            <div className="section-sub">
              Admission preference and previous academic history.
            </div>

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
                  {[8, 9, 10, 11, 12].map((cls) => (
                    <option key={cls}>Class {cls}</option>
                  ))}
                  <option>Plus One</option>
                  <option>Plus Two</option>
                  <option>Degree</option>
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
                  <option>2025–26</option>
                  <option>2026–27</option>
                  <option>2027–28</option>
                </select>
                <div className={`err-msg ${errors.academicYear ? "show" : ""}`}>
                  {errors.academicYear}
                </div>
              </div>
              <div className="form-group">
                <label>Stream / Section</label>
                <select
                  id="stream"
                  value={formData.stream}
                  onChange={handleInputChange}
                >
                  <option value="">N/A</option>
                  <option>Roots/Highschool</option>
                  <option>HS (Higher Secondary)</option>
                  <option>BS (Bachelor of Science)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Previous School Name</label>
                <input
                  type="text"
                  id="prevSchool"
                  placeholder="School name"
                  value={formData.prevSchool}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Previous Class</label>
                <input
                  type="text"
                  id="prevClass"
                  placeholder="e.g. Class 7"
                  value={formData.prevClass}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Previous Board</label>
                <select
                  id="prevBoard"
                  value={formData.prevBoard}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option>CBSE</option>
                  <option>ICSE</option>
                  <option>State Board</option>
                  <option>IB</option>
                  <option>IGCSE</option>
                </select>
              </div>
              <div className="form-group">
                <label>Percentage / Grade</label>
                <input
                  type="text"
                  id="prevPercentage"
                  placeholder="e.g. 85% or A+"
                  value={formData.prevPercentage}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group full">
                <label>Extracurricular Activities / Achievements</label>
                <textarea
                  id="achievements"
                  placeholder="Sports, arts, clubs, awards, competitions…"
                  value={formData.achievements}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="nav-btns">
              <button className="btn btn-outline" onClick={() => prevStep(2)}>
                ← Back
              </button>
              <button className="btn btn-primary" onClick={() => nextStep(2)}>
                Next: Parent Details →
              </button>
            </div>
          </div>

          {/* Step 3 – Parent / Guardian */}
          <div
            className={`form-section ${currentStep === 3 ? "active" : ""}`}
            id="sec3"
          >
            <div className="section-badge">Step 3 of 3</div>
            <div className="section-heading">Parent & Guardian Info</div>
            <div className="section-sub">
              Contact details and additional information.
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
                  display: "inline-block",
                  borderRadius: 2,
                }}
              />
              Father's Details
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
                <label>Father's Occupation</label>
                <input
                  type="text"
                  id="fatherOcc"
                  placeholder="e.g. Engineer"
                  value={formData.fatherOcc}
                  onChange={handleInputChange}
                />
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
                <label>Father's Email</label>
                <input
                  type="email"
                  id="fatherEmail"
                  placeholder="email@example.com"
                  value={formData.fatherEmail}
                  onChange={handleInputChange}
                />
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
              Mother's Details
            </div>
            <div className="form-grid col-2">
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
                <label>Mother's Occupation</label>
                <input
                  type="text"
                  id="motherOcc"
                  placeholder="e.g. Teacher"
                  value={formData.motherOcc}
                  onChange={handleInputChange}
                />
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
              <div className="form-group">
                <label>Mother's Email</label>
                <input
                  type="email"
                  id="motherEmail"
                  placeholder="email@example.com"
                  value={formData.motherEmail}
                  onChange={handleInputChange}
                />
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
              Additional Details
            </div>
            <div className="form-grid col-2">
              <div className="form-group">
                <label>Annual Family Income</label>
                <select
                  id="income"
                  value={formData.income}
                  onChange={handleInputChange}
                >
                  <option value="">Prefer not to say</option>
                  <option>Below ₹2 Lakhs</option>
                  <option>₹2–5 Lakhs</option>
                  <option>₹5–10 Lakhs</option>
                  <option>Above ₹10 Lakhs</option>
                </select>
              </div>
              <div className="form-group">
                <label>How did you hear about us?</label>
                <select
                  id="referral"
                  value={formData.referral}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option>Friend / Family</option>
                  <option>School Website</option>
                  <option>Social Media</option>
                  <option>Newspaper</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Emergency Contact Name</label>
                <input
                  type="text"
                  id="emergencyName"
                  placeholder="Contact name"
                  value={formData.emergencyName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Emergency Contact Phone</label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group full">
                <label>Medical Conditions / Allergies</label>
                <textarea
                  id="medical"
                  placeholder="Any known conditions, medications, or allergies…"
                  value={formData.medical}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group full">
                <label>Additional Remarks</label>
                <textarea
                  id="remarks"
                  placeholder="Any other information you'd like to share…"
                  value={formData.remarks}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="admit-declaration-form">
              <strong>Declaration:</strong> I hereby declare that all the
              information provided in this application is true and correct to
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
              <button className="btn btn-outline" onClick={() => prevStep(3)} disabled={isSubmitting}>
                ← Back
              </button>
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

      {/* Preview Page */}
      <div
        id="previewPage"
        className={`screen ${showPreview ? "active" : ""}`}
        style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px 60px" }}
      >
        <div className="preview-header no-print">
          <h2>Application Preview</h2>
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

        <div id="printArea">
          <div className="admit-header">
            <div className="admit-school-info">
              <div className="admit-logo">
                <div className="admit-logo-circle">
                  <img src={logo} alt="Ahlussuffa Logo" />
                </div>
                <div>
                  <div className="admit-school-name">Ahlussuffa</div>
                  <div className="admit-school-sub">
                    Where Faith Meets Knowledge · Kannur, Kerala
                  </div>
                </div>
              </div>
              <div className="admit-form-title">
                Student Admission Application
              </div>
            </div>
            <div className="admit-app-no">
              <div className="app-no-label">Application No.</div>
              <div className="app-no-val">{appNo}</div>
              <div className="app-date">
                Date:{" "}
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
          <div className="gold-bar" />

          <div className="admit-body">
            <div className="admit-top">
              <div className="admit-photo">
                {photoDataURL ? (
                  <img
                    src={photoDataURL}
                    alt="Student portrait"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "No Photo"
                )}
              </div>
              <div className="admit-name-block">
                <h3>
                  {formData.firstName} {formData.lastName}
                </h3>
                <div className="admit-class">
                  Applying for {formData.applyClass} · {formData.academicYear}
                </div>
                <div className="admit-tags">
                  {[formData.gender, formData.bloodGroup]
                    .filter((t) => t)
                    .map((t) => (
                      <span key={t} className="admit-tag">
                        {t}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="admit-section-title">Personal Information</div>
            <div className="info-grid">
              <InfoItem
                label="Date of Birth"
                value={
                  formData.dob
                    ? new Date(formData.dob).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"
                }
              />
              <InfoItem label="Gender" value={formData.gender} />
              <InfoItem label="Blood Group" value={formData.bloodGroup} />
              <InfoItem label="Nationality" value={formData.nationality} />
              <InfoItem label="Aadhar No." value={formData.aadhar} />
              <InfoItem label="Phone" value={formData.studentPhone} />
              <div style={{ gridColumn: "1/-1" }}>
                <InfoItem label="Address" value={formData.address} />
              </div>
            </div>

            <div className="admit-section-title">Academic Details</div>
            <div className="info-grid">
              <InfoItem
                label="Applying for Class"
                value={formData.applyClass}
              />
              <InfoItem label="Academic Year" value={formData.academicYear} />
              <InfoItem label="Stream" value={formData.stream} />
              <InfoItem label="Previous School" value={formData.prevSchool} />
              <InfoItem label="Previous Class" value={formData.prevClass} />
              <InfoItem label="Previous Board" value={formData.prevBoard} />
              <InfoItem
                label="Last Exam Result"
                value={formData.prevPercentage}
              />
              {formData.achievements && (
                <div style={{ gridColumn: "1/-1" }}>
                  <InfoItem
                    label="Achievements"
                    value={formData.achievements}
                  />
                </div>
              )}
            </div>

            <div className="admit-section-title">Parent / Guardian Details</div>
            <div className="info-grid">
              <InfoItem label="Father's Name" value={formData.fatherName} />
              <InfoItem
                label="Father's Occupation"
                value={formData.fatherOcc}
              />
              <InfoItem label="Father's Phone" value={formData.fatherPhone} />
              <InfoItem label="Father's Email" value={formData.fatherEmail} />
              <InfoItem label="Mother's Name" value={formData.motherName} />
              <InfoItem
                label="Mother's Occupation"
                value={formData.motherOcc}
              />
              <InfoItem label="Mother's Phone" value={formData.motherPhone} />
              <InfoItem label="Mother's Email" value={formData.motherEmail} />
              <InfoItem label="Annual Income" value={formData.income} />
              <InfoItem
                label="Emergency Contact"
                value={`${formData.emergencyName}${formData.emergencyPhone ? ` · ${formData.emergencyPhone}` : ""}`}
              />
            </div>

            <div className="admit-section-title">Additional Information</div>
            <div className="info-grid">
              <InfoItem label="Referral Source" value={formData.referral} />
              {formData.medical && (
                <div style={{ gridColumn: "1/-1" }}>
                  <InfoItem
                    label="Medical / Allergies"
                    value={formData.medical}
                  />
                </div>
              )}
              {formData.remarks && (
                <div style={{ gridColumn: "1/-1" }}>
                  <InfoItem
                    label="Additional Remarks"
                    value={formData.remarks}
                  />
                </div>
              )}
            </div>

            <div className="admit-declaration">
              <strong>Declaration:</strong> I hereby declare that all the
              information provided in this application is true and correct to
              the best of my knowledge. I agree to abide by the rules and
              regulations of the institution.
            </div>

            <div className="admit-footer">
              <div className="sig-line">
                <div className="sig-dashes" />
                <div className="sig-label">Parent / Guardian Signature</div>
              </div>
              <div className="sig-line">
                <div className="sig-dashes" />
                <div className="sig-label">Applicant Signature</div>
              </div>
              <div className="sig-line">
                <div className="sig-dashes" />
                <div className="sig-label">Office Use Only</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
