'use client';
import React from 'react';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { SignedOut } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NavContent = () => {
	const pathname = usePathname();
	return (
		<section className='flex h-full flex-1 flex-col gap-6 pt-16'>
			{sidebarLinks.map(item => {
				const isActive =
					(pathname.includes(item.route) && item.route.length > 1) ||
					item.route === pathname;
				return (
					<SheetClose key={item.route + item.imgURL} className='border-none outline-none'>
						<Link
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
								className={cn({
									'base-bold': isActive,
									'base-medium': !isActive,
								})}
							>
								{item.label}
							</p>
						</Link>
					</SheetClose>
				);
			})}
		</section>
	);
};

const MobileNav = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Image
					src='/assets/icons/hamburger.svg'
					className='invert-colors sm:hidden'
					alt='Hamburger menu icon'
					height={36}
					width={36}
				/>
			</SheetTrigger>
			<SheetContent
				side='left'
				className='background-light900_dark200 border-none'
			>
				<Link href='/' className='flex items-center gap-1'>
					<Image
						src='/assets/images/site-logo.svg'
						alt='DevFlow'
						width={23}
						height={23}
					/>
					<p className='h2-bold font-spaceGrotesk text-dark100_light900'>
						Dev<span className='text-primary-500'>Overflow</span>
					</p>
				</Link>
				<div>
					<SheetClose asChild>
						<NavContent />
					</SheetClose>
					<SignedOut>
						<div className='flex flex-col gap-3'>
							<SheetClose asChild>
								<Link href='sign-in'>
									<Button className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
										<span className='primary-text-gradient'>Log In</span>
									</Button>
								</Link>
							</SheetClose>
							<SheetClose asChild>
								<Link href='sign-up'>
									<Button className='small-medium btn-tertiary light-border-2 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none text-dark400_light900'>
										Sign Up
									</Button>
								</Link>
							</SheetClose>
						</div>
					</SignedOut>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileNav;
