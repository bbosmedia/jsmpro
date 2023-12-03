import React from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FilterProps {
	filters: {
		name: string;
		value: string;
	}[];
	otherClasses?: string;
	containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: FilterProps) => {
	return (
		<div className={cn('relative', containerClasses)}>
			<Select>
				<SelectTrigger
					className={cn(
						'body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5',
						otherClasses
					)}
				>
					<div className='flex-1 line-clamp-1 text-left'>
						<SelectValue placeholder='Select a filter' />
					</div>
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{filters.map(item => (
							<SelectItem key={item.value} value={item.value}>
								{item.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};

export default Filter;
