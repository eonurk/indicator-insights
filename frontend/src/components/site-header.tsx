import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/nav-main";
import { MobileNav } from "@/components/nav-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardButton = () => (
	<Link to="/dashboard">
		<Button variant="ghost">Dashboard</Button>
	</Link>
);

export function SiteHeader() {
	const [user, setUser] = useState<User | null>(null);
	const auth = getAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
		});
		return () => unsubscribe();
	}, [auth]);

	const handleLogout = async () => {
		try {
			await signOut(auth);
			setUser(null); // Clear user state
			navigate("/login"); // Redirect to login page after logout
		} catch (error) {
			console.error("Error logging out:", error);
		}
	};

	return (
		<header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container px-0 flex h-16 max-w-screen-2xl items-center">
				<MainNav />
				<MobileNav />

				<div className="flex flex-1 space-x-2 justify-end md:justify-end items-center">
					{/* Conditionally render buttons based on user authentication state */}
					{!user ? (
						<>
							<Link to="/login">
								<Button variant="outline">Login</Button>
							</Link>
							<Link to="/subscribe" onClick={() => window.scrollTo(0, 0)}>
								<Button className="bg-blue-600">Get Started</Button>
							</Link>
						</>
					) : (
						<>
							<DashboardButton />
							<Link to="/profile">
								<Avatar className="h-8 w-8">
									<AvatarImage src={user.photoURL || undefined} alt="Profile" />
									<AvatarFallback>
										{user.email?.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</Link>

							<Button variant="outline" onClick={handleLogout}>
								Logout
							</Button>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
