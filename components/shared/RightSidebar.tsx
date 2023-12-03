import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import RenderTag from './RenderTag'

const RightSidebar = () => {
	const hotQuestions = [
		{
			_id: 1,
			title: 'How do I use express a custom server in NextJS?',
		},
		{
			_id: 2,
			title: 'How do I use express a custom server in NextJS?',
		},
		{
			_id: 3,
			title: 'How do I use express a custom server in NextJS?',
		},
		{
			_id: 4,
			title: 'How do I use express a custom server in NextJS?',
		},
		{
			_id: 5,
			title: 'How do I use express a custom server in NextJS?',
		},
	];

	const popularTags = [
		{
			_id: 1,
			name: 'javascript',
			totalQuestions: 5,
		},
		{
			_id: 2,
			name: 'react',
			totalQuestions: 4,
		},
		{
			_id: 3,
			name: 'typescript',
			totalQuestions: 4,
		},
		{
			_id: 4,
			name: 'next',
			totalQuestions: 4,
		},
		{
			_id: 3,
			name: 'vue',
			totalQuestions: 4,
		},
	];
	return (
		<aside className='background-light900_dark200 light-border flex flex-col sticky top-0 left-0 h-screen overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden w-[350px]'>
			<div>
				<h3 className='h3-bold text-dark200_light900'>Top Questions</h3>
				<div className='mt-7 flex w-full flex-col gap-[30px]'>
					{hotQuestions.map(item => (
						<Link
							key={item._id}
							href={`/questions/${item._id}`}
							className='flex cursor-pointer items-center justify-between gap-7'
						>
							<p className='body-medium text-dark500_light700'>{item.title}</p>
							<Image
								src='/assets/icons/chevron-right.svg'
								alt='Chevron Right'
								height={20}
								width={20}
								className='invert-colors'
							/>
						</Link>
					))}
				</div>
			</div>
			<div className='mt-16'>
				<h3 className='h3-bold text-dark200_light900'>Popular Tags</h3>
				<div className='flex flex-col mt-7 gap-4'>
					{popularTags.map(tag=><RenderTag key={tag._id} {...tag} showCount />)}
				</div>
			</div>
		</aside>
	);
};

export default RightSidebar;
