'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/lib/utils/formUrlQuery';
import removeKeysFromQuery from '@/lib/utils/removeKeysFromQuery';
import GlobalResult from './GlobalResult';

const GlobalSearch = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const query = searchParams.get('global');
	const [search, setSearch] = useState(query || '');
	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (search) {
				const newUrl = formUrlQuery({
					params: searchParams.toString(),
					key: 'global',
					value: search,
				});
				router.push(newUrl, { scroll: false });
			} else {
				const newUrl = removeKeysFromQuery({
					params: searchParams.toString(),
					keysToRemove: ['global', 'type'],
				});
				router.push(newUrl, { scroll: false });
			}
		}, 300);
		return () => clearTimeout(delayDebounceFn);
	}, [search, router, pathname, searchParams, query]);
	return (
		<div className='relative w-full max-w-[600px] max-lg:hidden'>
			<div className='background-light800_darkgradient relative min-h-[56px] flex grow items-center gap-1 rounded-xl px-4'>
				<Image
					src='/assets/icons/search.svg'
					height={24}
					width={24}
					alt='Search Icon'
					className='cursor-pointer'
				/>
				<Input
					value={search}
					onChange={e => {
						setSearch(e.target.value);
						if (e.target.value.length > 0 && !isOpen) {
							setIsOpen(true);
						} else {
							setIsOpen(false);
						}
					}}
					type='text'
					placeholder='Search globally'
					className='paragraph-regular no-focus placeholder background-light800_darkgradient outline-none border-none shadow-none text-dark400_light700'
				/>
			</div>
			{isOpen && <GlobalResult />}
		</div>
	);
};

export default GlobalSearch;
