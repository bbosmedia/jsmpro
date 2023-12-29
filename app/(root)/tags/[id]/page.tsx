import QuestionCard from '@/components/cards/QuestionCard';
import NoResult from '@/components/shared/NoResult';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { Button } from '@/components/ui/button';
import { getQuestionsByTagId } from '@/lib/actions/tag.actions';
import { URLProps } from '@/types';
import Link from 'next/link';
import React from 'react';

const Page = async ({ params, searchParams }: URLProps) => {
	const { tagTitle, questions } = await getQuestionsByTagId({
		tagId: params.id,
		page: 1,
		searchQuery: searchParams.q,
	});
	return (
		<>
			<div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
				<h1 className='h1-bold text-dark100_light900 capitalize'>{tagTitle}</h1>
				<Link href='/ask-question' className='flex justify-end max-sm:w-full'>
					<Button className='primary-gradient min-h-[46px] px-4 py-3 text-light-900'>
						Ask a question
					</Button>
				</Link>
			</div>
			<div className='mt-11 w-full'>
				<LocalSearchbar
					route={`/tags/${params.id}`}
					iconPosition='left'
					imgSrc='/assets/icons/search.svg'
					otherClasses='flex-1'
					placeholder='Search for questions'
				/>
			</div>

			<div className='mt-10 flex w-full flex-col gap-6'>
				{questions && questions.length > 0 ? (
					questions.map((question: any) => (
						<QuestionCard
							key={question._id}
							_id={question._id}
							title={question.title}
							tags={question.tags}
							author={question.author}
							upvotes={question.upvotes}
							views={question.views}
							answers={question.answers}
							createdAt={question.createdAt}
						/>
					))
				) : (
					<NoResult
						title="There's no saved question question to show"
						description='Be the first to break the silence. Ask question and kickstart the
	discussion. Our query could be the next big thing others learn from. Get
	involved.'
						link='/ask-question'
						linkTitle='Ask a question'
					/>
				)}
			</div>
		</>
	);
};

export default Page;
