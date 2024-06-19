'use client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React from 'react'
import { FaSearch } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutUser } from '@/lib/user/userSlice';
import { useRouter } from 'next/navigation';
import { FaUser } from "react-icons/fa";


function Header() {

  const dispatch = useAppDispatch()
  const router = useRouter()

  const userData = useAppSelector((state)=> state.user.value)
  // console.log("userdata in header",userData)  

  function handleLogout(){
    dispatch(logoutUser())
    router.push('/')

  }

  return (
    <>
    <div className='flex drop-shadow-xl w-full p-3 bg-[#f6f6f6] text-black justify-between h-[50px] items-center'>
        <div>
            <p>Dashboard</p>
        </div>
        <div className='flex bg-main rounded-2xl px-3 py-1 items-center'>
            <input className='h-[30px] w-[300px] bg-inherit text-white' type="search" placeholder='search' />
<FaSearch size={15}/>
            
        </div>
        <div className='flex gap-3'>
          <span className='flex items-center'>

            <p className='capitalize'>Hi,</p>
            <p className='capitalize font-semibold text-lg text-blue-900'>{userData? userData?.userinfo?.name : "User"}</p>
          </span>
            <DropdownMenu>
  <DropdownMenuTrigger className='' >
    <div className='border-2 border-indigo-500 rounded-full p-1'>

    <FaUser size={20}/>
    </div>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <div onClick= {handleLogout}>

    <DropdownMenuItem >Logout</DropdownMenuItem>
    </div>
    <div>

    <DropdownMenuItem>Subscription</DropdownMenuItem>
    </div>
  </DropdownMenuContent>
</DropdownMenu>

        </div>

    </div>
    </>
  )
}

export default Header