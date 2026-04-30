import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const SUPABASE_TABLE_NAME =
	(import.meta.env.VITE_SUPABASE_TABLE_NAME as string) || "applications";
const SUPABASE_STORAGE_BUCKET =
	(import.meta.env.VITE_SUPABASE_STORAGE_BUCKET as string) || "student-photos";

// Initialize Supabase Client
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verify Supabase connection on initialization
void (async () => {
	try {
		await supabase.from(SUPABASE_TABLE_NAME).select("id").limit(1);
		console.log("✅ Supabase connection verified");
	} catch (err) {
		console.error("❌ Supabase connection failed:", err);
	}
})();

export { supabase, SUPABASE_TABLE_NAME, SUPABASE_STORAGE_BUCKET };

export interface ApplicationData {
	id?: string;
	appNo: string;
	firstName: string;
	lastName: string;
	dob: string;
	bloodGroup?: string;
	nationality?: string;
	aadhar?: string;
	studentPhone?: string;
	address: string;
	applyClass: string;
	academicYear: string;
	stream?: string;
	prevSchool?: string;
	prevClass?: string;
	prevBoard?: string;
	prevPercentage?: string;
	achievements?: string;
	fatherName: string;
	fatherOcc?: string;
	fatherPhone: string;
	fatherEmail?: string;
	motherName?: string;
	motherOcc?: string;
	motherPhone?: string;
	motherEmail?: string;
	income?: string;
	emergencyName?: string;
	emergencyPhone?: string;
	medical?: string;
	referral?: string;
	remarks?: string;
	agreeCheck: boolean;
	photo?: string | null;
	photoUrl?: string | null;
	submissionDate: Date | string;
	admissionType?: "new" | "local";
	status?: "submitted" | "reviewing" | "approved" | "rejected" | "deleted";
}

export interface PaginationOptions {
	page?: number;
	pageSize?: number;
}

export interface PaginatedApplications {
	data: ApplicationData[];
	totalCount: number;
	hasMore: boolean;
}

// Upload photo to Supabase Storage
export const uploadPhotoToStorage = async (
	photoDataUrl: string,
	appNo: string,
): Promise<string | null> => {
	if (!photoDataUrl || !photoDataUrl.startsWith("data:image")) {
		return null;
	}

	try {
		// Convert base64 to blob
		const base64Data = photoDataUrl.split(",")[1];
		const mimeMatch = photoDataUrl.match(/data:image\/(\w+);/);
		const mimeType = mimeMatch ? `image/${mimeMatch[1]}` : "image/jpeg";

		const byteCharacters = atob(base64Data);
		const byteArrays: ArrayBuffer[] = [];

		for (let i = 0; i < byteCharacters.length; i += 512) {
			const slice = byteCharacters.slice(i, i + 512);
			const byteNumbers = new Array(slice.length);
			for (let j = 0; j < slice.length; j++) {
				byteNumbers[j] = slice.charCodeAt(j);
			}
			const uint8Array = new Uint8Array(byteNumbers);
			byteArrays.push(uint8Array.buffer);
		}

		const blob = new Blob(byteArrays, { type: mimeType });
		const fileExt = mimeType.split("/")[1] || "jpg";
		const fileName = `${appNo}_${Date.now()}.${fileExt}`;
		const filePath = `photos/${fileName}`;

		const { error: uploadError } = await supabase.storage
			.from(SUPABASE_STORAGE_BUCKET)
			.upload(filePath, blob, {
				contentType: mimeType,
				upsert: false,
			});

		if (uploadError) {
			console.error("Photo upload error:", uploadError);
			return null;
		}

		// Get public URL
		const { data: urlData } = supabase.storage
			.from(SUPABASE_STORAGE_BUCKET)
			.getPublicUrl(filePath);

		return urlData.publicUrl;
	} catch (error) {
		console.error("Error uploading photo:", error);
		return null;
	}
};

// Delete photo from Supabase Storage
export const deletePhotoFromStorage = async (
	photoUrl: string | null,
): Promise<void> => {
	if (!photoUrl) return;

	try {
		// Extract file path from public URL
		const url = new URL(photoUrl);
		const pathMatch = url.pathname.match(
			/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/,
		);
		if (!pathMatch) return;

		const filePath = pathMatch[1];
		const { error } = await supabase.storage
			.from(SUPABASE_STORAGE_BUCKET)
			.remove([filePath]);

		if (error) {
			console.error("Photo delete error:", error);
		}
	} catch (error) {
		console.error("Error deleting photo:", error);
	}
};

