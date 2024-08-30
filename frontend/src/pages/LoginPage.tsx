import Login from "@/components/Login";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/Footer";

export function LoginPage() {
	return (
		<>
			<SiteHeader />
			<div className="h-[40rem] flex justify-center items-center px-0">
				<div className="text-2xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
					<Login />
				</div>
			</div>
			<SiteFooter />
		</>
	);
}

export default LoginPage;
