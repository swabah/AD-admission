import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addApplication, generateNextAppNo } from "../services/supabase";
import { downloadApplicationPDF } from "../utils/pdfDownloader";
import { admissionSchema, type AdmissionFormData } from "../utils/formSchema";
import { InputField } from "../components/InputField";
import { FormStep } from "../components/FormStep";
import { Button } from "../components/ui/button";
import { AdmissionPageHeader } from "../components/AdmissionPageHeader";
import { AdmissionSuccess } from "../components/AdmissionSuccess";
import { PhotoUploadSection } from "../components/PhotoUploadSection";
import ApplicationReview from "../components/ApplicationReview";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "../components/ui/card";
import { AlertCircle, ChevronLeft, ChevronRight, Send } from "lucide-react";

const NewAdmissionPage = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [photoDataURL, setPhotoDataURL] = useState<string | null>(null);
	const [photoError, setPhotoError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		trigger,
		getValues,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<AdmissionFormData>({
		resolver: zodResolver(admissionSchema),
		defaultValues: {
			nationality: "Indian",
			academicYear: "2026–27",
			agreeCheck: false,
		},
	});

	const selectedStream = watch("stream");

	const getClassOptions = () => {
		switch (selectedStream) {
			case "Root Exc":
				return ["Class 8", "Class 9", "Class 10"];
			case "HS":
				return ["Plus One", "Plus Two"];
			case "BS":
				return ["Degree 1st Year", "Degree 2nd Year", "Degree 3rd Year"];
			default:
				return [];
		}
	};

	const [submitError, setSubmitError] = useState<string | null>(null);
	const [showSuccess, setShowSuccess] = useState(false);
	const [appNo, setAppNo] = useState("");

	const stepFields: Record<number, (keyof AdmissionFormData)[]> = {
		1: [
			"firstName",
			"lastName",
			"dob",
			"bloodGroup",
			"nationality",
			"aadhar",
			"address",
		],
		2: [
			"applyClass",
			"academicYear",
			"prevSchool",
			"prevClass",
			"prevPercentage",
		],
		3: ["fatherName", "fatherPhone", "motherName"],
		4: ["agreeCheck"],
	};

	const getStepHasError = (step: number) => {
		const fields = stepFields[step];
		if (!fields) return false;

		// Photo error is specifically for step 1
		if (step === 1 && photoError) return true;

		return fields.some((field) => !!errors[field]);
	};

	const nextStep = async () => {
		const fieldsToValidate = stepFields[currentStep] || [];

		if (currentStep === 1 && !photoDataURL) {
			setPhotoError("Student photo is required");
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
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
		const newAppNo = await generateNextAppNo(data.stream, "new");
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
		} catch (err: unknown) {
			const error = err as Error;
			setSubmitError(error.message || "Failed to submit application.");
		}
	};

	if (showSuccess) {
		const formData = getValues();
		return (
			<AdmissionSuccess
				appNo={appNo}
				studentName={formData.firstName}
				onDownload={() => downloadApplicationPDF(appNo, formData.firstName)}
				printData={{
					...formData,
					appNo,
					photo: photoDataURL,
					status: "submitted",
					submissionDate: new Date().toISOString(),
				}}
			/>
		);
	}

	return (
		<div className="bg-slate-50 min-h-screen pb-20">
			<AdmissionPageHeader title="New Admission" session="2026–27" />

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
									hasError={getStepHasError(step)}
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

						<form
							onSubmit={handleSubmit(onSubmit, (errs) => {
								// Find the first step that has any of the errors
								const firstStepWithError = [1, 2, 3, 4].find((step) => {
									const fields = stepFields[step] || [];
									return (
										fields.some((field) => !!errs[field]) ||
										(step === 1 && !photoDataURL)
									);
								});
								if (firstStepWithError) {
									setCurrentStep(firstStepWithError);
								}
								window.scrollTo({ top: 0, behavior: "smooth" });
							})}
							className="space-y-8"
						>
							{Object.keys(errors).length > 0 && (
								<div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
									<AlertCircle className="w-5 h-5 text-rose-500 mt-0.5" />
									<div>
										<p className="text-sm font-bold text-rose-800">
											Please correct the errors before submitting.
										</p>
										<p className="text-xs text-rose-600 mt-1">
											Errors detected in:{" "}
											{[1, 2, 3, 4]
												.filter((s) => getStepHasError(s))
												.map((s) => `Step ${s}`)
												.join(", ")}
										</p>
									</div>
								</div>
							)}

							{currentStep === 1 && (
								<div className="space-y-6">
									<div className="flex flex-col md:flex-row gap-8">
										<div className="shrink-0 flex flex-col items-center gap-2">
											<div className="text-sm font-medium">Student Photo</div>
											<PhotoUploadSection
												photoDataURL={photoDataURL}
												onPhotoUpload={(url) => {
													setPhotoDataURL(url);
													setPhotoError(null);
												}}
											/>
											{photoError && (
												<p className="text-xs text-destructive font-medium mt-1">
													{photoError}
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
												registration={register("bloodGroup")}
												error={errors.bloodGroup?.message}
											/>
										</div>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
										<InputField
											label="Nationality"
											id="nationality"
											registration={register("nationality")}
											error={errors.nationality?.message}
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
											label="Academic Year"
											id="academicYear"
											type="select"
											options={["2026–27"]}
											registration={register("academicYear")}
											error={errors.academicYear?.message}
											required
										/>
										<InputField
											label="Department"
											id="stream"
											type="select"
											options={["Root Exc", "HS", "BS", "N/A"]}
											registration={register("stream")}
											error={errors.stream?.message}
										/>
										<InputField
											label="Applying for Class"
											id="applyClass"
											type="select"
											options={getClassOptions()}
											registration={register("applyClass")}
											error={errors.applyClass?.message}
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
											type="select"
											options={[
												{ value: "Kerala State", label: "Kerala State Board" },
												{ value: "CBSE", label: "CBSE" },
												{ value: "ICSE", label: "ICSE / ISC" },
												{ value: "VHSE", label: "VHSE (Kerala)" },
												{ value: "THSE", label: "THSE (Kerala)" },
												{ value: "NIOS", label: "NIOS (Open School)" },
												{ value: "Other", label: "Other Board" },
											]}
											registration={register("prevBoard")}
											error={errors.prevBoard?.message}
										/>
										<InputField
											label="Previous Class"
											id="prevClass"
											registration={register("prevClass")}
											error={errors.prevClass?.message}
										/>
										<InputField
											label="Percentage (%)"
											id="prevPercentage"
											registration={register("prevPercentage")}
											error={errors.prevPercentage?.message}
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
												type="select"
												options={[
													"Below ₹50,000",
													"₹50,000 - ₹1,00,000",
													"₹1,00,000 - ₹2,50,000",
													"₹2,50,000 - ₹5,00,000",
													"₹5,00,000 - ₹10,00,000",
													"Above ₹10,00,000",
												]}
												registration={register("income")}
												error={errors.income?.message}
											/>
										</div>
									</div>
								</div>
							)}

							{currentStep === 4 && (
								<div className="space-y-8">
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

									<ApplicationReview
										register={register}
										errors={errors}
										getValues={getValues}
									/>
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
