import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addApplication, generateNextAppNo } from "../services/supabase";
import { downloadApplicationPDF } from "../utils/pdfDownloader";
import { localAdmissionSchema, type LocalAdmissionFormData } from "../utils/formSchema";
import { InputField } from "../components/InputField";
import { Button } from "../components/ui/button";
import { AdmissionPageHeader } from "../components/AdmissionPageHeader";
import { AdmissionSuccess } from "../components/AdmissionSuccess";
import { PhotoUploadSection } from "../components/PhotoUploadSection";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "../components/ui/card";
import {
	Send,
	AlertCircle,
} from "lucide-react";
import printLogo from "../assets/horizontal-logo.png";

const LocalAdmissionPage = () => {
	const [photoDataURL, setPhotoDataURL] = useState<string | null>(null);
	const [photoError, setPhotoError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<LocalAdmissionFormData>({
		resolver: zodResolver(localAdmissionSchema),
		defaultValues: {
			academicYear: "2026–27",
		},
	});

	const [submitted, setSubmitted] = useState(false);
	const [appNo, setAppNo] = useState("");
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isDownloading, setIsDownloading] = useState(false);

	const preloadImage = (url: string): Promise<void> => {
		return new Promise((resolve) => {
			if (!url) {
				resolve();
				return;
			}
			const img = new Image();
			img.onload = () => resolve();
			img.onerror = () => resolve();
			img.src = url;
		});
	};

	const handleDownloadReceipt = async () => {
		const formData = getValues();
		setIsDownloading(true);
		try {
			const preloads = [preloadImage(printLogo)];
			if (photoDataURL) preloads.push(preloadImage(photoDataURL));
			await Promise.all(preloads);

			await downloadApplicationPDF(appNo, formData.firstName);
		} catch (err) {
			console.error("PDF download error:", err);
			alert("Failed to download receipt.");
		} finally {
			setIsDownloading(false);
		}
	};

	// Replaced with PhotoUploadSection logic

	const onSubmit = async (data: LocalAdmissionFormData) => {
		setSubmitError(null);

		try {
			const applicationNo = await generateNextAppNo(undefined, "local");
			setAppNo(applicationNo);

			await addApplication({
				...data,
				appNo: applicationNo,
				submissionDate: new Date().toISOString(),
				admissionType: "local",
				agreeCheck: true,
				photo: photoDataURL,
				status: "submitted",
			});

			setSubmitted(true);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (err) {
			console.error("Submission error:", err);
			setSubmitError("Failed to submit application. Please try again.");
		}
	};

	if (submitted) {
		const formData = getValues();
		return (
			<AdmissionSuccess 
				appNo={appNo}
				studentName={formData.firstName}
				onDownload={handleDownloadReceipt}
				isDownloading={isDownloading}
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
			<AdmissionPageHeader 
				title="Local Admission"
				session="2026–27"
			/>

			<main className="max-w-7xl mx-auto px-4 sm:px-6">
				<Card className="border-0 bg-transparent shadow-none sm:border sm:bg-white sm:shadow-sm sm:rounded-xl overflow-hidden">
					<CardHeader className="px-0 sm:px-6">
						<CardTitle>Re-admission Form</CardTitle>
						<CardDescription>
							Enter details for continuing students.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-8 px-0 sm:px-6">
						{submitError && (
							<div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
								<AlertCircle className="w-4 h-4" /> {submitError}
							</div>
						)}

						<form
							onSubmit={handleSubmit(onSubmit, () => {
								window.scrollTo({ top: 0, behavior: "smooth" });
							})}
							className="space-y-8"
						>
							{Object.keys(errors).length > 0 && (
								<div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
									<AlertCircle className="w-5 h-5 text-rose-500 mt-0.5" />
									<div>
										<p className="text-sm font-bold text-rose-800">Please correct the errors in the form.</p>
										<p className="text-xs text-rose-600 mt-1">
											Some required fields are missing or invalid. Please check the highlighted fields below.
										</p>
									</div>
								</div>
							)}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
								<div className="space-y-8">
									<h3 className="text-sm font-bold uppercase tracking-widest text-[#c8922a] border-b border-slate-100 pb-2">
										Student Information
									</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
									</div>
									<InputField
										label="Date of Birth"
										id="dob"
										type="date"
										registration={register("dob")}
										error={errors.dob?.message}
										required
									/>
									<InputField
										label="Student Phone"
										id="studentPhone"
										type="tel"
										registration={register("studentPhone")}
										error={errors.studentPhone?.message}
									/>
								</div>

								<div className="space-y-8">
									<h3 className="text-sm font-bold uppercase tracking-widest text-[#c8922a] border-b border-slate-100 pb-2">
										Parent Information
									</h3>
									<InputField
										label="Father's Name"
										id="fatherName"
										registration={register("fatherName")}
										error={errors.fatherName?.message}
										required
									/>
									<InputField
										label="Father's Phone"
										id="fatherPhone"
										type="tel"
										registration={register("fatherPhone")}
										error={errors.fatherPhone?.message}
										required
									/>
									<InputField
										label="Residential Address"
										id="address"
										type="textarea"
										registration={register("address")}
										error={errors.address?.message}
										required
									/>
								</div>
							</div>

							<div className="space-y-8">
								<h3 className="text-sm font-bold uppercase tracking-widest text-[#c8922a] border-b border-slate-100 pb-2">
									Academic Details
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
									<InputField
										label="Applying For Class"
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
										registration={register("applyClass")}
										error={errors.applyClass?.message}
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
										required
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
							</div>

							<div className="space-y-6 pt-4">
								<h3 className="text-sm font-bold uppercase tracking-widest text-[#c8922a] border-b border-slate-100 pb-2">
									Student Photograph
								</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
							</div>

							<div className="space-y-4">
								<label className="flex items-start gap-4 cursor-pointer p-5 bg-white rounded-2xl border border-slate-200 hover:border-[#0a1628] transition-all group">
									<div className="mt-1">
										<input
											type="checkbox"
											{...register("agreeCheck")}
											className="h-5 w-5 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628] cursor-pointer"
										/>
									</div>
									<span className="text-sm leading-relaxed text-slate-600 font-medium group-hover:text-[#0a1628] transition-colors">
										I hereby declare that the information provided is true to the best of my knowledge. 
										I understand that any false information may lead to rejection of this application.
									</span>
								</label>
								{errors.agreeCheck && (
									<p className="text-xs text-rose-500 font-bold ml-1 animate-in fade-in slide-in-from-left-2">
										{errors.agreeCheck.message}
									</p>
								)}
							</div>

							<div className="pt-10 border-t border-slate-100 flex justify-center sm:justify-start">
								<Button
									type="submit"
									loading={isSubmitting}
									disabled={isSubmitting}
									className="w-full sm:w-auto px-12 h-14 rounded-xl bg-[#0a1628] hover:bg-[#132238] text-white font-bold text-lg shadow-xl shadow-[#0a1628]/10 transition-all hover:-translate-y-1"
								>
									Submit Re-admission <Send className="w-5 h-5 ml-2" />
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</main>
		</div>
	);
};

export default LocalAdmissionPage;
