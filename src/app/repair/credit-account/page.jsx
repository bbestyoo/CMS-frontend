'use client'
import { postCreditsCustomerApi } from '@/api/GetRepairProducts'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"

function Page() {
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const {
        register,
        watch, 
        setValue,
        handleSubmit,
        formState: { errors },
      } = useForm()

      const router = useRouter()

   
    async function onSubmit(data){
        console.log(data)
        
        if (isSubmitting) return;   
        setIsSubmitting(true);  
        try {
          const res = await postCreditsCustomerApi(data)
          console.log(res)
          router.push(`/repair/call-to-customer/`)
        } catch(err) {
          console.log("error", err)
        } 
      }
       
      
  return (
    <>
   <div className=" mt-10 w-1/2 h-3/5 overflow-y-scroll bg-white text-black mx-auto  p-7 px-10 rounded-xl drop-shadow-xl mb-40 bg-footer">
        <h2 className="text-black text-xl text-center font-semibold mb-5">Add a new credit</h2>
        <form 
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-black">
              Customer Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              {...register('name',  { required: true })}
              className="mt-1 p-2 w-full border rounded-md "
            />
          </div>
          <div className="mb-4">
            <label htmlFor="due" className="block text-sm font-medium text-black">
                Due (Credit)
            </label>
            <input
              type="text"
              id="due"
              name="due"
              {...register('due',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white font-semibold p-3 mt-4 rounded-md disabled:bg-gray-400"

          >
            Submit
          </button>
        </form>
        </div>
    </>
  )
}

export default Page