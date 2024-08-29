import React from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFoundPage: React.FC = () => {
	return (
		<>
			<SiteHeader />
			<div className="container mx-auto px-4 py-16 text-center">
				<h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
				<p className="text-xl mb-8">
					Oops! The page you're looking for doesn't exist.
				</p>
				<Link to="/">
					<Button>Go Back Home</Button>
				</Link>
			</div>
			<SiteFooter />
		</>
	);
};

export default NotFoundPage;
