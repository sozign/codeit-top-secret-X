import Link from 'next/link';
import Image from 'next/image';
import TaskifyImage from '../../../Public/assets/TaskifyImage.svg';
import Taskify from '../../../Public/assets/Taskify.svg';

export default function Header() {
	return (
		<header className='bg-white m-3 container sm:px-[2rem] md:px-[2rem] '>
			<div className='flex justify-between items-center'>
				<Link href='/' className='cursor-pointer'>
					<div className='flex items-center p-5 md:mb-0'>
						<Image alt='TaskifyImage' src={TaskifyImage} />
						<Image alt='TaskifyLogo' src={Taskify} className='sm:hidden' />
					</div>
				</Link>
				<nav className='flex items-center justify-center gap-[4rem] pr-[8rem] md:pr-[2rem] sm:pr-[2rem]'>
					<Link href='/login' className=' text-16-500'>
						로그인
					</Link>
					<Link href='/signup' className=' text-16-500'>
						회원가입
					</Link>
				</nav>
			</div>
		</header>
	);
}
