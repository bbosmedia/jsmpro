'use server';

import {
	AnswerVoteParams,
	CreateAnswerParams,
	DeleteAnswerParams,
	GetAnswersParams,
} from '@/types/shared.types';
import { connectToDatabase } from '../mongoose';
import Answer from '@/database/answer.model';
import Question from '@/database/question.model';
import { revalidatePath } from 'next/cache';
import User from '@/database/user.model';
import Interaction from '@/database/interaction.model';

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
			throw new Error('Answer not found');
		}

		return revalidatePath(path + JSON.stringify(answer.question));
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// Delete Answer

export const deleteAnswer = async (params: DeleteAnswerParams) => {
	const { answerId, path } = params;
	try {
		await connectToDatabase();
		const answer = await Answer.findById(answerId);
		if (!answer) {
			throw new Error('Answer not found');
		}
		await Answer.deleteOne({ _id: answer._id });
		await Question.updateMany(
			{ _id: answer.question },
			{ $pull: { answers: answerId } }
		);
		await Interaction.deleteMany({ answer: answerId });
		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
};
