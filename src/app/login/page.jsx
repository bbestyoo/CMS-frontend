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
  const router = useRouter()
  const dispatch = useAppDispatch()
  // deleteCookie('accesstoken')
  // deleteCookie('refreshtoken')

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
        const accessToken = data.token.access
        const refreshToken = data.token.refresh
        setCookie('accesstoken', accessToken, {
          sameSite: 'Lax', // Use 'Strict' or 'Lax' as per your requirement. Use 'None' if you need cross-site usage.
        // secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
        // httpOnly: false 
        }); // expires in 24 hours
        setCookie('refreshtoken', refreshToken, {
          sameSite: 'Lax', // Use 'Strict' or 'Lax' as per your requirement. Use 'None' if you need cross-site usage.
        // secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
        // httpOnly: false 
        }); // expires in 24 hours

        // localStorage.setItem('accessToken', data.token.access);
        // localStorage.setItem('refreshToken', data.token.refresh);
        dispatch(setUserInfo(data))
        router.push('/');
        // router.reload();

      }
      else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Log in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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
      </div>
      <div className='mt-5 flex gap-5 items-center'>
        <p className='text-xl font-semibold'>Dont have an Account?</p>
        <Link className='text-indigo-900 underline' href={'/signup'}>signup</Link>


      </div>
    </div>
  );
};

export default Login;