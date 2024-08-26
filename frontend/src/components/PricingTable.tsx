import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";

const PricingTable: React.FC = () => {
	useEffect(() => {
		// Create a script element
		const script = document.createElement("script");
		script.src = "https://js.stripe.com/v3/pricing-table.js";
		script.async = true;

		// Append the script to the document body
		document.body.appendChild(script);

		// Cleanup the script when the component unmounts
		return () => {
			document.body.removeChild(script);
		};
	}, []);

	return (
		<div>
			<Card>
				<stripe-pricing-table
					pricing-table-id="prctbl_1PrzWV05acc8x5qb3qymRxun"
					publishable-key="pk_live_51Pqesh05acc8x5qbvuGdHGMryklOCrziyyNFk8MtHVj7VRFDmoy67vUBP8fEEPxYDw655DWARocCpQxwL9vDDy8Z00gx4D3kTB"
				></stripe-pricing-table>
			</Card>
		</div>
	);
};

export default PricingTable;
