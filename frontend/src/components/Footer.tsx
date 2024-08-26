"use client";

import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
	return (
		<>
			<Separator className="mt-4" />
			<footer className="py-6 md:px-8 md:py-0">
				<div className="container text-xs text-justify mt-4 text-slate-400">
					Disclaimer: Any of the content represented on this site does not
					constitute a recommendation or endorsement of any specific security,
					investment strategy, or financial product. The information provided is
					for educational and informational purposes only and should not be
					construed as financial advice. Be aware of the financial risks
					involved in trading and investing, including the potential loss of
					capital. Always conduct your own research or consult with a qualified
					financial advisor before making any investment decisions.
				</div>

				<div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
					<p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
						© 2024 Indicator Insights. All rights reserved.
					</p>

					<p></p>

					<ul className="flex space-x-4">
						<li>
							<a
								href={siteConfig.links.discord}
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="36"
									height="36"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="9" cy="12" r="1" />
									<circle cx="15" cy="12" r="1" />
									<path d="M7.5 7.5c3.5-1 5.5-1 9 0" />
									<path d="M7 16.5c3.5 1 6.5 1 10 0" />
									<path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833-1.5-11.5-1.457-1.015-3-1.34-4.5-1.5l-1 2.5" />
									<path d="M8.5 17c0 1-1.356 3-1.832 3-1.429 0-2.698-1.667-3.333-3-.635-1.667-.476-5.833 1.428-11.5C6.151 4.485 7.545 4.16 9 4l1 2.5" />
								</svg>
							</a>
						</li>
						<li>
							<a
								href={siteConfig.links.github}
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="36"
									height="36"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
								</svg>
							</a>
						</li>
						<li>
							<a
								href={siteConfig.links.twitter}
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="36"
									height="36"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5.66 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
								</svg>
							</a>
						</li>
					</ul>
				</div>
			</footer>
		</>
	);
}
