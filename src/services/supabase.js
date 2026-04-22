import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_TABLE_NAME =
	import.meta.env.VITE_SUPABASE_TABLE_NAME || "applications";

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verify Supabase connection on initialization
supabase
	.from(SUPABASE_TABLE_NAME)
	.select("id")
	.limit(1)
	.then(() => console.log("✅ Supabase connection verified"))
	.catch((err) => console.error("❌ Supabase connection failed:", err));

export { supabase, SUPABASE_TABLE_NAME };

// Add a new application
export const addApplication = async (data) => {
	// Convert camelCase to snake_case for Supabase
	const snakeCaseData = {
		app_no: data.appNo,
		first_name: data.firstName,
		last_name: data.lastName,
		dob: data.dob,
		blood_group: data.bloodGroup,
		nationality: data.nationality,
		aadhar: data.aadhar,
		student_phone: data.studentPhone,
		address: data.address,
		apply_class: data.applyClass,
		academic_year: data.academicYear,
		stream: data.stream,
		prev_school: data.prevSchool,
		prev_class: data.prevClass,
		prev_board: data.prevBoard,
		prev_percentage: data.prevPercentage,
		achievements: data.achievements,
		father_name: data.fatherName,
		father_occ: data.fatherOcc,
		father_phone: data.fatherPhone,
		father_email: data.fatherEmail,
		mother_name: data.motherName,
		mother_occ: data.motherOcc,
		mother_phone: data.motherPhone,
		mother_email: data.motherEmail,
		income: data.income,
		emergency_name: data.emergencyName,
		emergency_phone: data.emergencyPhone,
		medical: data.medical,
		referral: data.referral,
		remarks: data.remarks,
		agree_check: data.agreeCheck,
		photo: data.photo,
		admission_type: data.admissionType || "new",
		submitted_at: new Date().toISOString(),
		status: "submitted",
	};

	const { data: result, error } = await supabase
		.from(SUPABASE_TABLE_NAME)
		.insert([snakeCaseData])
		.select()
		.single();

	if (error) throw error;
	return result;
};

// Get all applications (admin only)
export const getAllApplications = async () => {
	const { data, error } = await supabase
		.from(SUPABASE_TABLE_NAME)
		.select("*")
		.order("submitted_at", { ascending: false })
		.limit(100);

	if (error) throw error;

	// Convert snake_case back to camelCase for frontend
	return data.map((app) => ({
		...app,
		appNo: app.app_no,
		firstName: app.first_name,
		lastName: app.last_name,
		bloodGroup: app.blood_group,
		studentPhone: app.student_phone,
		applyClass: app.apply_class,
		academicYear: app.academic_year,
		prevSchool: app.prev_school,
		prevClass: app.prev_class,
		prevBoard: app.prev_board,
		prevPercentage: app.prev_percentage,
		fatherName: app.father_name,
		fatherOcc: app.father_occ,
		fatherPhone: app.father_phone,
		fatherEmail: app.father_email,
		motherName: app.mother_name,
		motherOcc: app.mother_occ,
		motherPhone: app.mother_phone,
		motherEmail: app.mother_email,
		emergencyName: app.emergency_name,
		emergencyPhone: app.emergency_phone,
		agreeCheck: app.agree_check,
		submissionDate: app.submitted_at,
	}));
};

// Get a single application by ID
export const getApplicationById = async (id) => {
	const { data, error } = await supabase
		.from(SUPABASE_TABLE_NAME)
		.select("*")
		.eq("id", id)
		.single();

	if (error) throw error;
	return data;
};

// Search applications by phone and date of birth (for locate feature)
export const searchApplicationsByPhoneAndDob = async (phone, dob) => {
	const { data, error } = await supabase
		.from(SUPABASE_TABLE_NAME)
		.select("*")
		.or(`father_phone.eq.${phone},mother_phone.eq.${phone},student_phone.eq.${phone}`)
		.eq("dob", dob)
		.order("submitted_at", { ascending: false });

	if (error) throw error;

	// Convert snake_case back to camelCase for frontend
	return data.map((app) => ({
		...app,
		appNo: app.app_no,
		firstName: app.first_name,
		lastName: app.last_name,
		bloodGroup: app.blood_group,
		studentPhone: app.student_phone,
		applyClass: app.apply_class,
		academicYear: app.academic_year,
		prevSchool: app.prev_school,
		prevClass: app.prev_class,
		prevBoard: app.prev_board,
		prevPercentage: app.prev_percentage,
		fatherName: app.father_name,
		fatherOcc: app.father_occ,
		fatherPhone: app.father_phone,
		fatherEmail: app.father_email,
		motherName: app.mother_name,
		motherOcc: app.mother_occ,
		motherPhone: app.mother_phone,
		motherEmail: app.mother_email,
		emergencyName: app.emergency_name,
		emergencyPhone: app.emergency_phone,
		agreeCheck: app.agree_check,
		submissionDate: app.submitted_at,
		admissionType: app.admission_type,
	}));
};

// Update application status
export const updateApplicationStatus = async (id, status) => {
	const { data, error } = await supabase
		.from(SUPABASE_TABLE_NAME)
		.update({ status })
		.eq("id", id)
		.select()
		.single();
 
	if (error) throw error;
	return data;
};

// Delete an application
export const deleteApplication = async (id) => {
	const { error } = await supabase
		.from(SUPABASE_TABLE_NAME)
		.delete()
		.eq("id", id);

	if (error) throw error;
	return { success: true };
};
