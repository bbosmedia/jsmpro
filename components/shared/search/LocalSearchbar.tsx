'use client';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { formUrlQuery } from '@/lib/utils/formUrlQuery';
import removeKeysFromQuery from '@/lib/utils/removeKeysFromQuery'

interface LocalSearchbarProps {
	route: string;
	iconPosition: 'right' | 'left';
	imgSrc: string;
	otherClasses: string;
	placeholder: string;
}

const LocalSearchbar = ({
	route,
	iconPosition,
	placeholder,
	imgSrc,
	otherClasses,
}: LocalSearchbarProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const query = searchParams.get('q');
	const [search, setSearch] = useState(query || '');
	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (search) {
				const newUrl = formUrlQuery({
					params: searchParams.toString(),
					key: 'q',
					value: search,
				});
				router.push(newUrl, { scroll: false });
			}else{
				const newUrl  = removeKeysFromQuery({
					params: searchParams.toString(),
					keysToRemove: ['q']
				})
				router.push(newUrl, { scroll: false });
			}
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [search, route, pathname, router, searchParams, query]);
	return (
		<div
			className={cn(
				'background-light800_darkgradient flex min-h-[56px] grow items-center rounded-[10px] px-4',
				otherClasses
			)}
		>
			{iconPosition === 'left' && (
				<Image
					src={imgSrc}
					alt='Search Icon'
					width={24}
					height={24}
					className='cursor-pointer'
				/>
			)}

			<Input
				type='text'
				value={search}
				onChange={e => setSearch(e.target.value)}
				placeholder={placeholder}
				className='paragraph-regular no-focus placeholder background-light800_darkgradient outline-none border-none shadow-none'
			/>
			{iconPosition === 'right' && (
				<Image
					src={imgSrc}
					alt='Search Icon'
					width={24}
					height={24}
					className='cursor-pointer'
				/>
			)}
		</div>
	);
};

export default LocalSearchbar;
