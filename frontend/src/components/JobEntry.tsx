"use client";

import { Separator } from "@/components/ui/separator";

interface BlogEntryProps {
	title: string;
	date: string;
	link: string;
	description: string;
}

export function JobEntry({ title, date, link, description }: BlogEntryProps) {
	return (
		<>
			<div className="text-2xl mx-auto font-normal text-left text-black dark:text-neutral-400">
				<br />
				<a href={link} className="hover:underline">
					{title}
				</a>
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

export default JobEntry;
