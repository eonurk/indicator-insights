import { Link } from "react-router-dom"; // Import necessary hooks from react-router-dom
// import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

export function MainNav() {
	// const location = useLocation(); // Use useLocation to get the current pathname
	const pathname = location.pathname;

	return (
		<div className="mr-4 hidden md:flex">
			<Link to="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
				<Icons.logo className="h-6 w-6" />
				{/* <span className="hidden font-bold lg:inline-block">
					{siteConfig.name}
				</span> */}
			</Link>
			<nav className="flex items-center gap-4 text-sm lg:gap-6">
				<Link
					to="/"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname === "/" ? "text-foreground" : "text-foreground/60"
					)}
				>
					Home
				</Link>
				<Link
					to="/about"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname === "/about" ? "text-foreground" : "text-foreground/60"
					)}
				>
					About
				</Link>
				<Link
					to="/jobs"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname === "/jobs" ? "text-foreground" : "text-foreground/60"
					)}
				>
					Jobs (1)
				</Link>

				<Link
					to="/blog"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname === "/blog" ? "text-foreground" : "text-foreground/60"
					)}
				>
					Blog
				</Link>

				<Link
					to="/contact"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname === "/contact" ? "text-foreground" : "text-foreground/60"
					)}
				>
					Contact
				</Link>
			</nav>
		</div>
	);
}
