export const downloadApplicationPDF = async (
	appNo: string | undefined = "Form",
	studentName: string | undefined = "",
) => {
	const element = document.getElementById("printArea");
	if (!element) return;

	const html2pdf = (await import("html2pdf.js")).default;

	const originalTransform = element.style.transform;
	element.style.transform = "none";

	const safeName = studentName
		? studentName.replace(/[^a-zA-Z0-9]/g, "_")
		: "Student";
	const safeAppNo = appNo || "Form";

	const opt: any = {
		margin: 0,
		filename: `${safeName}_${safeAppNo}.pdf`,
		image: { type: "jpeg", quality: 0.98 },
		html2canvas: { scale: 2, useCORS: true },
		jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
	};

	return html2pdf()
		.from(element)
		.set(opt)
		.save()
		.then(() => {
			element.style.transform = originalTransform;
		});
};
