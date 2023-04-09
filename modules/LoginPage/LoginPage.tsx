import { Routes } from 'consts';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  signInEmailAndPassword,
  signInWithGoogle,
} from '@/store/firebaseActions/authActions';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/reducers/user';
import style from './LoginPage.module.scss';

type Props = {};

export const LoginPage: NextPage = (props: Props) => {
  const { t } = useTranslation('LoginPage');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

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
          <div className='mb-6 text-red-500'>{t(loginError)}</div>
          <div className='flex items-center justify-center'>
            <button
              className='focus:shadow-outline rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-500 focus:outline-none'
              type='button'
              onClick={() => {
                setLoginError('');
                signInEmailAndPassword(email, password).then(
                  (error: string | undefined) => {
                    if (error) {
                      setLoginError(error);
                    } else {
                      router.push(Routes.APARTMENTS);
                    }
                  }
                );
              }}
            >
              {t('sign_in')}
            </button>
          </div>
          <div className='flex items-center justify-evenly'>
            <button
              className={`focus:shadow-outline mt-4 rounded bg-gray-200 p-6 hover:bg-gray-100 focus:outline-none ${style.google}`}
              type='button'
              onClick={() => {
                setLoginError('');
                signInWithGoogle().then(res => {
                  if (res && res.id && res.email && res.accessToken) {
                    dispatch(
                      setUser({
                        id: res.id,
                        email: res.email,
                        accessToken: res.accessToken,
                      })
                    );
                    router.push(Routes.APARTMENTS);
                  }
                });
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
