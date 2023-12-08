'use client';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { SignedOut } from '@clerk/nextjs';
import { Button } from '../ui/button';

const LeftSidebar = () => {
	const pathname = usePathname();
	return (
		<aside className='background-light900_dark200 light-border sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]'>
			<div className='flex flex-1 flex-col gap-6'>
				{sidebarLinks.map(item => {
					const isActive =
						(pathname.includes(item.route) && item.route.length > 1) ||
						item.route === pathname;
					return (
						<Link
							key={item.route}
							href={item.route}
							className={cn(
								'flex items-center justify-start gap-4 bg-transparent p-4',
								{
									'primary-gradient text-light-900 rounded-lg': isActive,
									'text-dark300_light900': !isActive,
								}
							)}
						>
							<Image
								src={item.imgURL}
								alt={item.label}
								height={20}
								width={20}
								className={cn({ 'invert-colors': !isActive })}
							/>
							<p
								className={cn('max-lg:hidden', {
									'base-bold': isActive,
									'base-medium': !isActive,
								})}
							>
								{item.label}
							</p>
						</Link>
					);
				})}
			</div>
			<SignedOut>
				<div className='flex flex-col gap-3'>
					<Link href='sign-in'>
						<Button className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
							<Image
								src='/assets/icons/account.svg'
								alt='User Icon'
								height={20}
								width={20}
								className='invert-colors lg:hidden'
							/>
							<span className='primary-text-gradient max-lg:hidden'>
								Log In
							</span>
						</Button>
					</Link>
					<Link href='sign-up'>
						<Button className='small-medium btn-tertiary light-border-2 text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
							<Image
								src='/assets/icons/sign-up.svg'
								alt='User Icon'
								height={20}
								width={20}
								className='invert-colors lg:hidden'
							/>
							<p className='max-lg:hidden'>Sign Up</p>
						</Button>
					</Link>
				</div>
			</SignedOut>
		</aside>
	);
};

export default LeftSidebar;
