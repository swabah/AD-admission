import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Printer } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import ApplicationPrintDocument, { type RawApplicationData } from "./ApplicationPrintDocument";

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
			<Card className="border-emerald-100 bg-emerald-50/10">
				<CardContent className="pt-12 pb-12 flex flex-col items-center text-center">
					<div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
						<CheckCircle2 className="w-8 h-8" />
					</div>
					<h2 className="text-3xl font-bold mb-2">Congratulations, {studentName}!</h2>
					<p className="text-emerald-700/70 font-medium mb-6">Your application has been submitted successfully.</p>
					<p className="text-muted-foreground mb-8">
						Your application number is{" "}
						<span className="font-mono font-bold text-foreground">
							{appNo}
						</span>
					</p>
					<div className="flex gap-4">
						<Button onClick={() => navigate("/")} variant="outline">
							Back Home
						</Button>
						<Button
							onClick={onDownload}
							disabled={isDownloading}
							loading={isDownloading}
						>
							<Printer className="w-4 h-4 mr-2" /> Download PDF
						</Button>
					</div>
				</CardContent>
			</Card>
			<div className="mt-8">
				<ApplicationPrintDocument app={printData} />
			</div>
		</div>
	);
};

export default AdmissionSuccess;
