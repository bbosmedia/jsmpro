'use server';

import {
	GetAllTagsParams,
	GetQuestionsByTagIdParams,
	GetTopInteractedTagsParams,
} from '@/types/shared.types';
import { connectToDatabase } from '../mongoose';
import User from '@/database/user.model';
import Tag from '@/database/tag.model';
import { FilterQuery } from 'mongoose';
import Question from '@/database/question.model';

// Get Top Interacted Tags
export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
	try {
		await connectToDatabase();
		const { userId, limit = 3 } = params;
		const user = await User.findById(userId).limit(limit);
		if (!user) throw new Error('User not found');

		return [
			{ _id: 'xasa', name: 'tag1' },
			{ _id: 'xasaa', name: 'tag2' },
		];
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// Get All Tags
export async function getAllTags(params: GetAllTagsParams) {
	const { searchQuery } = params;
	try {
		await connectToDatabase();
		const query: FilterQuery<typeof Tag> = {};

		if (searchQuery) {
			query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }];
		}
		const tags = await Tag.find(query);
		return { tags };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// Get Questions By Tag ID

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
	try {
		await connectToDatabase();
		const { tagId, page = 1, pageSize = 20, searchQuery } = params;

		const tagFilter: FilterQuery<typeof Tag> = { _id: tagId };
		const skip = (page - 1) * pageSize;
		const tag = await Tag.findOne(tagFilter)
			.populate({
				path: 'questions',
				options: { createdAt: -1, skip, limit: pageSize },
				match: searchQuery
					? { title: { $regex: new RegExp(searchQuery, 'i') } }
					: {},
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

		if (!tag) {
			throw new Error('Tag is not found');
		}

		const questions = tag.questions;

		return { tagTitle: tag.name, questions };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getPopularTags() {
	try {
		await connectToDatabase();
		const popularTags = await Tag.aggregate([
			{ $project: { name: 1, numberOfQuestions: { $size: '$questions' } } },
			{
				$sort: { numberOfQuestions: -1, name: 1 },
			},
			{
				$limit: 5,
			},
		]);

		return popularTags;
	} catch (error) {
		console.log(error);
		throw error;
	}
}
