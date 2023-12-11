'use server';

import Question from '@/database/question.modal';
import Tag from '@/database/tag.modal';
import { connectToDatabase } from '../mongoose';
import {
	CreateQuestionParams,
	GetQuestionByIdParams,
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
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getQuestionById(params: GetQuestionByIdParams) {
	try {
		const { questionId } = params;
		connectToDatabase();
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
