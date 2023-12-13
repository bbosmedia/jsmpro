'use server';

import Question from '@/database/question.modal';
import Tag from '@/database/tag.modal';
import { connectToDatabase } from '../mongoose';
import {
	CreateQuestionParams,
	GetQuestionByIdParams,
	GetQuestionsParams,
	GetSavedQuestionsParams,
	QuestionVoteParams,
} from '@/types/shared.types';
import User from '@/database/user.modal';
import { revalidatePath } from 'next/cache';
import { FilterQuery } from 'mongoose';

// Get Question
export async function getQuestions(params: GetQuestionsParams) {
	try {
		await connectToDatabase();
		const questions = await Question.find({})
			.populate({
				path: 'tags',
				model: Tag,
			})
			.populate({ path: 'author', model: User })
			.sort({ createdAt: -1 });
		return { questions };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// Create Question
export async function createQuestion(params: CreateQuestionParams) {
	try {
		await connectToDatabase();

		const { title, content, tags, author, path } = params;

		// Add Question
		const question = await Question.create({
			title,
			content,
			author,
		});

		const tagDocuments = [];

		for (const tag of tags) {
			const existingTag = await Tag.findOneAndUpdate(
				{
					name: { $regex: new RegExp(`^${tag}$`, 'i') },
				},
				{
					$setOnInsert: { name: tag },
					$push: { questions: question },
				},
				{
					upsert: true,
					new: true,
				}
			);
			tagDocuments.push(existingTag._id);
		}

		await Question.findByIdAndUpdate(question._id, {
			$push: { tags: { $each: tagDocuments } },
		});
		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// Get Question By ID
export async function getQuestionById(params: GetQuestionByIdParams) {
	try {
		const { questionId } = params;
		await connectToDatabase();
		const question = await Question.findById(questionId)
			.populate({ path: 'tags', model: Tag, select: '_id name' })
			.populate({
				path: 'author',
				model: User,
				select: '_id clerkId name picture',
			});
		return question;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// Upvote The Question
export async function upvoteQuestion(params: QuestionVoteParams) {
	try {
		await connectToDatabase();
		const { questionId, userId, hasdownVoted, hasupVoted, path } = params;

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

		const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
			new: true,
		});

		if (!question) {
			throw new Error('Question not found');
		}

		return revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// Down Vote the Question
export async function downvoteQuestion(params: QuestionVoteParams) {
	try {
		await connectToDatabase();
		const { questionId, userId, hasdownVoted, hasupVoted, path } = params;

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

		const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
			new: true,
		});

		if (!question) {
			throw new Error('Question not found');
		}

		return revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
	const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;
	try {
		await connectToDatabase();
		const query: FilterQuery<typeof Question> = searchQuery
			? { title: { $regex: new RegExp(searchQuery, 'i') } }
			: {};
		const skip = (page - 1) * pageSize;
		const user = await User.findOne({ clerkId })
			.populate({
				path: 'saved',
				options: { createdAt: -1, skip, limit: pageSize },
				match: query,
				populate: [
					{ path: 'tags', model: Tag, select: '_id name' },
					{
						path: 'author',
						model: User,
						select: '_id clerkId name picture',
					},
				],
			})
			.exec();

		if (!user) {
			throw new Error('User not found');
		}

		const savedQuestions = user.saved;
		return { questions: savedQuestions };
	} catch (error) {
		console.log(error);
		throw error;
	}
}
