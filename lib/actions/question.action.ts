'use server';

import Question from '@/database/question.model';
import Tag from '@/database/tag.model';
import { connectToDatabase } from '../mongoose';
import {
	CreateQuestionParams,
	DeleteQuestionParams,
	EditQuestionParams,
	GetQuestionByIdParams,
	GetQuestionsParams,
	GetSavedQuestionsParams,
	QuestionVoteParams,
} from '@/types/shared.types';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';
import { FilterQuery } from 'mongoose';
import Answer from '@/database/answer.model';
import Interaction from '@/database/interaction.model';

// Get Question
export async function getQuestions(params: GetQuestionsParams) {
	try {
		await connectToDatabase();
		const { searchQuery, filter } = params;
		const query: FilterQuery<typeof Question> = {};

		if (searchQuery) {
			query.$or = [
				{ title: { $regex: new RegExp(searchQuery, 'i') } },
				{ content: { $regex: new RegExp(searchQuery, 'i') } },
			];
		}

		let sortOptions = {};

		switch (filter) {
			case 'newest':
				sortOptions = { createdAt: -1 };
				break;
			case 'frequent':
				sortOptions = { views: -1 };
				break;
			case 'recommended':
				sortOptions = { upvotes: -1, views: -1 };
				break;
			case 'unanswered':
				query.answers = { $size: 0 };
				break;
			default:
				break;
		}

		const questions = await Question.find(query)
			.populate({
				path: 'tags',
				model: Tag,
			})
			.populate({ path: 'author', model: User })
			.sort(sortOptions);
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

// Get Saved Questions
export async function getSavedQuestions(params: GetSavedQuestionsParams) {
	const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;
	try {
		await connectToDatabase();
		const query: FilterQuery<typeof Question> = {};

		let sortOptions = {};
		switch (filter) {
			case 'most_recent':
				sortOptions = { createdAt: -1 };
				break;
			case 'oldest':
				sortOptions = { createdAt: 1 };
				break;
			case 'most_voted':
				sortOptions = { upvotes: -1 };
				break;
			case 'most_viewed':
				sortOptions = { views: -1 };
				break;
			case 'most_answered':
				sortOptions = { answers: -1 };
				break;
			default:
				break;
		}

		if (searchQuery) {
			query.$or = [
				{ title: { $regex: new RegExp(searchQuery, 'i') } },
				{ content: { $regex: new RegExp(searchQuery, 'i') } },
			];
		}
		const skip = (page - 1) * pageSize;
		console.log(sortOptions);
		const user = await User.findOne({ clerkId })
			.populate({
				path: 'saved',
				match: query,
				options: { sort: sortOptions, skip },
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

// Delete Question
export const deleteQuestion = async (params: DeleteQuestionParams) => {
	const { questionId, path } = params;
	try {
		await connectToDatabase();
		await Question.deleteOne({ _id: questionId });
		await Answer.deleteMany({ question: questionId });
		await User.updateMany(
			{ saved: questionId },
			{ $pull: { saved: questionId } }
		);
		await Interaction.deleteMany({ question: questionId });
		await Tag.updateMany(
			{ questions: questionId },
			{ $pull: { questions: questionId } }
		);
		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

// Edit Question
export const editQuestion = async (params: EditQuestionParams) => {
	const { questionId, title, content, path } = params;
	try {
		await connectToDatabase();
		const question = await Question.findById(questionId).populate('tags');
		if (!question) {
			throw new Error('Question not found');
		}
		question.title = title;
		question.content = content;
		await question.save();
		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

// Get Hot the questions

export const getHotQuestions = async () => {
	try {
		await connectToDatabase();
		const hotQuestions = await Question.find()
			.sort({ views: -1, upvotes: -1 })
			.limit(5);
		return hotQuestions;
		return;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
