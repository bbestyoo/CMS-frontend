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
import { IoAddCircleSharp } from "react-icons/io5";


 const RepairForm  = ({row, roles, handlePatchFn, handleUnrepairable, handleDelete}) => {
  const [totalCost, setTotalCost] = useState(0)

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
    console.log("cost",totalCost)
    const formData = {
      ...data,
      repair_status: data.repair_status || 'Repaired' // No change here
    };
    console.log("forum",formData)
  
    if (totalCost !== "" && formData.repaired_by !== "" && formData.repair_status === "Repaired") { // Changed from != to !==
      handlePatchFn(formData, repair_id, selectedItems, totalCost); 
    } else if(totalCost === 0 && formData.repair_status === "Unrepairable") {
      console.log("this clicked")
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
  const [searchTerm, setSearchTerm] = useState('');


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
        <div className="flex flex-col gap-2  w-fit mx-auto items-end ">
         
      <form
        className="flex flex-col   gap-1 items-start   w-full max-w-xl "
        onSubmit={handleSubmit0(onSubmit)}
      >
        <div className='flex items-start  '>
        <div className="flex  space-x-3  ">
      <div className="w-[180px]  ">
        <p>Select Equipment</p>
        <Controller
  name="selectedItem"
  control={control}
  render={({ field }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="relative z-10 w-full border cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="drop-shadow-none shadow-none">
            {field.value ? field.value.name : 'Click to Select '}
          </span>
         
        </button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="max-w-md border-0 shadow-xl">
  <AlertDialogHeader className="border-b border-sky-100 pb-4">
    <AlertDialogTitle className="text-xl font-semibold text-sky-900 text-center">
      Select Inventory Item
    </AlertDialogTitle>
  </AlertDialogHeader>
  
  <div className="py-4">
    {/* Add inventory button */}
    <div 
      onClick={() => router.push('/repair/inventory/addProduct')} 
      className="flex items-center gap-3 p-3 mb-4 bg-sky-600 text-white hover:bg-sky-700 transition-colors duration-200 cursor-pointer rounded-lg shadow-sm"
    >
      <IoAddCircleSharp className="text-lg" />
      <span className="font-medium">Add New Inventory</span>
    </div>
    
    {/* Search bar */}
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      />
    </div>
    
    {/* Items list */}
    <div className="max-h-48 overflow-y-auto border border-sky-100 rounded-lg">
      <div className="divide-y divide-sky-50">
        {items
          .filter(item => 
            item.quantity !== 0 && 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item) => (
            <div
              key={item.id}
              onClick={() => field.onChange(item)}
              className={`relative cursor-pointer px-4 py-3 transition-colors duration-150 hover:bg-sky-50 ${
                field.value?.id === item.id 
                  ? 'bg-sky-100 border-l-4 border-sky-600' 
                  : 'hover:border-l-4 hover:border-sky-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm truncate pr-8 ${
                  field.value?.id === item.id ? 'font-semibold text-sky-900' : 'text-gray-700'
                }`}>
                  {item.brand_name + " " + item.name + " " + item.category_name}
                </span>
                {field.value?.id === item.id && (
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 bg-sky-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        }
        {items.filter(item => 
          item.quantity !== 0 && 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).length === 0 && (
          <div className="px-4 py-8 text-center text-gray-500 text-sm">
            No items found matching &quot;{searchTerm}&quot;
          </div>
        )}
      </div>
    </div>
  </div>
  
  <div className="border-t border-sky-100 pt-4">
    <AlertDialogAction className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200">
      Close
    </AlertDialogAction>
  </div>
</AlertDialogContent>
    </AlertDialog>
  )}
/>
        <div className="mt-2 bg-white pl-2 rounded-lg w-full overflow-x-visible">
          {selectedItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between mt-2">
              <span>{item.name}</span>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  className="px-2 py-1 bg-red-400  text-white rounded-l"
                >
                  -
                </button>
                <span className="px-2 py-1 bg-gray-200">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  className="px-2 py-1 bg-green-400 text-white rounded-r"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col ">
        <label htmlFor="totalCost" className=" text-sm font-medium text-gray-700">
          Total Cost
        </label>
        <input
        name="totalCost"
          id="totalCost"
          value={totalCost}
          onChange={(e) => {
            const value = e.target.value;
          
            // Check if the value is a valid number
            if (!isNaN(value) && value.trim() !== '') {
              setTotalCost(Number(value)); // Convert to number only if valid
            } else if (value === '') {
              setTotalCost(''); // Allow clearing the input
            }
          }}          className="px-3 w-[90px] py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
    <div className='flex flex-row gap-3 items-end '>
      <div className="flex ml-2 flex-col justify-start w-fit">
          <label htmlFor="repaired_by" className="block text-sm  font-medium text-black ">
            Select Technician
          </label>
          <select
            id="repaired_by"
            name="repaired_by"
            {...register0('repaired_by')}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 p-2 w-fit border rounded-md bg-white cursor-pointer"
            defaultValue=""
          >
            <option  className='' value="" disabled>
              Select Technician
            </option> 
           
            {roles.map((role, i) => (
              <option key={i} value={`${role.user_id}`}>
                {role.name}
              </option> 
            ))}
          </select>
          
        </div>
       <button
          
          className="bg-indigo-700 hover:bg-indigo-800 text-white text-[10px] rounded-full font-bold py-1 px-[0.4rem]"
          type="submit"
        >
          OK
        </button>
    </div>

        
        </div>
        <div className='flex gap-3 items-center'>

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
        <div className='flex gap-5 '>
       
      <div >
      <Dialog >
  <DialogTrigger >
    <button className='flex justify-end items-center p-1 hover:bg-slate-500 bg-slate-300 rounded-xl '><IoIosLogOut className="text-indigo-700" size={18}/></button></DialogTrigger>
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
        </div>

      </form>

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
  console.log("Response from user",response)
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
        console.log("products",products)
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
     <div className=" h-[80vh] container  drop-shadow-md mx-auto bg-white text-black rounded-xl">
        <DataTable isLoading={isLoading} columns={columns} initialData={data} initialMetadata={metadata} />
    </div>

    </>
  )
}
