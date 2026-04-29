import React from "react";
import ApplicationPrintDocument from "./ApplicationPrintDocument";
import type { ApplicationData } from "../services/supabase";

interface BulkApplicationPrintDocumentProps {
	applications: ApplicationData[];
	showStatus?: boolean;
}

const BulkApplicationPrintDocument: React.FC<BulkApplicationPrintDocumentProps> = ({
	applications,
	showStatus = true,
}) => {
	return (
		<div id="bulkPrintArea" className="bulk-print-container">
			{applications.map((app, index) => (
				<div 
					key={app.id || index} 
					className="print-page-wrapper"
				>
					<ApplicationPrintDocument app={app} showStatus={showStatus} />
				</div>
			))}
			
			<style>{`
				@media print {
					.bulk-print-wrapper {
						position: static !important;
						display: block !important;
						opacity: 1 !important;
						visibility: visible !important;
						width: 210mm !important;
						height: auto !important;
						margin: 0 !important;
						padding: 0 !important;
					}

					.bulk-print-container {
						display: block !important;
						width: 210mm !important;
						margin: 0 !important;
						padding: 0 !important;
					}

					.print-page-wrapper {
						display: block !important;
						width: 210mm !important;
						height: 297mm !important;
						overflow: hidden !important;
						page-break-after: always !important;
						break-after: page !important;
						margin: 0 !important;
						padding: 0 !important;
						background: white !important;
					}
				}
			`}</style>
		</div>
	);
};

export default BulkApplicationPrintDocument;
