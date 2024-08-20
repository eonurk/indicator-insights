import "./App.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home } from "@/pages/Home";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { ThemeProvider } from "@/components/theme-provider";

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
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				{
					<Router>
						<Routes>
							<Route path="/" element={<Home user={user} />} />
							<Route path="/login" element={<LoginPage />} />
							<Route path="/signup" element={<SignupPage />} />
						</Routes>
					</Router>
				}
			</ThemeProvider>
		</>
	);
}

export default App;
