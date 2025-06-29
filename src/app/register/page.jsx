"use client"

import React, { useState } from 'react';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "../../components/ui/input-otp"
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
  
  
const UserRegister = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const router = useRouter()

    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Password and confirm password do not match!');
            return;
        }

        // Perform API call to register user with password, confirm password, and OTP
        // Replace the following code with your actual API call

        try{
            const response = await fetch (
                `${baseURL}userauth/register/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify({
                        name: name,
                                email: email,
                                password: password,
                                password2: confirmPassword, 
                                otp: otp


                    })
                },{
                    
                             withCredentials: true 
                }

            )

        console.log('Registering user...');
        
        if (response.status === 201) {
            console.log('user created');
            const result = await response.json()
            console.log(result);
            // Reset form fields
            setPassword('');
            setConfirmPassword('');
            setOtp('');
            const accessToken = result.token.access
            const refreshToken = result.token.refresh
            setCookie('accesstoken', accessToken); // expires in 24 hours
            setCookie('refreshtoken', refreshToken); // expires in 24 hours
    
            // localStorage.setItem('accessToken', result.token.access);
            // localStorage.setItem('refreshToken', result.token.refresh);
            router.push('/');
            
        }
    }
    catch (error) {
        console.log(error);
    }

      
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-16 h-16 bg-blue-500/10 rounded-full blur-lg animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-blue-400/10 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-1/3 w-32 h-32 bg-indigo-500/10 rounded-full blur-lg animate-pulse delay-700"></div>
      </div>
            <h2 className="mb-8 text-2xl font-bold text-white">User Registration</h2>
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">


            <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 text-sm font-bold text-gray-700">Email:</label>
                    {/* {email} */}
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}

                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    />
                </div>

            <div className="mb-4">
                    <label htmlFor="name" className="block mb-2 text-sm font-bold text-gray-700">Name:</label>
                    <input
                        type="name"
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block mb-2 text-sm font-bold text-gray-700">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-bold text-gray-700">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="otp" className="block mb-2 text-sm font-bold text-gray-700">OTP:</label>
                    
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={(otp) => setOtp(otp)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">
        {otp === "" ? (
          <>Enter your one-time password.</>
        ) : (
          <>You entered: {otp}</>
        )}
      </div>
    </div>
                <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline">
                    Register
                </button>
            </form>
        </div>
    );
};

export default UserRegister;