import ProfileLink from '@/components/shared/ProfileLink';
import QuestionTab from '@/components/tabs/QuestionTab';
import Stats from '@/components/shared/Stats';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserInfo } from '@/lib/actions/user.action';
import { formatMonthAndYear } from '@/lib/utils/timeFormatter';
import { URLProps } from '@/types';
import { SignedIn, auth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { userInfo } from 'os';
import React from 'react';
import AnswersTab from '@/components/tabs/AnswersTab';

const Page = async ({ params, searchParams }: URLProps) => {
	const { userId: clerkId } = auth();
	const { user, totalAnswers, totalQuestions } = await getUserInfo({
		userId: params.id,
	});

	return (
		<>
			<div className='flex flex-col-reverse items-start justify-between sm:flex-row'>
				<div className='flex flex-col items-start'>
					<Image
						height={140}
						width={140}
						src={user.picture}
						alt={user.name}
						className='rounded-full object-cover'
					/>
					<div className='mt-3'>
						<h2 className='h2-bold text-dark100_light900'>{user.name}</h2>
						<p className='paragraph-regular text-dark200_light800'>
							@{user.username}
						</p>
						<div className='mt-5 flex flex-wrap items-center justify-start gap-5'>
							{user.portfolioWebsite && (
								<ProfileLink
									imgUrl='/assets/icons/link.svg'
									title='Portfolio'
									href={user.portfolioWebsite}
								/>
							)}
							{user.location && (
								<ProfileLink
									title={user.location}
									imgUrl='/assets/icons/location.svg'
								/>
							)}
							<ProfileLink
								title={formatMonthAndYear(user.joinedAt)}
								imgUrl='/assets/icons/calendar.svg'
							/>
						</div>
						{user.bio && (
							<p className='paragraph-regular text-dark400_light800 mt-8'>
								{user.bio}
							</p>
						)}
					</div>
				</div>
				<div className='flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3'>
					<SignedIn>
						{String(clerkId) === String(user.clerkId) && (
							<Link href='/profile/edit'>
								<Button className='paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3'>
									Edit profile
								</Button>
							</Link>
						)}
					</SignedIn>
				</div>
			</div>
			<Stats totalAnswers={totalAnswers} totalQuestions={totalQuestions} />
			<div className='mt-10 flex gap-10'>
				<Tabs defaultValue='top-posts' className='w-full'>
					<TabsList className='background-light800_dark400 min-h-[42px] p-1'>
						<TabsTrigger value='top-posts' className='tab'>
							Top posts
						</TabsTrigger>
						<TabsTrigger value='answers' className='tab'>
							Answers
						</TabsTrigger>
					</TabsList>
					<TabsContent value='top-posts'>
						<QuestionTab
							searchParams={searchParams}
							userId={user._id}
							clerkId={clerkId}
						/>
					</TabsContent>
					<TabsContent className='flex flex-col w-full' value='answers'>
						<AnswersTab
							searchParams={searchParams}
							userId={user._id}
							clerkId={clerkId}
						/>
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
};

export default Page;
