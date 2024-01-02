'use server';

import { SearchParams } from '@/types/shared.types';
import { connectToDatabase } from '../mongoose';
import Question from '@/database/question.model';
import User from '@/database/user.model';
import Answer from '@/database/answer.model';
import Tag from '@/database/tag.model';

export async function globalSearch(params: SearchParams) {
	const { query, type } = params;
	try {
		await connectToDatabase();
		const regexQuery = { $regex: query, $option: 'i' };
		const SearchableTypes = ['question', 'answer', 'user', 'tag'];
		let result: any[] = [];
		const modelsAndTypes = [
			{ model: Question, searchField: 'title', type: 'question' },
			{ model: User, searchField: 'name', type: 'user' },
			{ model: Answer, searchField: 'content', type: 'answer' },
			{ model: Tag, searchField: 'name', type: 'tag' },
		];

		const typeLower = type?.toLocaleLowerCase();

		if (!typeLower || SearchableTypes.includes(typeLower)) {
			// Search Accross Everyting
			for (const { model, searchField, type } of modelsAndTypes) {
				const queryResults = await model
					.find({ [searchField]: regexQuery })
					.limit(2);

				const items = queryResults.map(item => ({
					title:
						type === 'answer'
							? `Answers containing ${query}`
							: item[searchField],
					type,
					id:
						type === 'user'
							? item.clerkId
							: type === 'answer'
							  ? item.question
							  : item._id,
				}));
				result = [...result, ...items];
			}
		} else {
			// Search in special Field

			const modelInfo = modelsAndTypes.find(item => item.type === typeLower);
			if (!modelInfo) {
				throw Error('Invalid search type');
			}

			const queryResults = await modelInfo.model
				.find({
					[modelInfo.searchField]: regexQuery,
				})
				.limit(8);

			result = queryResults.map(item => ({
				title:
					type === 'answer'
						? `Answers containing ${query}`
						: item[modelInfo.searchField],
				type,
				id:
					type === 'user'
						? item.clerkId
						: type === 'answer'
						  ? item.question
						  : item._id,
			}));
		}
		return JSON.stringify(result);
	} catch (error) {
		console.log('Error fetching in Global Search', error);
		throw error;
	}
}
