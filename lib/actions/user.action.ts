'use server';

import User from '@/database/user.modal';
import { connectToDatabase } from '../mongoose';
import {
	CreateUserParams,
	DeleteUserParams,
	GetAllUsersParams,
	GetUserByIdParams,
	ToggleSaveQuestionParams,
	UpdateUserParams,
} from '@/types/shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.modal';
import { use } from 'react';

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
		// const { page = 1, pageSize = 20, filter, searchQuery } = params;
		const users = await User.find({}).sort({ createdAt: -1 });
		return { users };
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
