"use client"
import React, { useState } from 'react';
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { setUserInfo } from '@/lib/user/userSlice';
import { deleteCookie, setCookie } from 'cookies-next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}userauth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.token.access;
        const refreshToken = data.token.refresh;
        setCookie('accesstoken', accessToken, {
          sameSite: 'Lax',
        });
        setCookie('refreshtoken', refreshToken, {
          sameSite: 'Lax',
        });
        dispatch(setUserInfo(data));
        router.push('/');
      } else {
        if (response.status === 404 || 400){
          setError("Email or Password invalid");
        console.error('Login failed:', response.status);
        }
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://ideas.ted.com/wp-content/uploads/sites/3/2021/08/FINAL_Climate-Repair_credit_Stocksy.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-30"></div>
     <div className='text-white absolute top-0 left-0 p-3 text-3xl font-bold'> Ezilogs</div>
      <div className="relative z-10 max-w-md w- space-y-8 backdrop-blur-sm bg-black border-white border text-white rounded-lg p-10 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold">
            Log in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-lg font-medium text-white dark:text-white">Your email</label>
            <input id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-lg font-medium  dark:text-white">Password</label>
            <input id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          </div>
          <div className="flex items-start">

          <div className="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                          </div>
          <div className="ml-3 text-sm">
                            <label htmlFor="remember">Remember me</label>
                          </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log in
            </button>
          </div>
        </form>
        <div className='mt-5 items-center'>
          <p className='text-center font-bold text-md'>Don&apos;t have an Account? Click here to <Link className='text-center text-xl font-bold italic underline hover:text-blue-600' href={'/signup'}>Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
