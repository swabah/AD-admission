interface FormStepProps {
	step: number;
	currentStep: number;
	label: string;
	onClick: (step: number) => void;
}

const FormStep = ({ step, currentStep, label, onClick }: FormStepProps) => {
	const isActive = currentStep === step;
	const isDone = currentStep > step;

	const getDotClass = () => {
		if (isActive) return "step-dot active";
		if (isDone) return "step-dot done";
		return "step-dot";
	};

	return (
		<button
			type="button"
			onClick={() => onClick(step)}
			disabled={!isDone && !isActive}
			className="form-step-button"
		>
			<div className={getDotClass()}>{step}</div>
			<span className="form-step-label">{label}</span>
		</button>
	);
};

export default FormStep;
