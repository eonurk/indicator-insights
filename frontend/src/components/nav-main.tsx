"use client";

import { Link } from "react-router-dom"; // Import necessary hooks from react-router-dom
// import { siteConfig } from "@/config/site";
// import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

export function MainNav() {
	// const location = useLocation(); // Use useLocation to get the current pathname
	// const pathname = location.pathname;

	return (
		<div className="mr-4 hidden md:flex">
			<Link to="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
				<Icons.logo className="h-6 w-6" />
				{/* <span className="hidden font-bold lg:inline-block">
					{siteConfig.name}
				</span> */}
			</Link>
			{/* <nav className="flex items-center gap-4 text-sm lg:gap-6">
				<Link
					to="/docs"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname === "/docs" ? "text-foreground" : "text-foreground/60"
					)}
				>
					Docs
				</Link>
				<Link
					to="/docs/components"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname?.startsWith("/docs/components") &&
							!pathname?.startsWith("/docs/component/chart")
							? "text-foreground"
							: "text-foreground/60"
					)}
				>
					Components
				</Link>
				<Link
					to="/blocks"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname?.startsWith("/blocks")
							? "text-foreground"
							: "text-foreground/60"
					)}
				>
					Blocks
				</Link>
				<Link
					to="/charts"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname?.startsWith("/docs/component/chart") ||
							pathname?.startsWith("/charts")
							? "text-foreground"
							: "text-foreground/60"
					)}
				>
					Charts
				</Link>
				<Link
					to="/themes"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname?.startsWith("/themes")
							? "text-foreground"
							: "text-foreground/60"
					)}
				>
					Themes
				</Link>
				<Link
					to="/examples"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname?.startsWith("/examples")
							? "text-foreground"
							: "text-foreground/60"
					)}
				>
					Examples
				</Link>
				<Link
					to="/colors"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname?.startsWith("/colors")
							? "text-foreground"
							: "text-foreground/60"
					)}
				>
					Colors
				</Link>
			</nav> */}
		</div>
	);
}
