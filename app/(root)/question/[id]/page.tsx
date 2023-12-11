import Answer from '@/components/forms/Answer'
import Metric from '@/components/shared/Metric';
import ParseHTML from '@/components/shared/ParseHTML';
import RenderTag from '@/components/shared/RenderTag';
import { getQuestionById } from '@/lib/actions/question.action';
import { formatNumber } from '@/lib/utils/formatNumber';
import { timeAgoFormatter } from '@/lib/utils/timeFormatter';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Page = async ({ params }) => {
	const result = await getQuestionById({ questionId: params.id });
	const { author, tags } = await result;
	return (
		<>
			<div className='flex-start w-full flex-col'>
				<div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
					<Link
						className='flex items-center justify-start gap-1'
						href={'/profile/' + author.clerkId}
					>
						<Image
							className='rounded-full'
							width={22}
							height={22}
							src={author.picture}
							alt={author.name}
						/>
						<p className='paragraph-semibold text-dark300_light700'>
							{author.name}
						</p>
					</Link>
					<div>VOTING</div>
				</div>

				<h2 className='h2-semibold text-dark200_light900 mt-3.5 w-full text-left'>
					{result.title}
				</h2>
			</div>
			<div className='mb-8 mt-5 flex w-full flex-wrap gap-4'>
				<Metric
					href={'/profile/' + author.clerkId}
					imgUrl='/assets/icons/clock.svg'
					alt='Clock Icon'
					value={timeAgoFormatter(Date.parse(result.createdAt))}
					title='Asked'
					textStyles='small-medium text-dark400_light800'
				/>
				<Metric
					imgUrl='/assets/icons/message.svg'
					alt='Upvotes'
					value={formatNumber(result.answers.length)}
					title='Answers'
					textStyles='small-medium text-dark400_light800'
				/>
				<Metric
					imgUrl='/assets/icons/eye.svg'
					alt='Eye icon'
					value={formatNumber(result.views)}
					title='Views'
					textStyles='small-medium text-dark400_light800'
				/>
			</div>
			<ParseHTML data={result.content} />
			<div className='mt-8 flex flex-wrap gap-2'>
				{tags.map((tag: any) => (
					<RenderTag
						_id={tag._id}
						name={tag.name}
						key={tag._id}
						showCount={false}
					/>
				))}
			</div>
			<Answer />
		</>
	);
};

export default Page;
