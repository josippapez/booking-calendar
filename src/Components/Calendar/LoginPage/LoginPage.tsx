import { useState } from 'react';
import { useFirebase } from 'react-redux-firebase';
import { useNavigate } from 'react-router';
import { signInWithGoogle } from '../../../store/firebaseActions/authActions';
import { useAppDispatch } from '../../../store/hooks';
import { setUser } from '../../../store/reducers/user';
import style from './LoginPage.module.scss';

type Props = {};

const LoginPage = (props: Props) => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className='flex justify-center h-[calc(100vh_-_80px)] items-center bg-gray-100'>
      <div className='w-full max-w-xs'>
        <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='email'
            >
              Email
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='email'
              type='text'
              placeholder='email@example.com'
            />
          </div>
          <div className='mb-6'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='password'
            >
              Password
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
              id='password'
              type='password'
              placeholder='******************'
            />
            {/* <p className='text-red-500 text-xs italic'>
            Please choose a password.
          </p> */}
          </div>
          <div className='flex items-center justify-center'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='button'
              onClick={() => {
                firebase
                  .auth()
                  .signInWithEmailAndPassword(email, password)
                  .then(res => {
                    console.log(res);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }}
            >
              Sign In
            </button>
          </div>
          <div className='flex items-center justify-evenly'>
            <button
              className={`p-6 mt-4 bg-gray-200 hover:bg-gray-100 rounded focus:outline-none focus:shadow-outline ${style.google}`}
              type='button'
              onClick={() => {
                signInWithGoogle().then(res => {
                  if (res && res.id && res.email && res.accessToken) {
                    dispatch(
                      setUser({
                        id: res.id,
                        email: res.email,
                        accessToken: res.accessToken,
                      })
                    );
                    navigate('/apartments');
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

export default LoginPage;
