'use client';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

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
				onChange={() => {}}
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
