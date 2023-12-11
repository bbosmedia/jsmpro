'use server';

import { GetAllTagsParams, GetTopInteractedTagsParams } from '@/types/shared.types';
import { connectToDatabase } from '../mongoose';
import User from '@/database/user.modal';
import Tag from '@/database/tag.modal'

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
	try {
		connectToDatabase();
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

export async function getAllTags(params:GetAllTagsParams) {
	try {
		connectToDatabase();
		const tags = await Tag.find({})
		return {tags}
	} catch (error) {
		console.log(error);
		throw error;
	}
}
