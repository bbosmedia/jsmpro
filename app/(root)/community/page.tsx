import UserCard from '@/components/cards/UserCard';
import Pagination from '@/components/shared/Pagination';
import Filter from '@/components/shared/filters/Filter';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { UserFilters } from '@/constants/filters';
import { getAllUsers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
	title: 'Community | Dev Overflow',
	description: 'Dev Overflow is community of 1.000.000+ developers. Join Us.',
	icons: {
		icon: '/assets/images/site-logo.svg',
	},
};

const Page = async ({ searchParams }: SearchParamsProps) => {
	const result = await getAllUsers({
		searchQuery: searchParams.q,
		filter: searchParams.filter,
		page: searchParams.page ? +searchParams.page : 1,
		pageSize: 20,
	});
	return (
		<>
			<h1 className='h1-bold text-dark100_light900'>All Users</h1>
			<div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
				<LocalSearchbar
					route='/'
					iconPosition='left'
					imgSrc='/assets/icons/search.svg'
					otherClasses='flex-1'
					placeholder='Search for users'
				/>
				<Filter
					filters={UserFilters}
					otherClasses='min-h-[56px] sm:min-w-[170px]'
				/>
			</div>
			<section className='mt-12 flex flex-wrap gap-4'>
				{result.users.length > 0 ? (
					result.users.map(user => (
						<UserCard key={user._id} user={user}></UserCard>
					))
				) : (
					<div className='paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center'>
						<p>No users yet</p>
						<Link href='/sign-up' className='mt-1 font-bold text-accent-blue'>
							Join to be the first!
						</Link>
					</div>
				)}
			</section>
			<div className='mt-10'>
				<Pagination
					pageNumber={searchParams.page ? +searchParams.page : 1}
					isNext={result.isNext}
				/>
			</div>
		</>
	);
};

export default Page;
