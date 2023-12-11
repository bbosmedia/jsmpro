import * as z from 'zod';
export const AnswerSchema = z.object({
	answer: z.string().min(100),
});
