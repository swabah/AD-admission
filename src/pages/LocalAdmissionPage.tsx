import { useState, useRef, type ChangeEvent } from "react";
import { addApplication } from "../services/supabase";
import { downloadApplicationPDF } from "../utils/pdfDownloader";
import logo from "../assets/logo.jpg";
import ApplicationPrintDocument from "../components/ApplicationPrintDocument";
import { validatePhoto, validatePhone } from "../utils/formValidation";
import { formatApplicationNo } from "../utils/formatters";
import { InputField } from "../components/InputField";
import {
	Camera,
	AlertTriangle,
	Send,
	Loader2,
	Edit2,
	Printer,
	Share2,
	X,
} from "lucide-react";

interface FormData {
	firstName: string;
	lastName: string;
	dob: string;
	studentPhone: string;
	applyClass: string;
	academicYear: string;
	prevClass: string;
	fatherName: string;
	fatherPhone: string;
	motherName: string;
	motherPhone: string;
	address: string;
	agreeCheck: boolean;
}

interface FormErrors {
	[key: string]: string | null;
}



const LocalAdmissionPage = () => {
	const photoInputRef = useRef<HTMLInputElement>(null);
	const [photoDataURL, setPhotoDataURL] = useState<string | null>(null);
	const [formData, setFormData] = useState<FormData>({
		firstName: "",
		lastName: "",
		dob: "",
		studentPhone: "",
		applyClass: "",
		academicYear: "",
		prevClass: "",
		fatherName: "",
		fatherPhone: "",
		motherName: "",
		motherPhone: "",
		address: "",
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
				let width = img.width,
					height = img.height;
				const maxWidth = 1200,
					maxHeight = 1600;
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
				if (ctx) ctx.drawImage(img, 0, 0, width, height);
				let quality = 0.9;
				let compressedDataURL = canvas.toDataURL("image/jpeg", quality);
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

	const validate = () => {
		const newErrors: FormErrors = {};
		if (!formData.firstName.trim())
			newErrors.firstName = "First name is required";
		if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
		if (!formData.dob) newErrors.dob = "Date of birth is required";
		if (!formData.applyClass) newErrors.applyClass = "Class is required";
		if (!formData.academicYear)
			newErrors.academicYear = "Academic year is required";
		if (!formData.fatherName.trim())
			newErrors.fatherName = "Father's name is required";
		const studentPhoneError = validatePhone(formData.studentPhone || "");
		if (studentPhoneError) newErrors.studentPhone = studentPhoneError;
		const fatherPhoneError = validatePhone(formData.fatherPhone || "");
		if (fatherPhoneError) newErrors.fatherPhone = fatherPhoneError;
		if (!formData.motherName.trim())
			newErrors.motherName = "Mother's name is required";
		const motherPhoneError = validatePhone(formData.motherPhone || "");
		if (motherPhoneError) newErrors.motherPhone = motherPhoneError;
		if (!formData.address.trim()) newErrors.address = "Address is required";
		if (!formData.agreeCheck)
			newErrors.agreeCheck = "Please agree to the declaration";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const submitForm = async () => {
		setSubmitError(null);
		if (!validate()) {
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
				admissionType: "local" as const,
			} as FormData & { appNo: string; submissionDate: Date; photo: string | null; admissionType: "local" });
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
			} catch {
				// Share cancelled or failed silently
			}
		} else {
			navigator.clipboard.writeText(window.location.href);
			alert("Link copied to clipboard!");
		}
	};

	if (showPreview) {
		return (
			<div className="min-h-screen bg-[#faf8f5] font-sans pb-20">
				<div className="max-w-4xl mx-auto px-4 pt-8">
					<div className="bg-[#0a1628] rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm no-print">
						<h2 className="font-display text-2xl text-white font-bold">
							Application Preview
						</h2>
						<div className="flex flex-wrap gap-3">
							<button
								type="button"
								onClick={() => {
									setShowPreview(false);
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all border border-white/10"
							>
								<Edit2 className="w-4 h-4" /> Edit
							</button>
							<button
								type="button"
								onClick={() => downloadApplicationPDF(appNo, `${formData.firstName} ${formData.lastName}`.trim())}
								className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0a1628] text-sm font-semibold transition-all shadow-sm"
							>
								<Printer className="w-4 h-4" /> Download PDF
							</button>
							<button
								type="button"
								onClick={shareApplication}
								className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1d6fa4] to-[#165a88] hover:brightness-110 text-white text-sm font-semibold transition-all shadow-sm "
							>
								<Share2 className="w-4 h-4" /> Share
							</button>
						</div>
					</div>
					<ApplicationPrintDocument
						app={{ ...formData, appNo, photo: photoDataURL ?? undefined, submissionDate: new Date().toISOString(), status: 'submitted' }}
						showStatus={true}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#faf8f5] font-sans relative">
			{/* Header */}
			<div className="bg-gradient-to-br from-[#0a1628] to-[#132238] pt-16 pb-24 px-6 relative overflow-hidden text-center z-0 shadow-sm">
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djI2SDI0VjM0SDJWMjRoMjJWMEgzNnYyNGgyMnYxMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10 mix-blend-overlay"></div>
				<div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#1d6fa4]/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
				<div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#1e3a5f]/40 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>

				<div className="relative z-10 flex flex-col items-center">
					<div className="w-24 h-24 rounded-2xl bg-white/5 border border-[#1d6fa4]/30 p-2.5 backdrop-blur-md shadow-sm mb-6">
						<img
							src={logo}
							alt="Logo"
							className="w-full h-full object-contain filter invert brightness-0"
						/>
					</div>
					<h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight">
						Ahlussuffa Dars
					</h1>
					<p className="text-white/60 text-sm tracking-[0.15em] uppercase mb-6 font-medium">
						Where Faith Meets Knowledge · Kannur, Kerala
					</p>
					<div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1d6fa4]/15 border border-[#1d6fa4]/30 text-[#85c6f3] backdrop-blur-sm text-xs font-bold uppercase tracking-wider shadow-inner">
						<span className="w-2 h-2 rounded-full bg-[#85c6f3] animate-pulse"></span>
						Local Re-admission · 2026–27
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 -mt-12 pb-24">
				<div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
					<div className="p-6 sm:p-10 lg:p-12">
						{submitError && (
							<div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-4">
								<AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
								<div className="flex-1">
									<h3 className="font-bold text-rose-800 text-sm mb-1">
										Submission Failed
									</h3>
									<p className="text-sm text-rose-600 leading-relaxed">
										{submitError}
									</p>
								</div>
								<button
									type="button"
									onClick={() => setSubmitError(null)}
									className="text-rose-400 hover:text-rose-600"
								>
									<X className="w-5 h-5" />
								</button>
							</div>
						)}

						<div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
							<div className="mb-10 text-center sm:text-left">
								<h2 className="font-display text-3xl font-bold text-[#0a1628] mb-2">
									Student Information
								</h2>
								<p className="text-slate-500 text-[15px]">
									For existing students continuing their studies. Please provide
									updated information.
								</p>
							</div>

							<div className="flex flex-col md:flex-row gap-8 lg:gap-12">
								{/* Photo Upload */}
								<div className="shrink-0 flex flex-col gap-2">
									<label htmlFor="photo-upload" className="text-xs font-bold uppercase tracking-wider text-slate-500">
										Student Photo
									</label>
									<button
										type="button"
										id="photo-upload"
										onClick={() => photoInputRef.current?.click()}
										onKeyDown={(e) => e.key === 'Enter' && photoInputRef.current?.click()}
										className={`w-36 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group relative ${photoError ? "border-rose-300 bg-rose-50/50" : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-[#1d6fa4]/50"}`}
									>
										{photoDataURL ? (
											<>
												<img
													src={photoDataURL}
													alt="Preview"
													className="w-full h-full object-cover"
												/>
												<div className="absolute inset-0 bg-[#0a1628]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
													<Camera className="w-8 h-8 text-white" />
												</div>
											</>
										) : (
											<div className="text-center p-4 text-slate-400 group-hover:text-[#1d6fa4] transition-colors">
												<Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
												<div className="text-xs font-bold">Upload Photo</div>
												<div className="text-[10px] mt-1 opacity-70">
													JPG, PNG <br />
													Max 5MB
												</div>
											</div>
										)}
									</button>
									<input
										type="file"
										accept="image/jpeg,image/png,image/webp"
										onChange={previewPhoto}
										ref={photoInputRef}
										className="hidden"
									/>
									{photoError && (
										<div className="text-[11px] font-bold text-rose-500 max-w-[144px] leading-tight text-center mt-1">
											{photoError}
										</div>
									)}
									{photoInfo && !photoError && (
										<div className="text-[11px] font-bold text-emerald-600 max-w-[144px] leading-tight text-center mt-1">
											{photoInfo}
										</div>
									)}
								</div>

								<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
									<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
										label="First Name"
										id="firstName"
										placeholder="e.g. Muhammad"
										required
									/>
									<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
										label="Last Name"
										id="lastName"
										placeholder="e.g. Ibrahim"
										required
									/>
									<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
										label="Date of Birth"
										id="dob"
										type="date"
										required
									/>
									<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
										label="Student Phone"
										id="studentPhone"
										type="tel"
										placeholder="+91 XXXXX XXXXX"
									/>
								</div>
							</div>

							<div className="sm:col-span-2 flex items-center gap-3 my-8">
								<div className="h-px bg-slate-200 flex-1"></div>
								<span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100">
									Academic Details
								</span>
								<div className="h-px bg-slate-200 flex-1"></div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
									label="Applying for Class"
									id="applyClass"
									type="select"
									placeholder="Select class"
									options={[
										"Class 8",
										"Class 9",
										"Class 10",
										"Plus One",
										"Plus Two",
										"Degree 1st Year",
										"Degree 2nd Year",
										"Degree 3rd Year",
										"Degree 4th Year",
									]}
									required
								/>
								<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
									label="Academic Year"
									id="academicYear"
									type="select"
									placeholder="Select year"
									options={["2026–27", "2027–28", "2028–29"]}
									required
								/>
								<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
									label="Previous Class (Last Academic Year)"
									id="prevClass"
									placeholder="e.g. Class 7"
									className="sm:col-span-2"
								/>
								<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
									label="Residential Address"
									id="address"
									type="textarea"
									placeholder="House No., Street, Area, City, State, PIN"
									className="sm:col-span-2"
									required
								/>
							</div>

							<div className="sm:col-span-2 flex items-center gap-3 my-8">
								<div className="h-px bg-slate-200 flex-1"></div>
								<span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100">
									Parent Contact Details
								</span>
								<div className="h-px bg-slate-200 flex-1"></div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
									label="Father's Full Name"
									id="fatherName"
									placeholder="Full name"
									required
								/>
								<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
									label="Father's Phone"
									id="fatherPhone"
									type="tel"
									placeholder="+91 XXXXX XXXXX"
									required
								/>
								<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
									label="Mother's Full Name"
									id="motherName"
									placeholder="Full name"
									required
								/>
								<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
									label="Mother's Phone"
									id="motherPhone"
									type="tel"
									placeholder="+91 XXXXX XXXXX"
								/>
							</div>

							{/* Declaration */}
							<div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-10">
								<p className="text-sm text-slate-600 mb-4 leading-relaxed">
									<strong className="text-[#0a1628]">Declaration:</strong> I
									hereby declare that all the information provided in this
									re-admission application is true and correct to the best of my
									knowledge. I agree to abide by the rules and regulations of
									the institution.
								</p>
								<label className="flex items-start gap-3 cursor-pointer group">
									<input
										type="checkbox"
										id="agreeCheck"
										checked={formData.agreeCheck}
										onChange={handleInputChange}
										className="mt-1 w-5 h-5 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628] cursor-pointer"
									/>
									<div className="flex-1">
										<span
											className={`text-[15px] font-medium transition-colors ${errors.agreeCheck ? "text-rose-600" : "text-slate-700 group-hover:text-[#0a1628]"}`}
										>
											I agree to the declaration above{" "}
											<span className="text-rose-500">*</span>
										</span>
										{errors.agreeCheck && (
											<div className="text-xs font-bold text-rose-500 mt-1">
												{errors.agreeCheck}
											</div>
										)}
									</div>
								</label>
							</div>

							<div className="pt-10 border-t border-slate-100 flex justify-end">
								<button
									type="button"
									onClick={submitForm}
									disabled={isSubmitting}
									className="w-full sm:w-auto bg-gradient-to-r from-[#1d6fa4] to-[#165a88] hover:brightness-110 text-white px-10 py-4 rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="w-5 h-5 animate-spin" /> Submitting…
										</>
									) : (
										<>
											Review & Submit <Send className="w-4 h-4 ml-1" />
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LocalAdmissionPage;
