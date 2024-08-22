// BlogPage.tsx

import { SiteFooter } from "@/components/Footer";
import { SiteHeader } from "@/components/site-header";
import { BlogEntry } from "@/components/BlogEntry"; // Import the BlogEntry component

interface Blog {
	title: string;
	date: string;
	link: string;
	description: string;
}

const blogEntries: Blog[] = [
	{
		title: "Can Cells Talk?",
		date: "July 24, 2024",
		link: "blog/TCC/index.html",
		description:
			"Do cells have a language? With the recent success of large language models and the vast number of curated gene pathways, we visited this fundamental question one more time.",
	},
	// You can add more blog entries here
	{
		title: "Another Blog Title",
		date: "August 15, 2024",
		link: "blog/another/index.html",
		description:
			"Short description of the new blog.asnkldfnasf, asfkljsdfjklsdjlkfsajk ldflasdfkljasdfkl jslafldsljkfslja",
	},
];

export function BlogPage() {
	return (
		<>
			<SiteHeader />
			<div className="h-[40rem] flex flex-col justify-center items-center px-4 max-w-xl md:m-auto">
				{blogEntries.map((entry, index) => (
					<BlogEntry
						key={index}
						title={entry.title}
						date={entry.date}
						link={entry.link}
						description={entry.description}
					/>
				))}
			</div>
			<SiteFooter />
		</>
	);
}

export default BlogPage;
