'use client';
import { deleteAnswer } from '@/lib/actions/answer.action';
import { deleteQuestion } from '@/lib/actions/question.action';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface Props {
	type: 'Question' | 'Answer';
	itemId: string;
}

const EditDeleteAction = (props: Props) => {
	const { type, itemId } = props;
	const router = useRouter();
	const path = usePathname();
	const handleEdit = () => {
		router.push('/question/edit/' + JSON.parse(itemId));
	};
	const handleDelete = async () => {
		if (type === 'Question') {
			// Delete Question
			await deleteQuestion({ questionId: JSON.parse(itemId), path });
		}
		if (type === 'Answer') {
			// Delete Answer
			await deleteAnswer({ answerId: JSON.parse(itemId), path });
		}
	};
	return (
		<div className='flex items-center justify-end gap-3 max-sm:w-full'>
			{type === 'Question' && (
				<Image
					onClick={handleEdit}
					src='/assets/icons/edit.svg'
					alt='Edit icon'
					className='cursor-pointer object-contain'
					width={14}
					height={14}
				/>
			)}
			<Image
				onClick={handleDelete}
				src='/assets/icons/trash.svg'
				alt='Delete icon'
				className='cursor-pointer object-contain'
				width={14}
				height={14}
			/>
		</div>
	);
};

export default EditDeleteAction;
