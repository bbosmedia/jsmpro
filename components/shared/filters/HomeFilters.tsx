'use client';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import { cn } from '@/lib/utils';
import { formUrlQuery } from '@/lib/utils/formUrlQuery';
import removeKeysFromQuery from '@/lib/utils/removeKeysFromQuery';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const HomeFilters = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [active, setActive] = useState('');
	const handleTypeClick = (item: string) => {
		if (active === item) {
			const newUrl = removeKeysFromQuery({
				params: searchParams.toString(),
				keysToRemove: ['filter'],
			});
			router.push(newUrl, { scroll: false });
			setActive('');
		} else {
			const newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: 'filter',
				value: item.toLowerCase(),
			});
			router.push(newUrl, { scroll: false });
			setActive(item);
		}
	};

	return (
		<div className='mt-10 hidden flex-wrap gap-3 md:flex'>
			{HomePageFilters.map(item => (
				<Button
					key={item.value}
					className={cn(
						'body-medium rounded-lg px-6 py-3 capitalize shadow-none',
						{
							'bg-primary-100 text-primary-500': active === item.value,
							'bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light dark:hover:bg-dark-300':
								active !== item.value,
						}
					)}
					onClick={() => handleTypeClick(item.value)}
				>
					{item.name}
				</Button>
			))}
		</div>
	);
};

export default HomeFilters;
