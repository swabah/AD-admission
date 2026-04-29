import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Printer } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import ApplicationPrintDocument, { type RawApplicationData } from "./ApplicationPrintDocument";
import ApplicationResponsiveView from "./ApplicationResponsiveView";

interface AdmissionSuccessProps {
	appNo: string;
	studentName: string;
	onDownload: () => void | Promise<void>;
	printData: RawApplicationData;
	isDownloading?: boolean;
}

export const AdmissionSuccess = ({
	appNo,
	studentName,
	onDownload,
	printData,
	isDownloading = false,
}: AdmissionSuccessProps) => {
	const navigate = useNavigate();

	return (
		<div className="container mx-auto py-12 max-w-4xl px-4">
			<Card className="border-emerald-100 bg-emerald-50/10 mb-12">
				<CardContent className="pt-12 pb-12 flex flex-col items-center text-center">
					<div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
						<CheckCircle2 className="w-8 h-8" />
					</div>
					<h2 className="text-3xl font-bold mb-2 tracking-tight">Congratulations, {studentName}!</h2>
					<p className="text-emerald-700/70 font-medium mb-6">Your application has been submitted successfully.</p>
					<p className="text-muted-foreground mb-8">
						Your application number is{" "}
						<span className="font-mono font-bold text-foreground bg-emerald-100/50 px-2 py-1 rounded">
							{appNo}
						</span>
					</p>
					<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
						<Button onClick={() => navigate("/")} variant="outline" className="h-12 px-8 rounded-xl font-bold">
							Back Home
						</Button>
						<Button
							onClick={onDownload}
							disabled={isDownloading}
							loading={isDownloading}
							className="h-12 px-8 rounded-xl font-bold"
						>
							<Printer className="w-4 h-4 mr-2" /> Download PDF
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Desktop View: Print Document */}
			<div className="hidden md:block">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-bold text-[#0a1628] uppercase tracking-wider">Application Preview</h3>
					<p className="text-xs text-slate-400 font-medium italic">Exact print layout</p>
				</div>
				<ApplicationPrintDocument app={printData} />
			</div>

			{/* Mobile View: Responsive Detail Cards */}
			<div className="md:hidden">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-bold text-[#0a1628] uppercase tracking-wider">Application Details</h3>
					<Badge variant="outline" className="text-[10px] font-bold">Mobile View</Badge>
				</div>
				<ApplicationResponsiveView app={printData} />
			</div>
		</div>
	);
};

export default AdmissionSuccess;
