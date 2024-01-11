import React from 'react';
import Filter from './filters/Filter';
import { AnswerFilters } from '@/constants/filters';
import { getAnswers } from '@/lib/actions/answer.action';
import ParseHTML from './ParseHTML';
import Link from 'next/link';
import Image from 'next/image';
import { timeAgoFormatter } from '@/lib/utils/timeFormatter';
import Votes from './Votes';
import Pagination from './Pagination';

interface Props {
	questionId: string;
	userId?: string;
	totalAnswers: number;
	page: number;
	filter?: string;
}

const AllAnswers = async ({
	questionId,
	userId,
	totalAnswers,
	page,
	filter,
}: Props) => {
	const result = await getAnswers({
		questionId,
		sortBy: filter,
		pageSize: 20,
		page,
	});
	return (
		<div className='mt-11'>
			<div className='flex items-center justify-between'>
				<h3 className='primary-text-gradient'>{totalAnswers} Answers</h3>
				<Filter filters={AnswerFilters} />
			</div>
			<div>
				{result.answers.map(answer => (
					<article className='light-border border-b py-10' key={answer._id}>
						<div className='mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
							<Link
								href={'/profile/' + answer.author.clerkId}
								className='flex flex-1 items-start gap-1 sm:items-center'
							>
								<Image
									src={answer.author.picture}
									height={18}
									width={18}
									className='rounded-full object-cover max-sm:mt-0.5'
									alt={answer.author.name}
								/>
								<div className='flex flex-col sm:flex-row sm:items-center'>
									<p className='body-semibold text-dark300_light700'>
										{answer.author.name}
									</p>
									<p className='small-regular text-light400_light500 mt-0.5 line-clamp-1 ml-0.5'>
										<span className='max-sm:hidden'> -</span> answered{' '}
										{timeAgoFormatter(answer.createdAt)}
									</p>
								</div>
							</Link>

							<div className='flex justify-end'>
								<Votes
									type='Answer'
									itemId={JSON.stringify(answer._id)}
									userId={userId}
									upvotes={answer.upvotes.length}
									hasupVoted={
										userId ? answer.upvotes.includes(JSON.parse(userId)) : false
									}
									downvotes={answer.downvotes.length}
									hasdownVoted={
										userId
											? answer.downvotes.includes(JSON.parse(userId))
											: false
									}
								/>
							</div>
						</div>

						<ParseHTML data={answer.content} />
					</article>
				))}
			</div>
			<div className='mt-10'>
				<Pagination isNext={result.isNext} pageNumber={page} />
			</div>
		</div>
	);
};

export default AllAnswers;
