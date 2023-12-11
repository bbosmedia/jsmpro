'use server';

import User from '@/database/user.modal';
import { connectToDatabase } from '../mongoose';
import {
	CreateUserParams,
	DeleteUserParams,
	GetAllUsersParams,
	GetUserByIdParams,
	UpdateUserParams,
} from '@/types/shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.modal'

export async function getUserById(params: GetUserByIdParams) {
	const { userId } = params;

	try {
		await connectToDatabase();
		const user = await User.findOne({ userId });
		return user;
	} catch (e) {
		console.log(e);
	}
}

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

export async function deleteUser(params: DeleteUserParams) {
	const { clerkId } = params;
	try {
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
