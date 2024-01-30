import Link from 'next/link';
import Image from 'next/image';
import { useForm, FieldErrors } from 'react-hook-form';
import AuthInput from '@/components/common/Input/AuthInput';
import { VALIDATE_RULES } from '@/constants/validation';
import AuthButton from '@/components/common/Buttons/AuthButton';
import Taskify from '@/../../Public/assets/Taskify.svg';
import TaskifyImg from '@/../../Public/assets/TaskifyImage.svg';
import { postAuthLogin } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/modal/Layout';
import Button from '@/components/common/Buttons/Button';
import { AxiosError } from 'axios';

const isNoError = (obj: FieldErrors<LoginFormData>) => Object.keys(obj).length === 0;

type LoginFormData = {
	email: string;
	password: string;
	message: string;
};

export default function Login() {
	const {
		register,
		handleSubmit,
		// setError,
		formState: { errors },
	} = useForm<LoginFormData>({
		mode: 'onBlur',
		defaultValues: {
			email: '',
			password: '',
		},
	});
	const [loginError, setLoginError] = useState<boolean>(false);
	const [loginErrorMessageState, setLoginErrorMessage] = useState<string | null>(null);
	const router = useRouter();

	const handleLogin = async (data: LoginFormData) => {
		try {
			const { ...response } = await postAuthLogin(data as LoginFormData);
			localStorage.setItem('accessToken', response.accessToken);
			router.push('/mydashboard');
		} catch (error) {
			if (error instanceof AxiosError) {
				const loginErrorMessage = error.response?.data.message;
				setLoginErrorMessage(loginErrorMessage);
			}
			setLoginError(true);
		}
	};

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			router.push('/mydashboard');
		}
	}, [loginError]);

	const onSubmit = (data: LoginFormData) => {
		handleLogin(data);
	};

	const handleKeyPress = (e: { type: string; code: string }) => {
		// 엔터로 로그인하는 함수
		if (e.type === 'keypress' && e.code === 'Enter') {
			handleSubmit(onSubmit)();
		}
	};

	const INPUT_SETTING = {
		label: {
			email: '이메일',
			password: '비밀번호',
		},
		placeholder: {
			email: '이메일을 입력해 주세요.',
			password: '비밀번호를 입력해 주세요.',
		},
	};

	return (
		<>
			<div className='grid translate-y-[10rem] place-items-center'>
				<Link href='/'>
					<div className='flex h-[22rem] w-[12.5rem] shrink-0 flex-col items-center justify-center gap-2  pl-[0.01rem]'>
						<Image alt='Taskify 로고 이미지' src={TaskifyImg} className='h-[15rem] w-[13rem] shrink-0' />
						<Image alt='Taskify 로고' src={Taskify} className='h-[3.4rem] w-[13rem] shrink-0' />
					</div>
				</Link>
				<p className='text-center text-12-500 text-black-3'>오늘도 만나서 반가워요 !</p>
				<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center gap-[10rem]'>
					<AuthInput
						type='email'
						required={!!VALIDATE_RULES.email?.required}
						label={INPUT_SETTING.label.email}
						placeholder={INPUT_SETTING.placeholder.email}
						errorMessage={errors?.email?.message}
						{...register('email', VALIDATE_RULES.email)}
						className='h-[4.81rem] w-[52rem] gap-2  sm:px-[8.2rem]'
					/>

					<AuthInput
						type='password'
						required={!!VALIDATE_RULES.passwordInLogin?.required}
						label={INPUT_SETTING.label.password}
						placeholder={INPUT_SETTING.placeholder.password}
						errorMessage={errors?.password?.message}
						{...register('password', VALIDATE_RULES.passwordInLogin)}
						onKeyDown={handleKeyPress}
						className='h-[4.81rem] w-[52rem] gap-2 sm:px-[8.2rem]'
					/>
					<div className='flex items-center justify-center '>
						<AuthButton disabled={!isNoError(errors)} type='submit' onClick={() => setLoginError(false)}>
							로그인
						</AuthButton>
					</div>
				</form>
				<p className='py-5 text-12-400 text-black-3'>
					회원이 아니신가요?
					<Link href='/signup' className='text-violet-5 underline'>
						회원가입하기
					</Link>
				</p>
			</div>
			<Layout $modalType='Alert' isOpen={loginError} setOpen={setLoginError}>
				<div className='flex flex-col'>
					<p className='text-center text-12-500'>{loginErrorMessageState}</p>
					<Button
						onClick={() => {
							setLoginError(false);
						}}
						color='violet'
						disabled={false}
						variant='modal'
					>
						확인
					</Button>
				</div>
			</Layout>
		</>
	);
}
