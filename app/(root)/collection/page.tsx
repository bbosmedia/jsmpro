import QuestionCard from '@/components/cards/QuestionCard';
import NoResult from '@/components/shared/NoResult';
import Pagination from '@/components/shared/Pagination';
import Filter from '@/components/shared/filters/Filter';
import HomeFilters from '@/components/shared/filters/HomeFilters';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { Button } from '@/components/ui/button';
import { HomePageFilters, QuestionFilters } from '@/constants/filters';
import { getSavedQuestions } from '@/lib/actions/question.action';
import { SearchParamsProps } from '@/types';
import { auth } from '@clerk/nextjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async ({ searchParams }: SearchParamsProps) => {
	const user = await auth();
	const { userId } = user;
	if (!userId) return redirect('/sign-in');
	const { questions, isNext } = await getSavedQuestions({
		clerkId: user.userId,
		searchQuery: searchParams.q,
		filter: searchParams.filter,
		page: searchParams.page ? +searchParams.page : 1,
		pageSize: 20,
	});
	return (
		<>
			<div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
				<h1 className='h1-bold text-dark100_light900'>Saved questions</h1>
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
					filters={QuestionFilters}
					otherClasses='min-h-[56px] sm:min-w-[170px]'
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
			<div className='mt-10'>
				<Pagination
					pageNumber={searchParams.page ? +searchParams.page : 1}
					isNext={isNext}
				/>
			</div>
		</>
	);
};

export default Page;
