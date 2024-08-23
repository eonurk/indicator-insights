import { Link } from "react-router-dom";
import { Signup } from "@/components/Signup"; // Assuming this is a form component you'll create
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";

export function SignupPage() {
	return (
		<>
			<SiteHeader />

			<Card>
				<div className="container grid relative min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
					<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
						<div className="absolute inset-0 bg-zinc-900" />
						<div className="relative z-20 flex items-center text-lg font-medium"></div>
						<div className="relative z-20 mt-auto">
							<blockquote className="space-y-2">
								<p className="text-lg">Welcome to Indicator Insights Pro</p>
								{/* <footer className="text-sm">Albert Einstein</footer> */}
							</blockquote>
						</div>
					</div>
					<div className="lg:p-8">
						<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
							<CardHeader>
								<div className="flex flex-col space-y-2 text-center">
									<h1 className="text-2xl font-semibold tracking-tight">
										Create an account
									</h1>
									<p className="text-sm text-muted-foreground">
										Enter your email below to create your account
									</p>
								</div>
							</CardHeader>
							<CardContent>
								<Signup />
							</CardContent>
							<p className="px-8 text-center text-sm text-muted-foreground">
								By clicking continue, you agree to our{" "}
								<Link
									to="/terms"
									className="underline underline-offset-4 hover:text-primary"
								>
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link
									to="/privacy"
									className="underline underline-offset-4 hover:text-primary"
								>
									Privacy Policy
								</Link>
								.
							</p>
						</div>
					</div>
				</div>
			</Card>
		</>
	);
}

export default SignupPage;
