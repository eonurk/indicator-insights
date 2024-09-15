import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useAnimation, useInView } from "framer-motion";

const customerFeedback = [
	{
		name: "Sarah T.",
		role: "Day Trader",
		quote:
			"Indicator Insights' real-time alerts on unusual options activity have been a game-changer. My trading performance has improved significantly, and I'm catching opportunities I used to miss.",
	},
	{
		name: "John D.",
		role: "Small Business Owner",
		quote:
			"The economic indicators dashboard helps me anticipate market trends. I've adjusted my inventory strategy based on these insights, which has noticeably reduced costs and improved our cash flow.",
	},
	{
		name: "Emily W.",
		role: "Hedge Fund Analyst",
		quote:
			"The custom screeners and backtesting tools are impressive. We've developed strategies that consistently outperform our benchmarks. Indicator Insights has become an essential part of our research process.",
	},
];

const TestimonialCard = ({
	testimonial,
	index,
}: {
	testimonial: { name: string; role: string; quote: string };
	index: number;
}) => (
	<motion.div
		initial={{ opacity: 0, y: 50 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, delay: index * 0.1 }}
		whileHover={{ scale: 1.05 }}
		className="h-full"
	>
		<Card className="p-6 flex flex-col justify-between h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
			<CardContent className="flex flex-col flex-grow p-6">
				<div className="flex-grow">
					<p className="text-md text-gray-700 dark:text-gray-200 italic mb-6 text-left">
						{testimonial.quote}
					</p>
				</div>
				<div className="mt-6">
					<p className="text-sm font-bold text-gray-900 dark:text-white text-left">
						{testimonial.name}
					</p>
					<p className="text-xs text-gray-600 dark:text-gray-400 text-left">
						{testimonial.role}
					</p>
				</div>
			</CardContent>
		</Card>
	</motion.div>
);

export default function CustomerTestimonials() {
	const controls = useAnimation();
	const ref = useRef(null);
	const inView = useInView(ref, { once: true });

	useEffect(() => {
		if (inView) {
			controls.start("visible");
		}
	}, [controls, inView]);

	return (
		<section ref={ref} className="w-full py-8">
			<div className="mx-auto max-w-[95%] lg:max-w-6xl">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{customerFeedback.map((testimonial, index) => (
						<TestimonialCard
							key={index}
							testimonial={testimonial}
							index={index}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
