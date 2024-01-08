import { formatNumber } from '@/lib/utils/formatNumber';
import React from 'react';
import StatsCard from '../cards/StatsCard';

interface Props {
	totalQuestions: number;
	totalAnswers: number;
	goldBadges: number;
	bronzeBadges: number;
	silverBadges: number;
	reputations: number;
}

const Stats = ({
	totalQuestions,
	totalAnswers,
	goldBadges,
	bronzeBadges,
	silverBadges,
	reputations,
}: Props) => {
	return (
		<div className='mt-10'>
			<h3 className='h3-semibold text-dark200_light900'>
				Stats - {reputations}
			</h3>
			<div className='grid mt-5 grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4'>
				<div className='light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200'>
					<p>{formatNumber(totalQuestions)}</p>
					<p>Questions</p>
				</div>
				<div className='light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200'>
					<p>{formatNumber(totalAnswers)}</p>
					<p>Answers</p>
				</div>
				<StatsCard
					imgUrl='/assets/icons/gold-medal.svg'
					title='Gold Badges'
					value={goldBadges}
				/>
				<StatsCard
					imgUrl='/assets/icons/silver-medal.svg'
					title='Silver Badges'
					value={silverBadges}
				/>
				<StatsCard
					imgUrl='/assets/icons/bronze-medal.svg'
					title='Bronze Badges'
					value={bronzeBadges}
				/>
			</div>
		</div>
	);
};

export default Stats;
