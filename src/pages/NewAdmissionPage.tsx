import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addApplication } from "../services/supabase";
import { downloadApplicationPDF } from "../utils/pdfDownloader";
import logo from "../assets/logo.jpg";
import ApplicationPrintDocument from "../components/ApplicationPrintDocument";
import { admissionSchema, type AdmissionFormData } from "../utils/formSchema";
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
	const [photoError, setPhotoError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		trigger,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<AdmissionFormData>({
		resolver: zodResolver(admissionSchema),
		defaultValues: {
			nationality: "Indian",
			academicYear: "2026–27",
			agreeCheck: false,
		},
	});

	const [submitError, setSubmitError] = useState<string | null>(null);
	const [showSuccess, setShowSuccess] = useState(false);
	const [appNo, setAppNo] = useState("");

	const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			setPhotoDataURL(ev.target?.result as string);
			setPhotoError(null);
		};
		reader.readAsDataURL(file);
	};

	const nextStep = async () => {
		let fieldsToValidate: (keyof AdmissionFormData)[] = [];
		if (currentStep === 1) {
			fieldsToValidate = ["firstName", "lastName", "dob", "bloodGroup", "nationality", "aadhar", "address"];
			if (!photoDataURL) {
				setPhotoError("Student photo is required");
				window.scrollTo({ top: 0, behavior: "smooth" });
				return;
			}
		} else if (currentStep === 2) {
			fieldsToValidate = ["applyClass", "academicYear", "prevSchool", "prevClass", "prevPercentage"];
		} else if (currentStep === 3) {
			fieldsToValidate = ["fatherName", "fatherPhone", "motherName"];
		}

		const isStepValid = await trigger(fieldsToValidate);
		if (isStepValid) {
			setCurrentStep((prev) => prev + 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} else {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const onSubmit = async (data: AdmissionFormData) => {
		if (!photoDataURL) {
			setPhotoError("Student photo is required");
			setCurrentStep(1);
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}

		setSubmitError(null);
		const newAppNo = formatApplicationNo();
		setAppNo(newAppNo);

		try {
			await addApplication({
				...data,
				appNo: newAppNo,
				photo: photoDataURL,
				submissionDate: new Date(),
				admissionType: "new",
				status: "submitted",
			});
			setShowSuccess(true);
		} catch (err: any) {
			setSubmitError(err.message || "Failed to submit application.");
		}
	};

	if (showSuccess) {
		const formData = getValues();
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
									onClick={(step) => {
										if (step < currentStep) setCurrentStep(step);
									}}
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

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
							{currentStep === 1 && (
								<div className="space-y-6">
									<div className="flex flex-col md:flex-row gap-8">
										<div className="shrink-0 flex flex-col items-center gap-2">
											<div className="text-sm font-medium">Student Photo</div>
											<div
												onClick={() => photoInputRef.current?.click()}
												className="w-32 h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors mx-auto overflow-hidden"
											>
												{photoDataURL ? (
													<img
														src={photoDataURL}
														alt="Student Photo Preview"
														className="w-full h-full object-cover"
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
												accept="image/*"
											/>
											{(photoError || errors.photo) && (
												<p className="text-[10px] text-destructive font-medium text-center">
													{photoError || errors.photo?.message}
												</p>
											)}
										</div>
										<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
											<InputField
												label="First Name"
												id="firstName"
												registration={register("firstName")}
												error={errors.firstName?.message}
												required
											/>
											<InputField
												label="Last Name"
												id="lastName"
												registration={register("lastName")}
												error={errors.lastName?.message}
												required
											/>
											<InputField
												label="Date of Birth"
												id="dob"
												type="date"
												registration={register("dob")}
												error={errors.dob?.message}
												required
											/>
											<InputField
												label="Blood Group"
												id="bloodGroup"
												type="select"
												options={["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"]}
												registration={register("bloodGroup")}
												error={errors.bloodGroup?.message}
												required
											/>
										</div>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
										<InputField
											label="Nationality"
											id="nationality"
											registration={register("nationality")}
											error={errors.nationality?.message}
											required
										/>
										<InputField
											label="Student Phone"
											id="studentPhone"
											type="tel"
											registration={register("studentPhone")}
											error={errors.studentPhone?.message}
										/>
										<InputField
											label="Aadhar Number"
											id="aadhar"
											registration={register("aadhar")}
											error={errors.aadhar?.message}
											required
										/>
									</div>
									<InputField
										label="Residential Address"
										id="address"
										type="textarea"
										registration={register("address")}
										error={errors.address?.message}
										required
									/>
								</div>
							)}

							{currentStep === 2 && (
								<div className="space-y-6">
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
										<InputField
											label="Applying for Class"
											id="applyClass"
											type="select"
											options={["Class 8", "Class 9", "Class 10", "Plus One", "Plus Two", "Degree"]}
											registration={register("applyClass")}
											error={errors.applyClass?.message}
											required
										/>
										<InputField
											label="Stream"
											id="stream"
											type="select"
											options={["Science", "Commerce", "Humanities", "N/A"]}
											registration={register("stream")}
											error={errors.stream?.message}
										/>
										<InputField
											label="Academic Year"
											id="academicYear"
											type="select"
											options={["2026–27"]}
											registration={register("academicYear")}
											error={errors.academicYear?.message}
											required
										/>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<InputField
											label="Previous School"
											id="prevSchool"
											registration={register("prevSchool")}
											error={errors.prevSchool?.message}
											required
										/>
										<InputField
											label="Previous Board"
											id="prevBoard"
											registration={register("prevBoard")}
											error={errors.prevBoard?.message}
										/>
										<InputField
											label="Previous Class"
											id="prevClass"
											registration={register("prevClass")}
											error={errors.prevClass?.message}
											required
										/>
										<InputField
											label="Percentage (%)"
											id="prevPercentage"
											registration={register("prevPercentage")}
											error={errors.prevPercentage?.message}
											required
										/>
									</div>
									<InputField
										label="Achievements / Extra-curricular"
										id="achievements"
										type="textarea"
										registration={register("achievements")}
										error={errors.achievements?.message}
									/>
								</div>
							)}

							{currentStep === 3 && (
								<div className="space-y-6">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
										<div className="space-y-4">
											<h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
												Father's Information
											</h4>
											<InputField
												label="Name"
												id="fatherName"
												registration={register("fatherName")}
												error={errors.fatherName?.message}
												required
											/>
											<InputField
												label="Occupation"
												id="fatherOcc"
												registration={register("fatherOcc")}
												error={errors.fatherOcc?.message}
											/>
											<InputField
												label="Phone Number"
												id="fatherPhone"
												type="tel"
												registration={register("fatherPhone")}
												error={errors.fatherPhone?.message}
												required
											/>
											<InputField
												label="Email Address"
												id="fatherEmail"
												type="email"
												registration={register("fatherEmail")}
												error={errors.fatherEmail?.message}
											/>
										</div>
										<div className="space-y-4">
											<h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
												Mother's Information
											</h4>
											<InputField
												label="Name"
												id="motherName"
												registration={register("motherName")}
												error={errors.motherName?.message}
												required
											/>
											<InputField
												label="Occupation"
												id="motherOcc"
												registration={register("motherOcc")}
												error={errors.motherOcc?.message}
											/>
											<InputField
												label="Phone Number"
												id="motherPhone"
												type="tel"
												registration={register("motherPhone")}
												error={errors.motherPhone?.message}
											/>
											<InputField
												label="Email Address"
												id="motherEmail"
												type="email"
												registration={register("motherEmail")}
												error={errors.motherEmail?.message}
											/>
										</div>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
										<div className="space-y-4">
											<h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
												Emergency Contact
											</h4>
											<InputField
												label="Contact Person Name"
												id="emergencyName"
												registration={register("emergencyName")}
												error={errors.emergencyName?.message}
											/>
											<InputField
												label="Emergency Phone"
												id="emergencyPhone"
												type="tel"
												registration={register("emergencyPhone")}
												error={errors.emergencyPhone?.message}
											/>
										</div>
										<div className="space-y-4">
											<h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
												Financial Information
											</h4>
											<InputField
												label="Annual Family Income"
												id="income"
												registration={register("income")}
												error={errors.income?.message}
											/>
										</div>
									</div>
								</div>
							)}

							{currentStep === 4 && (
								<div className="space-y-6">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
										<InputField
											label="Medical Conditions / Allergies"
											id="medical"
											type="textarea"
											registration={register("medical")}
											error={errors.medical?.message}
										/>
										<InputField
											label="How did you hear about us?"
											id="referral"
											registration={register("referral")}
											error={errors.referral?.message}
										/>
									</div>
									<InputField
										label="General Remarks"
										id="remarks"
										type="textarea"
										registration={register("remarks")}
										error={errors.remarks?.message}
									/>

									<div className="p-6 border rounded-lg bg-slate-50 space-y-4">
										<h3 className="font-bold flex items-center gap-2">
											<CheckCircle2 className="w-5 h-5 text-green-600" />
											Review & Final Declaration
										</h3>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm">
											{/* Review items remain static or use getValues() */}
											<div className="flex justify-between border-b pb-1">
												<span className="text-muted-foreground">Full Name:</span>
												<span className="font-medium">
													{getValues("firstName")} {getValues("lastName")}
												</span>
											</div>
											<div className="flex justify-between border-b pb-1">
												<span className="text-muted-foreground">Applied Class:</span>
												<span className="font-medium">{getValues("applyClass")}</span>
											</div>
											<div className="flex justify-between border-b pb-1">
												<span className="text-muted-foreground">DOB:</span>
												<span className="font-medium">{getValues("dob")}</span>
											</div>
											<div className="flex justify-between border-b pb-1">
												<span className="text-muted-foreground">Father:</span>
												<span className="font-medium">{getValues("fatherName")}</span>
											</div>
										</div>

										<label className="flex items-start gap-3 cursor-pointer mt-6 p-3 bg-white rounded border border-slate-200">
											<input
												type="checkbox"
												{...register("agreeCheck")}
												className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628]"
											/>
											<span className="text-sm leading-relaxed text-slate-600">
												I hereby declare that the information provided is true to
												 the best of my knowledge. I understand that any false 
												 information may lead to rejection of this application.
											</span>
										</label>
										{errors.agreeCheck && (
											<p className="text-xs text-destructive font-medium ml-7">
												{errors.agreeCheck.message}
											</p>
										)}
									</div>
								</div>
							)}

							<div className="flex flex-col sm:flex-row gap-4 justify-between pt-8 border-t border-slate-100">
								<Button
									type="button"
									variant="outline"
									onClick={prevStep}
									disabled={currentStep === 1 || isSubmitting}
									className="rounded-xl h-12 px-6 font-bold w-full sm:w-auto order-2 sm:order-1"
								>
									<ChevronLeft className="w-4 h-4 mr-2" /> Previous
								</Button>
								{currentStep < 4 ? (
									<Button 
										type="button"
										variant="navy"
										onClick={nextStep} 
										className="rounded-xl h-12 px-8 font-bold w-full sm:w-auto order-1 sm:order-2"
									>
										Next Step <ChevronRight className="w-4 h-4 ml-2" />
									</Button>
								) : (
									<Button
										type="submit"
										variant="navy"
										disabled={isSubmitting}
										loading={isSubmitting}
										className="rounded-xl h-12 px-10 font-bold w-full sm:w-auto order-1 sm:order-2"
									>
										Submit Application <Send className="w-4 h-4 ml-2" />
									</Button>
								)}
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default NewAdmissionPage;
