import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import RenderTag from './RenderTag';
import { getHotQuestions } from '@/lib/actions/question.action';
import { getPopularTags } from '@/lib/actions/tag.actions';

const RightSidebar = async () => {
	const hotQuestions: any = await getHotQuestions();

	const popularTags = await getPopularTags();
	return (
		<aside className='background-light900_dark200 light-border flex flex-col sticky top-0 left-0 h-screen overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden w-[350px]'>
			<div>
				<h3 className='h3-bold text-dark200_light900'>Top Questions</h3>
				<div className='mt-7 flex w-full flex-col gap-[30px]'>
					{hotQuestions.map((item: any) => (
						<Link
							key={item._id}
							href={`/question/${item._id}`}
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
					{popularTags.map((tag: any) => (
						<RenderTag key={tag._id} {...tag} showCount />
					))}
				</div>
			</div>
		</aside>
	);
};

export default RightSidebar;
