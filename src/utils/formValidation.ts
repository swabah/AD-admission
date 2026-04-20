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

const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone.replace(/[\s\-+]/g, ""));
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidAadhar = (aadhar: string) => /^\d{4}\s?\d{4}\s?\d{4}$/.test(aadhar.trim());

export const validateStep = (
  step: number,
  formData: Partial<FormData>,
): FormErrors => {
  const errors: FormErrors = {};

  if (step === 1) {
    if (!formData.firstName?.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName.trim())) {
      errors.firstName = "First name should only contain letters";
    }

    if (!formData.lastName?.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName.trim())) {
      errors.lastName = "Last name should only contain letters";
    }

    if (!formData.dob) {
      errors.dob = "Date of birth is required";
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (dob >= today) {
        errors.dob = "Date of birth must be in the past";
      } else if (age > 30) {
        errors.dob = "Please check the date of birth — age seems too high";
      } else if (age < 3) {
        errors.dob = "Please check the date of birth — age seems too low";
      }
    }

    if (!formData.gender) {
      errors.gender = "Please select a gender";
    }

    if (!formData.address?.trim()) {
      errors.address = "Residential address is required";
    } else if (formData.address.trim().length < 10) {
      errors.address = "Please enter a complete address";
    }

    if (formData.aadhar && !isValidAadhar(formData.aadhar)) {
      errors.aadhar = "Aadhar must be a 12-digit number (e.g. 1234 5678 9012)";
    }

    if (formData.studentPhone && !isValidPhone(formData.studentPhone)) {
      errors.studentPhone = "Enter a valid 10-digit Indian mobile number";
    }
  }

  if (step === 2) {
    if (!formData.applyClass) {
      errors.applyClass = "Please select the class you are applying for";
    }
    if (!formData.academicYear) {
      errors.academicYear = "Please select the academic year";
    }
  }

  if (step === 3) {
    if (!formData.fatherName?.trim()) {
      errors.fatherName = "Father's name is required";
    } else if (formData.fatherName.trim().length < 2) {
      errors.fatherName = "Please enter a valid name";
    }

    if (!formData.fatherPhone) {
      errors.fatherPhone = "Father's phone number is required";
    } else if (!isValidPhone(formData.fatherPhone)) {
      errors.fatherPhone = "Enter a valid 10-digit Indian mobile number";
    }

    if (formData.fatherEmail && !isValidEmail(formData.fatherEmail)) {
      errors.fatherEmail = "Enter a valid email address (e.g. name@example.com)";
    }

    if (!formData.motherName?.trim()) {
      errors.motherName = "Mother's name is required";
    } else if (formData.motherName.trim().length < 2) {
      errors.motherName = "Please enter a valid name";
    }

    if (formData.motherPhone && !isValidPhone(formData.motherPhone)) {
      errors.motherPhone = "Enter a valid 10-digit Indian mobile number";
    }

    if (formData.motherEmail && !isValidEmail(formData.motherEmail)) {
      errors.motherEmail = "Enter a valid email address (e.g. name@example.com)";
    }

    if (formData.emergencyPhone && !isValidPhone(formData.emergencyPhone)) {
      errors.emergencyPhone = "Enter a valid 10-digit Indian mobile number";
    }

    if (!formData.agreeCheck) {
      errors.agreeCheck = "You must agree to the declaration before submitting";
    }
  }

  return errors;
};

export const isValidStep = (errors: FormErrors): boolean => {
  return Object.values(errors).every(
    (error) => error === null || error === undefined,
  );
};

export const validatePhoto = (file: File): string | null => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSizeMB = 5;

  if (!allowedTypes.includes(file.type)) {
    return "Only JPG, PNG, or WebP images are allowed";
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Photo is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 5 MB`;
  }
  return null;
};
