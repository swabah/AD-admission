/**
 * ApplicationPrintDocument Component
 * Displays printable student admission application
 */

import logo from "../assets/logo.jpg";
import InfoItem from "./InfoItem";
import { formatDate } from "../utils/formatters";

interface RawApplicationData {
  appNo?: string;
  app_no?: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  dob?: string;
  gender?: string;
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
}

interface ApplicationPrintDocumentProps {
  app: RawApplicationData;
}

const ApplicationPrintDocument = ({ app }: ApplicationPrintDocumentProps) => {
  // Normalize field names to support both camelCase and snake_case
  const data = {
    appNo: app.appNo || app.app_no || "",
    firstName: app.firstName || app.first_name || "",
    lastName: app.lastName || app.last_name || "",
    dob: app.dob,
    gender: app.gender,
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

  return (
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
          <div className="admit-form-title">Student Admission Application</div>
        </div>
        <div className="admit-app-no">
          <div className="app-no-label">Application No.</div>
          <div className="app-no-val">{data.appNo}</div>
          <div className="app-date">
            Date: {formatDate(data.submissionDate, "full")}
          </div>
        </div>
      </div>
      <div className="gold-bar" />

      <div className="admit-body">
        <div className="admit-top">
          <div className="admit-photo">
            {data.photo ? (
              <img
                src={data.photo}
                alt="Student portrait"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              "No Photo"
            )}
          </div>
          <div className="admit-name-block">
            <h3>
              {data.firstName} {data.lastName}
            </h3>
            <div className="admit-class">
              Applying for {data.applyClass} · {data.academicYear}
            </div>
            <div className="admit-tags">
              {[data.gender, data.bloodGroup]
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
            value={formatDate(data.dob, "full")}
          />
          <InfoItem label="Gender" value={data.gender} />
          <InfoItem label="Blood Group" value={data.bloodGroup} />
          <InfoItem label="Nationality" value={data.nationality} />
          <InfoItem label="Aadhar No." value={data.aadhar} />
          <InfoItem label="Phone" value={data.studentPhone} />
          <div style={{ gridColumn: "1/-1" }}>
            <InfoItem label="Address" value={data.address} />
          </div>
        </div>

        <div className="admit-section-title">Academic Details</div>
        <div className="info-grid">
          <InfoItem label="Applying for Class" value={data.applyClass} />
          <InfoItem label="Academic Year" value={data.academicYear} />
          <InfoItem label="Stream" value={data.stream} />
          <InfoItem label="Previous School" value={data.prevSchool} />
          <InfoItem label="Previous Class" value={data.prevClass} />
          <InfoItem label="Previous Board" value={data.prevBoard} />
          <InfoItem label="Last Exam Result" value={data.prevPercentage} />
          {data.achievements && (
            <div style={{ gridColumn: "1/-1" }}>
              <InfoItem label="Achievements" value={data.achievements} />
            </div>
          )}
        </div>

        <div className="admit-section-title">Parent / Guardian Details</div>
        <div className="info-grid">
          <InfoItem label="Father's Name" value={data.fatherName} />
          <InfoItem label="Father's Occupation" value={data.fatherOcc} />
          <InfoItem label="Father's Phone" value={data.fatherPhone} />
          <InfoItem label="Father's Email" value={data.fatherEmail} />
          <InfoItem label="Mother's Name" value={data.motherName} />
          <InfoItem label="Mother's Occupation" value={data.motherOcc} />
          <InfoItem label="Mother's Phone" value={data.motherPhone} />
          <InfoItem label="Mother's Email" value={data.motherEmail} />
          <InfoItem label="Annual Income" value={data.income} />
          <InfoItem
            label="Emergency Contact"
            value={`${data.emergencyName}${data.emergencyPhone ? ` · ${data.emergencyPhone}` : ""}`}
          />
        </div>

        <div className="admit-section-title">Additional Information</div>
        <div className="info-grid">
          <InfoItem label="Referral Source" value={data.referral} />
          {data.medical && (
            <div style={{ gridColumn: "1/-1" }}>
              <InfoItem label="Medical / Allergies" value={data.medical} />
            </div>
          )}
          {data.remarks && (
            <div style={{ gridColumn: "1/-1" }}>
              <InfoItem label="Additional Remarks" value={data.remarks} />
            </div>
          )}
        </div>

        <div className="admit-declaration">
          <strong>Declaration:</strong> I hereby declare that all the
          information provided in this application is true and correct to the
          best of my knowledge. I agree to abide by the rules and regulations of
          the institution.
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
  );
};

export default ApplicationPrintDocument;
