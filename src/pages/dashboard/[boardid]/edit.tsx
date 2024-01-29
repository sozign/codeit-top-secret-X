import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MyDashboardHeader from '@/components/common/Headers/MyDashboardHeader';
import EditBox from '@/components/edit/EditBox';
import arrowLeft from '@/../Public/assets/arrowLeft.svg';
import PageLayout from '@/components/common/PageLayout';
import MemberBox from '@/components/edit/MemberBox';
import { MembersGet, UserInfo } from '@/constants/types';
import InviteListBox from '@/components/edit/InviteListBox';

const myInfo: UserInfo = {
	id: 1,
	email: 'asd@aa.cc',
	nickname: 'asd',
	profileImageUrl: null,
	createdAt: '2024-01-28T00:35:34.671Z',
	updatedAt: '2024-01-28T00:35:34.671Z',
};

const members: MembersGet = {
	totalCount: 5,
	members: [
		{
			id: 1,
			userId: 11,
			email: 'asd@aa.cc',
			nickname: 'asd',
			profileImageUrl: null,
			createdAt: '2024-01-28T00:35:34.671Z',
			updatedAt: '2024-01-28T00:35:34.671Z',
			isOwner: true,
		},
		{
			id: 2,
			userId: 12,
			email: 'fgh@aa.cc',
			nickname: 'fgh',
			profileImageUrl: null,
			createdAt: '2024-01-28T00:35:34.671Z',
			updatedAt: '2024-01-28T00:35:34.671Z',
			isOwner: false,
		},
		{
			id: 3,
			userId: 13,
			email: 'jkl@aa.cc',
			nickname: 'jkl',
			profileImageUrl: null,
			createdAt: '2024-01-28T00:35:34.671Z',
			updatedAt: '2024-01-28T00:35:34.671Z',
			isOwner: false,
		},
		{
			id: 4,
			userId: 14,
			email: 'zxc@aa.cc',
			nickname: 'zxc',
			profileImageUrl: null,
			createdAt: '2024-01-28T00:35:34.671Z',
			updatedAt: '2024-01-28T00:35:34.671Z',
			isOwner: false,
		},
		{
			id: 5,
			userId: 15,
			email: 'vbn@aa.cc',
			nickname: 'vbn',
			profileImageUrl: null,
			createdAt: '2024-01-28T00:35:34.671Z',
			updatedAt: '2024-01-28T00:35:34.671Z',
			isOwner: false,
		},
	],
};

export default function DashBoardEdit() {
	const router = useRouter();
	const boardId = +(router.query?.boardid ?? '');

	const title = '비브리지';
	const color = 'green';

	return (
		<PageLayout boardId={boardId}>
			<div className='flex h-fit flex-col gap-[2rem] bg-gray-F'>
				<MyDashboardHeader title={'비브리지'} nickname={'nickname'} profileImageUrl={''} />
				<Link
					href={`/dashboard/${boardId}`}
					className='ml-[2rem] flex h-fit w-fit items-center justify-center gap-[0.6rem] text-16-500 text-black-3'
				>
					<Image src={arrowLeft} alt='돌아가기 버튼' /> 돌아가기
				</Link>
				<div className='flex flex-col gap-[1.2rem]'>
					<EditBox title={title} color={color} />
					<MemberBox members={members} />
					<InviteListBox />
				</div>
			</div>
		</PageLayout>
	);
}
