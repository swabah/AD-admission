import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FormStepProps {
	step: number;
	currentStep: number;
	label: string;
	onClick: (step: number) => void;
	isLast?: boolean;
}

export function FormStep({ step, currentStep, label, onClick, isLast = false }: FormStepProps) {
	const isActive = currentStep === step;
	const isDone = currentStep > step;
	const isPending = currentStep < step;

	return (
		<div className="flex items-center gap-2 flex-1">
			<Button
				type="button"
				variant="ghost"
				onClick={() => onClick(step)}
				disabled={isPending}
				className={cn(
					"flex flex-col items-center gap-2 h-auto p-3 relative group",
					isPending && "opacity-50 cursor-not-allowed"
				)}
			>
				{/* Progress line after step */}
				{!isLast && (
					<div
						className={cn(
							"absolute top-7 left-[calc(50%+20px)] w-full h-0.5 -z-10 transition-all duration-500",
							isDone && "bg-[#c8922a]",
							isActive && "bg-gradient-to-r from-[#c8922a] to-slate-200",
							isPending && "bg-slate-200"
						)}
					/>
				)}

				{/* Step circle */}
				<div
					className={cn(
						"relative flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 shadow-sm",
						isActive && "border-[#0a1628] bg-[#0a1628] text-white shadow-lg shadow-[#0a1628]/20 scale-110",
						isDone && "border-[#c8922a] bg-[#c8922a] text-white shadow-md",
						isPending && "border-slate-300 bg-white text-slate-400"
					)}
				>
					{isDone ? (
						<Check className="h-5 w-5 animate-in zoom-in duration-300" />
					) : (
						<span className="animate-in fade-in duration-300">{step}</span>
					)}

					{/* Animated ring for active step */}
					{isActive && (
						<span className="absolute inset-0 rounded-full border-2 border-[#c8922a] animate-ping opacity-20" />
					)}
				</div>

				{/* Label */}
				<span
					className={cn(
						"text-xs font-semibold tracking-wide transition-colors",
						isActive && "text-[#0a1628]",
						isDone && "text-[#c8922a]",
						isPending && "text-slate-400"
					)}
				>
					{label}
				</span>

				{/* Active indicator arrow */}
				{isActive && (
					<ChevronRight className="absolute -right-1 top-1/2 -translate-y-1/2 h-4 w-4 text-[#c8922a] animate-bounce" />
				)}
			</Button>
		</div>
	);
}

export default FormStep;
