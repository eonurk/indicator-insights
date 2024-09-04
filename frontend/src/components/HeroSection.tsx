import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
	const handleScroll = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	const featureItems = [
		{
			icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
			text: "Real-time stock analysis",
			color: "text-green-500",
		},
		{
			icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
			text: "Advanced indicators",
			color: "text-blue-500",
		},
		{
			icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
			text: "Market-wide visuals",
			color: "text-purple-500",
		},
	];

	return (
		<section className="py-20 sm:py-32 md:py-40 bg-background">
			<div className="container mx-auto px-4">
				<div className="max-w-3xl mx-auto text-center">
					<h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground relative">
						<span className="text-green-400 inline-block">Buy,</span>{" "}
						<span className="text-teal-500 inline-block">Sell,</span>{" "}
						<span className="text-blue-500 inline-block">Why?</span> <br />
						<span className="text-foreground">Know what you are doing.</span>
					</h1>
					<div className="text-lg md:text-xl mb-8 text-muted-foreground">
						{featureItems.map((item, index) => (
							<motion.span
								key={index}
								className="flex items-center justify-center mb-2"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.3 }}
							>
								<svg
									className={`w-5 h-5 md:w-6 md:h-6 mr-2 ${item.color}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d={item.icon}
									/>
								</svg>
								<span aria-label={item.text}>{item.text}</span>
							</motion.span>
						))}
					</div>

					<div className="flex justify-center space-x-4 transition-all duration-300 ">
						<Button
							asChild
							className="py-6 px-8 hover:shadow-lg hover:scale-105 transition-all duration-300"
						>
							<Link to="/subscribe">Get Started</Link>
						</Button>
						<Button
							className="py-6 px-8 hover:shadow-lg hover:scale-105 transition-all duration-300"
							variant="outline"
							onClick={() => handleScroll("notification-board")}
						>
							Learn More
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
