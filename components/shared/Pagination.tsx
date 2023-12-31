'use client';
import React from 'react';
import { Button } from '../ui/button';
import { formUrlQuery } from '@/lib/utils/formUrlQuery';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
	pageNumber: number;
	isNext: boolean;
	type?: 'userQuestions' | 'userAnswers';
}

const Pagination = (props: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { pageNumber, isNext, type } = props;
	const handleNavigation = (btnType: 'next' | 'prev') => {
		const nextPageNumber = btnType === 'next' ? pageNumber + 1 : pageNumber - 1;
		if (type === 'userQuestions') {
			const newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: 'questionsPage',
				value: nextPageNumber.toString(),
			});
			router.push(newUrl);
		} else if (type === 'userAnswers') {
			const newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: 'answersPage',
				value: nextPageNumber.toString(),
			});
			router.push(newUrl);
		} else {
			const newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: 'page',
				value: nextPageNumber.toString(),
			});
			router.push(newUrl);
		}
	};
	return (
		<div className='flex w-full items-center gap-2 justify-center'>
			<Button
				disabled={pageNumber === 1}
				className='light-border-2 btn border flex min-h-[36px] items-center justify-center gap-2'
				onClick={() => handleNavigation('prev')}
			>
				<p className='body-medium text-dark200_light800'>Prev</p>
			</Button>

			<div className='bg-primary-500 flex justify-center items-center rounded-md px-3.5 py-2'>
				<p className='body-semibold text-light-900'>{pageNumber}</p>
			</div>
			<Button
				disabled={!isNext}
				className='light-border-2 btn border flex min-h-[36px] items-center justify-center gap-2'
				onClick={() => handleNavigation('next')}
			>
				<p className='body-medium text-dark200_light800'>Next</p>
			</Button>
		</div>
	);
};

export default Pagination;
