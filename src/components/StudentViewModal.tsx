/**
 * StudentViewModal Component
 * Displays student details in a modal
 */

import InfoItem from "./InfoItem";
import { formatDate } from "../utils/formatters";

interface RawStudentData {
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
  religion?: string;
  category?: string;
  aadhar?: string;
  studentPhone?: string;
  student_phone?: string;
  address?: string;
  applyClass?: string;
  apply_class?: string;
  academicYear?: string;
  academic_year?: string;
  stream?: string;
  medium?: string;
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

interface StudentViewModalProps {
  app: RawStudentData;
  onClose: () => void;
}

const StudentViewModal = ({ app, onClose }: StudentViewModalProps) => {
  // Normalize field names to support both camelCase and snake_case
  const data = {
    appNo: app.appNo || app.app_no || "",
    firstName: app.firstName || app.first_name || "",
    lastName: app.lastName || app.last_name || "",
    dob: app.dob,
    gender: app.gender,
    bloodGroup: app.bloodGroup || app.blood_group,
    nationality: app.nationality,
    religion: app.religion,
    category: app.category,
    aadhar: app.aadhar,
    studentPhone: app.studentPhone || app.student_phone,
    address: app.address,
    applyClass: app.applyClass || app.apply_class || "",
    academicYear: app.academicYear || app.academic_year || "",
    stream: app.stream,
    medium: app.medium,
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Student Details</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {data.photo && (
            <div className="modal-photo-section">
              <img
                src={data.photo}
                alt="Student"
                className="modal-student-photo"
              />
              <div className="modal-photo-info">
                <h3>
                  {data.firstName} {data.lastName}
                </h3>
                <p>App No: {data.appNo}</p>
                <p>
                  Class {data.applyClass} • {data.academicYear}
                </p>
              </div>
            </div>
          )}
          <div className="student-details-grid">
            <div className="detail-group">
              <h4>Personal Information</h4>
              <div className="detail-row">
                <span className="detail-label">Application No:</span>
                <span className="detail-value">{data.appNo}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">
                  {data.firstName} {data.lastName}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date of Birth:</span>
                <span className="detail-value">{data.dob}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Gender:</span>
                <span className="detail-value">{data.gender}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Blood Group:</span>
                <span className="detail-value">{data.bloodGroup || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Nationality:</span>
                <span className="detail-value">{data.nationality}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Religion:</span>
                <span className="detail-value">{data.religion || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{data.category || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Aadhar:</span>
                <span className="detail-value">{data.aadhar || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">
                  {data.studentPhone || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{data.address}</span>
              </div>
            </div>

            <div className="detail-group">
              <h4>Academic Information</h4>
              <div className="detail-row">
                <span className="detail-label">Class:</span>
                <span className="detail-value">{data.applyClass}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Academic Year:</span>
                <span className="detail-value">{data.academicYear}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Stream:</span>
                <span className="detail-value">{data.stream || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Medium:</span>
                <span className="detail-value">{data.medium}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Previous School:</span>
                <span className="detail-value">{data.prevSchool || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Previous Class:</span>
                <span className="detail-value">{data.prevClass || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Previous Board:</span>
                <span className="detail-value">{data.prevBoard || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Previous Percentage:</span>
                <span className="detail-value">
                  {data.prevPercentage || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Achievements:</span>
                <span className="detail-value">
                  {data.achievements || "N/A"}
                </span>
              </div>
            </div>

            <div className="detail-group">
              <h4>Parent Information</h4>
              <div className="detail-row">
                <span className="detail-label">Father's Name:</span>
                <span className="detail-value">{data.fatherName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Father's Occupation:</span>
                <span className="detail-value">{data.fatherOcc || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Father's Phone:</span>
                <span className="detail-value">{data.fatherPhone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Father's Email:</span>
                <span className="detail-value">
                  {data.fatherEmail || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mother's Name:</span>
                <span className="detail-value">{data.motherName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mother's Occupation:</span>
                <span className="detail-value">{data.motherOcc || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mother's Phone:</span>
                <span className="detail-value">
                  {data.motherPhone || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mother's Email:</span>
                <span className="detail-value">
                  {data.motherEmail || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Family Income:</span>
                <span className="detail-value">{data.income || "N/A"}</span>
              </div>
            </div>

            <div className="detail-group">
              <h4>Emergency & Additional Information</h4>
              <div className="detail-row">
                <span className="detail-label">Emergency Contact:</span>
                <span className="detail-value">
                  {data.emergencyName || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Emergency Phone:</span>
                <span className="detail-value">
                  {data.emergencyPhone || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Medical Conditions:</span>
                <span className="detail-value">{data.medical || "None"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Referral:</span>
                <span className="detail-value">{data.referral || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Remarks:</span>
                <span className="detail-value">{data.remarks || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Submission Date:</span>
                <span className="detail-value">
                  {formatDate(data.submissionDate, "full")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentViewModal;
