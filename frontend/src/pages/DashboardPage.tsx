import Dashboard from "@/components/dashboard/Dashboard";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/Footer";
import { User } from "firebase/auth";
import { Navigate } from "react-router-dom";

export default function DashboardPage({ user }: { user: User | null }) {
	return (
		<>
			<SiteHeader />
			{!user ? <Navigate to="/login" /> : <Dashboard user={user} />}
			<SiteFooter />
		</>
	);
}
