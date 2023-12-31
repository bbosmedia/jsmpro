'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
	CreateUserParams,
	DeleteUserParams,
	GetAllUsersParams,
	GetUserByIdParams,
	GetUserStatsParams,
	ToggleSaveQuestionParams,
	UpdateUserParams,
} from '@/types/shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';
import { use } from 'react';
import Answer from '@/database/answer.model';
import Tag from '@/database/tag.model';
import { FilterQuery } from 'mongoose';

// Get User Details By ID
export async function getUserById(params: GetUserByIdParams) {
	const { userId } = params;

	try {
		await connectToDatabase();
		const user = await User.findOne({ clerkId: userId });
		return user;
	} catch (e) {
		console.log(e);
	}
}

// Create User
export async function createUser(userData: CreateUserParams) {
	try {
		connectToDatabase();
		const newUser = await User.create(userData);
		return newUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// Update User Details
export async function updateUser(params: UpdateUserParams) {
	const { clerkId, updateData, path } = params;
	try {
		connectToDatabase();
		const user = await User.findOneAndUpdate({ clerkId }, updateData, {
			new: true,
		});
		revalidatePath(path);
		return user;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// Get All Users
export async function getAllUsers(params: GetAllUsersParams) {
	try {
		connectToDatabase();
		const { page = 1, pageSize = 20, filter, searchQuery } = params;
		const query: FilterQuery<typeof Question> = {};
		const skip = (page - 1) * pageSize;
		let sortOptions = {};

		switch (filter) {
			case 'new_users':
				sortOptions = { joinedAt: -1 };
				break;
			case 'old_users':
				sortOptions = { joinedAt: 1 };
				break;
			case 'top_contributors':
				sortOptions = { reputation: -1 };
				break;
			default:
				sortOptions = { joinedAt: -1 };
				break;
		}

		if (searchQuery) {
			query.$or = [
				{ username: { $regex: new RegExp(searchQuery, 'i') } },
				{ name: { $regex: new RegExp(searchQuery, 'i') } },
				{ email: { $regex: new RegExp(searchQuery, 'i') } },
				{ bio: { $regex: new RegExp(searchQuery, 'i') } },
				{ location: { $regex: new RegExp(searchQuery, 'i') } },
			];
		}
		const users = await User.find(query)
			.sort(sortOptions)
			.limit(pageSize)
			.skip(skip);

		const totalUsersCount = await User.countDocuments(query);
		const isNext = totalUsersCount > pageSize * page;
		return { users, isNext };
	} catch (e) {
		console.log(e);
		throw e;
	}
}

// Delete User
export async function deleteUser(params: DeleteUserParams) {
	const { clerkId } = params;
	try {
		await connectToDatabase();
		const user = await User.findOne({ clerkId });

		if (!user) {
			throw new Error('User not found');
		}

		const deletedUser = await Question.deleteMany({ author: user._id });

		await User.findByIdAndDelete(user._id);

		return deletedUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// Toggle Save Question
export async function toggleSavedQuestion(params: ToggleSaveQuestionParams) {
	const { userId, questionId, path } = params;
	try {
		await connectToDatabase();

		const user = await User.findById(userId);

		if (!user) {
			throw new Error('User not found');
		}

		let updateQuery = {};

		if (user.saved.includes(questionId)) {
			updateQuery = { $pull: { saved: questionId } };
		} else {
			updateQuery = { $addToSet: { saved: questionId } };
		}

		await User.findByIdAndUpdate(userId, updateQuery, { new: true });

		return revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// Get User Info
export async function getUserInfo(params: GetUserByIdParams) {
	try {
		await connectToDatabase();
		const user = await User.findOne({ clerkId: params.userId }).exec();
		if (!user) {
			throw new Error('User not found');
		}
		const totalQuestions = await Question.countDocuments({ author: user._id });
		const totalAnswers = await Answer.countDocuments({ author: user._id });
		return { user, totalAnswers, totalQuestions };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// Get User Questions
export const getUserQuestions = async (params: GetUserStatsParams) => {
	const { userId, page = 1, pageSize = 10 } = params;
	const skip = (page - 1) * pageSize;
	try {
		await connectToDatabase();
		const totalQuestions = await Question.countDocuments({ author: userId });
		const userQuestions = await Question.find({ author: userId })
			.sort({ views: -1, upvotes: -1 })
			.limit(pageSize)
			.skip(skip)
			.populate('tags', '_id name')
			.populate('author', '_id clerkId name picture');
		const isNext = totalQuestions > page * pageSize;
		return { questions: userQuestions, isNext };
	} catch (error) {
		console.log(error);
		throw error;
	}
};

// Get User Answers
export const getUserAnswers = async (params: GetUserStatsParams) => {
	const { userId, page = 1, pageSize = 10 } = params;
	const skip = (page - 1) * pageSize;
	try {
		await connectToDatabase();
		const totalAnswers = await Answer.countDocuments({ author: userId });
		const userAnswers = await Answer.find({ author: userId })
			.sort({ upvotes: -1 })
			.limit(pageSize)
			.skip(skip)
			.populate('question', '_id title')
			.populate('author', '_id clerkId name picture');

		const isNext = totalAnswers > page * pageSize;
		return { answers: userAnswers, isNext };
	} catch (error) {
		console.log(error);
		throw error;
	}
};

// Update User Details
export const updateUserDetails = async (params: UpdateUserParams) => {
	const { clerkId, updateData, path } = params;
	try {
		await connectToDatabase();
		const user = await User.findOne({ clerkId });
		if (!user) {
			throw new Error('User not found');
		}
		await User.findByIdAndUpdate(user._id, updateData, { new: true });
		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
};