// Generate next application number
export const generateNextAppNo = async (
	stream?: string,
	admissionType: "new" | "local" = "new",
): Promise<string> => {
	try {
		const { count, error } = await supabase
			.from(SUPABASE_TABLE_NAME)
			.select("*", { count: "exact", head: true });

		if (error) {
			console.error("Error fetching count for app no:", error);
			// Fallback to timestamp if count fails
			return `AS${Date.now().toString().slice(-6)}`;
		}

		const nextId = (count || 0) + 1;
		const paddedId = nextId.toString().padStart(4, "0");

		let streamCode = "NW"; // Default for New

		if (admissionType === "local") {
			streamCode = "LC";
		} else {
			if (stream === "Root Exc") streamCode = "RE";
			else if (stream === "HS") streamCode = "HS";
			else if (stream === "BS") streamCode = "BS";
		}

		return `AS${streamCode}${paddedId}`;
	} catch (err) {
		console.error("Exception generating app no:", err);
		return `AS${Date.now().toString().slice(-6)}`;
	}
};

// Add a new application
export const addApplication = async (
	data: ApplicationData,
): Promise<{ id: string; photoUrl?: string | null }> => {
	// Upload photo to storage if provided as base64
	let photoUrl: string | null = null;
	if (data.photo && data.photo.startsWith("data:image")) {
		photoUrl = await uploadPhotoToStorage(data.photo, data.appNo);
	} else if (data.photoUrl) {
		photoUrl = data.photoUrl;
	}

	// Convert camelCase to snake_case for Supabase
	const snakeCaseData: Record<
		string,
		string | number | boolean | Date | null | undefined
	> = {
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
		photo: photoUrl,
		admission_type: data.admissionType || "new",
		submitted_at:
			data.submissionDate instanceof Date
				? data.submissionDate.toISOString()
				: data.submissionDate,
		status: "submitted",
	};

	const { data: result, error } = await supabase
		.from(SUPABASE_TABLE_NAME)
		.insert([snakeCaseData])
		.select()
		.single();

	if (error) throw error;
	return { id: result.id, photoUrl };
};

// Get all applications with pagination
export const getAllApplications = async (
	options: PaginationOptions & { includeDeleted?: boolean } = {},
): Promise<PaginatedApplications> => {
	const { page = 1, pageSize = 100, includeDeleted = false } = options;
	const start = (page - 1) * pageSize;
	const end = start + pageSize - 1;

	// Get total count first
	let queryCount = supabase
		.from(SUPABASE_TABLE_NAME)
		.select("*", { count: "exact", head: true });

	if (!includeDeleted) {
		queryCount = queryCount.neq("status", "deleted");
	}

	const { count, error: countError } = await queryCount;

	if (countError) throw countError;

	// Get paginated data
	let queryData = supabase.from(SUPABASE_TABLE_NAME).select("*");

	if (!includeDeleted) {
		queryData = queryData.neq("status", "deleted");
	} else {
		// If including deleted, we might only want to see deleted items or all?
		// Usually for a "Deleted" tab, we'd want ONLY deleted.
		// But let's allow all if includeDeleted is true, or handle it in filters.
		// Actually, let's make it fetch all including deleted if flag is true.
	}

	const { data, error } = await queryData
		.order("submitted_at", { ascending: false })
		.range(start, end);

	if (error) throw error;

	// Convert snake_case back to camelCase for frontend
	const formattedData: ApplicationData[] = data.map((app) => ({
		id: app.id,
		appNo: app.app_no,
		firstName: app.first_name,
		lastName: app.last_name,
		dob: app.dob,
		bloodGroup: app.blood_group,
		nationality: app.nationality,
		aadhar: app.aadhar,
		studentPhone: app.student_phone,
		address: app.address,
		applyClass: app.apply_class,
		academicYear: app.academic_year,
		stream: app.stream,
		prevSchool: app.prev_school,
		prevClass: app.prev_class,
		prevBoard: app.prev_board,
		prevPercentage: app.prev_percentage,
		achievements: app.achievements,
		fatherName: app.father_name,
		fatherOcc: app.father_occ,
		fatherPhone: app.father_phone,
		fatherEmail: app.father_email,
		motherName: app.mother_name,
		motherOcc: app.mother_occ,
		motherPhone: app.mother_phone,
		motherEmail: app.mother_email,
		income: app.income,
		emergencyName: app.emergency_name,
		emergencyPhone: app.emergency_phone,
		medical: app.medical,
		referral: app.referral,
		remarks: app.remarks,
		agreeCheck: app.agree_check,
		photoUrl: app.photo,
		admissionType: app.admission_type,
		submissionDate: app.submitted_at,
		status: app.status,
	}));

	return {
		data: formattedData,
		totalCount: count || 0,
		hasMore: (count || 0) > end + 1,
	};
};

