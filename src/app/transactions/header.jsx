'use client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from '@/lib/user/userSlice';
import { useRouter } from 'next/navigation';
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";

function THeader() {
  const [isFocused, setIsFocused] = useState(false); // Correctly initialize state
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userData = useAppSelector((state) => state.user.value);

  function handleLogout() {
    router.push('/login');
    dispatch(logoutUser());
  }

  function handleSearchFocus() {
    setIsFocused(true);
  }

  function handleSearchBlur() {
    setIsFocused(false);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const searchQuery = e.target.elements.search.value;
    if (searchQuery) {
      router.push(`/transactions/search?q=${searchQuery}`);
    }
  }

  return (
    <>
      <div className='flex drop-shadow-xl w-full p-3 bg-[#f6f6f6] text-black justify-between h-[50px] items-center'>
        <div>
          <p className='font-sans italic font-bold text-xl'>EziLogs</p>
        </div>
        
        <form 
          className={`flex bg-main rounded-3xl px-3 py-1 items-center border ${isFocused ? 'border-2 border-black' : 'border border-gray-400'}`} // Adjusted classes for border
          onSubmit={handleSearchSubmit}
        >
          <input 
            onFocus={handleSearchFocus} 
            onBlur={handleSearchBlur} 
            name="search" 
            className='h-[30px] w-[300px] bg-inherit border-none text-black outline-none' 
            type="search" 
            placeholder='Search your transactions here' 
          />
          <button type="submit" className='border-none bg-inherit p-0 m-0'>
            <FaSearch size={15} />
          </button>
        </form>

        <div className='flex gap-3'>
          <span className='flex items-center'>
            <p className='mr-2'><IoIosNotifications size={23} /></p>
            <p className='capitalize'>Hi,</p>
            <p className='capitalize font-semibold text-lg text-blue-900'>{userData ? userData?.userDetails?.name || userData?.userinfo?.name : "User"}</p>
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger className=''>
              <div className='border-2 border-indigo-500 rounded-full p-1'>
                <FaUser size={20} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div onClick={handleLogout}>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </div>
              <div>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}

export default THeader;
