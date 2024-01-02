'use client';
import { GlobalSearchFilters } from '@/constants/filters';
import { cn } from '@/lib/utils';
import { formUrlQuery } from '@/lib/utils/formUrlQuery';
import removeKeysFromQuery from '@/lib/utils/removeKeysFromQuery';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const GlobalFilters = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const typeParams = searchParams.get('type');
	const [active, setActive] = useState(typeParams || '');

	const handleTypeClick = (filterType: string) => {
		if (typeParams === filterType) {
			setActive('');
			const newUrl = removeKeysFromQuery({
				params: searchParams.toString(),
				keysToRemove: ['type'],
			});
			router.push(newUrl, { scroll: false });
		} else {
			setActive(filterType);
			const newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: 'type',
				value: filterType.toLowerCase(),
			});
			router.push(newUrl, { scroll: false });
		}
	};
	return (
		<div className='flex items-center gap-5 px-5'>
			<p className='text-dark400_light900 body-medium'>Type: </p>
			<div className='flex items-center gap-3'>
				{GlobalSearchFilters.map(item => (
					<button
						type='button'
						key={item.value}
						onClick={() => handleTypeClick(item.value)}
						className={cn(
							'light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800 dark:hover:text-primary-500',
							{
								'bg-primary-500 text-light-900':
									active.toLowerCase() === item.value.toLowerCase(),
								'bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500':
									active !== item.value,
							}
						)}
					>
						{item.name}
					</button>
				))}
			</div>
		</div>
	);
};

export default GlobalFilters;