// Get a single application by ID
export const getApplicationById = async (
	id: string,
): Promise<ApplicationData | null> => {
	const { data, error } = await supabase
		.from(SUPABASE_TABLE_NAME)
		.select("*")
		.eq("id", id)
		.neq("status", "deleted")
		.single();

	if (error) throw error;
	if (!data) return null;

	return {
		id: data.id,
		appNo: data.app_no,
		firstName: data.first_name,
		lastName: data.last_name,
		dob: data.dob,
		bloodGroup: data.blood_group,
		nationality: data.nationality,
		aadhar: data.aadhar,
		studentPhone: data.student_phone,
		address: data.address,
		applyClass: data.apply_class,
		academicYear: data.academic_year,
		stream: data.stream,
		prevSchool: data.prev_school,
		prevClass: data.prev_class,
		prevBoard: data.prev_board,
		prevPercentage: data.prev_percentage,
		achievements: data.achievements,
		fatherName: data.father_name,
		fatherOcc: data.father_occ,
		fatherPhone: data.father_phone,
		fatherEmail: data.father_email,
		motherName: data.mother_name,
		motherOcc: data.mother_occ,
		motherPhone: data.mother_phone,
		motherEmail: data.mother_email,
		income: data.income,
		emergencyName: data.emergency_name,
		emergencyPhone: data.emergency_phone,
		medical: data.medical,
		referral: data.referral,
		remarks: data.remarks,
		agreeCheck: data.agree_check,
		photoUrl: data.photo,
		admissionType: data.admission_type,
		submissionDate: data.submitted_at,
		status: data.status,
	};
};

// Search applications by phone and date of birth (for locate feature)
export const searchApplicationsByPhoneAndDob = async (
	phone: string,
	dob: string,
): Promise<ApplicationData[]> => {
	const { data, error } = await supabase
		.from(SUPABASE_TABLE_NAME)
		.select("*")
		.neq("status", "deleted")
		.or(
			`father_phone.eq.${phone},mother_phone.eq.${phone},student_phone.eq.${phone}`,
		)
		.eq("dob", dob)
		.order("submitted_at", { ascending: false });

	if (error) throw error;

	// Convert snake_case back to camelCase for frontend
	return data.map((app) => ({
		id: app.id,
		appNo: app.app_no,
		firstName: app.first_name,
		lastName: app.last_name,
		dob: app.dob,
		bloodGroup: app.blood_group,
		nationality: app.nationality,
		aadhar: app.aadhar,
		studentPhone: app.student_phone,
		address: app.address,
		applyClass: app.apply_class,
		academicYear: app.academic_year,
		stream: app.stream,
		prevSchool: app.prev_school,
		prevClass: app.prev_class,
		prevBoard: app.prev_board,
		prevPercentage: app.prev_percentage,
		achievements: app.achievements,
		fatherName: app.father_name,
		fatherOcc: app.father_occ,
		fatherPhone: app.father_phone,
		fatherEmail: app.father_email,
		motherName: app.mother_name,
		motherOcc: app.mother_occ,
		motherPhone: app.mother_phone,
		motherEmail: app.mother_email,
		income: app.income,
		emergencyName: app.emergency_name,
		emergencyPhone: app.emergency_phone,
		medical: app.medical,
		referral: app.referral,
		remarks: app.remarks,
		agreeCheck: app.agree_check,
		photoUrl: app.photo,
		photo: app.photo,
		admissionType: app.admission_type,
		submissionDate: app.submitted_at,
		status: app.status,
	}));
};

// Update application status
export const updateApplicationStatus = async (
	id: string,
	status: string,
): Promise<void> => {
	const { error } = await supabase
		.from(SUPABASE_TABLE_NAME)
		.update({ status })
		.eq("id", id);

	if (error) throw error;
};

// Delete an application (Soft or Hard Delete)
export const deleteApplication = async (
	id: string,
	photoUrl?: string | null,
	hardDelete: boolean = false,
): Promise<{ success: boolean }> => {
	if (hardDelete) {
		// Delete photo from storage if exists
		if (photoUrl) {
			await deletePhotoFromStorage(photoUrl);
		}

		const { error } = await supabase
			.from(SUPABASE_TABLE_NAME)
			.delete()
			.eq("id", id);

		if (error) throw error;
	} else {
		// Perform a soft delete by updating the status to 'deleted'.
		const { error } = await supabase
			.from(SUPABASE_TABLE_NAME)
			.update({ status: "deleted" })
			.eq("id", id);

		if (error) throw error;
	}

	return { success: true };
};

