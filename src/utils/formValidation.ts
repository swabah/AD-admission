/**
 * Form Validation Utilities
 * Handles form field validation logic
 */

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

const requiredFields: Record<number, (keyof FormData)[]> = {
  1: ["firstName", "lastName", "dob", "gender", "address"],
  2: ["applyClass", "academicYear"],
  3: ["fatherName", "fatherPhone", "motherName", "agreeCheck"],
};

export const validateStep = (
  step: number,
  formData: Partial<FormData>,
): FormErrors => {
  const errors: FormErrors = {};

  const fields = requiredFields[step] || [];
  fields.forEach((field) => {
    if (!formData[field]) {
      errors[field] = "This field is required";
    }
  });

  if (step === 3 && !formData.agreeCheck) {
    errors.agreeCheck = "Please agree to the declaration to proceed";
  }

  return errors;
};

export const isValidStep = (errors: FormErrors): boolean => {
  return Object.values(errors).every(
    (error) => error === null || error === undefined,
  );
};
