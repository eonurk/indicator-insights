import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const HeroSection = () => {
	const handleScroll = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<section className="py-40 bg-background">
			<div className="container mx-auto px-4">
				<div className="max-w-3xl mx-auto text-center">
					<h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
						Smart Investing with Indicator Insights
					</h1>
					<p className="text-xl mb-8 text-muted-foreground">
						Empower your investment decisions with real-time stock analysis,
						advanced indicators, and market-wide visualizations.
					</p>

					<div className="flex justify-center space-x-4">
						<Button asChild>
							<Link to="/subscribe">Get Started</Link>
						</Button>
						<Button
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
