import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
	getAuth,
	onAuthStateChanged,
	updatePassword,
	reauthenticateWithCredential,
	EmailAuthProvider,
} from "firebase/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/Footer";

const UserProfile: React.FC = () => {
	const [email, setEmail] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setEmail(user.email || "");
			} else {
				// User is signed out, redirect to login page
				navigate("/login");
			}
		});

		return () => unsubscribe();
	}, [navigate]);

	const handlePasswordChange = async () => {
		if (newPassword !== confirmPassword) {
			toast({
				title: "Error",
				description: "New passwords do not match.",
				variant: "destructive",
			});
			return;
		}

		if (newPassword.length < 6) {
			toast({
				title: "Error",
				description: "New password must be at least 6 characters long.",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);
		const auth = getAuth();
		const user = auth.currentUser;

		if (user && user.email) {
			try {
				// Re-authenticate user
				const credential = EmailAuthProvider.credential(
					user.email,
					currentPassword
				);
				await reauthenticateWithCredential(user, credential);

				// Change password
				await updatePassword(user, newPassword);

				toast({
					title: "Success",
					description: "Password changed successfully.",
				});

				// Clear password fields
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
			} catch (error) {
				toast({
					title: "Error",
					description:
						"Failed to change password. Please check your current password and try again.",
					variant: "destructive",
				});
			}
		} else {
			toast({
				title: "Error",
				description: "User not found. Please log in again.",
				variant: "destructive",
			});
			navigate("/login");
		}

		setIsLoading(false);
	};

	return (
		<>
			<SiteHeader />
			<div className="dashboard-container min-h-screen">
				<h1 className="text-3xl font-bold mb-8 text-center">User Dashboard</h1>
				<Card className="max-w-md mx-auto">
					<div className="p-8">
						<h2 className="text-xl font-medium mb-4 text-left">User Profile</h2>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 ">
								Email Address
							</label>
							<input
								disabled
								type="email"
								value={email}
								readOnly
								className="text-muted-foreground mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							/>
						</div>
					</div>
				</Card>
				<Card className="max-w-md mx-auto mt-4">
					<div className="p-8">
						<h2 className="text-xl font-medium mb-4 text-left">
							Change Password
						</h2>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">
								Current Password
							</label>
							<input
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">
								New Password
							</label>
							<input
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">
								Confirm New Password
							</label>
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							/>
						</div>
						<Button
							className="w-full"
							onClick={handlePasswordChange}
							disabled={isLoading}
						>
							{isLoading ? "Changing Password..." : "Change Password"}
						</Button>
					</div>
				</Card>
			</div>
			<SiteFooter />
		</>
	);
};

export default UserProfile;
