import { getTopInteractedTags } from '@/lib/actions/tag.actions';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Badge } from '../ui/badge';
import RenderTag from '../shared/RenderTag';

interface Props {
	user: {
		_id: string;
		clerkId: string;
		name: string;
		username: string;
		email: string;
		picture: string;
	};
}

const UserCard = async ({ user }: Props) => {
	const interactedTags = await getTopInteractedTags({ userId: user._id });
	return (
		<div className='shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]'>
			<article className='background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8'>
				<Link href={'/profile/' + user.clerkId}>
					<Image
						src={user.picture}
						alt={user.name}
						width={100}
						height={100}
						className='rounded-full'
					/>
				</Link>

				<div className='mt-4 text-center'>
					<Link href={'/profile/' + user.clerkId}>
						<h3 className='h3-bold text-dark200_light900 line-clamp-1'>
							{user.name}
						</h3>
					</Link>
					<Link href={'/profile/' + user.clerkId}>
						<p className='body-regular text-dark500_light500 '>
							@{user.username}
						</p>
					</Link>
				</div>
				<div className='mt-5'>
					{interactedTags.length > 0 ? (
						<div className='flex items-center gap-2'>
							{interactedTags.map(tag => (
								<RenderTag
									key={tag._id}
									_id={tag._id}
									name={tag.name}
								></RenderTag>
							))}
						</div>
					) : (
						<Badge>No tags</Badge>
					)}
				</div>
			</article>
		</div>
	);
};

export default UserCard;
