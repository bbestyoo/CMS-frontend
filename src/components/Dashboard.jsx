'use client'
import { useAppSelector } from '@/lib/hooks';
import React from 'react'
import { MdShopTwo } from "react-icons/md";
import { FcLineChart } from "react-icons/fc";
import { FaMoneyCheckAlt } from "react-icons/fa";
  
function Dashboard() {


  const userData = useAppSelector(state => state.user.value)
  console.log("Asdasduseradta",userData)

  
  return (
    <>
    <div className='mt-0'>
        <div className='container col-span-3'>
      <h2 className='text-2xl font-bold my-5'>My Records</h2>

    <div className='flex justify-between mb-5'>
       
        <div className='z-40 drop-shadow-2xl group border-l-4 border-l-indigo-900  bg-white flex gap-3 py-5 px-6 pr- items-center shadow-md w-fit text-center  rounded-md'>
        <div>
      <div className="flex gap-3">
        <span>
          <MdShopTwo className='group-hover:scale-110' size={30} />
        </span>
        <p>Total Orders</p>
      </div>
      <div>
        <p className='text-left text-xl font-bold'> 400</p>
      </div>
    </div>
         <div className='group-hover:scale-110'>
          <FcLineChart  size={50}/>

         </div>
          </div>
        <div className='drop-shadow-2xl group border-l-4 border-l-indigo-900  bg-white flex gap-3 py-5 px-6 pr- items-center shadow-md w-fit text-center  rounded-md'>
        <div>
      <div className="flex gap-3">
        <span>
          <FaMoneyCheckAlt className='group-hover:scale-110' size={30} />
        </span>
        <p>Total Sales</p>
      </div>
      <div>
        <p className='text-left text-xl font-bold'>Nrs.5000</p>
      </div>
    </div>
         <div>
          <FcLineChart className='group-hover:scale-110' size={50}/>

         </div>
          </div>
        <div className='drop-shadow-2xl group border-l-4 border-l-indigo-900  bg-white flex gap-3 py-5 px-6 pr- items-center shadow-md w-fit text-center  rounded-md'>
        <div>
      <div className="flex gap-3">
        <span>
          <FaMoneyCheckAlt className='group-hover:scale-110' size={30} />
        </span>
        <p>Total Sales</p>
      </div>
      <div>
        <p className='text-left text-xl font-medium'>Nrs.5000</p>
      </div>
    </div>
         <div>
          <FcLineChart className='group-hover:scale-110' size={50}/>

         </div>
          </div>
       
       
        
    </div>
    

    </div>
      

    </div>
   
    </>
  )
}

export default Dashboard