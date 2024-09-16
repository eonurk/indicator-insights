import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

interface BlogEntryProps {
	title: string;
	date: string;
	link: string;
	description: string;
}

export function BlogEntry({ title, date, link, description }: BlogEntryProps) {
	return (
		<>
			<div className="text-2xl mx-auto font-normal text-left text-black dark:text-neutral-400">
				<br />
				<Link to={link} className="hover:underline">
					{title}
				</Link>
				<div className="mx-auto text-sm text-left text-neutral-600 dark:text-neutral-400">
					{date}
				</div>
				<br />
				<div className="mx-auto text-base text-left text-neutral-600 dark:text-neutral-400">
					{description}
				</div>
				<br />
				<Separator />
			</div>
		</>
	);
}

export default BlogEntry;
