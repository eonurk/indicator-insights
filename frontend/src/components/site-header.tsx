// import Link from "react-router-dom";
// import { CommandMenu } from "@/components/command-menu";
import { Button } from "@/components/ui/button";
// import { ModeToggle } from "@/components/mode-toggle";
import { Link } from "react-router-dom";
import { MainNav } from "@/components/nav-main";
import { MobileNav } from "@/components/nav-mobile";

export function SiteHeader() {
	return (
		<>
			<header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container px-0 flex h-16 max-w-screen-2xl items-center">
					<MainNav />
					<MobileNav />

					<div className="flex flex-1 space-x-2 justify-end md:justify-end">
						<Button variant="outline">
							<Link to="/login">Login</Link>
						</Button>
						<Button>
							<Link to="/signup">Sign Up</Link>
						</Button>

						{/* <ModeToggle /> */}
					</div>
				</div>
			</header>
		</>
	);
}
