'use client'
import { useAppSelector } from '@/lib/hooks';
import React, { useEffect, useState } from 'react'
import { MdShopTwo } from "react-icons/md";
import { FcLineChart } from "react-icons/fc";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { getStats, productsApi } from '@/api/GetRepairProducts';
import { useRouter } from 'next/navigation';
  
function Dashboard() {

  const router = useRouter()
  const [pending, setPending] = useState([])
  const [unrepairable, setUnrepairable] = useState([])
  const [outRepaired, setOutrepaired] = useState([])
  const userData = useAppSelector(state => state.user.value)
  console.log("userData",userData)

  useEffect(() => {

      getRepair()

  }, [])

  const getRepair = async ()=> {
    const response = await getStats()
    console.log(response)
    setPending(response.pending);
    setUnrepairable(response.unrepairable);
    setOutrepaired(response.outside);
  }

  

  
  return (
    <>
    <div className='mt-0'>
        <div className='container col-span-3'>
      <h2 className='text-xl text-center text-sky-800 my-5'>Dashboard</h2>

    <div className='flex justify-between mb-5 '>
       
        <div  onClick={()=>router.push('/repair/')} className='z-40   group border-l-4 border-l-sky-600  bg-white flex gap-3  px-3 xl:py-5 xl:px-6  pr- items-center shadow-md w-fit text-center  rounded-md bg-gradient-to-br from-gray-100 to-blue-200'>
        <div>
      <div className="flex gap-3 ">
        <span>
          <MdShopTwo className='group-hover:scale-105' size={30} />
        </span>
        <p className="text-xl ">Pending Repairs</p>
      </div>
      <div>
        <p className='text-left text-xl font-bold'>{`${pending}`}</p>
      </div>
    </div>
         <div className='group-hover:scale-105'>
          <FcLineChart className='size-[35px] xl:size-[50px]' />

         </div>
          </div>
        <div onClick={()=>router.push('/repair/unrepairable-repairs')} className=' group border-l-4 border-l-sky-600   flex gap-3 px-3 py-1 xl:py-5 xl:px-6 pr- items-center shadow-md w-fit text-center  rounded-md bg-gradient-to-br from-sky-100 to-slate-300 '>
        <div>
      <div className="flex gap-3">
        <span>
          <FaMoneyCheckAlt className='group-hover:scale-105' size={30} />
        </span>
        <p className="text-xl ">Unrepairable Repairs</p>
      </div>
      <div>
        <p className='text-left text-xl font-bold'>{`${unrepairable}`
}</p>
      </div>
    </div>
         <div>
          <FcLineChart className='group-hover:scale-110' size={50}/>

         </div>
          </div>
        <div onClick={()=>router.push('/repair/out-repairs')} className=' group border-l-4 border-l-sky-600  bg-white flex gap-3 px-3 py-1 xl:py-5 xl:px-6 pr- items-center shadow-md w-fit text-center  rounded-md bg-gradient-to-br from-gray-100 to-blue-200'>
        <div>
      <div className="flex gap-3">
        <span>
          <FaMoneyCheckAlt className='group-hover:scale-110' size={30} />
        </span>
        <p className="text-xl ">Outside Repairs</p>
      </div>
      <div>
        <p className='text-left text-xl font-medium'>{`${outRepaired}`}</p>
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