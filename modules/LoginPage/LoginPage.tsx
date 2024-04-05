'use client';

import { useAuthenticationControllerLogIn } from '@/api';
import { Link } from '@modules/translations';
import Google from '@public/Styles/Assets/Images/google.svg';
import { Routes } from 'consts';
import Cookies from 'js-cookie';
import { NextPage } from 'next';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

type Props = {};

export const LoginPage: NextPage = (props: Props) => {
  const t = useTranslations('LoginPage');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const { mutate: loginWithEmailAndPassword, isPending } =
    useAuthenticationControllerLogIn({
      mutation: {
        mutationKey: ['login-email-password'],
        onMutate: async () => {
          setLoginError('');
        },
        onError: error => {
          toast.error(t(error.response?.data.message));
        },
        onSuccess: data => {
          Cookies.set('accessToken', data.accessToken);
          Cookies.set('refreshToken', data.refreshToken);
          router.push(Routes.APARTMENTS);
        },
      },
    });

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='w-full max-w-xs'>
        <div className='mb-3 text-xl font-bold'>{t('header')}</div>
        <form className='mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md'>
          <div className='mb-4'>
            <label
              className='mb-2 block text-sm font-bold text-gray-700'
              htmlFor='email'
            >
              {t('email')}
            </label>
            <input
              className='focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none'
              id='email'
              type='text'
              placeholder='email@example.com'
              value={email}
              onChange={e => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className='mb-4'>
            <label
              className='mb-2 block text-sm font-bold text-gray-700'
              htmlFor='password'
            >
              {t('password')}
            </label>
            <input
              className='focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none'
              id='password'
              type='password'
              placeholder='******************'
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
            />
          </div>
          {loginError && (
            <div className='mb-6 text-red-500'>{t(loginError)}</div>
          )}
          <div className='flex items-center justify-center'>
            <button
              className='focus:shadow-outline rounded bg-blue-700 px-4 py-2 font-bold text-white transition-all hover:bg-blue-500 focus:outline-none'
              type='button'
              disabled={isPending}
              onClick={() => {
                loginWithEmailAndPassword({
                  data: {
                    email,
                    password,
                  },
                });
              }}
            >
              {t('sign_in')}
            </button>
          </div>
          <div className='flex items-center justify-evenly'>
            <Link
              href={Routes.GOOGLE_LOGIN}
              target='_self'
              className={`focus:shadow-outline mt-4 rounded bg-gray-200 p-3 transition-all hover:bg-gray-100 focus:outline-none`}
            >
              <Google />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
