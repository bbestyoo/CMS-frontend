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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="mb-8 text-2xl font-bold text-gray-700">User Registration</h2>
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