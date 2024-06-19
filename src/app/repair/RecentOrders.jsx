'use client'
import React, { useEffect, useState } from 'react';
import { patchProductsApiCompleted, patchProductsApiRepaired, patchProductsApiUnrepairable, productsApi, userInfo } from "@/api/GetRepairProducts"
import { DataTable } from './data-table';
import { Checkbox } from "@/components/ui/checkbox"
import { baseURL } from '@/Url';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useForm } from "react-hook-form"



 const RepairForm  = ({row, handlePatchFn, handleUnrepairable}) => {

  const getTechInfo =  async () => {
    console.log("!!!!!!!!!!!!!!!!!!")
    const response = await userInfo()
    console.log("!!!!!!again",response)
    setRoles(response)


  }


  useEffect(()=>{
    getTechInfo()

  },[])


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [roles, setRoles] = useState([])

  const onSubmit = async (data) => {
    console.log("here");
    const { repair_id } = row.original;
    console.log("Form Data:", data);
    console.log("Repair ID:", repair_id);
    const formData = {
      ...data,
      repair_status: data.repair_status || 'Unrepairable' // No change here
    };
  
    if (formData.repair_cost_price !== "" && formData.repair_status === "Repaired") { // Changed from != to !==
      handlePatchFn(formData, repair_id);
    } else {
      handleUnrepairable(repair_id);
    }
  };
  
  return (
    <div className="flex gap-0 items-center pr-4">
      <form
        className="flex ml-4 gap-4 items-center w-full max-w-xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <div className="flex gap-1 justify-between w-full">
            <p>Repaired</p>
            <input
              onClick={(e) => e.stopPropagation()}
              type="checkbox"
              name="repair_status" // Changed from name="Repaired" to name="repair_status"
              value="Repaired"
              {...register('repair_status')}
            />
          </div>
        </div>
        <div className="flex flex-col w-2/5">
          <label
            htmlFor="repair_cost_price"
            className="block text-sm font-medium text-black capitalize"
          >
            Repair Cost
          </label>
          <input
            type="text"
            id="repair_cost_price"
            name="repair_cost_price"
            {...register('repair_cost_price')}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 text-black-600 p-2 w-full border rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="repaired_by" className="block text-sm font-medium text-black">
            Select Technician
          </label>
          <select
            id="repaired_by"
            name="repaired_by"
            {...register('repaired_by')}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 p-2 w-fit border rounded-md"
            required
          >
            <option value="" disabled>
              Select Tech
            </option> 
            {roles.map((role, i) => (
              <option key={i} value={`${role.user_id}`}>
                {role.name}
              </option> 
            ))}
           
          </select>
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className="bg-indigo-500 hover:bg-indigo-700 text-white rounded-xl p-1"
          type="submit"
        >
          OK
        </button>
      </form>
    </div>
  );

 }

 

export default function RecentOrders() {


 
  const [isLoading, setIsLoading] = useState(true)



  
   

  // localStorage.clear();
  console.log("here")
  
  const [data, setData] = useState([])
  const [isRepaired, setIsRepaired] = useState(false)
  // const [isCompleted, setIsCompleted] = useState(false)
  const [isUnrepairable, setIsUnrepairable] = useState(false)

  const columns = [
    {
        accessorKey: "phone_model",
        header: "Products",
        cell: ({ row }) => {

          const {customer_name } = row.original

          return <div className="capitalize "> {row.getValue("phone_model")} by {customer_name} </div>
        },
      },
    {
        accessorKey: "repair_problem",
        header: "Problem",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("repair_problem")}</div>
        ),
      },
 
  {
    accessorKey: "total_amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_amount"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "Nrs",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "repair_status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("repair_status")}</div>
    ),
  },
  {
  id: "select",
  header: "Repaired?",
  cell: ({ row }) => {
    return (

      
      <RepairForm row={row} 
      handlePatchFn={handlePatchFn}
          handleUnrepairable={handleUnrepairable}
      />
    )
   
  },
  enableSorting: false,
  enableHiding: false,
}

 
  
  
  
]




const handlePatchFn = async (formData, repair_id) => {

  
  console.log("entereddddddddddddddd")

  console.log("tfisgoingon",formData)
  console.log("*******",repair_id)
      try {
        // Perform your PATCH request here
        const response = await patchProductsApiRepaired(formData, repair_id)
        const result = await response
        console.log("patched", result)   
        setIsRepaired(true)     

      } 
      catch (error) {
        console.error('Error updating data:', error);
      }
      
}
const handleUnrepairable = async (repairId) => {
  console.log("here")

      try {
        // Perform your PATCH request here
        console.log("here agian")
        console.log("******8",repairId)
        const response = await patchProductsApiUnrepairable(repairId)
        const result = await response
        console.log("patched", result)   
        setIsUnrepairable(true)     

      } 
      catch (error) {
        console.error('Error updating data:', error);
      }
      
}
// const handleCompleted = async (repairId, amountPaid) => {
//   console.log("here")

//       try {
//         // Perform your PATCH request here
//         console.log("here agian")
//         console.log("******8",repairId)
//         const response = await patchProductsApiCompleted(repairId, amountPaid)
//         const result = await response
//         console.log("patched", result)   
//         setIsCompleted(true)     

//       } 
//       catch (error) {
//         console.error('Error updating data:', error);
//       }
      
// }

  const someFunction = async () => {
    try {
        // Call the productsApi function to fetch data
        console.log("asdasd")
        const products = await productsApi();
        
        // Do something with the fetched products data
        console.log("here", products);
        const filteredProducts = products.filter((product) => product.repair_status === "Not repaired");
        console.log("filtered", filteredProducts);
        setData(filteredProducts);
        console.log("datatoshov",filteredProducts)
        setIsLoading(false)
    } catch (error) {
        // Handle errors if any
        console.error('Error fetching products:', error);
    }
};

useEffect(() => { 
someFunction();

}, [isRepaired, isUnrepairable])

return (
    <>
     <div className=" h-[460px] container drop-shadow-xl mx-auto py-10 bg-white text-black rounded-xl">
      <DataTable isLoading={isLoading} columns={columns} data={data} />
    </div>

    </>
  )
}
