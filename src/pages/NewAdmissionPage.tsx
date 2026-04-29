import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addApplication } from "../services/supabase";
import { downloadApplicationPDF } from "../utils/pdfDownloader";
import logo from "../assets/logo.jpg";
import ApplicationPrintDocument from "../components/ApplicationPrintDocument";
import { validateStep, type FormData } from "../utils/formValidation";
import { formatApplicationNo } from "../utils/formatters";
import { InputField } from "../components/InputField";
import { FormStep } from "../components/FormStep";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "../components/ui/card";
import {
	Camera,
	ChevronLeft,
	ChevronRight,
	Send,
	CheckCircle2,
	Printer,
	AlertCircle,
} from "lucide-react";

const NewAdmissionPage = () => {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(1);
	const photoInputRef = useRef<HTMLInputElement>(null);
	const [photoDataURL, setPhotoDataURL] = useState<string | null>(null);
	const [formData, setFormData] = useState<FormData>({
		firstName: "",
		lastName: "",
		dob: "",
		bloodGroup: "",
		nationality: "Indian",
		aadhar: "",
		studentPhone: "",
		address: "",
		applyClass: "",
		academicYear: "2026–27",
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
		annualIncome: "",
		localGuardian: "",
		guardianPhone: "",
		agreeCheck: false,
	});

	const [errors, setErrors] = useState<Record<string, string | null>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [showSuccess, setShowSuccess] = useState(false);
	const [appNo, setAppNo] = useState("");

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { id, value, type } = e.target;
		const checked = (e.target as HTMLInputElement).checked;
		setFormData((prev) => ({
			...prev,
			[id]: type === "checkbox" ? checked : value,
		}));
		if (errors[id]) setErrors((prev) => ({ ...prev, [id]: null }));
	};

	const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => setPhotoDataURL(ev.target?.result as string);
		reader.readAsDataURL(file);
	};

	const nextStep = () => {
		const stepErrors = validateStep(currentStep, formData);
		if (Object.keys(stepErrors).length > 0) {
			setErrors(stepErrors);
			return;
		}
		setCurrentStep((prev) => prev + 1);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const prevStep = () => {
		setCurrentStep((prev) => prev - 1);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		setSubmitError(null);
		const newAppNo = formatApplicationNo();
		setAppNo(newAppNo);

		try {
			await addApplication({
				...formData,
				appNo: newAppNo,
				photo: photoDataURL,
				submissionDate: new Date(),
				admissionType: "new",
				status: "submitted",
			});
			setShowSuccess(true);
		} catch (err: any) {
			setSubmitError(err.message || "Failed to submit application.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (showSuccess) {
		return (
			<div className="container mx-auto py-12 max-w-4xl px-4">
				<Card className="border-emerald-100 bg-emerald-50/10">
					<CardContent className="pt-12 pb-12 flex flex-col items-center text-center">
						<div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
							<CheckCircle2 className="w-8 h-8" />
						</div>
						<h2 className="text-3xl font-bold mb-2">Submission Successful!</h2>
						<p className="text-muted-foreground mb-8">
							Your application number is{" "}
							<span className="font-mono font-bold text-foreground">
								{appNo}
							</span>
						</p>
						<div className="flex gap-4">
							<Button onClick={() => navigate("/")} variant="outline">
								Back Home
							</Button>
							<Button
								onClick={() =>
									downloadApplicationPDF(appNo, formData.firstName)
								}
							>
								<Printer className="w-4 h-4 mr-2" /> Download PDF
							</Button>
						</div>
					</CardContent>
				</Card>
				<div className="mt-8">
					<ApplicationPrintDocument
						app={{
							...formData,
							appNo,
							photo: photoDataURL,
							status: "submitted",
							submissionDate: new Date().toISOString(),
						}}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-slate-50 min-h-screen pb-20">
			<header className="sticky top-0 z-50 bg-[#0a1628]/95 backdrop-blur-md border-b border-[#c8922a]/20 py-3 sm:py-4 mb-8 sm:mb-12 shadow-xl shadow-[#0a1628]/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
					<div className="flex items-center gap-2.5 sm:gap-5">
						<div className="bg-white p-1 rounded-xl shadow-lg border border-white/20 shrink-0">
							<img src={logo} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
						</div>
						<div className="min-w-0">
							<h1 className="text-white text-base sm:text-2xl font-display font-bold leading-none mb-1 sm:mb-1.5 truncate">
								New Admission
							</h1>
							<p className="text-[#c8922a] text-[8px] sm:text-[10px] uppercase font-bold tracking-[0.15em] truncate">
								Session 2026–27
							</p>
						</div>
					</div>
					<Link
						to="/apply"
						className="text-white/60 hover:text-white text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-colors group shrink-0"
					>
						<ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
						<span className="hidden xs:inline">Back <span className="hidden sm:inline">to Portal</span></span>
					</Link>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<Card className="mb-8 border-0 bg-transparent shadow-none sm:border sm:bg-white sm:shadow-sm sm:rounded-xl overflow-hidden">
					<CardContent className="p-0">
						<div className="flex overflow-x-auto no-scrollbar py-4 px-2 sm:px-6 divide-x divide-slate-100">
							{[1, 2, 3, 4].map((step) => (
								<FormStep
									key={step}
									step={step}
									currentStep={currentStep}
									label={
										step === 1
											? "Personal"
											: step === 2
												? "Academic"
												: step === 3
													? "Family"
													: "Review"
									}
									onClick={setCurrentStep}
									isLast={step === 4}
								/>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 bg-transparent shadow-none sm:border sm:bg-white sm:shadow-sm sm:rounded-xl overflow-hidden">
					<CardHeader className="px-0 sm:px-6">
						<CardTitle>Step {currentStep}</CardTitle>
						<CardDescription>
							Please provide the required information below.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-8 px-0 sm:px-6">
						{submitError && (
							<div className="p-4 bg-destructive/10 text-destructive rounded-lg flex gap-3 text-sm">
								<AlertCircle className="w-4 h-4 shrink-0" />
								{submitError}
							</div>
						)}

						{currentStep === 1 && (
							<div className="space-y-6">
								<div className="flex flex-col md:flex-row gap-8">
									<div className="shrink-0 flex flex-col items-center gap-2">
										<div className="text-sm font-medium">Student Photo</div>
										<div
											onClick={() => photoInputRef.current?.click()}
											className="w-32 h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors mx-auto"
										>
											{photoDataURL ? (
												<img
													src={photoDataURL}
													alt="Student Photo Preview"
													className="w-full h-full object-cover rounded-lg"
												/>
											) : (
												<Camera className="text-slate-400" />
											)}
										</div>
										<input
											type="file"
											className="hidden"
											ref={photoInputRef}
											onChange={handlePhotoUpload}
										/>
									</div>
									<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
										<InputField
											label="First Name"
											id="firstName"
											formData={formData}
											handleInputChange={handleInputChange}
											errors={errors}
											required
										/>
										<InputField
											label="Last Name"
											id="lastName"
											formData={formData}
											handleInputChange={handleInputChange}
											errors={errors}
											required
										/>
										<InputField
											label="Date of Birth"
											id="dob"
											type="date"
											formData={formData}
											handleInputChange={handleInputChange}
											errors={errors}
											required
										/>
										<InputField
											label="Blood Group"
											id="bloodGroup"
											type="select"
											options={[
												"A+",
												"B+",
												"O+",
												"AB+",
												"A-",
												"B-",
												"O-",
												"AB-",
											]}
											formData={formData}
											handleInputChange={handleInputChange}
											errors={errors}
											required
										/>
									</div>
								</div>
								<InputField
									label="Aadhar Number"
									id="aadhar"
									formData={formData}
									handleInputChange={handleInputChange}
									errors={errors}
									required
								/>
								<InputField
									label="Address"
									id="address"
									type="textarea"
									formData={formData}
									handleInputChange={handleInputChange}
									errors={errors}
									required
								/>
							</div>
						)}

						{currentStep === 2 && (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<InputField
									label="Applying for Class"
									id="applyClass"
									type="select"
									options={[
										"Class 8",
										"Class 9",
										"Class 10",
										"Plus One",
										"Plus Two",
										"Degree",
									]}
									formData={formData}
									handleInputChange={handleInputChange}
									errors={errors}
									required
								/>
								<InputField
									label="Academic Year"
									id="academicYear"
									type="select"
									options={["2026–27"]}
									formData={formData}
									handleInputChange={handleInputChange}
									errors={errors}
									required
								/>
								<InputField
									label="Previous School"
									id="prevSchool"
									formData={formData}
									handleInputChange={handleInputChange}
									errors={errors}
									required
								/>
								<InputField
									label="Previous Percentage"
									id="prevPercentage"
									formData={formData}
									handleInputChange={handleInputChange}
									errors={errors}
									required
								/>
							</div>
						)}

						{currentStep === 3 && (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<InputField
									label="Father's Name"
									id="fatherName"
									formData={formData}
									handleInputChange={handleInputChange}
									errors={errors}
									required
								/>
								<InputField
									label="Father's Phone"
									id="fatherPhone"
									type="tel"
									formData={formData}
									handleInputChange={handleInputChange}
									errors={errors}
									required
								/>
								<InputField
									label="Mother's Name"
									id="motherName"
									formData={formData}
									handleInputChange={handleInputChange}
									errors={errors}
									required
								/>
								<InputField
									label="Mother's Phone"
									id="motherPhone"
									type="tel"
									formData={formData}
									handleInputChange={handleInputChange}
									errors={errors}
								/>
							</div>
						)}

						{currentStep === 4 && (
							<div className="space-y-6">
								<div className="p-6 border rounded-lg bg-slate-50">
									<h3 className="font-bold mb-4">Review Information</h3>
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="text-muted-foreground">Name:</span>{" "}
											{formData.firstName} {formData.lastName}
										</div>
										<div>
											<span className="text-muted-foreground">Class:</span>{" "}
											{formData.applyClass}
										</div>
										<div>
											<span className="text-muted-foreground">DOB:</span>{" "}
											{formData.dob}
										</div>
										<div>
											<span className="text-muted-foreground">Father:</span>{" "}
											{formData.fatherName}
										</div>
									</div>
								</div>
								<label className="flex items-start gap-3 cursor-pointer">
									<input
										type="checkbox"
										id="agreeCheck"
										checked={formData.agreeCheck}
										onChange={handleInputChange}
										className="mt-1"
									/>
									<span className="text-sm text-muted-foreground">
										I confirm that all information provided is accurate.
									</span>
								</label>
								{errors.agreeCheck && (
									<p className="text-xs text-destructive font-medium">
										{errors.agreeCheck}
									</p>
								)}
							</div>
						)}

						<div className="flex justify-between pt-6 border-t">
							<Button
								variant="ghost"
								onClick={prevStep}
								disabled={currentStep === 1 || isSubmitting}
							>
								<ChevronLeft className="w-4 h-4 mr-2" /> Previous
							</Button>
							{currentStep < 4 ? (
								<Button onClick={nextStep}>
									Next <ChevronRight className="w-4 h-4 ml-2" />
								</Button>
							) : (
								<Button
									onClick={handleSubmit}
									disabled={isSubmitting}
									loading={isSubmitting}
								>
									Submit Application <Send className="w-4 h-4 ml-2" />
								</Button>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default NewAdmissionPage;