// Admin authentication using Supabase Auth
export const authenticateAdmin = async (
	email: string,
	password: string,
): Promise<{ success: boolean; error?: string }> => {
	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("Admin auth error:", error);
			return { success: false, error: error.message };
		}

		if (data.session) {
			return { success: true };
		}

		return { success: false, error: "Authentication failed" };
	} catch (err) {
		console.error("Admin auth exception:", err);
		return { success: false, error: "Authentication failed" };
	}
};

// Verify admin session
export const verifyAdminToken = async (): Promise<boolean> => {
	try {
		const { data, error } = await supabase.auth.getSession();
		if (error || !data.session) {
			return false;
		}
		return true;
	} catch {
		return false;
	}
};

// Update an existing application
export const updateApplication = async (
	id: string,
	data: Partial<ApplicationData>,
): Promise<{ success: boolean; photoUrl?: string | null }> => {
	// Upload photo to storage if provided as base64
	let photoUrl: string | null = null;
	if (data.photo && data.photo.startsWith("data:image")) {
		photoUrl = await uploadPhotoToStorage(data.photo, data.appNo || "updated");
	} else if (data.photoUrl) {
		photoUrl = data.photoUrl;
	}

	// Convert camelCase to snake_case for Supabase
	const snakeCaseData: Record<
		string,
		string | number | boolean | Date | null | undefined
	> = {};

	if (data.firstName !== undefined) snakeCaseData.first_name = data.firstName;
	if (data.lastName !== undefined) snakeCaseData.last_name = data.lastName;
	if (data.dob !== undefined) snakeCaseData.dob = data.dob;
	if (data.bloodGroup !== undefined)
		snakeCaseData.blood_group = data.bloodGroup;
	if (data.nationality !== undefined)
		snakeCaseData.nationality = data.nationality;
	if (data.aadhar !== undefined) snakeCaseData.aadhar = data.aadhar;
	if (data.studentPhone !== undefined)
		snakeCaseData.student_phone = data.studentPhone;
	if (data.address !== undefined) snakeCaseData.address = data.address;
	if (data.applyClass !== undefined)
		snakeCaseData.apply_class = data.applyClass;
	if (data.academicYear !== undefined)
		snakeCaseData.academic_year = data.academicYear;
	if (data.stream !== undefined) snakeCaseData.stream = data.stream;
	if (data.prevSchool !== undefined)
		snakeCaseData.prev_school = data.prevSchool;
	if (data.prevClass !== undefined) snakeCaseData.prev_class = data.prevClass;
	if (data.prevBoard !== undefined) snakeCaseData.prev_board = data.prevBoard;
	if (data.prevPercentage !== undefined)
		snakeCaseData.prev_percentage = data.prevPercentage;
	if (data.achievements !== undefined)
		snakeCaseData.achievements = data.achievements;
	if (data.fatherName !== undefined)
		snakeCaseData.father_name = data.fatherName;
	if (data.fatherOcc !== undefined) snakeCaseData.father_occ = data.fatherOcc;
	if (data.fatherPhone !== undefined)
		snakeCaseData.father_phone = data.fatherPhone;
	if (data.fatherEmail !== undefined)
		snakeCaseData.father_email = data.fatherEmail;
	if (data.motherName !== undefined)
		snakeCaseData.mother_name = data.motherName;
	if (data.motherOcc !== undefined) snakeCaseData.mother_occ = data.motherOcc;
	if (data.motherPhone !== undefined)
		snakeCaseData.mother_phone = data.motherPhone;
	if (data.motherEmail !== undefined)
		snakeCaseData.mother_email = data.motherEmail;
	if (data.income !== undefined) snakeCaseData.income = data.income;
	if (data.emergencyName !== undefined)
		snakeCaseData.emergency_name = data.emergencyName;
	if (data.emergencyPhone !== undefined)
		snakeCaseData.emergency_phone = data.emergencyPhone;
	if (data.medical !== undefined) snakeCaseData.medical = data.medical;
	if (data.referral !== undefined) snakeCaseData.referral = data.referral;
	if (data.remarks !== undefined) snakeCaseData.remarks = data.remarks;
	if (data.status !== undefined) snakeCaseData.status = data.status;
	if (photoUrl) snakeCaseData.photo = photoUrl;

	const { error } = await supabase
		.from(SUPABASE_TABLE_NAME)
		.update(snakeCaseData)
		.eq("id", id);

	if (error) throw error;
	return { success: true, photoUrl };
};

// Logout admin
export const logoutAdmin = async (): Promise<void> => {
	await supabase.auth.signOut();
};
