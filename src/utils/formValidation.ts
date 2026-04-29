export interface FormData {
  firstName: string;
  lastName: string;
  dob: string;
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

export const validatePhone = (phone: string, required = true): string | null => {
  if (!phone?.trim()) {
    return required ? "Phone number is required" : null;
  }
  const phoneClean = phone.replace(/\s/g, "").replace(/[-+()]/g, "");
  // Accept 10 digits or 10 digits with +91 prefix (total 12 digits)
  if (!/^[0-9]{10}$/.test(phoneClean) && !/^[0-9]{12}$/.test(phoneClean)) {
    return "Please enter a valid 10-digit phone number";
  }
  // If 12 digits, it should start with 91 (India country code)
  if (/^[0-9]{12}$/.test(phoneClean) && !phoneClean.startsWith("91")) {
    return "Please enter a valid Indian phone number";
  }
  return null;
};

export const validateStep = (
  step: number,
  formData: Partial<FormData>,
): FormErrors => {
  const errors: FormErrors = {};

  if (step === 1) {
    if (!formData.firstName?.trim()) errors.firstName = "First name is required";
    if (!formData.lastName?.trim()) errors.lastName = "Last name is required";
    if (!formData.dob) errors.dob = "Date of birth is required";
    if (!formData.bloodGroup) errors.bloodGroup = "Blood group is required";
    if (!formData.address?.trim()) errors.address = "Residential address is required";
    if (!formData.aadhar?.trim()) {
      errors.aadhar = "Aadhar number is required";
    } else {
      const aadharClean = formData.aadhar.replace(/\s/g, "");
      if (!/^\d{12}$/.test(aadharClean)) {
        errors.aadhar = "Aadhar must be exactly 12 digits";
      }
    }
    const studentPhoneError = validatePhone(formData.studentPhone || "");
    if (studentPhoneError) errors.studentPhone = studentPhoneError;
  }

  if (step === 2) {
    if (!formData.applyClass) errors.applyClass = "Please select the class you are applying for";
    if (!formData.academicYear) errors.academicYear = "Please select the academic year";
    if (!formData.prevSchool?.trim()) errors.prevSchool = "Previous school name is required";
    if (!formData.prevPercentage?.trim()) errors.prevPercentage = "Previous year percentage is required";
  }

	if (step === 3) {
		if (!formData.fatherName?.trim())
			errors.fatherName = "Father's name is required";
		const fatherPhoneError = validatePhone(formData.fatherPhone || "");
		if (fatherPhoneError) errors.fatherPhone = fatherPhoneError;
		if (!formData.motherName?.trim())
			errors.motherName = "Mother's name is required";
		const motherPhoneError = validatePhone(formData.motherPhone || "", false);
		if (motherPhoneError) errors.motherPhone = motherPhoneError;
		if (formData.emergencyPhone?.trim()) {
			const emergencyPhoneError = validatePhone(formData.emergencyPhone);
			if (emergencyPhoneError) errors.emergencyPhone = emergencyPhoneError;
		}
	}

	if (step === 4) {
		if (!formData.agreeCheck)
			errors.agreeCheck = "You must agree to the declaration before submitting";
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
