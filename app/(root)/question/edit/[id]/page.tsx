import Question from '@/components/forms/Question';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
import React from 'react';
import { useParams } from 'next/navigation';
import { getQuestionById } from '@/lib/actions/question.action';
import { ParamsProps } from '@/types';

const Page = async ({ params }: ParamsProps) => {
	const { userId } = auth();
	if (!userId) return null;

	const mongoUser = await getUserById({ userId });
	const result = await getQuestionById({ questionId: params.id });
	return (
		<>
			<h1 className='h1-bold text-dark100_light900'>Edit Question</h1>
			<div className='mt-9'>
				<Question
					type='edit'
					mongoUserId={JSON.stringify(mongoUser._id)}
					questionDetails={JSON.stringify(result)}
				/>
			</div>
		</>
	);
};

export default Page;
