import React from "react";
import { User, GraduationCap, Users, AlertCircle, Calendar, Phone, MapPin, Hash, Droplets, Flag, Briefcase, Mail, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { type RawApplicationData } from "./ApplicationPrintDocument";
import { formatDate } from "../utils/formatters";

interface ApplicationResponsiveViewProps {
	app: RawApplicationData;
}

const InfoCard = ({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) => (
	<Card className="border-slate-100 shadow-sm overflow-hidden">
		<CardHeader className="bg-slate-50/50 py-3 px-4 border-b border-slate-100">
			<CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700 uppercase tracking-wider">
				<Icon className="w-4 h-4 text-[#c8922a]" />
				{title}
			</CardTitle>
		</CardHeader>
		<CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
			{children}
		</CardContent>
	</Card>
);

const DetailItem = ({ label, value, icon: Icon }: { label: string; value?: string | null; icon?: React.ComponentType<{ className?: string }> }) => (
	<div className="flex flex-col gap-1">
		<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
			{Icon && <Icon className="w-3 h-3" />}
			{label}
		</span>
		<span className="text-sm font-semibold text-[#0a1628] leading-tight">
			{value || "—"}
		</span>
	</div>
);

export const ApplicationResponsiveView = ({ app }: ApplicationResponsiveViewProps) => {
	const d = {
		appNo:          app.appNo          || app.app_no          || "",
		firstName:      app.firstName      || app.first_name      || "",
		lastName:       app.lastName       || app.last_name       || "",
		dob:            app.dob,
		bloodGroup:     app.bloodGroup     || app.blood_group,
		nationality:    app.nationality,
		aadhar:         app.aadhar,
		studentPhone:   app.studentPhone   || app.student_phone,
		address:        app.address,
		applyClass:     app.applyClass     || app.apply_class     || "",
		academicYear:   app.academicYear   || app.academic_year   || "",
		stream:         app.stream,
		prevSchool:     app.prevSchool     || app.prev_school,
		prevClass:      app.prevClass      || app.prev_class,
		prevBoard:      app.prevBoard      || app.prev_board,
		prevPercentage: app.prevPercentage || app.prev_percentage,
		achievements:   app.achievements,
		fatherName:     app.fatherName     || app.father_name     || "",
		fatherOcc:      app.fatherOcc      || app.father_occ,
		fatherPhone:    app.fatherPhone    || app.father_phone    || "",
		fatherEmail:    app.fatherEmail    || app.father_email,
		motherName:     app.motherName     || app.mother_name     || "",
		motherOcc:      app.motherOcc      || app.mother_occ,
		motherPhone:    app.motherPhone    || app.mother_phone,
		motherEmail:    app.motherEmail    || app.mother_email,
		income:         app.income,
		emergencyName:  app.emergencyName  || app.emergency_name,
		emergencyPhone: app.emergencyPhone || app.emergency_phone,
		medical:        app.medical,
		remarks:        app.remarks,
		photo:          app.photo          || app.photoUrl        || app.photo_url       || "",
		submissionDate: app.submissionDate || app.submission_date,
		status:         app.status         || "submitted",
	};

	const fullName = `${d.firstName} ${d.lastName}`.trim();

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* Application Header */}
			<div className="bg-[#0a1628] rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center gap-6 shadow-xl shadow-[#0a1628]/10 relative overflow-hidden">
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djI2SDI0VjM0SDJWMjRoMjJWMEgzNnYyNGgyMnYxMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10 pointer-events-none"></div>
				
				{d.photo && (
					<div className="w-24 h-24 rounded-2xl border-2 border-[#c8922a] overflow-hidden shrink-0 shadow-lg bg-white/5">
						<img src={d.photo} alt="Student" className="w-full h-full object-cover" />
					</div>
				)}
				
				<div className="flex-1 text-center sm:text-left relative z-10">
					<div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
						<Badge className="bg-[#c8922a] text-[#0a1628] font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border-none">
							{d.appNo}
						</Badge>
						<Badge variant="outline" className="text-white/70 border-white/10 bg-white/5 text-[10px] uppercase tracking-wider font-bold">
							{d.applyClass} · {d.academicYear}
						</Badge>
					</div>
					<h3 className="text-2xl font-display font-bold mb-1">{fullName}</h3>
					<div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-white/50 font-medium">
						<span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(d.submissionDate, "full")}</span>
						<span className="flex items-center gap-1 uppercase tracking-wider text-[#c8922a]"><span className="w-1.5 h-1.5 rounded-full bg-[#c8922a]" /> {d.status}</span>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Personal Info */}
				<InfoCard title="Personal Information" icon={User}>
					<DetailItem label="Full Name" value={fullName} icon={User} />
					<DetailItem label="Date of Birth" value={formatDate(d.dob, "full")} icon={Calendar} />
					<DetailItem label="Blood Group" value={d.bloodGroup} icon={Droplets} />
					<DetailItem label="Aadhar Number" value={d.aadhar} icon={Hash} />
					<DetailItem label="Phone Number" value={d.studentPhone} icon={Phone} />
					<DetailItem label="Nationality" value={d.nationality} icon={Flag} />
					<div className="sm:col-span-2">
						<DetailItem label="Residential Address" value={d.address} icon={MapPin} />
					</div>
				</InfoCard>

				{/* Academic Info */}
				<InfoCard title="Academic Details" icon={GraduationCap}>
					<DetailItem label="Applying Class" value={d.applyClass} />
					<DetailItem label="Academic Year" value={d.academicYear} />
					<DetailItem label="Department" value={d.stream} />
					<div className="sm:col-span-2">
						<DetailItem label="Previous School" value={d.prevSchool} />
					</div>
					<DetailItem label="Previous Class" value={d.prevClass} />
					<DetailItem label="Percentage (%)" value={d.prevPercentage} />
					<div className="sm:col-span-2">
						<DetailItem label="Achievements" value={d.achievements} />
					</div>
				</InfoCard>

				{/* Parent Info */}
				<InfoCard title="Parent / Guardian" icon={Users}>
					<DetailItem label="Father's Name" value={d.fatherName} icon={User} />
					<DetailItem label="Father's Phone" value={d.fatherPhone} icon={Phone} />
					<DetailItem label="Mother's Name" value={d.motherName} icon={User} />
					<DetailItem label="Mother's Phone" value={d.motherPhone} icon={Phone} />
					<DetailItem label="Father's Occupation" value={d.fatherOcc} icon={Briefcase} />
					<DetailItem label="Father's Email" value={d.fatherEmail} icon={Mail} />
					<div className="sm:col-span-2">
						<DetailItem label="Annual Family Income" value={d.income} icon={DollarSign} />
					</div>
				</InfoCard>

				{/* Other Details */}
				<InfoCard title="Emergency & Health" icon={AlertCircle}>
					<DetailItem label="Emergency Contact" value={d.emergencyName} icon={User} />
					<DetailItem label="Emergency Phone" value={d.emergencyPhone} icon={Phone} />
					<div className="sm:col-span-2">
						<DetailItem label="Medical Conditions" value={d.medical} icon={AlertCircle} />
					</div>
					{d.remarks && (
						<div className="sm:col-span-2">
							<DetailItem label="Remarks" value={d.remarks} />
						</div>
					)}
				</InfoCard>
			</div>
			
			<div className="text-center pb-8 pt-4">
				<p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
					Computer Generated Application · Ahlussuffa Admission Portal
				</p>
			</div>
		</div>
	);
};

export default ApplicationResponsiveView;
