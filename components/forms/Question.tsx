/* eslint-disable react/no-unescaped-entities */
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { QuestionsSchema } from '@/lib/validations/question';
import * as z from 'zod';
import { Editor } from '@tinymce/tinymce-react';
import { useRef, KeyboardEvent, useState } from 'react';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { createQuestion, editQuestion } from '@/lib/actions/question.action';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeProvider';

interface QuestionProps {
	type: 'edit' | 'create';
	mongoUserId: string;
	questionDetails?: string;
}

const Question = ({ type, mongoUserId, questionDetails }: QuestionProps) => {
	const parsedQuestionDetails = questionDetails && JSON.parse(questionDetails);

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const router = useRouter();
	const editorRef = useRef(null);
	const { mode } = useTheme();
	const groupedTags =
		parsedQuestionDetails &&
		parsedQuestionDetails.tags.map((item: any) => item.name);

	const path = usePathname();

	// 1. Define your form.
	const form = useForm<z.infer<typeof QuestionsSchema>>({
		resolver: zodResolver(QuestionsSchema),
		defaultValues: {
			title: parsedQuestionDetails?.title || '',
			explanation: parsedQuestionDetails?.content || '',
			tags: groupedTags || [],
		},
	});

	// 2. Define submit handler
	async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
		setIsSubmitting(() => true);
		try {
			if (type === 'create') {
				await createQuestion({
					title: values.title,
					content: values.explanation,
					tags: values.tags.map(tag => tag.toLowerCase()),
					author: JSON.parse(mongoUserId),
					path: '/',
				});
				router.push('/');
			} else {
				await editQuestion({
					questionId: parsedQuestionDetails._id,
					title: values.title,
					content: values.explanation,
					path: path,
				});
				router.push('/question/' + parsedQuestionDetails._id);
			}
		} catch (e) {
		} finally {
			setIsSubmitting(() => false);
		}
	}

	// Add Tags
	const handleInputKeydown = (
		e: KeyboardEvent<HTMLInputElement>,
		field: ControllerRenderProps<
			{
				title: string;
				explanation: string;
				tags: string[];
			},
			'tags'
		>
	) => {
		if (e.key === 'Enter' && field.name === 'tags') {
			e.preventDefault();
			const tagInput = e.target as HTMLInputElement;
			const tagValue = tagInput.value.trim();
			if (tagValue !== '') {
				if (tagValue.length > 15) {
					form.setError('tags', {
						type: 'required',
						message: 'Tag must be less than 15 characters.',
					});
				}
				if (!field.value.includes(tagValue as never)) {
					form.setValue('tags', [...field.value, tagValue]);
					tagInput.value = '';
					form.clearErrors('tags');
				} else {
					form.trigger();
				}
			}
		}
	};

	// Remove Tags
	const handleTagRemove = (
		tag: string,
		field: ControllerRenderProps<
			{
				title: string;
				explanation: string;
				tags: string[];
			},
			'tags'
		>
	) => {
		const newTags = field.value.filter(item => item !== tag);
		form.setValue('tags', newTags);
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex w-full flex-col gap-10'
			>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='paragraph-semibold text-dark400_light800'>
								Question Title <span className='text-primary-500'>*</span>
							</FormLabel>
							<FormControl className='mt-3.5'>
								<Input
									className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
									{...field}
								/>
							</FormControl>
							<FormDescription className='body-regular mt-2.5 text-light-500'>
								Be specific and imagine you're asking a question to another
								person.
							</FormDescription>
							<FormMessage className='text-red-500' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='explanation'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='paragraph-semibold text-dark400_light800'>
								Question Title <span className='text-primary-500'>*</span>
							</FormLabel>
							<FormControl className='mt-3.5'>
								<Editor
									apiKey={process.env.NEXT_PUBLIC_TINY_URL}
									onInit={(evt, editor) => {
										// @ts-ignore
										editorRef.current = editor;
									}}
									initialValue={parsedQuestionDetails?.content || ''}
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
							<FormDescription className='body-regular mt-2.5 text-light-500'>
								Introduce the problem and expand on what you put in the title.
								Minimum 20 characters.
							</FormDescription>
							<FormMessage className='text-red-500' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='tags'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='paragraph-semibold text-dark400_light800'>
								Tags <span className='text-primary-500'>*</span>
							</FormLabel>
							<FormControl className='mt-3.5'>
								<Input
									disabled={type === 'edit'}
									className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
									placeholder='Add tags...'
									onKeyDown={e => handleInputKeydown(e, field)}
								/>
							</FormControl>
							{field.value.length > 0 && (
								<div className='flex-start mt-2.5 gap-2.5'>
									{field.value.map(item => (
										<Badge
											className='subtle-medium background-light800_dark300 text-dark500_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize'
											key={item}
											onClick={() =>
												type === 'edit' ? null : handleTagRemove(item, field)
											}
										>
											{item}
											{type === 'create' && (
												<Image
													src='/assets/icons/close.svg'
													alt='Close Icon'
													height={12}
													width={12}
													className='object-contain cursor-pointer invert-0 dark:invert'
												/>
											)}
										</Badge>
									))}
								</div>
							)}
							<FormDescription className='body-regular mt-2.5 text-light-500'>
								Add up to 3 tags to describe what your question is about.You
								need to press enter to add tag.
							</FormDescription>
							<FormMessage className='text-red-500' />
						</FormItem>
					)}
				/>
				<Button
					type='submit'
					className='primary-gradient w-fit !text-light-900'
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<>{type === 'edit' ? 'Editing...' : 'Posting...'}</>
					) : (
						<>{type === 'edit' ? 'Edit Question' : 'Ask a Question'}</>
					)}
				</Button>
			</form>
		</Form>
	);
};

export default Question;
