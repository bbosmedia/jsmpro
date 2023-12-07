'use server';

import User from '@/database/user.modal';
import { connectToDatabase } from '../mongoose';
import {
	CreateUserParams,
	GetUserByIdParams,
	UpdateUserParams,
} from '@/types/shared.types';
import { revalidatePath } from 'next/cache';

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
	console.log(params)
	try {
		connectToDatabase();
		const user = await User.findOneAndUpdate(
			{ clerkId },
			updateData,
			{ new: true }
		);
		revalidatePath(path);
		return user;
	} catch (error) {
		console.log(error);
		throw error;
	}
}
