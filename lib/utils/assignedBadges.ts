import { BADGE_CRITERIA } from '@/constants';
import { BadgeCounts } from '@/types';

interface BadgeParams {
	criteria: {
		type: keyof typeof BADGE_CRITERIA;
		count: number;
	}[];
}

const assignedBadges = (params: BadgeParams) => {
	const { criteria } = params;
	const badgeCounts: BadgeCounts = {
		GOLD: 0,
		SILVER: 0,
		BRONZE: 0,
	};

	criteria.forEach(item => {
		const { type, count } = item;

		const badgeLevels: any = BADGE_CRITERIA;

		Object.keys(badgeLevels).forEach(level => {
			if (count >= badgeLevels[level]) {
				badgeCounts[level as keyof BadgeCounts] += 1;
			}
		});
	});

	return badgeCounts;
};

export default assignedBadges;
