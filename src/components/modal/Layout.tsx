import { popoverModal } from '@/utils/framerAnimaition';
import { motion } from 'framer-motion';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { createPortal } from 'react-dom';

interface LayoutProps {
	children: ReactNode;
	$modalType: 'Alert' | 'Modal' | 'Task' | 'NotFound';
	title?: string;
	isOpen: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}
function Layout({ children, $modalType, title, isOpen, setOpen }: LayoutProps) {
	if (!isOpen) return null;
	const modalType = {
		NotFound:
			'rounded-[0.8rem] flex h-[25rem] w-[54rem] justify-center rounded-lg bg-white px-[2.8rem] py-[2.8rem] sm:h-[22rem] sm:w-[32.7rem]',
		Alert:
			'rounded-[0.8rem] flex h-[25rem] w-[54rem] justify-center rounded-lg bg-white px-[2.8rem] py-[2.8rem] sm:h-[22rem] sm:w-[32.7rem]',
		Modal:
			'no-scrollbar max-h-[90rem] overflow-y-auto rounded-[0.8rem] flex min-h-[22rem] h-fit w-[54rem] flex-col bg-white px-[2.8rem] pb-[2.8rem] pt-[3.2rem] sm:px-[2rem] sm:py-[2.8rem]',
		Task: 'no-scrollbar max-h-[76.3rem] overflow-y-auto rounded-[0.8rem] flex h-fit w-[73rem] flex-shrink-0 flex-col bg-white px-[2.8rem] py-[3.2rem] md:w-[68rem] sm:w-[32.7rem] sm:px-[2rem] sm:pb-[2.8rem] sm:pt-[1.4rem]',
	};

	if ($modalType === 'NotFound')
		return createPortal(
			<div className='overlay fixed left-0 top-0 z-MODALLAYOUT flex h-full w-full items-center justify-center bg-black-0/50 sm:px-[2.4rem]'>
				<motion.div
					initial='hidden'
					variants={popoverModal}
					animate='visibleSmoother'
					className={`modal relative z-MODAL ${modalType[$modalType]}`}
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					{children}
				</motion.div>
			</div>,
			document.getElementById('modal-root') as HTMLDivElement,
		);
	else
		return createPortal(
			<div
				className='overlay fixed left-0 top-0 z-MODALLAYOUT flex h-full w-full items-center justify-center bg-black-0/50 sm:px-[2.4rem]'
				onClick={() => setOpen((prev) => !prev)}
			>
				<motion.div
					initial='hidden'
					variants={popoverModal}
					animate='visibleSmoother'
					className={`modal relative z-MODAL ${modalType[$modalType]}`}
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					{$modalType === 'Modal' && <p className='mb-[3.2rem] text-24-700 leading-[2.9rem] text-black-3'>{title}</p>}
					{children}
				</motion.div>
			</div>,
			document.getElementById('modal-root') as HTMLDivElement,
		);
}

export default Layout;
