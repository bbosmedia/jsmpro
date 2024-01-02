'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ProfileSchema } from '@/lib/validations/profile';
import { usePathname, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Textarea } from '../ui/textarea';
import { updateUser } from '@/lib/actions/user.action';

interface Props {
	clerkId: string;
	user: string;
}

const Profile = (props: Props) => {
	const router = useRouter();
	const pathname = usePathname();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { clerkId, user } = props;
	const parsedUserDetails = JSON.parse(user);

	// 1. Define your form.
	const form = useForm<z.infer<typeof ProfileSchema>>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: {
			name: parsedUserDetails.name || '',
			username: parsedUserDetails.username || '',
			portfolioWebsite: parsedUserDetails.portfolioWebsite || '',
			location: parsedUserDetails.location || '',
			bio: parsedUserDetails.bio || '',
		},
	});
	// 2. Define submit handler
	async function onSubmit(values: z.infer<typeof ProfileSchema>) {
		setIsSubmitting(() => true);
		try {
			await updateUser({
				clerkId,
				updateData: {
					name: values.name,
					bio: values.bio,
					username: values.username,
					portfolioWebsite: values.portfolioWebsite,
				},
				path: pathname,
			});
			router.back();
		} catch (e) {
		} finally {
			setIsSubmitting(() => false);
		}
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='mt-9 flex gap-9 w-full flex-col'
			>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem className='space-y-3.5'>
							<FormLabel className='paragraph-semibold text-dark400_light800'>
								Name <span className='text-primary-500'>*</span>
							</FormLabel>
							<FormControl className='mt-3.5'>
								<Input
									placeholder='Name'
									className='no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
									{...field}
								/>
							</FormControl>
							<FormMessage className='text-red-500' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem className='space-y-3.5'>
							<FormLabel className='paragraph-semibold text-dark400_light800'>
								Username <span className='text-primary-500'>*</span>
							</FormLabel>
							<FormControl className='mt-3.5'>
								<Input
									placeholder='Username'
									className='no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
									{...field}
								/>
							</FormControl>
							<FormMessage className='text-red-500' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='portfolioWebsite'
					render={({ field }) => (
						<FormItem className='space-y-3.5'>
							<FormLabel className='paragraph-semibold text-dark400_light800'>
								Portfolio Website
							</FormLabel>
							<FormControl className='mt-3.5'>
								<Input
									type='url'
									placeholder='Your portfolio URL'
									className='no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
									{...field}
								/>
							</FormControl>
							<FormMessage className='text-red-500' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='location'
					render={({ field }) => (
						<FormItem className='space-y-3.5'>
							<FormLabel className='paragraph-semibold text-dark400_light800'>
								Location
							</FormLabel>
							<FormControl className='mt-3.5'>
								<Input
									type='text'
									placeholder='Where are you from?'
									className='no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
									{...field}
								/>
							</FormControl>
							<FormMessage className='text-red-500' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='bio'
					render={({ field }) => (
						<FormItem className='space-y-3.5'>
							<FormLabel className='paragraph-semibold text-dark400_light800'>
								Bio<span className='text-primary-500'>*</span>
							</FormLabel>
							<FormControl className='mt-3.5'>
								<Textarea
									rows={9}
									placeholder="What's special about you?"
									className='no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
									{...field}
								/>
							</FormControl>
							<FormMessage className='text-red-500' />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					className='primary-gradient w-fit !text-light-900'
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Editing...' : 'Edit'}
				</Button>
			</form>
		</Form>
	);
};

export default Profile;
