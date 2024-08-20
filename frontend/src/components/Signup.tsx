import { useState } from "react";
import { auth } from "@/firebase";
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";

export function Signup() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSignUp = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		setError("");

		try {
			await createUserWithEmailAndPassword(auth, email, password);
			alert("Sign up successful! You can now log in.");
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
			alert("Google sign-in successful!");
		} catch (error: any) {
			setError(error.message);
		}
	};

	return (
		<div>
			<form onSubmit={handleSignUp} className="space-y-4 mt-8">
				<div>
					<Label htmlFor="signup-email">Email</Label>
					<Input
						id="signup-email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full p-2 border"
					/>
				</div>
				<div>
					<Label htmlFor="signup-password">Password</Label>
					<Input
						id="signup-password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="w-full p-2 border"
					/>
				</div>
				<Button className="w-full" type="submit" disabled={loading}>
					{loading ? "Loading..." : "Sign Up"}
				</Button>
			</form>
			<div className="relative mt-4 mb-4">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t"></span>
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">Or</span>
				</div>
			</div>
			<Button
				className="w-full text-slate-400 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 "
				type="button"
				onClick={handleGoogleSignIn}
			>
				<span>
					<Icons.google className="h-4 w-4 mr-2" />
				</span>{" "}
				<span>Sign in with Google</span>
			</Button>
			<div className="text-sm">
				{error && <p className="text-red-500 mt-4">{error}</p>}
			</div>
		</div>
	);
}

export default Signup;
