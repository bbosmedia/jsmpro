import { formatNumber } from '@/lib/utils/formatNumber';
import Image from 'next/image';
import React from 'react';

interface Props {
	imgUrl: string;
	title: string;
	value: number;
}

const StatsCard = ({ imgUrl, title, value }: Props) => {
	return (
		<div className='light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200'>
			<Image src={imgUrl} width={40} height={50} alt='Badge Icon' />
			<div>
				<p className='paragraph-semibold text-dark200_light900'>
					{formatNumber(value)}
				</p>
				<p className='body-medium text-dark400_light700'>{title}</p>
			</div>
		</div>
	);
};

export default StatsCard;
