'use client'
import { editProductDetails, getSearchProductsApi } from '@/api/GetRepairProducts'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { FaPrint } from "react-icons/fa6";


  function Orders() {
    const router = useRouter()
    const path = useParams()
    const params = path.details
    const {
      register,
      watch, 
      setValue,
      handleSubmit,
      formState: { errors },
    } = useForm()

    const totalAmount = watch('total_amount');
    const advancePaid = watch('advance_paid');

    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      if (params) {
        // Replace with your API endpoint
        getRepair(params)

      }
    }, [params])

    const getRepair = async (params)=> {
      const response = await getSearchProductsApi(`q=${params}`)
      console.log("here is se4arched product",response)
      const data = response[0]
      Object.keys(data).forEach((key) => {
        setValue(key, data[key])
      })
      setLoading(false)

    }
  
    // const onSubmit = (data) => {
    //   // Handle form submission, e.g., send updated data to your API
    //   console.log('Form data submitted:', data)
    // }
  
  const [receivedDate, setReceivedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format the date as yyyy-mm-dd
  });
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format the date as yyyy-mm-dd
  });
  

    useEffect(() => {
      // Calculate the due amount
      const dueAmount = (parseFloat(totalAmount) || 0) - (parseFloat(advancePaid) || 0);
      // Set the due value in the form
      setValue('due', dueAmount);
    }, [totalAmount, advancePaid, setValue]);
  


    

 
   function onSubmit(data){
    console.log("hereeeeeeeeee")

    console.log("data",data)

    
    
     
     async function products(){
       
       try{
         
         const res = await editProductDetails(data)
         console.log("asdasd",res)
         
          console.log("reached here")
          router.push("/")
         
      }
      catch(err){
        console.log("error",err)
      }
    }
    products()
  }


  
  if (loading) return <div>Loading...</div>
  

  return (
    <>
    <div onClick={()=>router.push(`/search/${params}`)} className='w-full flex justify-end px-10 my-5'>
      <span className='bg-white drop-shadow-xl flex gap-3 w-fit px-3 py-1 rounded-xl hover:bg-gray-100'>

      <p className=''>Print in PDF</p>
      <button className='rounded-md'><FaPrint size={30}/></button>
      </span>
    </div>
    <div className="w-1/2 h-4/5 overflow-y-scroll bg-white text-black mx-auto mt-1 p-7 px-10 rounded-xl drop-shadow-xl mb-40 bg-footer">
        <h2 className="text-black text-xl text-center font-semibold mb-5">Post A Repair</h2>
        <form 
        onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label htmlFor="customer_name" className="block text-sm font-medium text-black">
              Customer Name
            </label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              {...register('customer_name',  { required: true })}
              className="mt-1 p-2 w-full border rounded-md "
            />
          </div>
          <div className="mb-4">
            <label htmlFor="customer_phone_number" className="block text-sm font-medium text-black">
              Customer Phone Number
            </label>
            <input
              type="text"
              id="customer_phone_number"
              name="customer_phone_number"
              {...register('customer_phone_number',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone_model" className="block text-sm font-medium text-black">
              Phone Model
            </label>
            <input
              type="text"
              id="phone_model"
              name="phone_model"
              {...register('phone_model',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="repair_problem" className="block text-sm font-medium text-black">
              Repair Problem
            </label>
            <input
              type="text"
              id="repair_problem"
              name="repair_problem"
              {...register('repair_problem',  { required: true })}
              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
                  
          <div className="mb-4">
            <label htmlFor="repair_description" className="block text-sm font-medium text-black capitalize">
              repair description
            </label>
            <textarea
              id="repair_description"
              name="repair_description"
              {...register('repair_description',  { required: true })}
              className="mt-1 p-2 w-full border rounded-md "
              rows="2"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="imei_number" className="block text-sm font-medium text-black">
              Imei number
            </label>
            <input
              type="text"
              id="imei_number"
              name="imei_number"
              {...register('imei_number',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="model_number" className="block text-sm font-medium text-black">
              Model Number
            </label>
            <input
              type="text"
              id="model_number"
              name="model_number"
              {...register('model_number',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone_condition" className="block text-sm font-medium text-black">
              Phone condition
            </label>
            <input
              type="text"
              id="phone_condition"
              name="phone_condition"
              {...register('phone_condition',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="sim" className="block text-sm font-medium text-black">
            </label>
            Sim 
            <select
              id="sim"
              name="sim"
              {...register('sim')}

              className="mt-1 p-2 w-full border rounded-md "
              required
            >
              <option value="" disabled>
                Select Sim tray
              </option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option> 
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="sim_tray" className="block text-sm font-medium text-black">
            </label>
            Sim tray
            <select
              id="sim_tray"
              name="sim_tray"
              {...register('sim_tray')}

              className="mt-1 p-2 w-full border rounded-md "
              required
            >
              <option value="" disabled>
                Select Sim tray
              </option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option> 
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="SD_card" className="block text-sm font-medium text-black">
            </label>
            SD card
            <select
              id="SD_card"
              name="SD_card"
              {...register('SD_card')}

              className="mt-1 p-2 w-full border rounded-md "
              required
            >
              <option value="" disabled>
                Select SD card
              </option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="phone_cover" className="block text-sm font-medium text-black">
            </label>
            phone cover
            <select
              id="phone_cover"
              name="phone_cover"
              {...register('phone_cover')}

              className="mt-1 p-2 w-full border rounded-md "
              required
            >
              <option value="" disabled>
                Select cover
              </option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="total_amount" className="block text-sm font-medium text-black">
              Total Amount
            </label>
            <input
              type="text"
              id="total_amount"
              name="total_amount"
              {...register('total_amount',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="advance_paid" className="block text-sm font-medium text-black">
              Advance paid
            </label>
            <input
              type="text"
              id="advance_paid"
              name="advance_paid"
              {...register('advance_paid',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="due" className="block text-sm font-medium text-black">
              Due
            </label>
            <input
              type="text"
              id="due"
              name="due"
              {...register('due',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="received_date" className="block text-sm font-medium text-black">
              received date
            </label>
            <input
              type="date"
              id="received_date"
              name="received_date"
              {...register('received_date',  { required: true })}
              defaultValue={receivedDate}
              onChange={(e) => setReceivedDate(e.target.value)}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="received_date" className="block text-sm font-medium text-black">
              received date
            </label>
            <input
              type="date"
              id="received_date"
              name="received_date"
              {...register('received_date',  { required: true })}
              defaultValue={receivedDate}
              onChange={(e) => setReceivedDate(e.target.value)}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="delivery_date" className="block text-sm font-medium text-black">
              delivery date
            </label>
            <input
              type="date"
              id="delivery_date"
              name="delivery_date"
              defaultValue={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}

              
              {...register('delivery_date',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="repair_cost_price" className="block text-sm font-medium text-black">
              Repair Cost Price
            </label>
            <input
              type="text"
              id="repair_cost_price"
              name="repair_cost_price"

              
              {...register('repair_cost_price',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="received_by" className="block text-sm font-medium text-black">
              received by
            </label>
            <input
              type="text"
              id="received_by"
              name="received_by"
              {...register('received_by',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="repair_status" className="block text-sm font-medium text-black">
            </label>
            Status
            <select
              id="repair_status"
              name="repair_status"
              {...register('repair_status',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="Repaired">repaired</option>
              <option value="Not repaired">Not repaired</option>
             
            </select>
          </div>
        
        

          <button
            type="submit"
            className="bg-blue-500 text-black py-2 px-4 rounded-md  hover:bg-blue-600"
          >
            Post
          </button>
        </form>
      </div>
    </>
  )
}

export default Orders