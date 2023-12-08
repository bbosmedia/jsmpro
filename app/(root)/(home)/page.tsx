import QuestionCard from '@/components/cards/QuestionCard';
import NoResult from '@/components/shared/NoResult';
import Filter from '@/components/shared/filters/Filter';
import HomeFilters from '@/components/shared/filters/HomeFilters';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import { getQuestions } from '@/lib/actions/question.action';
import Link from 'next/link';
import React from 'react';

const Page = async () => {
	const { questions } = await getQuestions({});
	return (
		<>
			<div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
				<h1 className='h1-bold text-dark100_light900'>All questions</h1>
				<Link href='/ask-question' className='flex justify-end max-sm:w-full'>
					<Button className='primary-gradient min-h-[46px] px-4 py-3 text-light-900'>
						Ask a question
					</Button>
				</Link>
			</div>
			<div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
				<LocalSearchbar
					route='/'
					iconPosition='left'
					imgSrc='/assets/icons/search.svg'
					otherClasses='flex-1'
					placeholder='Search for questions'
				/>
				<Filter
					filters={HomePageFilters}
					otherClasses='min-h-[56px] sm:min-w-[170px]'
					containerClasses='hidden max-md:flex'
				/>
			</div>
			<HomeFilters />
			<div className='mt-10 flex w-full flex-col gap-6'>
				{questions && questions.length > 0 ? (
					questions.map(question => (
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
						title="There's no question to show"
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
