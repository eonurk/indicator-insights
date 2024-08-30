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
					<div className="mt-4 flex justify-center">
						<a
							href="https://www.producthunt.com/posts/indicator-insights?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-indicator&#0045;insights"
							target="_blank"
						>
							<img
								src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=485019&theme=light"
								alt="Indicator&#0032;Insights - Buy&#0044;&#0032;Sell&#0044;&#0032;Why&#0063;&#0032;Know&#0032;what&#0032;you&#0039;re&#0032;doing&#0046; | Product Hunt"
								style={{ width: "230px", height: "50px" }}
								width="230"
								height="30"
							/>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};
export default HeroSection;
