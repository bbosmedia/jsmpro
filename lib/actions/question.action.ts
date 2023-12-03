'use server';

import Question from '@/database/question.modal';
import Tag from '@/database/tag.modal';
import { connectToDatabase } from '../mongoose';
import {
	CreateQuestionParams,
	DeleteUserParams,
	GetQuestionsParams,
} from '@/types/shared.types';
import User from '@/database/user.modal';
import { revalidatePath } from 'next/cache';

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
	} catch (e) {}
}

export async function deleteUser(params: DeleteUserParams) {
	const { clerkId } = params;
	try {
		const user = await User.findOne({ clerkId });

		if (!user) {
			throw new Error('User not found');
		}

		const userQuestionIds = await Question.find({ author: user._id }).distinct(
			'_id'
		);

		const deletedUser = await Question.deleteMany({ author: user._id });

		await User.findByIdAndRemove(user._id);

		return deletedUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
}
