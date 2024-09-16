// BlogPage.tsx

import { SiteFooter } from "@/components/Footer";
import { SiteHeader } from "@/components/site-header";
import JobEntry from "@/components/JobEntry"; // Import the component

interface Blog {
	title: string;
	date: string;
	link: string;
	description: string;
}

const blogEntries: Blog[] = [
	{
		title: "Intern - Full Stack ",
		date: "August 22, 2024",
		link: "mailto:help.indicatorinsights@gmail.com?subject=Job Application for Full Stack Intern&body=Dear Indicator Insights Team,%0D%0A%0D%0AI'm interested in the Full Stack Intern position. Here are my details:%0D%0A%0D%0A[Your Name]%0D%0A[Your Phone Number]%0D%0A[Your LinkedIn/GitHub Profile]%0D%0A%0D%0AThank you!%0D%0A%0D%0ABest regards,%0D%0A[Your Name]",
		description:
			"Are you a curious developer looking to dive into the world of full stack development with minimal supervision? We’re on the hunt for a Full Stack Intern who’s excited to learn, create, and grow with us! You’ll get hands-on experience working with cool technologies like React, TypeScript, and Vite while building applications that matter.",
	},
	// You can add more blog entries here
	// {
	// 	title: "Another Blog Title",
	// 	date: "August 15, 2024",
	// 	link: "blog/another/index.html",
	// 	description:
	// 		"Short description of the new blog.asnkldfnasf, asfkljsdfjklsdjlkfsajk ldflasdfkljasdfkl jslafldsljkfslja",
	// },
];

export function JobsPage() {
	return (
		<>
			<SiteHeader />
			<div className="h-[40rem] flex flex-col justify-center items-center px-4 max-w-xl md:m-auto">
				{blogEntries.map((entry, index) => (
					<JobEntry
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

export default JobsPage;
