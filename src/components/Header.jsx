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

function Header() {
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
      router.push(`/repair/search?q=${searchQuery}`);
    }
  }

  return (
    <>
      <div className='flex  w-full px-8 bg-gradient-to-r from-sky-500  to-slate-600 via-sky-600 text-black justify-between h-[50px] items-center'>
        <div className='flex items-center '>
          <p className='font-sans   text-md'>Welcome,&nbsp;</p>
           <p className='capitalize font-semibold text-xl '>{userData ? userData?.userDetails?.name || userData?.userinfo?.name : "User"}</p>
        </div>
        
        <form 
          className={`flex bg-main rounded-3xl bg-gray-100 px-3 py-1 items-center border ${isFocused ? 'border-2 border-black' : 'border border-gray-400'}`} // Adjusted classes for border
          onSubmit={handleSearchSubmit}
        >
          <input 
            onFocus={handleSearchFocus} 
            onBlur={handleSearchBlur} 
            name="search" 
            className='h-[30px] w-[50vw] bg-inherit border-none text-black outline-none' 
            type="search" 
            placeholder='Search your repairs here' 
          />
          <button type="submit" className='border-none bg-inherit p-0 m-0'>
            <FaSearch size={15} />
          </button>
        </form>

        <div className='flex '>
          <span className='flex items-center'>
            <p className='mr-2 cursor-pointer'><IoIosNotifications className='text-white' size={23} /></p>
           
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger className=''>
              <div className='border-2 border-white rounded-full p-1'>
                <FaUser className='text-white' size={20} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div  onClick={handleLogout}>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </div>
              <div  onClick={handleLogout}>
                <DropdownMenuItem>Change Password</DropdownMenuItem>
              </div>
              <div >
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}

export default Header;
