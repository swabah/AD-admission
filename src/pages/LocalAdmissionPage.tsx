import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { addApplication } from "../services/supabase";
import { downloadApplicationPDF } from "../utils/pdfDownloader";
import logo from "../assets/logo.jpg";
import { validatePhoto } from "../utils/formValidation";
import { formatApplicationNo } from "../utils/formatters";
import { InputField } from "../components/InputField";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import {
	Camera,
	Send,
	Printer,
	CheckCircle2,
	ChevronLeft
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
	address: string;
	photo?: string | null;
}

const LocalAdmissionPage = () => {
	const navigate = useNavigate();
	const photoInputRef = useRef<HTMLInputElement>(null);
	const [photoDataURL, setPhotoDataURL] = useState<string | null>(null);
	const [formData, setFormData] = useState<FormData>({
		firstName: "",
		lastName: "",
		dob: "",
		studentPhone: "",
		applyClass: "",
		academicYear: "2026–27",
		prevClass: "",
		fatherName: "",
		fatherPhone: "",
		address: "",
	});

	const [errors, setErrors] = useState<Record<string, string | null>>({});
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [appNo, setAppNo] = useState("");
	const [submitError, setSubmitError] = useState<string | null>(null);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
		if (errors[id]) setErrors((prev) => ({ ...prev, [id]: null }));
	};

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const validation = validatePhoto(file);
			if (!validation.valid) {
				alert(validation.error);
				return;
			}

			const reader = new FileReader();
			reader.onloadend = () => {
				setPhotoDataURL(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setSubmitError(null);

		try {
			const applicationNo = formatApplicationNo("L");
			setAppNo(applicationNo);

			await addApplication({
				...formData,
				appNo: applicationNo,
				submissionDate: new Date().toISOString(),
				admissionType: "local",
				agreeCheck: true,
				photo: photoDataURL,
				status: "submitted",
			});

			setSubmitted(true);
		} catch (err) {
			console.error("Submission error:", err);
			setSubmitError("Failed to submit application. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (submitted) {
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
				<Card className="max-w-md w-full text-center p-8 rounded-3xl shadow-xl border-slate-100">
					<div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
						<CheckCircle2 className="w-10 h-10" />
					</div>
					<h2 className="text-3xl font-display font-bold text-[#0a1628] mb-2">Application Submitted!</h2>
					<p className="text-slate-500 mb-8 font-medium">Your local re-admission has been received successfully.</p>
					
					<div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
						<p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Application Number</p>
						<p className="text-2xl font-mono font-bold text-[#0a1628]">{appNo}</p>
					</div>

					<div className="space-y-3">
						<Button onClick={() => downloadApplicationPDF(appNo, formData.firstName)} className="w-full h-12 rounded-xl bg-[#0a1628] hover:bg-[#132238] font-bold">
							<Printer className="w-4 h-4 mr-2" /> Download Receipt
						</Button>
						<Button variant="outline" onClick={() => navigate("/apply")} className="w-full h-12 rounded-xl font-bold">
							Back to Portal
						</Button>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className="bg-slate-50 min-h-screen pb-20">
			<header className="bg-[#0a1628] border-b border-[#c8922a]/20 py-4 mb-12 shadow-md">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
					<div className="flex items-center gap-5">
						<div className="bg-white p-1 rounded-xl shadow-lg border border-white/20">
							<img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
						</div>
						<h1 className="text-white text-2xl font-display font-bold">Local Re-admission</h1>
					</div>
					<Link to="/apply" className="text-white/60 hover:text-white text-xs font-bold flex items-center gap-2 transition-colors group">
						<ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Portal
					</Link>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6">
				<Card className="border-0 bg-transparent shadow-none sm:border sm:bg-white sm:shadow-sm sm:rounded-xl overflow-hidden">
					<CardHeader className="px-0 sm:px-6">
						<CardTitle>Re-admission Form</CardTitle>
						<CardDescription>Enter details for continuing students.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-8 px-0 sm:px-6">
						{submitError && (
							<div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
								{submitError}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-8">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div className="space-y-6">
									<h3 className="text-sm font-bold uppercase tracking-widest text-[#c8922a]">Student Information</h3>
									<div className="grid grid-cols-2 gap-4">
										<InputField label="First Name" id="firstName" formData={formData as any} handleInputChange={handleInputChange} errors={errors} required />
										<InputField label="Last Name" id="lastName" formData={formData as any} handleInputChange={handleInputChange} errors={errors} required />
									</div>
									<InputField label="Date of Birth" id="dob" type="date" formData={formData as any} handleInputChange={handleInputChange} errors={errors} required />
									<InputField label="Student Phone" id="studentPhone" formData={formData as any} handleInputChange={handleInputChange} errors={errors} />
								</div>

								<div className="space-y-6">
									<h3 className="text-sm font-bold uppercase tracking-widest text-[#c8922a]">Parent Information</h3>
									<InputField label="Father's Name" id="fatherName" formData={formData as any} handleInputChange={handleInputChange} errors={errors} required />
									<InputField label="Father's Phone" id="fatherPhone" formData={formData as any} handleInputChange={handleInputChange} errors={errors} required />
									<InputField label="Residential Address" id="address" type="textarea" formData={formData as any} handleInputChange={handleInputChange} errors={errors} required />
								</div>
							</div>

							<div className="space-y-6">
								<h3 className="text-sm font-bold uppercase tracking-widest text-[#c8922a]">Academic Details</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<InputField 
										label="Applying For Class" 
										id="applyClass" 
										type="select" 
										options={["Class 8", "Class 9", "Class 10", "Plus One", "Plus Two", "Degree"]} 
										formData={formData as any} 
										handleInputChange={handleInputChange} 
										errors={errors} 
										required 
									/>
									<InputField label="Previous Class" id="prevClass" formData={formData as any} handleInputChange={handleInputChange} errors={errors} required />
									<InputField 
										label="Academic Year" 
										id="academicYear" 
										type="select" 
										options={["2026–27"]} 
										formData={formData as any} 
										handleInputChange={handleInputChange} 
										errors={errors} 
										required 
									/>
								</div>
							</div>

							<div className="space-y-4">
								<h3 className="text-sm font-bold uppercase tracking-widest text-[#c8922a]">Student Photograph</h3>
								<div className="flex items-center gap-6 p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
									<div className="w-24 h-24 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm relative group">
										{photoDataURL ? (
											<img src={photoDataURL} alt="Student" className="w-full h-full object-cover" />
										) : (
											<Camera className="w-8 h-8 text-slate-300" />
										)}
										<input type="file" ref={photoInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
									</div>
									<div className="space-y-2">
										<Button type="button" variant="outline" onClick={() => photoInputRef.current?.click()} className="h-10 rounded-xl font-bold bg-white">
											{photoDataURL ? "Change Photo" : "Upload Photo"}
										</Button>
										<p className="text-[11px] text-slate-400 font-medium">JPG or PNG. Max size 2MB.</p>
									</div>
								</div>
							</div>

							<div className="pt-8 border-t border-slate-100">
								<Button type="submit" disabled={loading} className="w-full md:w-auto px-12 h-14 rounded-xl bg-[#0a1628] hover:bg-[#132238] text-white font-bold text-lg shadow-lg shadow-[#0a1628]/10 transition-all hover:-translate-y-0.5">
									{loading ? "Submitting..." : "Submit Re-admission"} <Send className="w-5 h-5 ml-2" />
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
