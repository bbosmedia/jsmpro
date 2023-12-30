'use client';
import React, { useState } from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import removeKeysFromQuery from '@/lib/utils/removeKeysFromQuery';
import { formUrlQuery } from '@/lib/utils/formUrlQuery';

interface FilterProps {
	filters: {
		name: string;
		value: string;
	}[];
	otherClasses?: string;
	containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: FilterProps) => {
	const [active, setActive] = useState('');
	const searchParams = useSearchParams();
	const router = useRouter();
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
		<div className={cn('relative', containerClasses)}>
			<Select value={active} onValueChange={value => handleTypeClick(value)}>
				<SelectTrigger
					className={cn(
						'body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5',
						otherClasses
					)}
				>
					<div className='line-clamp-1 flex-1 text-left'>
						<SelectValue placeholder='Select a filter' />
					</div>
				</SelectTrigger>
				<SelectContent className='bg-white'>
					<SelectGroup>
						{filters.map(item => (
							<SelectItem key={item.value} value={item.value}>
								{item.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};

export default Filter;
