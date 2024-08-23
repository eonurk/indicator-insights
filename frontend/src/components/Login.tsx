import { useState } from "react";
import { auth } from "@/firebase";
import {
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
} from "firebase/auth";

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";

import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(auth, email, password);
			navigate("/"); // Redirect to the dashboard after login
		} catch (error: any) {
			setError(error.message);
		}
	};

	const handleGoogleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
			navigate("/");
		} catch (error: any) {
			setError(error.message);
		}
	};

	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Login</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleLogin} className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
							<Link to="#" className="ml-auto inline-block text-sm underline">
								Forgot your password?
							</Link>
						</div>
						<Input
							id="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					{error && <p className="text-red-500">{error}</p>}{" "}
					{/* Show error message */}
					<Button type="submit" className="w-full">
						Login
					</Button>
					<Button
						variant="outline"
						className="w-full"
						onClick={handleGoogleSignIn}
					>
						Login with Google
					</Button>
				</form>
				<div className="mt-4 text-center text-sm">
					Don&apos;t have an account?{" "}
					<Link to="/subscribe" className="underline">
						{" "}
						{/* Update this to your signup route */}
						Get Started Here.
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
