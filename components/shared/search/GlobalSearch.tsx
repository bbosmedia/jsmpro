import Image from 'next/image';
import React from 'react';
import { Input } from '@/components/ui/input';

const GlobalSearch = () => {
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
					type='text'
					placeholder='Search globally'
			
					className='paragraph-regular no-focus placeholder background-light800_darkgradient outline-none border-none shadow-none'
				/>
			</div>
		</div>
	);
};

export default GlobalSearch;
