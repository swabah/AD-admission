import { z } from "zod";

const phoneSchema = z.string().refine((val) => {
  if (!val) return true; // Optional case handled by schema
  const clean = val.replace(/\s/g, "").replace(/[-+()]/g, "");
  return /^[0-9]{10}$/.test(clean) || /^[0-9]{12}$/.test(clean);
}, "Please enter a valid 10-digit phone number");

const requiredPhoneSchema = z.string().min(1, "Phone number is required").refine((val) => {
  const clean = val.replace(/\s/g, "").replace(/[-+()]/g, "");
  return /^[0-9]{10}$/.test(clean) || /^[0-9]{12}$/.test(clean);
}, "Please enter a valid 10-digit phone number");

export const admissionSchema = z.object({
  // Step 1: Personal
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  nationality: z.string().min(1, "Nationality is required"),
  aadhar: z.string().min(1, "Aadhar number is required").refine((val) => {
    const clean = val.replace(/\s/g, "");
    return /^\d{12}$/.test(clean);
  }, "Aadhar must be exactly 12 digits"),
  studentPhone: phoneSchema.optional(),
  address: z.string().min(1, "Residential address is required"),
  
  // Step 2: Academic
  applyClass: z.string().min(1, "Please select the class"),
  academicYear: z.string().min(1, "Please select the academic year"),
  stream: z.string().optional(),
  prevSchool: z.string().min(1, "Previous school name is required"),
  prevClass: z.string().min(1, "Previous class is required"),
  prevBoard: z.string().optional(),
  prevPercentage: z.string().min(1, "Previous year percentage is required"),
  achievements: z.string().optional(),

  // Step 3: Family
  fatherName: z.string().min(1, "Father's name is required"),
  fatherOcc: z.string().optional(),
  fatherPhone: requiredPhoneSchema,
  fatherEmail: z.string().email("Invalid email").or(z.literal("")).optional(),
  motherName: z.string().min(1, "Mother's name is required"),
  motherOcc: z.string().optional(),
  motherPhone: phoneSchema.optional(),
  motherEmail: z.string().email("Invalid email").or(z.literal("")).optional(),
  income: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: phoneSchema.optional(),

  // Step 4: Final
  medical: z.string().optional(),
  referral: z.string().optional(),
  remarks: z.string().optional(),
  agreeCheck: z.boolean().refine((val) => val === true, "You must agree to the declaration"),
});

export type AdmissionFormData = z.infer<typeof admissionSchema>;

export const localAdmissionSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  studentPhone: phoneSchema.optional(),
  applyClass: z.string().min(1, "Please select the class"),
  academicYear: z.string().min(1, "Please select the academic year"),
  prevClass: z.string().min(1, "Previous class is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  fatherPhone: requiredPhoneSchema,
  prevBoard: z.string().optional(),
  address: z.string().min(1, "Residential address is required"),
  agreeCheck: z.boolean().refine((val) => val === true, "You must agree to the declaration"),
});

export type LocalAdmissionFormData = z.infer<typeof localAdmissionSchema>;

export const locateSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  dob: z.string().min(1, "Date of birth is required"),
});

export type LocateFormData = z.infer<typeof locateSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
