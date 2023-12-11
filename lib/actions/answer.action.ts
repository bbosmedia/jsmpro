'use server';

import { CreateAnswerParams } from '@/types/shared.types';
import { connectToDatabase } from '../mongoose';
import Answer from '@/database/answer.modal';
import Question from '@/database/question.modal';
import { revalidatePath } from 'next/cache'

export async function createAnswer(params: CreateAnswerParams) {
	try {
		await connectToDatabase();
		const { question, content, path, author } = params;
		const newAnswer = await new Answer({ question, content, author });

		// Add the answer to the question's answers array
		await Question.findByIdAndUpdate(question, {
			$push: { answers: newAnswer._id },
		});
		revalidatePath(path)
	} catch (error) {
		console.log(error);
		throw error;
	}
}
