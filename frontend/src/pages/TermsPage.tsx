import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const TermsAndConditions: React.FC = () => {
	return (
		<Card className="container">
			<CardHeader>
				<h1 className="text-2xl font-bold">Terms and Conditions</h1>
			</CardHeader>
			<CardContent>
				<div className="space-y-4 text-base">
					<h2 className="text-xl font-semibold">1. Introduction</h2>
					<p>
						1.1 These Terms and Conditions ("Terms") govern the use of the
						services and products provided by
						<strong> Indicator Insights</strong> ("the Company", "we", "our", or
						"us") through our software platform, website, mobile application, or
						any other digital platform (collectively referred to as the
						"Services").
					</p>
					<p>
						1.2 By accessing or using our Services, you ("User" or "you") agree
						to be bound by these Terms. If you do not agree with any part of
						these Terms, you must not use our Services.
					</p>
					<p>
						1.3 We reserve the right to modify these Terms at any time. Any
						changes will be effective immediately upon posting on our website.
						Your continued use of the Services after the posting of the revised
						Terms constitutes your acceptance of the changes.
					</p>

					<h2 className="text-xl font-semibold">2. Services Provided</h2>
					<p>
						2.1 Indicator Insights provides Software as a Service (SaaS) that
						delivers insights derived from various financial indicators,
						including market trends, economic data, and financial forecasts
						("Insights").
					</p>
					<p>
						2.2 Our SaaS platform is accessible via subscription and may include
						various features such as real-time data analysis, customizable
						dashboards, and automated reporting tools. The specific features and
						scope of the Services are described on our website or in a separate
						agreement with you.
					</p>
					<p>
						2.3 Our Insights are provided for informational purposes only and do
						not constitute financial advice. Users should seek independent
						financial advice before making any investment decisions based on the
						Insights provided by our platform.
					</p>
					<p>
						2.4 We reserve the right to modify, suspend, or discontinue any part
						of our Services at any time with or without notice. We will endeavor
						to provide notice of any significant changes that may affect your
						use of the Services.
					</p>

					<h2 className="text-xl font-semibold">3. User Responsibilities</h2>
					<p>
						3.1 You agree to use our Services only for lawful purposes and in
						compliance with all applicable laws and regulations.
					</p>
					<p>
						3.2 You are responsible for maintaining the confidentiality of your
						account information, including passwords, and for all activities
						that occur under your account.
					</p>
					<p>
						3.3 You agree to provide accurate, current, and complete information
						when creating an account or using our Services. You must update such
						information as necessary to keep it accurate and complete.
					</p>
					<p>
						3.4 You acknowledge that the financial Insights provided by the
						Company are based on data from third-party sources. The Company does
						not guarantee the accuracy, completeness, or timeliness of such
						data.
					</p>

					<h2 className="text-xl font-semibold">4. Intellectual Property</h2>
					<p>
						4.1 All content, trademarks, and other intellectual property
						associated with the Services, including but not limited to text,
						graphics, logos, icons, software, and the financial Insights
						provided, are owned by or licensed to Indicator Insights and are
						protected by Dutch and international copyright and trademark laws.
					</p>
					<p>
						4.2 You may not reproduce, distribute, display, or otherwise use any
						of the intellectual property, including the Insights, without our
						prior written permission, except as expressly permitted under these
						Terms.
					</p>

					<h2 className="text-xl font-semibold">5. Fees and Payment</h2>
					<p>
						5.1 The fees for using our Services are as stated on our website or
						in a separate agreement with you. All fees are in [specify currency]
						and are exclusive of VAT unless otherwise stated.
					</p>
					<p>
						5.2 Payment must be made using the methods specified on our website.
						Failure to pay any fees may result in suspension or termination of
						your access to the Services.
					</p>
					<p>
						5.3 All payments are non-refundable unless otherwise specified. If
						you believe a payment has been made in error, please contact us
						within [number] days of the transaction.
					</p>

					<h2 className="text-xl font-semibold">6. Limitation of Liability</h2>
					<p>
						6.1 The Insights provided by Indicator Insights are based on
						analysis of financial indicators and are intended to be used as
						informational tools. We do not guarantee any specific results or
						outcomes from the use of our Services.
					</p>
					<p>
						6.2 To the fullest extent permitted by law, Indicator Insights shall
						not be liable for any direct, indirect, incidental, consequential,
						or special damages arising out of or in connection with the use of
						our Services or the reliance on any financial Insights provided.
					</p>
					<p>
						6.3 You acknowledge that financial markets are inherently volatile
						and that past performance is not indicative of future results.
					</p>

					<h2 className="text-xl font-semibold">
						7. Privacy and Data Protection
					</h2>
					<p>
						7.1 Your privacy is important to us. Please refer to our Privacy
						Policy for information on how we collect, use, and protect your
						personal data.
					</p>
					<p>
						7.2 By using our Services, you consent to the processing of your
						personal data in accordance with our Privacy Policy.
					</p>

					<h2 className="text-xl font-semibold">
						8. Governing Law and Jurisdiction
					</h2>
					<p>
						8.1 These Terms shall be governed by and construed in accordance
						with the laws of the Netherlands, without regard to its conflict of
						law provisions.
					</p>
					<p>
						8.2 Any disputes arising out of or in connection with these Terms or
						the use of our Services shall be subject to the exclusive
						jurisdiction of the courts of the Netherlands.
					</p>

					<h2 className="text-xl font-semibold">9. Contact Information</h2>
					<p>
						9.1 If you have any questions about these Terms or the Services
						provided by Indicator Insights, please contact us at:
					</p>
					<p>
						<strong>Indicator Insights</strong>
						<br />
						help.indicatorinsights@gmail.com
					</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default TermsAndConditions;
