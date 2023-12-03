import Question from '@/components/forms/Question';
import { getUserById } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {
	const userId = 'CL12345';
	const mongoUser = await getUserById({ userId });
	if (!userId) return redirect('/sign-in');
	return (
		<div>
			<h1 className='h1-bold text-dark100_light900'>Ask a question</h1>
			<div className='mt-9'>
				<Question mongoUserId={JSON.stringify(mongoUser._id)} type='create' />
			</div>
		</div>
	);
};

export default Page;
