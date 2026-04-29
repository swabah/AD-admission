export const downloadApplicationPDF = async (
	appNo: string | undefined = "Form",
	studentName: string | undefined = "",
) => {
	const element = document.getElementById("printArea");
	if (!element) return;

	const html2pdf = (await import("html2pdf.js")).default;

	const safeName = studentName
		? studentName.replace(/[^a-zA-Z0-9]/g, "_")
		: "Student";
	const safeAppNo = appNo || "Form";

	// ── Save ALL styles we'll touch ────────────────────────────────────────
	const saved = {
		transform:       element.style.transform,
		transformOrigin: element.style.transformOrigin,
		marginBottom:    element.style.marginBottom,
		boxShadow:       element.style.boxShadow,
		overflow:        element.style.overflow,
		width:           element.style.width,
		height:          element.style.height,
	};

	const parent = element.parentElement as HTMLElement | null;
	const savedParent = parent
		? {
				overflow:  parent.style.overflow,
				minHeight: parent.style.minHeight,
				height:    parent.style.height,
				display:   parent.style.display,
		  }
		: null;

	try {
		// ── Strip everything that can confuse html2canvas ──────────────────
		element.style.transform       = "none";
		element.style.transformOrigin = "top left";
		element.style.marginBottom    = "0";
		element.style.boxShadow       = "none";
		element.style.overflow        = "visible";
		// Lock to exact A4 pixel dimensions at 96 dpi
		element.style.width           = "793px";   // 210 mm
		element.style.height          = "1122px";  // 297 mm

		if (parent && savedParent) {
			parent.style.overflow  = "visible";
			parent.style.minHeight = "0";
			parent.style.height    = "auto";
			parent.style.display   = "block";
		}

		// ── Wait for TWO animation frames so the browser repaints ──────────
		await new Promise<void>((res) =>
			requestAnimationFrame(() => requestAnimationFrame(() => res())),
		);

		const opt: object = {
			margin: 0,
			filename: `${safeName}_${safeAppNo}.pdf`,
			image:      { type: "jpeg", quality: 0.98 },
			html2canvas: {
				scale:           2,
				useCORS:         true,
				logging:         false,
				allowTaint:      true,
				backgroundColor: "#ffffff",
				width:           793,
				height:          1122,
				windowWidth:     793,
			},
			jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
		};

		await html2pdf().from(element).set(opt).save();
	} finally {
		// ── Always restore — even if pdf generation threw ──────────────────
		element.style.transform       = saved.transform;
		element.style.transformOrigin = saved.transformOrigin;
		element.style.marginBottom    = saved.marginBottom;
		element.style.boxShadow       = saved.boxShadow;
		element.style.overflow        = saved.overflow;
		element.style.width           = saved.width;
		element.style.height          = saved.height;

		if (parent && savedParent) {
			parent.style.overflow  = savedParent.overflow;
			parent.style.minHeight = savedParent.minHeight;
			parent.style.height    = savedParent.height;
			parent.style.display   = savedParent.display;
		}
	}
};
