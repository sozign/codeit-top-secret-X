import arrowForward from '@/../public/assets/arrowForward.svg';
import DashboardHeader from '@/components/common/Headers/DashboardHeader';
import PageLayout from '@/components/common/PageLayout';
import EditBox from '@/components/domains/edit/EditBox';
import InvitationsBox from '@/components/domains/edit/InvitationsBox';
import MemberBox from '@/components/domains/edit/MemberBox';
import ConfirmModal from '@/components/modal/ConfirmModal';
import NotInvitedMemberAlert from '@/components/modal/NotInvitedMemberAlert';
import { DashboardData } from '@/constants/types';
import { deleteDashboard, getDashboardItem, getUsers } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function DashBoardEdit() {
	const router = useRouter();
	const boardId = +(router.query.boardid ?? 0);

	const [isDashboardDeleteConfirmModalOpen, setIsDashboardDeleteConfirmModalOpen] = useState(false);
	const [dashboardInfo, setDashboardInfo] = useState<DashboardData>({
		id: boardId,
		title: '',
		color: '#7AC555',
		createdAt: '',
		updatedAt: '',
		createdByMe: true,
		userId: 0,
	});

	const [myId, setMyId] = useState<number>();

	const [isAccessPermissionModal, setIsAccessPermissionModal] = useState(false);

	async function loadMyId() {
		const res = await getUsers();
		setMyId(res.id);
	}

	async function loadDashboardData(dashboardId: number) {
		try {
			const resData = await getDashboardItem(dashboardId);
			setDashboardInfo(resData);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	useEffect(() => {
		if (boardId === 0) return;
		loadDashboardData(boardId);
		loadMyId();
		console.log(myId, dashboardInfo.userId);
	}, [boardId]);

	useEffect(() => {
		if (myId !== undefined && dashboardInfo.userId !== undefined) {
			setIsAccessPermissionModal(myId !== dashboardInfo.userId);
		}
	}, [myId, dashboardInfo.userId]);

	async function handleDelete(dashboardId: number) {
		await deleteDashboard(dashboardId);
		router.push('/mydashboard');
	}

	return (
		<>
			{isAccessPermissionModal ? (
				<NotInvitedMemberAlert
					alertMessage='접근 권한이 없습니다.'
					modalControl={{
						isOpen: isAccessPermissionModal,
						setOpen: setIsAccessPermissionModal,
					}}
				/>
			) : (
				<PageLayout boardId={boardId}>
					<div className='flex h-fit min-h-full w-full flex-col gap-[2rem] bg-gray-F pb-[5.6rem] md:pb-[4.8rem] sm:gap-[1.7rem] sm:pb-[2.4rem]'>
						<DashboardHeader dashboardId={boardId} title={''} />
						<Link
							href={`/dashboard/${boardId}`}
							className='ml-[2rem] flex h-fit w-fit items-center justify-center gap-[0.6rem]'
						>
							<Image src={arrowForward} alt='돌아가기 버튼' className='sm:h-[1.8rem] sm:w-[1.8rem]' />
							<span className='text-16-500 text-black-3 sm:text-14-500'>돌아가기</span>
						</Link>
						<div className='flex flex-col gap-[1.2rem] px-[2.8rem] sm:gap-[1.1rem]'>
							<EditBox dashboardId={boardId} title={dashboardInfo.title} color={dashboardInfo.color} />
							<MemberBox boardId={boardId} hostId={dashboardInfo.userId} />
							<InvitationsBox dashboardId={boardId} />
							<button
								onClick={() => setIsDashboardDeleteConfirmModalOpen(true)}
								className='flex  h-[6.2rem]  w-[32.5rem]  items-center justify-center rounded-[0.8rem]  border border-gray-D bg-gray-F text-18-500 text-black-3 sm:w-[100%] sm:text-16-500'
							>
								<div>대시보드 삭제하기</div>
							</button>
						</div>
					</div>
					{isDashboardDeleteConfirmModalOpen && (
						<ConfirmModal
							reload={() => router.push('/mydashboard')}
							request={handleDelete}
							id={boardId}
							content='대시보드를 삭제하시겠습니까?'
							isOpen={isDashboardDeleteConfirmModalOpen}
							setOpen={setIsDashboardDeleteConfirmModalOpen}
						/>
					)}
				</PageLayout>
			)}
		</>
	);
}
