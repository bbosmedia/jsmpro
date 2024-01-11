import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
	return (
		<section>
			<div className='mt-12 flex flex-wrap gap-4'>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
					<Skeleton
						key={item + 'loading-home'}
						className='h-60 sm:w-[260px] w-full rounded-xl'
					/>
				))}
			</div>
		</section>
	);
};

export default Loading;
