export function timeFormatter(timestamp: Date): string {
	const currentTime = new Date();
	const timeDiff = (currentTime.getTime() - timestamp.getTime()) / 1000; // Convert to seconds

	if (timeDiff < 60) {
		return 'Less than a minute ago';
	} else if (timeDiff < 3600) {
		const minutesAgo = Math.floor(timeDiff / 60);
		return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
	} else if (timeDiff < 86400) {
		const hoursAgo = Math.floor(timeDiff / 3600);
		return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
	} else {
		const formattedDate = timestamp.toLocaleString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			month: 'long',
			day: 'numeric',
			year:
				currentTime.getFullYear() !== timestamp.getFullYear()
					? 'numeric'
					: undefined,
		});
		return formattedDate;
	}
}

export function timeAgoFormatter(timestamp: number): string {
	const now = Date.now();
	const elapsedMilliseconds = now - timestamp;

	const seconds = Math.floor(elapsedMilliseconds / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30.44); // Average days in a month
	const years = Math.floor(months / 12);

	if (years > 0) {
		return years === 1 ? '1 year ago' : `${years} years ago`;
	} else if (months > 0) {
		return months === 1 ? '1 month ago' : `${months} months ago`;
	} else if (days > 0) {
		return days === 1 ? '1 day ago' : `${days} days ago`;
	} else if (hours > 0) {
		return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
	} else if (minutes > 0) {
		return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
	} else {
		return seconds <= 10 ? 'just now' : `${seconds} seconds ago`;
	}
}

export function formatMonthAndYear(date: Date): string {
	// Define an array of month names
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	// Extract the month and year
	const month = monthNames[date.getMonth()];
	const year = date.getFullYear();

	return `${month}, ${year}`;
}
