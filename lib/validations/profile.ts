import * as z from 'zod';
export const ProfileSchema = z.object({
	username: z.string().min(5).max(50),
	name: z.string().min(5).max(50),
	bio: z.string().min(10).max(150),
	portfolioWebsite: z.string().url(),
	location: z.string().min(5).max(50),
});