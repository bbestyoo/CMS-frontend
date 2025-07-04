'use client'
import { postProductsApi } from '@/api/GetRepairProducts'
import { useAppSelector } from '@/lib/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"

function Orders() {

  const userData = useAppSelector((state)=> state.user.value)

  const router = useRouter()
  const {
    register,
    watch, 
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const totalAmount = watch('total_amount');
  const advancePaid = watch('advance_paid');

  const [receivedDate, setReceivedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format the date as yyyy-mm-dd
  });
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format the date as yyyy-mm-dd
  });

  const [receivedBy, setReceivedBy] = useState(userData?.userinfo?.name)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function formatErrors(errorObj) {
  return Object.entries(errorObj)
    .map(([key, messages]) => `${formatField(key)}: ${messages.join(", ")}`)
    .join(". ");
}

function formatField(field) {
  // Make it pretty
  return field
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

  useEffect(() => {
    // Calculate the due amount
    const dueAmount = (parseFloat(totalAmount) || 0) - (parseFloat(advancePaid) || 0);
    // Set the due value in the form
    setValue('due', dueAmount);
  }, [totalAmount, advancePaid, setValue]);

  async function onSubmit(data){
    if (isSubmitting) return;
    setIsSubmitting(true);  
    try {
      const res = await postProductsApi(data)
      console.log("reached here",res)
      if(!res.ok){
        const errData = await res.json();
         const message = formatErrors(errData);
      setError(message);
      setIsSubmitting(false)
        return;
      }
      const pathres = await res.json()
      console.log("pathres",pathres)
      setError("");
      router.push(`/search/${pathres.repair_id}`)
    } catch(err) {
      console.log("error", err)
      setIsSubmitting(false)
    } 
  }

  return (
    <>
      <div className="w-[92%] h-[85vh] overflow-y-scroll bg-white text-black mx-auto mt-5 p-7 px-10 rounded-xl drop-shadow-xl mb-0 capitalize0 bg-footer">
        <h2 className="text-black text-xl text-center font-semibold mb-5">Enter a Record</h2>
        <form  
        className='flex flex-wrap justify-around gap-2'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-0 capitalize w-[45%]">
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
          <div className="mb-0 capitalize w-[45%]">
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
          <div className="mb-0 capitalize  w-[45%]">
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
          <div className="mb-0 capitalize  w-[45%]">
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
          <div className="mb-0 capitalize  w-[45%]">
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
          <div className="mb-0 capitalize  w-[45%]">
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
          <div className="mb-0 capitalize  w-[45%]">
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
                Select Sim 
              </option>
              <option value="Absent">Absent</option> 
              <option value="Present">Present</option>
            </select>
          </div>
          <div className="mb-0 capitalize  w-[45%]">
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
          <div className="mb-0 capitalize  w-[45%]">
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
              <option value="Absent">Absent</option>
              <option value="Present">Present</option>
            </select>
          </div>
          <div className="mb-0 capitalize  w-[45%]">
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
              <option value="Absent">Absent</option>
              <option value="Present">Present</option>
            </select>
          </div>
          <div className="mb-0 capitalize  w-[45%]">
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
          <div className="mb-0 capitalize  w-[45%]">
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
          <div className="mb-0 capitalize  w-[45%]">
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
          <div className="mb-0 capitalize   w-[45%]">
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
            />
          </div>
          <div className="mb-0 capitalize   w-[45%]">
            <label htmlFor="delivery_date" className="block text-sm font-medium text-black">
              delivery date
            </label>
            <input
              type="date"
              id="delivery_date"
              name="delivery_date"
              {...register('delivery_date',  { required: true })}
              defaultValue={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}

              className="mt-1 p-2 w-full border rounded-md "
            />
          </div>
          <div className="mb-0 capitalize   w-[45%]">
            <label htmlFor="received_by" className="block text-sm font-medium text-black">
              received by
            </label>
            <input
              type="text"
              id="received_by"
              name="received_by"
              {...register('received_by',  { required: true })}
              defaultValue={receivedBy}
              className="mt-1 p-2 w-full border rounded-md "
            />
          </div>
          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-800 text-white font-semibold p-3 mt-4 rounded-md disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            Submit
          </button>
          {error && <p className='text-red-400 text-sm'>{error}</p>}
        </form>
      </div>
    </>
  )
}

export default Orders
