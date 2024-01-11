import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
	return (
		<section>
			<h1 className='h1-bold text-dark100_light900'>All Users</h1>
			<div className='mb-12 mt-11 flex justify-between gap-5 sm:items-center flex-wrap'>
				<Skeleton className='h-14 flex-1 ' />
				<Skeleton className='h-14 w-28' />
			</div>
			<div className='flex flex-col gap-6'>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
					<Skeleton
						key={item + 'loading-home'}
						className='h-60 w-full rounded-xl'
					/>
				))}
			</div>
		</section>
	);
};

export default Loading;
