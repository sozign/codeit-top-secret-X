import Image from 'next/image';
import searchIcon from '@../../../public/assets/searchIcon.svg';
import { InvitationDashboardData } from '@/constants/types';
import Invitation from './Invitation';
import { useRef, useEffect, useState, useCallback } from 'react';
import { getInvitations } from '@/lib/api';
import NotInvited from './NotInvited';
import useAsync from '@/hooks/useAsync';
import BarSpinner from '@/components/common/spinner/BarSpinner';

function InvitationList({
	onAcceptInvitation,
}: {
	onAcceptInvitation: (invitationId: number, accept: boolean) => Promise<void>;
}) {
	const [invitationList, setInvitationList] = useState<(InvitationDashboardData | undefined)[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchKeyword, setSearchKeyword] = useState<string>('');
	const cursorId = useRef<number>(0);
	const lastElementRef = useRef<HTMLDivElement>(null);

	// 추가 초대 요청
	const loadMoreInvitations = async () => {
		setLoading(true);

		try {
			if (cursorId.current === null) return;
			const data = await getInvitations({ size: 2, cursorId: cursorId.current });
			cursorId.current = data.cursorId;

			setInvitationList((prevList) => [...prevList, ...data.invitations]);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	// 검색
	const searchInvitation = async (keyword: string) => {
		try {
			const data = await getInvitations({ size: 20, title: keyword });
			setInvitationList(data.invitations);
		} catch (error) {
			console.error(error);
		}
	};

	//검색 로딩
	const [searchLoading, searchError, executeSearch] = useAsync(searchInvitation);

	const debounce = (func: (keyword: string) => void, delay: number) => {
		let timer: ReturnType<typeof setTimeout>;
		return (keyword: string) => {
			clearTimeout(timer);
			timer = setTimeout(() => func(keyword), delay);
		};
	};

	//검색(+디바운스) 처리
	const handleSearchDebounced = useCallback(
		debounce((keyword: string) => {
			executeSearch(keyword);
		}, 300),
		[],
	);

	useEffect(() => {
		const intersectionObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				loadMoreInvitations();
			});
		});

		if (lastElementRef.current) {
			intersectionObserver.observe(lastElementRef.current);
		}

		return () => {
			if (lastElementRef.current) {
				intersectionObserver.unobserve(lastElementRef.current);
			}
		};
	}, [cursorId.current]);

	return (
		<div>
			<div className='flex h-[100%] w-[102.2rem] flex-col gap-[2rem] rounded-[0.8rem]  bg-white px-[2.8rem] py-[3.2rem] md:w-[100%] sm:w-[100%] sm:px-[2.4rem] sm:py-[2.4rem]'>
				<h2 className='text-24-700 sm:text-20-600'>초대받은 대시보드</h2>
				{!loading && !searchLoading && invitationList.length === 0 && searchKeyword === '' ? (
					<NotInvited />
				) : (
					<div>
						<div className='relative flex items-center justify-between'>
							<Image
								src={searchIcon}
								className='absolute  left-[1.3rem] h-[2.4rem] w-[2.4rem] sm:h-[2.2rem] sm:w-[2.2rem]'
								alt='검색 아이콘'
							/>
							<input
								value={searchKeyword}
								onChange={(e) => {
									handleSearchDebounced(e.target.value);
									setSearchKeyword(e.target.value);
								}}
								placeholder='검색'
								className='w-[100%] rounded-[0.6rem] border border-gray-D px-[4rem] py-[1.1rem] text-14-500 sm:px-[4.4rem]'
							/>
							{searchLoading && (
								<BarSpinner size={2.4} className='absolute right-0 top-1/2 mr-4 -translate-y-1/2 transform' />
							)}
						</div>
						{!searchLoading && (
							<div className='mt-[2rem]'>
								<ul className='flex items-center  justify-between py-[0.4rem] text-16-400 text-gray-9 md:w-[100%]  sm:hidden'>
									<li className=' w-1/3'>이름</li>
									<li className='w-1/3'>초대자</li>
									<li className='w-1/3'>수락여부</li>
								</ul>
								<ul className='flex flex-col  sm:w-[100%]'>
									{invitationList.map((invitation) => (
										<Invitation onAcceptInvitation={onAcceptInvitation} invitation={invitation} key={invitation?.id} />
									))}
								</ul>
								<div ref={lastElementRef}></div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default InvitationList;
