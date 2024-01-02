import Link from 'next/link';
import React from 'react';
import RenderTag from '../shared/RenderTag';
import Metric from '../shared/Metric';
import { timeAgoFormatter, timeFormatter } from '@/lib/utils/timeFormatter';
import { formatNumber } from '@/lib/utils/formatNumber';
import { IUser } from '@/database/user.model';
import { SignedIn, auth } from '@clerk/nextjs';
import EditDeleteAction from '../shared/EditDeleteAction';

interface QuestionCardProps {
	_id: string;
	clerkId?: string | null;
	title: string;
	tags: {
		_id: string;
		name: string;
	}[];
	author: IUser;
	upvotes: Array<Object>;
	views: number;
	answers: Array<Object>;
	createdAt: string;
}

const QuestionCard = (props: QuestionCardProps) => {
	const {
		_id,
		clerkId,
		title,
		tags,
		author,
		upvotes,
		views,
		answers,
		createdAt,
	} = props;
	const showActionButtons = clerkId && clerkId === author.clerkId;
	return (
		<div className='card-wrapper rounded-[10px] p-9 sm:px-11'>
			<div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
				<div>
					<span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>
						{timeFormatter(new Date(createdAt))}
					</span>
					<Link href={'/question/' + _id}>
						<h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>
							{title}
						</h3>
					</Link>
				</div>
				<SignedIn>
					{showActionButtons && (
						<EditDeleteAction type={'Question'} itemId={JSON.stringify(_id)} />
					)}
				</SignedIn>
			</div>
			<div className=' mt-3.5 flex flex-wrap gap-2'>
				{tags.map(item => (
					<RenderTag key={_id} _id={item._id} name={item.name} />
				))}
			</div>
			<div className='flex-between mt-6 w-full flex-wrap gap-3'>
				<Metric
					href={'/profile/' + author.clerkId}
					imgUrl={author.picture}
					alt='Upvotes'
					value={''}
					title={
						author.name + ' asked ' + timeAgoFormatter(Date.parse(createdAt))
					}
					textStyles='small-medium text-dark400_light800'
				/>
				<Metric
					imgUrl='/assets/icons/like.svg'
					alt='Upvotes'
					value={formatNumber(upvotes.length)}
					title='Votes'
					textStyles='small-medium text-dark400_light800'
				/>
				<Metric
					imgUrl='/assets/icons/message.svg'
					alt='Answers'
					value={formatNumber(answers.length)}
					title='Answers'
					textStyles='small-medium text-dark400_light800'
				/>
				<Metric
					imgUrl='/assets/icons/eye.svg'
					alt='Eye icon'
					value={formatNumber(views)}
					title='Views'
					textStyles='small-medium text-dark400_light800'
				/>
			</div>
		</div>
	);
};

export default QuestionCard;
