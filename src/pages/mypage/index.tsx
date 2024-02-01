//강의 02 6:35  setting page
// 상태관리 라이브러리 뷰스탄드 context 새로 갱신하게

/**
 * 내 정보 조회
 */
// export async function getUsers() {
// 	const res = await authAxios.get<UserInfo>(`/users/me`);
// 	return res.data;
// }

// interface putUsersProps {
// 	nickname: string;
// 	profileImageUrl: string;
// }
/**
 * 내 정보 수정
 */
// export async function putUsers(userData: putUsersProps) {
// 	const res = await authAxios.put<UserInfo>(`/users/me`, userData);
// 	return res.data;
// }

/**
 * 프로필 이미지 업로드
 */
// export async function postUsersProfileImage(imageFile: ImagePost) {
// 	const res = await authAxios.post<UsersProfileImagePost>(`/users/me/image`, imageFile);
// 	return res.data;
// }
import { useState } from 'react';
import Button from '@/components/common/Buttons/Button';
import DashboardHeader from '@/components/common/Headers/DashboardHeader';
import Image from 'next/image';
// import FormInput from '@/components/common/Input/FormInput';
import PageLayout from '@/components/common/PageLayout';
import plusIcon from '@/../../Public/assets/myPage-plusIcon.svg';
import leftArrow from '@/../../Public/assets/myPage-leftArrow.svg';
import PassWordForm from '@/components/myPage/PassWordForm';

//모달확인하기위해 import
import MyPageModal from '@/components/modal/MyPageModal';

export default function MyPage() {
	// 모달창 확인을 위한 useState
	const [open, setOpen] = useState(false);

	const additionHandleClick = () => {
		setOpen((prev) => !prev);
	};

	return (
		<>
			<DashboardHeader dashboardId={0} title={'계정관리'} />
			<PageLayout>
				{/* 모달창 확인하기 위해 임시 생성 */}
				<div>
					<div onClick={additionHandleClick}>모달 확인하러 가기</div>

					{open === true ? <MyPageModal isOpen={open} setOpen={setOpen} /> : null}
				</div>
				<div className=' bg-[#FAFAFA]'>
					<div className=' ml-[2rem] '>
						{/* 바로 직전에 클릭했던 링크로 되돌아가야한다. */}
						{/* <Link href=''> */}
						<p className='t-[#333236] flex items-center pt-[2rem] text-[1.6rem] font-medium'>
							<Image src={leftArrow} alt='leftArrow 이미지' className='mr-[0.6rem] h-[2rem] w-[2rem]' />
							돌아가기
						</p>
						{/* </Link> */}
						<div className='mt-[2.5rem] h-[35.5rem] w-[62rem] rounded-lg bg-white '>
							<p className=' ml-[2.8rem] py-[3.2rem] text-[2.4rem] font-bold text-[#332636]'>프로필</p>
							<form className='ml-[2.8rem]'>
								{/* 이미지와 인풋 */}
								<div className='flex'>
									<div className=' mr-[1.6rem] flex h-[18.2rem] w-[18.2rem] items-center justify-center rounded-md bg-[#F5F5F5]'>
										<Image src={plusIcon} alt='plus 이미지' className='h-[3rem] w-[3rem]' />
									</div>
									<div className='w-[36.6rem] bg-pink'>
										{/* <FormInput label='이메일'> */}
										{/* <FormInput /> */}
									</div>
								</div>
								<Button
									color='violet'
									disabled={false}
									type='submit'
									variant='confirm'
									//check) mb-[2.8rem] 적용 못함
									className='float-right mb-[2.8rem] mr-[2.8rem]  mt-[2.4rem] flex '
								>
									저장
								</Button>
							</form>
						</div>
						<PassWordForm />
					</div>
				</div>
			</PageLayout>
		</>
	);
}
