'use client';
import React, { useRef, useState } from 'react';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AnswerSchema } from '@/lib/validations/answer';
import { zodResolver } from '@hookform/resolvers/zod';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from '@/context/ThemeProvider';
import { Button } from '../ui/button';
import Image from 'next/image';
import { createAnswer } from '@/lib/actions/answer.action';
import { usePathname } from 'next/navigation';

interface Props {
	question: string;
	questionId: string;
	author: string;
}

const Answer = ({ question, questionId, author }: Props) => {
	const pathanme = usePathname();
	const { mode } = useTheme();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const form = useForm<z.infer<typeof AnswerSchema>>({
		resolver: zodResolver(AnswerSchema),
		defaultValues: {
			answer: '',
		},
	});

	const answerRef = useRef(null);

	const handleCreateAnswer = async (data: z.infer<typeof AnswerSchema>) => {
		setIsSubmitting(value => true);
		try {
			await createAnswer({
				content: data.answer,
				author: JSON.parse(author),
				question: JSON.parse(questionId),
				path: pathanme,
			});
			form.reset();
			if (answerRef.current) {
				const editor = answerRef.current as any;
				editor.setContent('');
			}
		} catch (e) {
			console.log(e);
		} finally {
			setIsSubmitting(value => false);
		}
	};
	return (
		<div>
			<div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
				<h4 className='paragraph-semibold text-dark400_light800'>
					Write your answer here.
				</h4>
				<Button
					onClick={() => {}}
					className='btn light-border-2 gap-1.5 rounded px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500'
				>
					<Image
						width={12}
						height={12}
						className='object-contain'
						src='/assets/icons/stars.svg'
						alt='Star'
					/>
					Generate an AI Answer
				</Button>
			</div>
			<Form {...form}>
				<form
					className='mt-6 flex w-full flex-col gap-10'
					onSubmit={form.handleSubmit(handleCreateAnswer)}
				>
					<FormField
						control={form.control}
						name='answer'
						render={({ field }) => (
							<FormItem>
								<FormControl className='mt-3.5'>
									<Editor
										apiKey={process.env.NEXT_PUBLIC_TINY_URL}
										onInit={(evt, editor) => {
											// @ts-ignore
											answerRef.current = editor;
										}}
										initialValue=''
										onBlur={field.onBlur}
										onEditorChange={content => field.onChange(content)}
										init={{
											height: 350,
											menubar: false,
											plugins: [
												'advlist',
												'autolink',
												'lists',
												'link',
												'image',
												'charmap',
												'preview',
												'anchor',
												'searchreplace',
												'visualblocks',
												'codesample',
												'fullscreen',
												'insertdatetime',
												'media',
												'table',
											],
											toolbar:
												'undo redo | ' +
												'codesample | bold italic forecolor | alignleft aligncenter ' +
												'alignright alignjustify | bullist numlist ' +
												'removeformat | help',
											content_style:
												'body { font-family:Inter,sans-serif; font-size:16px }',
											skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
											content_css: mode === 'dark' ? 'dark' : 'light',
										}}
									/>
								</FormControl>

								<FormMessage className='text-red-500' />
							</FormItem>
						)}
					/>
					<div className='flex justify-end'>
						<Button
							type='submit'
							disabled={isSubmitting}
							className='primary-gradient w-fit text-white'
						>
							{isSubmitting ? 'Submitting...' : 'Submit'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default Answer;
