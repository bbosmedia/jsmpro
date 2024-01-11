'use client';
import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeProvider';
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from '@/components/ui/menubar';
import Image from 'next/image';
import { themes } from '@/constants';

const Theme = () => {
	const { mode, setMode } = useTheme();

	const handleTheme = () => {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			setMode('dark');
			document.documentElement.classList.add('dark');
		} else {
			setMode('light');
			document.documentElement.classList.add('light');
		}
	};

	useEffect(() => {
		handleTheme();
	}, [mode]);
	return (
		<Menubar className='relative border-none bg-transparent shadow-none'>
			<MenubarMenu>
				<MenubarTrigger>
					{mode === 'light' ? (
						<Image
							src='/assets/icons/sun.svg'
							alt='Sun'
							height={20}
							width={20}
							className='active-theme'
						/>
					) : (
						<Image
							src='/assets/icons/moon.svg'
							alt='Moon'
							height={20}
							width={20}
							className='active-theme'
						/>
					)}
				</MenubarTrigger>
				<MenubarContent className='absolute right-[-3rem] mt-3 min-w-[150px]  rounded py-2 border dark:border-dark-400 dark:bg-dark-300 bg-light-900'>
					{themes.map(item => (
						<MenubarItem
							className='flex items-center gap-4 px-2.5 py-2 focus:bg-light-800 dark:focus:bg-dark-400 cursor-pointer'
							key={item.value}
							onClick={() => {
								setMode(item.value);

								if (item.value !== 'system') {
									localStorage.theme = item.value;
								} else {
									localStorage.removeItem('theme');
								}
							}}
						>
							<Image
								src={item.icon}
								alt={item.label}
								width={16}
								height={16}
								className={`${mode === item.value && 'active-theme'}`}
							/>
							<p
								className={`body-semibold text-light-500 ${
									mode === item.value
										? 'text-primary-500'
										: 'text-dark100_light900'
								}`}
							>
								{item.label}
							</p>
						</MenubarItem>
					))}
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
};

export default Theme;
