import { getUserAnswers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react';
import AnswerCard from '../cards/AnswerCard';

interface Props extends SearchParamsProps {
	userId: string;
	clerkId?: string | null;
}

const AnswersTab = async (props: Props) => {
	const { userId, clerkId, searchParams } = props;
	const result = await getUserAnswers({ userId, page: 1 });
	return (
		<>
			{result.answers.map((answer, index) => (
				<AnswerCard
					_id={answer._id}
					question={answer.question}
					author={answer.author}
					upvotes={answer.upvotes.length}
					createdAt={answer.createdAt}
					clerkId={clerkId}
				/>
			))}
		</>
	);
};

export default AnswersTab;
