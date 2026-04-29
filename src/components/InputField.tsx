import { AlertTriangle } from "lucide-react";
import type { ChangeEvent } from "react";

interface InputFieldOption {
	value: string;
	label: string;
}

interface InputFieldProps {
	label: string;
	id: string;
	type?: "text" | "textarea" | "select" | "email" | "tel" | "date" | "number" | "password";
	placeholder?: string;
	required?: boolean;
	className?: string;
	maxLength?: number;
	options?: (string | InputFieldOption)[];
	formData: Record<string, any>;
	handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
	errors: Record<string, string | null>;
}

export const InputField = ({
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
}: InputFieldProps) => {
	const error = errors[id];
	const value = formData[id] ?? "";

	const inputClasses = `w-full px-4 py-3 bg-slate-50 border ${error ? "border-rose-300 ring-1 ring-rose-100 bg-rose-50/30" : "border-slate-200 focus:border-[#0a1628] focus:ring-1 focus:ring-[#0a1628]"} rounded-xl outline-none transition-all text-[15px]`;

	return (
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
					value={value}
					onChange={handleInputChange}
					className={`${inputClasses} min-h-[100px] resize-y`}
				/>
			) : type === "select" ? (
				<select
					id={id}
					value={value}
					onChange={handleInputChange}
					className={`${inputClasses} appearance-none cursor-pointer`}
				>
					{placeholder && <option value="">{placeholder}</option>}
					{options?.map((opt) => {
						const optValue = typeof opt === "string" ? opt : opt.value;
						const optLabel = typeof opt === "string" ? opt : opt.label;
						return (
							<option key={optValue} value={optValue}>
								{optLabel}
							</option>
						);
					})}
				</select>
			) : (
				<input
					type={type}
					id={id}
					placeholder={placeholder}
					maxLength={maxLength}
					value={value}
					onChange={handleInputChange}
					className={inputClasses}
				/>
			)}
			{error && (
				<div className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-0.5">
					<AlertTriangle className="w-3 h-3" /> {error}
				</div>
			)}
		</div>
	);
};

export default InputField;
