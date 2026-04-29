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
					style={{ 
						pageBreakAfter: index === applications.length - 1 ? "auto" : "always",
						marginBottom: index === applications.length - 1 ? 0 : "20mm" 
					}}
					className="print-page-wrapper"
				>
					<ApplicationPrintDocument app={app} showStatus={showStatus} />
				</div>
			))}
			
			<style>{`
				@media print {
					.bulk-print-container {
						padding: 0 !important;
						margin: 0 !important;
					}
					.print-page-wrapper {
						page-break-after: always !important;
						break-after: page !important;
						margin-bottom: 0 !important;
						padding: 0 !important;
					}
				}
			`}</style>
		</div>
	);
};

export default BulkApplicationPrintDocument;
