import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import TermsAndConditions from "@/pages/TermsPage";
import AboutPage from "@/pages/AboutPage";
import BlogPage from "@/pages/Jobs";
import SubscribePage from "@/pages/SubscribePage";
import UserProfile from "@/pages/UserProfilePage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ContactPage from "@/pages/ContactPage";
import FAQPage from "@/pages/FAQPage";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Toaster } from "@/components/ui/toaster";
import ResetPassword from "@/pages/ResetPassword";

function App() {
	const [user, setUser] = useState<User | null>(null); // Use User type from firebase/auth
	const auth = getAuth();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
		});
		return () => unsubscribe(); // Cleanup on unmount
	}, [auth]);

	return (
		<>
			<Toaster />
			<Router>
				<Routes>
					<Route path="/" element={<Home user={user} />} />
					<Route path="/about" element={<AboutPage />} />
					<Route path="/jobs/*" element={<BlogPage />} />
					<Route path="/subscribe" element={<SubscribePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignupPage />} />
					<Route path="/profile" element={<UserProfile />} />
					<Route path="/terms" element={<TermsAndConditions />} />
					<Route path="/privacy" element={<PrivacyPolicyPage />} />
					<Route path="/contact" element={<ContactPage />} />
					<Route path="/faq" element={<FAQPage />} />
					<Route path="/reset-password" element={<ResetPassword />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
