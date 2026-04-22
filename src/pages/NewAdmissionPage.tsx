import { useState, useRef, type ChangeEvent } from "react";
import React from "react";
import { addApplication } from "../services/supabase";
import { downloadApplicationPDF } from "../utils/pdfDownloader";
import logo from "../assets/logo.jpg";
import ApplicationPrintDocument from "../components/ApplicationPrintDocument";
import { validateStep, validatePhoto } from "../utils/formValidation";
import { formatApplicationNo } from "../utils/formatters";
import {
	Camera,
	AlertTriangle,
	CheckCircle2,
	ChevronRight,
	ChevronLeft,
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

interface FormErrors {
	[key: string]: string | null;
}



	const InputField = ({
		label,
		id,
		type = "text",
		placeholder = "",
		required = false,
		className = "",
		maxLength,
		options,
		formData,
		handleInputChange,
		errors,
	}: any) => (
		<div className={`flex flex-col gap-1.5 ${className}`}>
			<label
				htmlFor={id}
				className="text-xs font-bold uppercase tracking-wider text-slate-500"
			>
				{label} {required && <span className="text-rose-500">*</span>}
			</label>
			{type === "textarea" ? (
				<textarea
					id={id}
					placeholder={placeholder}
					value={(formData as any)[id]}
					onChange={handleInputChange}
					className={`w-full px-4 py-3 bg-slate-50 border ${errors[id] ? "border-rose-300 ring-1 ring-rose-100 bg-rose-50/30" : "border-slate-200 focus:border-[#0a1628] focus:ring-1 focus:ring-[#0a1628]"} rounded-xl outline-none transition-all min-h-[100px] resize-y text-[15px]`}
				/>
			) : type === "select" ? (
				<select
					id={id}
					value={(formData as any)[id]}
					onChange={handleInputChange}
					className={`w-full px-4 py-3 bg-slate-50 border ${errors[id] ? "border-rose-300 ring-1 ring-rose-100 bg-rose-50/30" : "border-slate-200 focus:border-[#0a1628] focus:ring-1 focus:ring-[#0a1628]"} rounded-xl outline-none transition-all text-[15px] appearance-none cursor-pointer`}
				>
					{placeholder && <option value="">{placeholder}</option>}
					{options?.map((opt: any) => (
						<option key={opt.value || opt} value={opt.value || opt}>
							{opt.label || opt}
						</option>
					))}
				</select>
			) : (
				<input
					type={type}
					id={id}
					placeholder={placeholder}
					maxLength={maxLength}
					value={(formData as any)[id]}
					onChange={handleInputChange}
					className={`w-full px-4 py-3 bg-slate-50 border ${errors[id] ? "border-rose-300 ring-1 ring-rose-100 bg-rose-50/30" : "border-slate-200 focus:border-[#0a1628] focus:ring-1 focus:ring-[#0a1628]"} rounded-xl outline-none transition-all text-[15px]`}
				/>
			)}
			{errors[id] && (
				<div className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-0.5">
					<AlertTriangle className="w-3 h-3" /> {errors[id]}
				</div>
			)}
		</div>
	);

const NewAdmissionPage = () => {
	const photoInputRef = useRef<HTMLInputElement>(null);
	const [currentStep, setCurrentStep] = useState(1);
	const [photoDataURL, setPhotoDataURL] = useState<string | null>(null);
	const [formData, setFormData] = useState<FormData>({
		firstName: "",
		lastName: "",
		dob: "",
		gender: "",
		bloodGroup: "",
		nationality: "Indian",
		aadhar: "",
		studentPhone: "",
		address: "",
		applyClass: "",
		academicYear: "",
		stream: "",
		prevSchool: "",
		prevClass: "",
		prevBoard: "",
		prevPercentage: "",
		achievements: "",
		fatherName: "",
		fatherOcc: "",
		fatherPhone: "",
		fatherEmail: "",
		motherName: "",
		motherOcc: "",
		motherPhone: "",
		motherEmail: "",
		income: "",
		emergencyName: "",
		emergencyPhone: "",
		medical: "",
		referral: "",
		remarks: "",
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

	const validate = (step: number) => {
		const newErrors = validateStep(step, formData);
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const nextStep = (from: number) => {
		if (!validate(from)) return;
		setCurrentStep(from + 1);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const prevStep = (from: number) => {
		setCurrentStep(from - 1);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const submitForm = async () => {
		setSubmitError(null);
		if (!validate(3)) {
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
				admissionType: "new",
			} as any);
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
			} catch (err) {}
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
								className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c8922a] to-[#b5801f] hover:brightness-110 text-white text-sm font-semibold transition-all shadow-sm "
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
				<div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#c8922a]/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
				<div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#1e3a5f]/40 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>

				<div className="relative z-10 flex flex-col items-center">
					<div className="w-24 h-24 rounded-2xl bg-white/5 border border-[#c8922a]/30 p-2.5 backdrop-blur-md shadow-sm mb-6">
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
					<div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#c8922a]/15 border border-[#c8922a]/30 text-[#c8922a] backdrop-blur-sm text-xs font-bold uppercase tracking-wider shadow-inner">
						<span className="w-2 h-2 rounded-full bg-[#c8922a] animate-pulse"></span>
						New Admission · 2026–27
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 -mt-12 pb-24">
				<div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
					{/* Progress Bar */}
					<div className="bg-white border-b border-slate-100 sticky top-0 z-20 flex max-w-3xl mx-auto">
						{[1, 2, 3].map((step) => (
							<button
								type="button"
								key={step}
								onClick={() =>
									currentStep > step ? setCurrentStep(step) : null
								}
								className={`flex-1 py-5 text-center border-b-2 transition-all text-sm font-bold tracking-wide uppercase ${
									currentStep === step
										? "border-[#0a1628] text-[#0a1628]"
										: currentStep > step
											? "border-[#c8922a] text-[#c8922a] hover:bg-slate-50 cursor-pointer"
											: "border-transparent text-slate-400 cursor-not-allowed"
								}`}
							>
								<span className="hidden sm:inline-block mr-2 opacity-50">
									Step {step}
								</span>
								<span className="hidden sm:inline-block opacity-30">—</span>
								<span className="sm:ml-2">
									{step === 1
										? "Personal"
										: step === 2
											? "Academic"
											: "Parent & Misc"}
								</span>
							</button>
						))}
					</div>

					{/* Form Content */}
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

						{/* Step 1: Personal Information */}
						<div
							className={`space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 ${currentStep === 1 ? "block" : "hidden"}`}
						>
							<div className="mb-8">
								<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">
									Step 1 of 3
								</div>
								<h2 className="font-display text-3xl font-bold text-[#0a1628] mb-2">
									Personal Information
								</h2>
								<p className="text-slate-500 text-[15px]">
									Please provide the student's personal details accurately.
								</p>
							</div>

							<div className="flex flex-col md:flex-row gap-8 lg:gap-12">
								{/* Photo Upload */}
								<div className="shrink-0 flex flex-col gap-2">
									<label className="text-xs font-bold uppercase tracking-wider text-slate-500">
										Student Photo
									</label>
									<div
										onClick={() => photoInputRef.current?.click()}
										className={`w-36 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group relative ${photoError ? "border-rose-300 bg-rose-50/50" : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-[#0a1628]/50"}`}
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
											<div className="text-center p-4 text-slate-400 group-hover:text-[#0a1628] transition-colors">
												<Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
												<div className="text-xs font-bold">Upload Photo</div>
												<div className="text-[10px] mt-1 opacity-70">
													JPG, PNG <br />
													Max 5MB
												</div>
											</div>
										)}
									</div>
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
										label="Blood Group"
										id="bloodGroup"
										type="select"
										placeholder="Select"
										options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
									/>
									<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
										label="Nationality"
										id="nationality"
										placeholder="Indian"
									/>
									<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
										label="Aadhar Number"
										id="aadhar"
										placeholder="XXXX XXXX XXXX"
										maxLength={14}
										required
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
									label="Student Phone"
									id="studentPhone"
									type="tel"
									placeholder="+91 XXXXX XXXXX"
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

							<div className="pt-6 border-t border-slate-100 flex justify-end">
								<button
									type="button"
									onClick={() => nextStep(1)}
									className="bg-[#0a1628] hover:bg-[#132238] text-white px-8 py-3.5 rounded-xl font-bold text-[15px] transition-all flex items-center gap-2 shadow-sm hover:-translate-y-0.5"
								>
									Next: Academic Details <ChevronRight className="w-4 h-4" />
								</button>
							</div>
						</div>

						{/* Step 2: Academic Details */}
						<div
							className={`space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 ${currentStep === 2 ? "block" : "hidden"}`}
						>
							<div className="mb-8">
								<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">
									Step 2 of 3
								</div>
								<h2 className="font-display text-3xl font-bold text-[#0a1628] mb-2">
									Academic Details
								</h2>
								<p className="text-slate-500 text-[15px]">
									Admission preference and previous academic history.
								</p>
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
									label="Stream / Section"
									id="stream"
									type="select"
									placeholder="Select Stream"
									options={[
										"RootExc",
										"HS (Higher Secondary)",
										"BS (Bachelor of Science)",
									]}
								/>
								<div className="hidden sm:block"></div>

								<div className="sm:col-span-2 flex items-center gap-3 my-2">
									<div className="h-px bg-slate-200 flex-1"></div>
									<span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
										Previous History
									</span>
									<div className="h-px bg-slate-200 flex-1"></div>
								</div>

								<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
									label="Previous School Name"
									id="prevSchool"
									placeholder="School name"
									className="sm:col-span-2"
								/>
								<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
									label="Previous Class"
									id="prevClass"
									placeholder="e.g. Class 7"
								/>
								<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
									label="Previous Board"
									id="prevBoard"
									type="select"
									placeholder="Select Board"
									options={["CBSE", "ICSE", "State Board", "IB", "IGCSE"]}
								/>
								<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
									label="Percentage / Grade"
									id="prevPercentage"
									placeholder="e.g. 85% or A+"
								/>
								<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
									label="Extracurricular Activities / Achievements"
									id="achievements"
									type="textarea"
									placeholder="Sports, arts, clubs, awards, competitions…"
									className="sm:col-span-2"
								/>
							</div>

							<div className="pt-6 border-t border-slate-100 flex justify-between items-center">
								<button
									type="button"
									onClick={() => prevStep(2)}
									className="text-slate-500 hover:text-[#0a1628] font-bold px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
								>
									<ChevronLeft className="w-4 h-4" /> Back
								</button>
								<button
									type="button"
									onClick={() => nextStep(2)}
									className="bg-[#0a1628] hover:bg-[#132238] text-white px-8 py-3.5 rounded-xl font-bold text-[15px] transition-all flex items-center gap-2 shadow-sm hover:-translate-y-0.5"
								>
									Next: Parent Details <ChevronRight className="w-4 h-4" />
								</button>
							</div>
						</div>

						{/* Step 3: Parent & Misc */}
						<div
							className={`space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 ${currentStep === 3 ? "block" : "hidden"}`}
						>
							<div className="mb-8">
								<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">
									Step 3 of 3
								</div>
								<h2 className="font-display text-3xl font-bold text-[#0a1628] mb-2">
									Parent & Guardian Info
								</h2>
								<p className="text-slate-500 text-[15px]">
									Contact details and additional information.
								</p>
							</div>

							<div className="space-y-8">
								{/* Father */}
								<div>
									<div className="flex items-center gap-2 mb-4">
										<div className="w-1 h-4 bg-[#c8922a] rounded-full"></div>
										<h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
											Father's Details
										</h3>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
										<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
											label="Full Name"
											id="fatherName"
											placeholder="Full name"
											required
										/>
										<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
											label="Occupation"
											id="fatherOcc"
											placeholder="e.g. Engineer"
										/>
										<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
											label="Phone Number"
											id="fatherPhone"
											type="tel"
											placeholder="+91 XXXXX XXXXX"
											required
										/>
										<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
											label="Email Address"
											id="fatherEmail"
											type="email"
											placeholder="email@example.com"
										/>
									</div>
								</div>

								{/* Mother */}
								<div>
									<div className="flex items-center gap-2 mb-4">
										<div className="w-1 h-4 bg-[#c8922a] rounded-full"></div>
										<h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
											Mother's Details
										</h3>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
										<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
											label="Full Name"
											id="motherName"
											placeholder="Full name"
											required
										/>
										<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
											label="Occupation"
											id="motherOcc"
											placeholder="e.g. Teacher"
										/>
										<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
											label="Phone Number"
											id="motherPhone"
											type="tel"
											placeholder="+91 XXXXX XXXXX"
										/>
										<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
											label="Email Address"
											id="motherEmail"
											type="email"
											placeholder="email@example.com"
										/>
									</div>
								</div>

								{/* Additional */}
								<div>
									<div className="flex items-center gap-2 mb-4">
										<div className="w-1 h-4 bg-[#c8922a] rounded-full"></div>
										<h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
											Additional Details
										</h3>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
										<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
											label="Annual Family Income"
											id="income"
											type="select"
											placeholder="Prefer not to say"
											options={[
												"Below ₹2 Lakhs",
												"₹2–5 Lakhs",
												"₹5–10 Lakhs",
												"Above ₹10 Lakhs",
											]}
										/>
										<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
											label="How did you hear about us?"
											id="referral"
											type="select"
											placeholder="Select"
											options={[
												"Friend / Family",
												"Website",
												"Social Media",
												"Newspaper",
												"Other",
											]}
										/>
										<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
											label="Emergency Contact Name"
											id="emergencyName"
											placeholder="Contact name"
										/>
										<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
											label="Emergency Contact Phone"
											id="emergencyPhone"
											type="tel"
											placeholder="+91 XXXXX XXXXX"
										/>
										<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
											label="Medical Conditions / Allergies"
											id="medical"
											type="textarea"
											placeholder="Any known conditions, medications, or allergies…"
											className="sm:col-span-2"
										/>
										<InputField formData={formData} handleInputChange={handleInputChange} errors={errors}
											label="Additional Remarks"
											id="remarks"
											type="textarea"
											placeholder="Any other information you'd like to share…"
											className="sm:col-span-2"
										/>
									</div>
								</div>

								{/* Declaration */}
								<div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-6">
									<p className="text-sm text-slate-600 mb-4 leading-relaxed">
										<strong className="text-[#0a1628]">Declaration:</strong> I
										hereby declare that all the information provided in this
										application is true and correct to the best of my knowledge.
										I agree to abide by the rules and regulations of the
										institution.
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
							</div>

							<div className="pt-8 border-t border-slate-100 flex justify-between items-center">
								<button
									onClick={() => prevStep(3)}
									disabled={isSubmitting}
									className="text-slate-500 hover:text-[#0a1628] font-bold px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50"
								>
									<ChevronLeft className="w-4 h-4" /> Back
								</button>
								<button
									onClick={submitForm}
									disabled={isSubmitting}
									className="bg-gradient-to-r from-[#c8922a] to-[#b5801f] hover:brightness-110 text-white px-8 py-4 rounded-xl font-bold text-[15px] transition-all flex items-center gap-2 shadow-sm hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
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

export default NewAdmissionPage;
