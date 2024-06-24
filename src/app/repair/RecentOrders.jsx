'use client'
import React, { useEffect, useState } from 'react';
import { patchProductsApiCompleted, patchProductsApiOutRepair, patchProductsApiRepaired, patchProductsApiUnrepairable, productsApi, userInfo } from "@/api/GetRepairProducts"
import { DataTable } from './data-table';
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useForm } from "react-hook-form"
import { IoIosLogOut } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation';



 const RepairForm  = ({row, handlePatchFn, handleUnrepairable}) => {

  const router = useRouter()

  const [receivedDate, setReceivedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format the date as yyyy-mm-dd
  });
  const [show, setShow] = useState(false)
  const { repair_id } = row.original;


  const getTechInfo =  async () => {
    const response = await userInfo()
    setRoles(response)


  }


  useEffect(()=>{
    getTechInfo()

  },[])

  const handlePopup = (e) => {
    e.stopPropagation()
    setShow(true)
}


  const {
    register:register0,
    handleSubmit:handleSubmit0,
    formState: { errors },
  } = useForm()
  const { register: register1, handleSubmit: handleSubmit1 } = useForm();

  const [roles, setRoles] = useState([])

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      repair_status: data.repair_status || 'Repaired' // No change here
    };
  
    if (formData.repair_cost_price !== "" && formData.repair_status === "Repaired") { // Changed from != to !==
      handlePatchFn(formData, repair_id);
    } else if(formData.repair_cost_price === "" && formData.repair_status === "Unrepairable") {
      handleUnrepairable(repair_id);
    }
  };

  function onPost(data){
    const formdata = {...data, outside_repair: true}

     async function products(){
       
       try{
         
         const res = await patchProductsApiOutRepair(formdata, repair_id)
          router.push("/repair/out-repairs")
      }
      catch(err){
        console.log("error",err)
      }
    }

    products()


  }

  
  
  return ( 
    <>

    <div className="flex  items-center pr-4">
      <form
        className="flex ml-4 mr-2 gap-4 items-center w-full max-w-xl"
        onSubmit={handleSubmit0(onSubmit)}
      >
        <div className='w-fit '>
          <div className="flex gap-1 justify-start w-full ">
            <p>Unrepairable</p>
            <input
              onClick={(e) => e.stopPropagation()}
              type="checkbox"
              name="repair_status" // Changed from name="Repaired" to name="repair_status"
              value="Unrepairable"
              {...register0('repair_status')}
            />
          </div>
        </div>
        <div className="flex flex-col w-2/5">
          <label
            htmlFor="repair_cost_price"
            className="block text-sm font-medium text-black capitalize"
          >
           Description
          </label>
          <input
            type="text"
            id="repair_cost_price"
            name="repair_cost_price"
            {...register0('cost_price_description')}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 text-black-600 p-2 w-full border rounded-md"
          />
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
            {...register0('repair_cost_price')}
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
            {...register0('repaired_by')}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 p-2 w-fit border rounded-md"
            required
            defaultValue=""
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
          
          className="bg-indigo-500 hover:bg-indigo-700 text-white rounded-xl p-1"
          type="submit"
        >
          OK
        </button>
      </form>
      <div >
      <Dialog >
  <DialogTrigger >
    <button className='flex justify-end items-center p-1 bg-red-300 rounded-xl '><IoIosLogOut size={20}/></button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Outside repair form</DialogTitle>
      <DialogDescription>
      <form onSubmit={handleSubmit1(onPost)} action="">
      <div className="mb-4">
            <label htmlFor="outside_name" className="block text-sm font-medium text-black">
               Outside shop
            </label>
            <input
              type="text"
              id="outside_name"
              name="outside_name"
              {...register1('outside_name',  { required: true })}
              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
       <div className="mb-4">
            <label htmlFor="outside_taken_date" className="block text-sm font-medium text-black">
              taken date
            </label>
            <input
              type="date"
              id="outside_taken_date"
              name="outside_taken_date"
              {...register1('outside_taken_date',  { required: true })}
              defaultValue={receivedDate}
              onChange={(e) => setReceivedDate(e.target.value)}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
      <div className="mb-4">
            <label htmlFor="taken_by" className="block text-sm font-medium text-black">
               Taken By
            </label>
            <input
              type="text"
              id="taken_by"
              name="taken_by"
              {...register1('taken_by',  { required: true })}
              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          
      <div className="mb-4">
            <label htmlFor="outside_desc" className="block text-sm font-medium text-black">
               Description
            </label>
            <input
              type="text"
              id="outside_desc"
              name="outside_desc"
              {...register1('outside_desc',  { required: true })}
              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-black py-2 px-4 rounded-md  hover:bg-blue-600"
          >
            Post
          </button>
      </form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
</div>
      
    </div>
      </>                                                                                                     

  );
 }

 

export default function RecentOrders() {


  const router = useRouter()
  function handleRowClick (rowData){
    console.log('Clicked row:', rowData);
    router.push(`/repair/productDetails/${rowData.original.repair_id}`)
}
  

 
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

         
          return <div  onClick={() => handleRowClick(row)}  className="capitalize "> {row.getValue("phone_model")} by {customer_name} </div>
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
    accessorKey: "due",
    header: () => <div className="text-right">Due Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("due"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "Nrs",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
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
