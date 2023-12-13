'use server';

import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from '@/types/shared.types';
import { connectToDatabase } from '../mongoose';
import Answer from '@/database/answer.modal';
import Question from '@/database/question.modal';
import { revalidatePath } from 'next/cache';
import User from '@/database/user.modal';

export async function createAnswer(params: CreateAnswerParams) {
	try {
		await connectToDatabase();
		const { question, content, path, author } = params;
		const newAnswer = await Answer.create({ question, content, author });

		// Add the answer to the question's answers array
		await Question.findByIdAndUpdate(question, {
			$push: { answers: newAnswer._id },
		});
		await newAnswer.save();
		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getAnswers(params: GetAnswersParams) {
	const { questionId } = params;
	try {
		await connectToDatabase();
		const answers = await Answer.find({ question: questionId })
			.populate({
				path: 'author',
				model: User,
				select: '_id clerkId name picture',
			})
			.sort({ createdAt: -1 });
		return answers ? { answers } : { answers: [] };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function upvoteAnswer(params: AnswerVoteParams) {
	try {
		await connectToDatabase();
		const { answerId, userId, hasdownVoted, hasupVoted, path } = params;

		let updateQuery = {};

		if (hasupVoted) {
			updateQuery = { $pull: { upvotes: userId } };
		} else if (hasdownVoted) {
			updateQuery = {
				$pull: { downvotes: userId },
				$push: { upvotes: userId },
			};
		} else {
			updateQuery = { $addToSet: { upvotes: userId } };
		}

		const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
			new: true,
		});

		if (!answer) {
			throw new Error('Question not found');
		}

		return revalidatePath(path + JSON.stringify(answer.question));
	} catch (error) {
		console.log(error);
		throw error;
	}
}


export async function downvoteAnswer(params: AnswerVoteParams) {
	try {
		await connectToDatabase();
		const { answerId, userId, hasdownVoted, hasupVoted, path } = params;

		let updateQuery = {};

		if (hasdownVoted) {
			updateQuery = { $pull: { downvotes: userId } };
		} else if (hasupVoted) {
			updateQuery = {
				$pull: { upvotes: userId },
				$push: { downvotes: userId },
			};
		} else {
			updateQuery = { $addToSet: { downvotes: userId } };
		}

		const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
			new: true,
		});

		if (!answer) {
			throw new Error('Question not found');
		}

		return revalidatePath(path + JSON.stringify(answer.question));
	} catch (error) {
		console.log(error);
		throw error;
	}
}
