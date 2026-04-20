import { useState, useCallback } from "react";

export const useFormSteps = (totalSteps: number) => {
	const [currentStep, setCurrentStep] = useState(1);

	const nextStep = useCallback(() => {
		setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [totalSteps]);

	const prevStep = useCallback(() => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const goToStep = useCallback(
		(step: number) => {
			if (step <= currentStep) {
				setCurrentStep(step);
			}
		},
		[currentStep],
	);

	return {
		currentStep,
		nextStep,
		prevStep,
		goToStep,
		isFirst: currentStep === 1,
		isLast: currentStep === totalSteps,
	};
};
