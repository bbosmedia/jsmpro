import { getUserQuestions } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react';
import QuestionCard from '../cards/QuestionCard';

interface Props extends SearchParamsProps {
	userId: string;
	clerkId?: string | null;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
	const result = await getUserQuestions({ userId, page: 1});
	return (
		<div className='w-full flex flex-col gap-5'>
			{result.questions.map((item, index) => (
				<QuestionCard
					_id={item._id}
					title={item.title}
					tags={item.tags}
					author={item.author}
					upvotes={item.upvotes}
					views={item.views}
					answers={item.answers}
					createdAt={item.createdAt}
					key={item._id}
					clerkId={clerkId}
				/>
			))}
		</div>
	);
};

export default QuestionTab;
