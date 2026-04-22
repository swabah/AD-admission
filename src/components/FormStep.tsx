import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FormStepProps {
	step: number;
	currentStep: number;
	label: string;
	onClick: (step: number) => void;
}

export function FormStep({ step, currentStep, label, onClick }: FormStepProps) {
	const isActive = currentStep === step;
	const isDone = currentStep > step;
	const isPending = currentStep < step;

	return (
		<Button
			type="button"
			variant="ghost"
			onClick={() => onClick(step)}
			disabled={isPending}
			className={cn(
				"flex flex-col items-center gap-2 h-auto p-2",
				isPending && "opacity-50 cursor-not-allowed"
			)}
		>
			<div
				className={cn(
					"flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
					isActive && "border-navy bg-navy text-white shadow-lg",
					isDone && "border-green-500 bg-green-500 text-white",
					isPending && "border-gray-300 bg-white text-gray-400"
				)}
			>
				{isDone ? (
					<Check className="h-5 w-5" />
				) : (
					step
				)}
			</div>
			<span
				className={cn(
					"text-xs font-medium",
					isActive && "text-navy font-semibold",
					isDone && "text-green-600",
					isPending && "text-gray-400"
				)}
			>
				{label}
			</span>
		</Button>
	);
}

export default FormStep;
