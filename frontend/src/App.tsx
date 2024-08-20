import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
	return (
		<>
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				{
					<Router>
						<Routes>
							<Route path="/" element={<Home />} />
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
