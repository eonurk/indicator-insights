import { SiteFooter } from "@/components/Footer";
import PricingTable from "@/components/PricingTable";
import { SiteHeader } from "@/components/site-header";
import { motion } from "framer-motion";

export function SubscribePage() {
	return (
		<>
			<SiteHeader />
			<motion.section
				className="pt-20 text-center"
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.7 }}
			>
				<motion.h2
					className="text-4xl md:text-4xl font-semibold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-6"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					Unlock the Full Potential of Market Analysis
				</motion.h2>
				<motion.p
					className="text-xl text-muted-foreground mb-8"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					Discover the power of advanced market analysis with our comprehensive
					suite of tools. Join us today and take your trading to the next level.
				</motion.p>

				<motion.div
					className="flex justify-center pb-10"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.8 }}
				>
					<PricingTable />
				</motion.div>
			</motion.section>
			<SiteFooter />
		</>
	);
}

export default SubscribePage;
