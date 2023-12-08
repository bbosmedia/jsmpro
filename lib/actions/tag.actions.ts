'use server';

import { GetTopInteractedTagsParams } from '@/types/shared.types';
import { connectToDatabase } from '../mongoose';
import User from '@/database/user.modal';

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
	try {
		connectToDatabase();
		const { userId, limit = 3 } = params;
		const user = await User.findById(userId).limit(limit);
		if (!user) throw new Error('User not found');
		
		return [{_id: 'xasa', name:'tag1'}, {_id: 'xasaa', name:'tag2'}];
	} catch (error) {
		console.log(error);
		throw error;
	}
}
