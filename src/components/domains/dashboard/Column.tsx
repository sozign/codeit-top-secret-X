import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { CardData, ColumnData, MembersData } from '@/constants/types';
import { getCards, getMembers } from '@/lib/api';
import TaskCard from './TaskCard';
import bullet from '@/../Public/assets/bullet.svg';
import setting from '@/../Public/assets/settingIcon.svg';
import addIcon from '@/../../Public/assets/addIcon.svg';
import SquareChip from '@/components/common/chips/SquareChip';

import { useForm, SubmitHandler, Controller, FieldErrors } from 'react-hook-form';
import Layout from '@/components/modal/Layout';
import FormInput from '@/components/common/Input/FormInput';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '@/components/common/Buttons/Button';
import TagInput from '@/components/common/Input/TagInput';
import DropDownManager from '@/components/dropdown/DropDownManager';
import { useRouter } from 'next/router';

/**
 * @TODO
 * 이런 상수 값들 constants로 빼기
 */
const RULES = {
	title: {
		required: '필수값 입니다.',
		maxLength: { value: 20, message: '최대 20자를 넘을 수 없습니다.' },
	},
	description: {
		required: '필수값 입니다.',
		maxLength: { value: 20, message: '최대 20자를 넘을 수 없습니다.' },
	},
	dueDate: {
		min: { value: 18, message: '18 미만의 값을 입력할 수 없습니다.' },
		max: { value: 99, message: '99 초과의 값을 입력할 수 없습니다.' },
	},
};

export interface FormValue {
	assigneeUserId: undefined | number;
	title: string;
	description: string;
	date: Date;
	tag: string[];
}

interface ColumnProps {
	columnItem: ColumnData;
}

export default function Column({ columnItem }: ColumnProps) {
	const router = useRouter();
	const boardId = +(router.query?.boardid ?? '');

	// 대시보드 멤버 데이터 페칭
	const [dashboardMemberList, setDashboardMemberList] = useState<MembersData[]>([]);

	async function loadDashboardMemberList() {
		const data = await getMembers({ page: 0, size: 0, dashboardId: boardId });
		setDashboardMemberList(data.members);
	}

	useEffect(() => {
		loadDashboardMemberList();
	}, []);

	// 컬럼 데이터 페칭 + 무한 스크롤
	const [currentCardList, setCurrentCardList] = useState<CardData[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const trigger = useRef<HTMLDivElement>(null);
	const cardListTotalCount = useRef<number>(0);
	const cursorId = useRef<number | null>(0);

	async function reloadCardList() {
		if (cursorId.current == null) return; // 더 불러올 값이 없을 경우
		setIsLoading(true);

		const query = {
			size: 10,
			cursorId: cursorId.current ?? 0,
			columnId: columnItem.id,
		};
		const data = await getCards(query);

		setCurrentCardList((prevCardList) => {
			return [...prevCardList, ...data.cards];
		});
		cardListTotalCount.current = data.totalCount;
		cursorId.current = data.cursorId;

		setIsLoading(false);
	}

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				if (isLoading) return;
				reloadCardList();
			});
		});

		if (!trigger.current) return;
		observer.observe(trigger.current);

		return () => {
			if (!trigger.current) return;
			observer.unobserve(trigger.current);
		};
	}, []);

	// 모달 관련
	const [isTaskEditModalOpen, setIsTaskEditModalOpen] = useState(false);
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValue>({
		mode: 'onBlur',
		defaultValues: {
			assigneeUserId: undefined,
			title: '',
			description: '',
			date: undefined,
			tag: [],
		},
	});
	const onSubmit: SubmitHandler<FormValue> = (data) => console.log(data);
	const isNoError = (obj: FieldErrors<FormValue>) => Object.keys(obj).length === 0;

	if (!currentCardList) return;
	return (
		<>
			<div className='w-[35.4rem] flex-shrink-0 overflow-y-auto whitespace-nowrap border-b-[0.1rem] border-r-[0.1rem] bg-gray-F px-[2rem] pb-[2rem] pt-[2.2rem] md:container sm:container sm:px-[1.2rem] sm:pt-[1.7rem]'>
				<div className='mb-[2.5rem] flex items-center justify-between sm:mb-[1.7rem] '>
					<div className='flex items-center'>
						<Image className='mr-[0.6rem]' alt='불렛모양 아이콘' src={bullet} />
						<div className='sm:text-16-700 mr-[1.2rem] text-18-700 text-black-3'>{columnItem.title}</div>
						<SquareChip color='gray'>{cardListTotalCount.current}</SquareChip>
					</div>
					<button>
						<Image alt='설정 아이콘' src={setting} />
					</button>
				</div>
				<div className='flex flex-col gap-[1.6rem]'>
					<button
						onClick={() => {
							setIsTaskEditModalOpen(true);
						}}
						className='flex justify-center rounded-[0.6rem] border-[0.1rem] border-gray-D bg-white py-[0.9rem]'
					>
						<SquareChip color='violet'>
							<Image className='px-[0.6rem] py-[0.6rem]' fill src={addIcon} alt='추가하기 아이콘' />
						</SquareChip>
					</button>
					{currentCardList.map((cardItem) => (
						<TaskCard key={cardItem.id} cardItem={cardItem} />
					))}
					<div ref={trigger} />
				</div>
			</div>

			{/* 할 일 생성 모달 */}
			<Layout $modalType='Modal' title='할 일 생성' isOpen={isTaskEditModalOpen} setOpen={setIsTaskEditModalOpen}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DropDownManager<FormValue>
						name='assigneeUserId'
						dashboardMemberList={dashboardMemberList}
						control={control}
					/>
					<FormInput<FormValue>
						label='제목'
						name='title'
						control={control}
						rules={RULES.title}
						required={!!('required' in RULES.title)}
					/>

					<FormInput<FormValue>
						label='설명'
						name='description'
						control={control}
						rules={RULES.description}
						required={!!('required' in RULES.description)}
						className='mt-[2.4rem]'
					/>

					<Controller
						name='date'
						control={control}
						shouldUnregister={true}
						render={({ field: { ref, value, onChange } }) => (
							<>
								<p className='mt-[2.4rem] text-18-500'>마감일</p>
								<div className='container mb-[0.8rem] mt-[1rem] flex h-[5rem] flex-row gap-[1rem] rounded-[0.8rem] border border-gray-D bg-white px-[1.5rem] py-[1.2rem] align-top  text-16-400  '>
									<Image
										className='h-auto w-auto'
										width={20}
										height={20}
										src='/assets/calender.svg'
										alt='캘린더 모양 아이콘'
									/>
									<DatePicker
										onKeyDown={(e) => {
											e.preventDefault(); // 수동 입력 방지
										}}
										dateFormat={'YYYY.MM.dd hh:mm'}
										showTimeSelect={true}
										ref={ref}
										selected={value}
										onChange={onChange}
										className='container placeholder:mt-0 placeholder:text-gray-D focus:outline-violet-5'
										wrapperClassName='container'
										calendarClassName='container'
										placeholderText='날짜를 입력해주세요'
									/>
								</div>
							</>
						)}
					/>
					<TagInput className='mt-[3.2rem]' control={control} label='태그' />

					<div className='mt-[2.8rem] flex flex-row justify-end gap-[1.2rem]'>
						<Button
							onClick={() => {
								setIsTaskEditModalOpen(false);
							}}
							color='modalWhite'
							disabled={false}
							variant='modal'
						>
							취소
						</Button>
						<Button disabled={!isNoError(errors)} type='submit' color='modalViolet' variant='modal'>
							확인
						</Button>
					</div>
				</form>
			</Layout>
		</>
	);
}
