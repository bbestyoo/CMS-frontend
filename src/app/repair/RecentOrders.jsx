'use client'
import React, { useEffect, useState, useRef } from 'react';
import { deleteProductsApi, getItems, patchProductsApiCompleted, patchProductsApiOutRepair, patchProductsApiRepaired, patchProductsApiUnrepairable, productsApi, userInfo } from "@/api/GetRepairProducts"
import { DataTable } from './data-table';
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useForm, Controller  } from "react-hook-form"
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
import { FaTrash } from "react-icons/fa";
import { useAppSelector } from '@/lib/hooks';
import { CloudCog } from 'lucide-react';
import { Listbox } from '@headlessui/react'



 const RepairForm  = ({row, roles, handlePatchFn, handleUnrepairable, handleDelete}) => {

  const userData = useAppSelector((state)=> state.user.value)

  const router = useRouter()

  const [receivedDate, setReceivedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format the date as yyyy-mm-dd
  });
  const [show, setShow] = useState(false)
  const { repair_id } = row.original;


  const handlePopup = (e) => {
    e.stopPropagation()
    setShow(true)
}


  const {
    register:register0,
    handleSubmit:handleSubmit0,
    setValue: setValue0,
    formState: { errors },
  } = useForm()
  const { register: register1, handleSubmit: handleSubmit1 } = useForm();


  const onSubmit = async (data) => {
    const formData = {
      ...data,
      repair_status: data.repair_status || 'Repaired' // No change here
    };
    console.log("forum",formData)
  
    if (formData.repair_cost_price !== "" && formData.repaired_by !== "" && formData.repair_status === "Repaired") { // Changed from != to !==
      handlePatchFn(formData, repair_id, selectedItems, totalCost); 
    } else if(formData.repair_cost_price === "" && formData.repair_status === "Unrepairable") {
      handleUnrepairable(repair_id);
    }
  };  

  function onPost(data){
    const formdata = {...data, outside_repair: true}

     async function products(){
       
       try{
        console.log("formdata",formdata)
         const res = await patchProductsApiOutRepair(formdata, repair_id)
          router.push("/repair/out-repairs")
      }
      catch(err){
        console.log("error",err)
      }
    }

    products()


  }
  const [items, setItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([]);
  const dropdownRef = useRef(null);

  // Update editableTotalCost when selectedItems change
  

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const [totalCost, setTotalCost] = useState(0)

  const { control, watch } = useForm()


  const watchSelectedItem = watch('selectedItem')

  useEffect(() => {
    if (watchSelectedItem && !selectedItems.some(item => item.id === watchSelectedItem.id)) {
      setSelectedItems([...selectedItems, { ...watchSelectedItem, quantity: 1 }])
    }
  }, [watchSelectedItem])

  useEffect(() => {
    const newTotalCost = selectedItems.reduce((sum, item) => {
      const itemPrice = items.find(i => i.id === item.id)?.cost || 0
      return sum + itemPrice * item.quantity
    }, 0)
    setTotalCost(newTotalCost)
  }, [selectedItems, items])

  const handleQuantityChange = (id, change) => {
    setSelectedItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    )
  }
 

  

  useEffect(()=>{

    async function fetchInitialData (){
      const response = await getItems()
      console.log("asdasd",response)
      setItems(response)
    }

    fetchInitialData()


  },[])



 
  return ( 
  <>
        
        <div className="flex gap-2  items-center ">
      <form
        className="flex ml-4 gap-4 items-center w-full max-w-xl"
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
      
        <div className="flex items-end space-x-3 px-2 py-4">
      <div className="w-[150px] self-end">
        <Controller
          name="selectedItem"
          control={control}
          render={({ field }) => (
            <Listbox value={field.value} onChange={field.onChange}>
              <div className="relative mt-1">
                <Listbox.Button className="relative  w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{field.value ? field.value.name : 'Select an item'}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    ▼
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {items.map((item) => (
                    <Listbox.Option
                      key={item.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                        }`
                      }
                      value={item}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {item.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              ✓
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          )}
        />
        <div className="mt-4">
          {selectedItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between mt-2">
              <span>{item.name}</span>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  className="px-2 py-1 bg-red-500 text-white rounded-l"
                >
                  -
                </button>
                <span className="px-2 py-1 bg-gray-200">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  className="px-2 py-1 bg-green-500 text-white rounded-r"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col self-center">
        <label htmlFor="totalCost" className=" text-sm font-medium text-gray-700">
          Total Cost
        </label>
        <input
          type="number"
          id="totalCost"
          value={totalCost}
          onChange={(e) => setTotalCost(Number(e.target.value))}
          className="px-3 w-[90px] py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
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
            className="mt-1 p-1 w-fit border rounded-md bg-gray-50 "
            defaultValue=""
          >
            <option  className='' value="" disabled>
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
          
          className="bg-indigo-500 hover:bg-indigo-700 text-white text-[10px] rounded-full font-bold py-1 px-[0.35rem]"
          type="submit"
        >
          OK
        </button>
      </form>
      <div >
      <Dialog >
  <DialogTrigger >
    <button className='flex justify-end items-center p-1 bg-red-300 rounded-xl '><IoIosLogOut size={18}/></button></DialogTrigger>
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
{

  userData?.userinfo?.role === 'Admin' &&
<AlertDialog>
  <AlertDialogTrigger><FaTrash className='' size={18}/>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete this data
        and remove this data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>handleDelete(repair_id)}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

}
      
    </div>

      </>                                                                                                     

  );
 }

 

export default function RecentOrders() {

  // console.log("logged")


  const router = useRouter()

  function handleRowClick (rowData){
    const repairId = rowData.original.repair_id
    router.push(`/repair/productDetails/${repairId}`)
}
  
 
  const [isLoading, setIsLoading] = useState(true)

  // localStorage.clear();
  
  const [data, setData] = useState([])
  const [metadata,setMetadata] = useState({})
  const [isRepaired, setIsRepaired] = useState(false)
  const [isUnrepairable, setIsUnrepairable] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [roles, setRoles] = useState([])

  
const getTechInfo =  async () => {
  const response = await userInfo()
  setRoles(response)
}

useEffect(()=>{
  getTechInfo()
  console.log("Tech is about to hit");
},[])

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
    header: () => <div className="text-right">Due Amt</div>,
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
      roles = {roles}
      handlePatchFn={handlePatchFn}
          handleUnrepairable={handleUnrepairable}
          handleDelete= {handleDelete}
      />
    )
   
  },
  enableSorting: false,
  enableHiding: false,
}
  
]


const handlePatchFn = async (formData, repair_id, selectedItem,totalCost) => {


      try {
        // Perform your PATCH request here
        console.log("asd",formData)
        // console.log("itemscost",selectedItem)
        const newArray = selectedItem.map((item) => ({
          item: item.id,
          quantity: item.quantity,
        }));
        console.log("data",newArray)
        const response = await patchProductsApiRepaired(formData, repair_id, newArray, totalCost)
        const result = await response
        // console.log("patched", result)   
        setIsRepaired(true)     

      } 
      catch (error) {
        console.error('Error updating data:', error);
      }
      
}

const handleDelete = async (repair_id) => {

  try {
    // Perform your PATCH request here
    const response = await deleteProductsApi(repair_id)
    const result = await response
    // console.log("deleted", result)   
    setIsDelete(true)     
  } 
  catch (error) {
    console.error('Error updating data:', error);
  }

}
const handleUnrepairable = async (repairId) => {

      try {
        // Perform your PATCH request here
        const response = await patchProductsApiUnrepairable(repairId)
        const result = await response
        // console.log("patched", result)   
        setIsUnrepairable(true)     

      } 
      catch (error) {
        console.error('Error updating data:', error);
      }
}

  const someFunction = async () => {
    try {
        // Call the productsApi function to fetch data
        const products = await productsApi("Not repaired");
        
        // Do something with the fetched products data
        const filteredProducts = products.results;
        setMetadata({

          "next" : products.next,
          "previous" : products.previous,
          "count" : products.count
        })

        setData(filteredProducts);
        setIsLoading(false)
        setIsRepaired(false)
        setIsDelete(false)
        setIsUnrepairable(false)
    } catch (error) {
        // Handle errors if any
        console.error('Error fetching products:', error);
    }
};



useEffect(() => { 
  console.log("useeffect called")
someFunction();

}, [isRepaired, isUnrepairable, isDelete])


return (
    <>
     <div className=" h-[480px] container overflow-visible drop-shadow-xl mx-auto bg-white text-black rounded-xl">
        <DataTable isLoading={isLoading} columns={columns} initialData={data} initialMetadata={metadata} />
    </div>

    </>
  )
}
