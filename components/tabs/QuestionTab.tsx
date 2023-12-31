import { getUserQuestions } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react';
import QuestionCard from '../cards/QuestionCard';
import Pagination from '../shared/Pagination';

interface Props extends SearchParamsProps {
	userId: string;
	clerkId?: string | null;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
	const result = await getUserQuestions({
		userId,
		page: searchParams.questionsPage ? +searchParams.questionsPage : 1,
		pageSize: 20,
	});
	return (
		<>
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
			<div className='mt-10'>
				<Pagination
					isNext={result.isNext}
					type='userQuestions'
					pageNumber={
						searchParams.questionsPage ? +searchParams.questionsPage : 1
					}
				/>
			</div>
		</>
	);
};

export default QuestionTab;
