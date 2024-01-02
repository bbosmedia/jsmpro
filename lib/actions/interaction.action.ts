'use server';

import { ViewQuestionParams } from '@/types/shared.types';
import { connectToDatabase } from '../mongoose';
import Question from '@/database/question.model';
import Interaction from '@/database/interaction.model';

export async function viewQuestion(params: ViewQuestionParams) {
	try {
		await connectToDatabase();

		const { userId, questionId } = params;

		await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

		if (userId) {
			const existingAction = await Interaction.findOne({
				user: userId,
				action: 'view',
				question: questionId,
			});

			if (existingAction) return console.log('User already viewed');

			// Create Interaction
			await Interaction.create({
				user: userId,
				action: 'view',
				question: questionId,
			});
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
}
