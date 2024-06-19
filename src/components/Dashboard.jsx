'use client'
import { useAppSelector } from '@/lib/hooks';
import React from 'react'
import { SiShopify } from "react-icons/si";
  
function Dashboard() {


  const userData = useAppSelector(state => state.user.value)
  console.log("Asdasduseradta",userData)

  
  return (
    <>
    <div className='mt-0'>
        <div className='container col-span-3'>
      <h2 className='text-2xl font-bold my-5'>My Records</h2>

    <div className='flex justify-between mb-5'>
        <div className='drop-shadow-2xl bg-white flex gap-3 py-5 px-12 pr-20 items-center shadow-md w-fit text-center  rounded-md'>
          <span className=''>
        <SiShopify size="50"/>
          </span>
          <span>
            <p className='text-xl font-semibold'>1000</p>
            <p>Users</p>
          </span>

        </div>
        <div className='drop-shadow-2xl bg-white flex gap-3 py-5 px-10 items-center shadow-md w-fit text-center  rounded-md'>
          <span className=''>
        <SiShopify size="50"/>
          </span>
          <span>
            <p className='text-xl font-semibold'>1000</p>
            <p>Users</p>
          </span>

        </div>
        <div className='drop-shadow-2xl bg-white flex gap-3 py-5 px-10 items-center shadow-md w-fit text-center  rounded-md'>
          <span className=''>
        <SiShopify size="50"/>
          </span>
          <span>
            <p className='text-xl font-semibold'>1000</p>
            <p>Users</p>
          </span>

        </div>
       
        
    </div>
    

    </div>
      

    </div>
   
    </>
  )
}

export default Dashboard