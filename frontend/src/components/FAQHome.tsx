import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const FAQHome = () => {
	return (
		<section className="pt-20 pb-10 bg-background">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-10 text-foreground">
					Frequently Asked Questions
				</h2>
				<Accordion type="single" collapsible className="max-w-2xl mx-auto">
					<AccordionItem value="item-1">
						<AccordionTrigger className="text-left">
							What indicators are available?
						</AccordionTrigger>
						<AccordionContent className="text-left">
							We offer a range of popular indicators including RMI, RSI, EMA,
							MACD, and Bollinger Bands. We are constantly adding new
							indicators.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger className="text-left">
							How often is the data updated?
						</AccordionTrigger>
						<AccordionContent className="text-left">
							Our data is updated in real-time during market hours, ensuring you
							always have the latest information for your analysis.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-3">
						<AccordionTrigger className="text-left">
							What stock exchanges are supported?
						</AccordionTrigger>
						<AccordionContent className="text-left">
							Currently, we support major US stock exchanges NASDAQ, S&P 100 and
							BIST. We're working on expanding our coverage to include other
							international markets in the future.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-4">
						<AccordionTrigger className="text-left">
							Is there a free trial?
						</AccordionTrigger>
						<AccordionContent className="text-left">
							Yes! We offer a 7-day free trial. You can cancel anytime. After
							the trial, you can choose to subscribe to our service for €99.99
							per month.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</section>
	);
};

export default FAQHome;
