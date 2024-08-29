import React from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicyPage: React.FC = () => {
	return (
		<>
			<SiteHeader />
			<div className="container mx-auto px-4 py-8 md:max-w-3xl">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p>Last updated: 2024-07-15</p>
						<h2 className="text-xl font-semibold">1. Introduction</h2>
						<p>
							This Privacy Policy describes how Indicator Insights ("we", "our",
							or "us") collects, uses, and shares your personal information when
							you use our website and services.
						</p>
						<h2 className="text-xl font-semibold">2. Information We Collect</h2>
						<p>
							We collect information you provide directly to us, such as when
							you create an account, subscribe to our service, or contact us for
							support.
						</p>
						<h2 className="text-xl font-semibold">
							3. How We Use Your Information
						</h2>
						<p>
							We use the information we collect to provide, maintain, and
							improve our services, to communicate with you, and to comply with
							legal obligations.
						</p>
						<h2 className="text-xl font-semibold">
							4. Information Sharing and Disclosure
						</h2>
						<p>
							We may share your information with third-party service providers,
							as required by law, or in connection with a merger, acquisition,
							or sale of assets.
						</p>
						<h2 className="text-xl font-semibold">5. Data Security</h2>
						<p>
							We implement appropriate technical and organizational measures to
							protect your personal information against unauthorized access,
							alteration, disclosure, or destruction.
						</p>
						<h2 className="text-xl font-semibold">
							6. Your Rights and Choices
						</h2>
						<p>
							You have the right to access, correct, or delete your personal
							information. You may also have the right to object to or restrict
							certain processing of your data.
						</p>
						<h2 className="text-xl font-semibold">
							7. Changes to This Privacy Policy
						</h2>
						<p>
							We may update this Privacy Policy from time to time. We will
							notify you of any changes by posting the new Privacy Policy on
							this page.
						</p>
						<h2 className="text-xl font-semibold">8. Contact Us</h2>
						<p>
							If you have any questions about this Privacy Policy, please
							contact us at help.indicatorinsights@gmail.com.
						</p>
					</CardContent>
				</Card>
			</div>
			<SiteFooter />
		</>
	);
};

export default PrivacyPolicyPage;
