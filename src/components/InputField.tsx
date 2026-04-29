import { AlertTriangle } from "lucide-react";
import type { ChangeEvent } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

interface InputFieldOption {
	value: string;
	label: string;
}

interface InputFieldProps {
	label: string;
	id: string;
	type?:
		| "text"
		| "textarea"
		| "select"
		| "email"
		| "tel"
		| "date"
		| "number"
		| "password";
	placeholder?: string;
	required?: boolean;
	className?: string;
	maxLength?: number;
	options?: (string | InputFieldOption)[];
	formData: any;
	handleInputChange: (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
	) => void;
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
	const displayPlaceholder = placeholder || `Enter ${label.toLowerCase()}`;

	const baseClasses = "bg-slate-50 transition-all text-[15px] rounded-xl placeholder:text-slate-400";
	const errorClasses = error
		? "border-rose-300 ring-rose-100 bg-rose-50/30"
		: "border-slate-200 focus:border-[#0a1628] focus:ring-[#0a1628]";

	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<Label
				htmlFor={id}
				className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5"
			>
				{label} {required && <span className="text-rose-500">*</span>}
			</Label>

			{type === "textarea" ? (
				<textarea
					id={id}
					placeholder={displayPlaceholder}
					value={value}
					onChange={handleInputChange}
					className={cn(
						"flex min-h-[100px] w-full rounded-xl border border-input bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						baseClasses,
						errorClasses,
						"min-h-[100px] resize-y px-4 py-3",
					)}
				/>
			) : type === "select" ? (
				<div className="relative">
					<select
						id={id}
						value={value}
						onChange={handleInputChange}
						className={cn(
							"flex h-12 w-full items-center justify-between rounded-xl border border-input bg-slate-50 px-4 py-3 text-[15px] ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
							baseClasses,
							errorClasses,
						)}
					>
						{displayPlaceholder && <option value="">{displayPlaceholder}</option>}
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
					<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
						<svg
							aria-label="select"
							width="12"
							height="12"
							viewBox="0 0 12 12"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M2.5 4.5L6 8L9.5 4.5"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				</div>
			) : (
				<Input
					type={type}
					id={id}
					placeholder={displayPlaceholder}
					maxLength={maxLength}
					value={value}
					onChange={handleInputChange}
					className={cn("h-12 px-4", baseClasses, errorClasses)}
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
