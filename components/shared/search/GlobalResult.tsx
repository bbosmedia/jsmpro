'use client';
import React, { useEffect, useState } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GlobalFilters from './GlobalFilters';

const GlobalResult = () => {
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState([
		{ type: 'question', id: '333', title: 'Nextjs question' },
		{ type: 'tag', id: '333w', title: 'Nextjs' },
		{ type: 'user', id: '33e3', title: 'Abbos Nurgulshanov' },
	]);
	const global = searchParams.get('global');
	const type = searchParams.get('type');
	useEffect(() => {
		const fetchResult = async () => {
			setResult([]);
			setIsLoading(true);
			try {
			} catch (error) {
				console.log(error);
				throw error;
			} finally {
				setIsLoading(false);
			}
		};
	}, [type, global]);
	return (
		<div className='absolute top-full z-10 mt-3 w-full bg-light-800 py-5 shadow-sm dark:bg-dark-400 rounded-xl'>
			
			<GlobalFilters />
			<div className='my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50' />
			<div className='space-y-5'>
				<p className='text-dark400_light900 paragraph-semibold px-5'>
					Top Match
				</p>
				{isLoading ? (
					<div className='flex-center flex-col px-5'>
						<ReloadIcon className='my-2 h-10 w-10 text-primary-500 animate-spin' />
						<p className='text-dark200_light800'>
							Browsing the entire database
						</p>
					</div>
				) : (
					<div>
						{result.length > 0 ? (
							result.map((item: any, index: number) => (
								<Link
									key={item.type + item.id + index}
									href={renderLink('type', 'a')}
									className='flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50'
								>
									<Image
										src='/assets/icons/tag.svg'
										height={18}
										width={18}
										alt='tags'
										className='invert-colors mt-1 object-contain'
									/>
									<div className='flex flex-col'>
										<p className='body-medium text-dark200_light800 line-clamp-1'>
											{item.title}
										</p>
										<p className='text-light400_light500 capitalize mt-1 font-medium'>
											{item.type}
										</p>
									</div>
								</Link>
							))
						) : (
							<div className='flex-center flex-col px-5'>
								<p className='text-dark200_light800 body-regular px-5 py-2.5'>
									Oops, no results found
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

const renderLink = (type: string, id: string) => {
	return '';
};

export default GlobalResult;