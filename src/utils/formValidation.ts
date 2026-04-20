export interface FormData {
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

export interface FormErrors {
  [key: string]: string | null;
}

export const validateStep = (
  step: number,
  formData: Partial<FormData>,
): FormErrors => {
  const errors: FormErrors = {};

  if (step === 1) {
    if (!formData.firstName?.trim()) errors.firstName = "First name is required";
    if (!formData.lastName?.trim()) errors.lastName = "Last name is required";
    if (!formData.dob) errors.dob = "Date of birth is required";
    if (!formData.gender) errors.gender = "Please select a gender";
    if (!formData.address?.trim()) errors.address = "Residential address is required";
  }

  if (step === 2) {
    if (!formData.applyClass) errors.applyClass = "Please select the class you are applying for";
    if (!formData.academicYear) errors.academicYear = "Please select the academic year";
  }

  if (step === 3) {
    if (!formData.fatherName?.trim()) errors.fatherName = "Father's name is required";
    if (!formData.fatherPhone?.trim()) errors.fatherPhone = "Father's phone number is required";
    if (!formData.motherName?.trim()) errors.motherName = "Mother's name is required";
    if (!formData.agreeCheck) errors.agreeCheck = "You must agree to the declaration before submitting";
  }

  return errors;
};

export const isValidStep = (errors: FormErrors): boolean => {
  return Object.values(errors).every((error) => error === null || error === undefined);
};

export const validatePhoto = (file: File): string | null => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSizeMB = 5;
  if (!allowedTypes.includes(file.type)) {
    return "Only JPG, PNG, or WebP images are allowed";
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Photo is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed is 5 MB`;
  }
  return null;
};
