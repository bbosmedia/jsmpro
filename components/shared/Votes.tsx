'use client';
import { downvoteAnswer, upvoteAnswer } from '@/lib/actions/answer.action';
import { viewQuestion } from '@/lib/actions/interaction.action';
import {
	downvoteQuestion,
	upvoteQuestion,
} from '@/lib/actions/question.action';
import { toggleSavedQuestion } from '@/lib/actions/user.action';
import { formatNumber } from '@/lib/utils/formatNumber';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import React, { useEffect } from 'react';

interface Props {
	type: 'Question' | 'Answer';
	itemId: string;
	userId: string;
	upvotes: number;
	hasupVoted: boolean;
	downvotes: number;
	hasdownVoted: boolean;
	hasSaved?: boolean;
}

const Votes = ({
	type,
	itemId,
	userId,
	upvotes,
	hasdownVoted,
	downvotes,
	hasupVoted,
	hasSaved,
}: Props) => {
	const pathname = usePathname();

	const handleSave = async () => {
		await toggleSavedQuestion({
			questionId: JSON.parse(itemId),
			userId: JSON.parse(userId),
			path: pathname,
		});
	};

	const handleVote = async (action: 'upvote' | 'downvote') => {
		const detailsQuestion = {
			questionId: JSON.parse(itemId),
			userId: JSON.parse(userId),
			hasupVoted,
			hasdownVoted,
			path: pathname,
		};
		const detailsAnswer = {
			answerId: JSON.parse(itemId),
			userId: JSON.parse(userId),
			hasupVoted,
			hasdownVoted,
			path: pathname,
		};

		if (!userId) {
			return;
		}
		if (type === 'Question') {
			if (action === 'upvote') {
				await upvoteQuestion(detailsQuestion);
			} else {
				await downvoteQuestion(detailsQuestion);
			}
		} else {
			if (action === 'upvote') {
				await upvoteAnswer(detailsAnswer);
			} else {
				await downvoteAnswer(detailsAnswer);
			}
		}
	};
	useEffect(() => {
		if (type === 'Question') {
			viewQuestion({
				questionId: JSON.parse(itemId),
				userId: userId ? JSON.parse(userId) : undefined,
			});
		}
	}, [pathname, itemId, userId, type]);
	return (
		<div className='flex gap-5'>
			<div className='flex-center gap-2.5'>
				<div className='flex-center gap-1.5'>
					<Image
						src={
							hasupVoted
								? '/assets/icons/upvoted.svg'
								: '/assets/icons/upvote.svg'
						}
						className='cursor-pointer'
						width={18}
						height={18}
						onClick={() => handleVote('upvote')}
						alt='Upvote Icon'
					/>
					<div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
						<p className='subtle-medium text-dark400_light900'>
							{formatNumber(upvotes)}
						</p>
					</div>
				</div>
				<div className='flex-center gap-1.5'>
					<Image
						src={
							hasdownVoted
								? '/assets/icons/downvoted.svg'
								: '/assets/icons/downvote.svg'
						}
						className='cursor-pointer'
						width={18}
						height={18}
						onClick={() => handleVote('downvote')}
						alt='Downvote Icon'
					/>
					<div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
						<p className='subtle-medium text-dark400_light900'>
							{formatNumber(downvotes)}
						</p>
					</div>
				</div>
			</div>
			{type === 'Question' && (
				<Image
					src={
						hasSaved
							? '/assets/icons/star-filled.svg'
							: '/assets/icons/star-red.svg'
					}
					className='cursor-pointer'
					width={18}
					height={18}
					onClick={() => handleSave()}
					alt='Star Icon'
				/>
			)}
		</div>
	);
};

export default Votes;
