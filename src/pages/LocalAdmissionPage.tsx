import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addApplication, generateNextAppNo } from "../services/supabase";
import { downloadApplicationPDF } from "../utils/pdfDownloader";
import logo from "../assets/logo.jpg";
import { localAdmissionSchema, type LocalAdmissionFormData } from "../utils/formSchema";
import { formatApplicationNo } from "../utils/formatters";
import { InputField } from "../components/InputField";
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
	Send,
	Printer,
	CheckCircle2,
	ChevronLeft,
	AlertCircle,
} from "lucide-react";

const LocalAdmissionPage = () => {
	const navigate = useNavigate();
	const photoInputRef = useRef<HTMLInputElement>(null);
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

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 2 * 1024 * 1024) {
				setPhotoError("Image size must be less than 2MB");
				return;
			}
			const reader = new FileReader();
			reader.onloadend = () => {
				setPhotoDataURL(reader.result as string);
				setPhotoError(null);
			};
			reader.readAsDataURL(file);
		}
	};

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
			<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
				<Card className="max-w-md w-full text-center p-8 rounded-3xl shadow-xl border-slate-100">
					<div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
						<CheckCircle2 className="w-10 h-10" />
					</div>
					<h2 className="text-3xl font-display font-bold text-[#0a1628] mb-2">
						Application Submitted!
					</h2>
					<p className="text-slate-500 mb-8 font-medium">
						Your local re-admission has been received successfully.
					</p>

					<div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
						<p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
							Application Number
						</p>
						<p className="text-2xl font-mono font-bold text-[#0a1628]">
							{appNo}
						</p>
					</div>

					<div className="space-y-3">
						<Button
							onClick={() => downloadApplicationPDF(appNo, formData.firstName)}
							className="w-full h-12 rounded-xl bg-[#0a1628] hover:bg-[#132238] font-bold"
						>
							<Printer className="w-4 h-4 mr-2" /> Download Receipt
						</Button>
						<Button
							variant="outline"
							onClick={() => navigate("/apply")}
							className="w-full h-12 rounded-xl font-bold"
						>
							Back to Portal
						</Button>
					</div>
				</Card>
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
								Local Re-admission
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

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
								<div className="flex flex-col sm:flex-row items-center gap-6 p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
									<div className="w-32 h-40 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm relative group">
										{photoDataURL ? (
											<img
												src={photoDataURL}
												alt="Student"
												className="w-full h-full object-cover"
											/>
										) : (
											<Camera className="w-10 h-10 text-slate-300" />
										)}
										<input
											type="file"
											ref={photoInputRef}
											onChange={handlePhotoChange}
											accept="image/*"
											className="hidden"
										/>
									</div>
									<div className="space-y-3 text-center sm:text-left">
										<p className="text-sm font-bold text-[#0a1628]">
											Recent Passport Size Photo
										</p>
										<Button
											type="button"
											variant="outline"
											onClick={() => photoInputRef.current?.click()}
											className="h-11 rounded-xl font-bold bg-white border-slate-200 hover:bg-slate-50 transition-all"
										>
											{photoDataURL ? "Change Photo" : "Upload Photo"}
										</Button>
										{photoError && (
											<p className="text-xs text-rose-500 font-medium">
												{photoError}
											</p>
										)}
										<p className="text-[11px] text-slate-400 font-medium">
											JPG or PNG. Max size 2MB. Ensure clear face visibility.
										</p>
									</div>
								</div>
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
