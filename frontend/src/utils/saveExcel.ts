import { Notification } from "@/components/charts/NotificationBoard";

export function exportToCSV(
	data: Record<string, string>[],
	filename: string
): void {
	const csvContent = [
		Object.keys(data[0]).join(","), // Header
		...data.map((row) => Object.values(row).join(",")), // Rows
	].join("\n");

	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const link = document.createElement("a");
	if (link.download !== undefined) {
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", filename);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}

export function exportNotificationsToCSV(notifications: Notification[]) {
	const headers = [
		"ID",
		"Stock",
		"Indicator",
		"Signal",
		"Price",
		"Timestamp",
		"Is New",
	];
	const rows = notifications.map((notification) => [
		notification.id,
		notification.stock,
		notification.indicator,
		notification.signal,
		notification.price.toFixed(2),
		notification.timestamp.toISOString(),
		notification.isNew ? "Yes" : "No",
	]);

	const csvContent =
		"data:text/csv;charset=utf-8," +
		headers.join(",") +
		"\n" +
		rows.map((e) => e.join(",")).join("\n");

	const encodedUri = encodeURI(csvContent);
	const link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "notifications.csv");
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
