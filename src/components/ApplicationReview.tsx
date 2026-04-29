import React from "react";
import { CheckCircle2 } from "lucide-react";
import { type UseFormRegister, type FieldErrors, type UseFormGetValues, type FieldValues, type Path } from "react-hook-form";

interface ApplicationReviewProps<T extends FieldValues> {
	register: UseFormRegister<T>;
	errors: FieldErrors<T>;
	getValues: UseFormGetValues<T>;
}

const SummaryItem = ({ label, value }: { label: string; value: string | undefined }) => (
	<div className="flex justify-between border-b border-slate-100 pb-2">
		<span className="text-slate-500 font-medium">{label}:</span>
		<span className="font-bold text-[#0a1628]">{value || "—"}</span>
	</div>
);

const ApplicationReview = <T extends FieldValues>({
	register,
	errors,
	getValues,
}: ApplicationReviewProps<T>) => {
	const values = getValues();

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="bg-slate-50/50 rounded-3xl p-6 sm:p-8 border border-slate-100">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
						<CheckCircle2 className="w-6 h-6" />
					</div>
					<div>
						<h3 className="font-display font-bold text-xl text-[#0a1628]">Review Summary</h3>
						<p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Double check your details</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
					<div className="space-y-4">
						<SummaryItem label="Full Name" value={`${values.firstName || ""} ${values.lastName || ""}`} />
						<SummaryItem label="Date of Birth" value={values.dob} />
						<SummaryItem label="Applied Class" value={values.applyClass} />
						<SummaryItem label="Academic Year" value={values.academicYear} />
					</div>
					<div className="space-y-4">
						<SummaryItem label="Father&apos;s Name" value={values.fatherName} />
						<SummaryItem label="Contact Number" value={values.fatherPhone} />
						<SummaryItem label="Stream" value={values.stream} />
						<SummaryItem label="Blood Group" value={values.bloodGroup} />
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<label className="flex items-start gap-4 cursor-pointer p-5 bg-white rounded-2xl border border-slate-200 hover:border-[#0a1628] transition-all group">
					<div className="mt-1">
						<input
							type="checkbox"
							{...register("agreeCheck" as Path<T>)}
							className="h-5 w-5 rounded border-slate-300 text-[#0a1628] focus:ring-[#0a1628] cursor-pointer"
						/>
					</div>
					<span className="text-sm leading-relaxed text-slate-600 font-medium group-hover:text-[#0a1628] transition-colors">
						I hereby declare that the information provided is true to the best of my knowledge. 
						I understand that any false information may lead to rejection of this application and 
						I agree to abide by the rules and regulations of the institution.
					</span>
				</label>
				{errors.agreeCheck && (
					<p className="text-xs text-rose-500 font-bold ml-1 animate-in fade-in slide-in-from-left-2">
						{errors.agreeCheck?.message as string}
					</p>
				)}
			</div>
		</div>
	);
};

export default ApplicationReview;
