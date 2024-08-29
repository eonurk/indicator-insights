import React from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage: React.FC = () => {
	const faqs = [
		{
			question: "What is Indicator Insights?",
			answer:
				"Indicator Insights is a platform designed to provide advanced financial analysis tools and insights for individual investors and traders.",
		},
		{
			question: "How do I get started?",
			answer:
				"To get started, simply sign up for an account on our website. Once registered, you can explore our various tools and features.",
		},
		{
			question: "What types of indicators does Indicator Insights offer?",
			answer:
				"We offer a wide range of technical and fundamental indicators, including moving averages, RSI, MACD, and P/E ratios.",
		},
		{
			question: "Is Indicator Insights suitable for beginners?",
			answer:
				"Yes, our platform caters to both beginners and experienced traders. We provide educational resources and tooltips to help newcomers understand and use our tools effectively.",
		},
		{
			question: "How often is the data updated?",
			answer:
				"Our data is updated regularly throughout the trading day, ensuring you have current information for your analysis.",
		},
		{
			question: "Can I customize the indicators?",
			answer:
				"Absolutely! Most of our indicators allow for customization, including adjusting time periods, thresholds, and other parameters to suit your trading strategy.",
		},
		{
			question: "What kind of customer support do you offer?",
			answer:
				"We provide customer support via email. Our team aims to respond to all inquiries within 24 hours.",
		},
		{
			question: "Are there any subscription plans available?",
			answer:
				"Yes, we offer different subscription tiers to suit various needs and budgets. You can find more information about our pricing on our website.",
		},
	];
	return (
		<>
			<SiteHeader />
			<div className="container mx-auto px-0 py-8">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-bold">
							Frequently Asked Questions
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Accordion type="single" collapsible className="w-full">
							{faqs.map((faq, index) => (
								<AccordionItem key={index} value={`item-${index}`}>
									<AccordionTrigger className="text-left">
										{faq.question}
									</AccordionTrigger>
									<AccordionContent className="text-left">
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</CardContent>
				</Card>
			</div>
			<SiteFooter />
		</>
	);
};

export default FAQPage;
