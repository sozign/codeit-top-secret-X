import Image from 'next/image';
import arrowIcon from '@/../../Public/assets/arrowIcon.svg';
import crownIcon from '@/../../Public/assets/crownIcon.svg';
import clsx from 'clsx';

type DashboardInfo = {
	color: string;
	title: string;
	createdByMe?: boolean;
	onClick?: () => void;
};
function DashboardButton({ color, title, createdByMe, onClick }: DashboardInfo) {
	return (
		<button
			onClick={onClick}
			className='flex h-[7rem] w-[33.2rem] items-center justify-center gap-[1.2rem]  rounded-[0.8rem] border border-gray-D bg-white md:h-[6.8rem] md:w-[24.7rem] sm:h-[5.8rem] sm:w-[100%]'
		>
			<div className={clsx('h-[0.8rem] w-[0.8rem] rounded', `bg-${color}`)}></div>
			<div className=' sm:text-14-600 text-16-600'>{title}</div>
			{createdByMe ? (
				<div className=' h-1.6rme relative w-[2rem] md:h-[1.4rem] md:w-[1.75rme] sm:h-[1.2rem] sm:w-[1.5re]'>
					<Image src={crownIcon} fill alt='왕관 아이콘' />
				</div>
			) : null}
			<div className='relative h-[1.8rem] w-[1.8rem]'>
				<Image fill src={arrowIcon} alt='화살표 아이콘' />
			</div>
		</button>
	);
}

export default DashboardButton;
