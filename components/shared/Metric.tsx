import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface MetricProps {
	imgUrl: string;
	alt: string;
	value: number | string;
	title: string;
	textStyles?: string;
	href?: string;
	isAuthor?: boolean;
}

const Metric = (props: MetricProps) => {
	const { imgUrl, alt, value, href, title, textStyles} = props;
	const metricContent = (
		<>
			<Image
				src={imgUrl}
				alt={alt}
				height={16}
				width={16}
				className={cn('object-contain', {
					'rounded-full': href,
				})}
			/>
			<p className={cn('flex items-center gap-1', textStyles)}>
				{value} {title}
			</p>
		</>
	);
	if (href)
		return (
			<Link href={href} className='flex flex-center gap-1 cursor-pointer'>
				{metricContent}
			</Link>
		);
	return <div className='flex flex-center gap-1'>{metricContent}</div>;
};

export default Metric;
