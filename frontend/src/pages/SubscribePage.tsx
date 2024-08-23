import { SiteFooter } from "@/components/Footer";
import PricingTable from "@/components/PricingTable";
import { SiteHeader } from "@/components/site-header";

export function SubscribePage() {
	return (
		<>
			<SiteHeader />
			<div className="h-[40rem] flex justify-center items-center px-4">
				<div className="text-2xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
					<PricingTable />
				</div>
			</div>
			<SiteFooter />
		</>
	);
}

export default SubscribePage;
