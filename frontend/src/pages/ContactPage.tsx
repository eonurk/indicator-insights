import React, { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ContactPage: React.FC = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const url = new URL(
			"https://script.google.com/macros/s/AKfycbyPaLEcdvfjZl6b98vRay0cdYcbOSTCpEpdua_S20HMtllaSOEEd9aFK1Rpy78lFsZb/exec"
		);
		url.searchParams.append("name", name);
		url.searchParams.append("email", email);
		url.searchParams.append("message", message);

		try {
			const response = await fetch(url.toString(), {
				method: "GET",
			});

			if (response.ok) {
				toast({
					title: "Success",
					description: "Message sent successfully!",
				});
				setName("");
				setEmail("");
				setMessage("");
			} else {
				toast({
					title: "Error",
					description: "Failed to send message. Please try again.",
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to send message. Please try again.",
				variant: "destructive",
			});
		}
	};

	return (
		<>
			<SiteHeader />
			<div className="container mx-auto px-0 py-8">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label htmlFor="name" className="block mb-2">
										Name
									</label>
									<Input
										id="name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
									/>
								</div>
								<div>
									<label htmlFor="email" className="block mb-2">
										Email
									</label>
									<Input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>
								<div>
									<label htmlFor="message" className="block mb-2">
										Message
									</label>
									<Textarea
										id="message"
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										required
									/>
								</div>
								<Button type="submit">Send Message</Button>
							</form>
						</CardContent>
					</CardHeader>
				</Card>
			</div>
			<SiteFooter />
		</>
	);
};

export default ContactPage;
