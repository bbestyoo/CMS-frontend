"use client"
import {  deleteProductsApi, getCreditsCustomerApi, patchCreditsCustomerApi, patchProductsApiCompleted, productsApi } from "@/api/GetRepairProducts";
import { DataTable } from "../data-table";
import { useEffect, useState  } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { useAppSelector } from "@/lib/hooks";
import { FaWallet } from "react-icons/fa";
import { useForm } from 'react-hook-form';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"



export default  function DemoPage() {
  const userData = useAppSelector((state)=> state.user.value)
  const [isDelete, setIsDelete] = useState(false)
  const [isCredited, setIsCredited] = useState(false)
  const [creditsCustomer, setCreditsCustomer] = useState([])



  
  const router = useRouter()
  
  function handleRowClick (rowData){
    console.log('Clicked row:', rowData);
    const repairId = rowData.original.repair_id
    router.push(`/repair/productDetails/${repairId}`)
}
  const [metadata,setMetadata] = useState({})

  const [data, setData] = useState([])  
  const [isCompleted, setIsCompleted] = useState(false)

  const AmountPaidCell = ({ value, row, table }) => {
    const [amountPaid, setAmountPaid] = useState(value);
  console.log("Asd",creditsCustomer)
    const handleInputChange = (e) => {
      const newValue = parseFloat(e.target.value);
      setAmountPaid(newValue);
      // Update the row data with the new value
      const rowIndex = row.index;
      const updatedRow = { ...row.original, amount_paid: newValue };
      table.options.meta?.updateData(rowIndex, updatedRow);
    };

    const [receivedDate, setReceivedDate] = useState(() => {
      const today = new Date();
      return today.toISOString().split('T')[0]; // Format the date as yyyy-mm-dd
    });

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();


   async function onSubmit(data){
      console.log("datacredits",data)
      const credits_data = {...data, repair_id:row.original.repair_id, repair_status:"Credited"}
      const response = await patchCreditsCustomerApi(credits_data)
      console.log(response)
      setIsCredited(true)
    }
    return (
      <>
      
      <div className="text-right font-medium flex justify-end gap-4 items-center">
        <input
          type="number"
          value={amountPaid}
          onChange={handleInputChange}
          onClick={(e) => e.stopPropagation()}
          placeholder="0"

          className="text-right p-1 border bg-gray-50 placeholder:text-black"
          style={{ width: "100px" }}
        />
        <Button         
onClick={(e)=>handleCompleted(row.original.repair_id, amountPaid, e)}>Ok</Button>
     {

userData?.userinfo?.role === 'Admin' && (

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
    <AlertDialogAction onClick={()=>handleDelete(row.original.repair_id)}>Continue</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>
</AlertDialog>
)
  }
<div>
<Dialog>
        <DialogTrigger>
          <button className='flex justify-end items-center p-1 bg-red-300 rounded-xl'>
            <FaWallet size={18} />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-between mt-3 items-center">

            <DialogTitle>Credit details Form</DialogTitle>
            <div>
              <button onClick={()=>router.push('/repair/add-credits/')} className="px-3 py-1 rounded-2xl bg-black text-white">Add</button>
              </div>
            </div>

            <DialogDescription>
             
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                  <label htmlFor="outside_name" className="block text-sm font-medium text-black">
  Select Customers
</label>
<select
  id="credit_id"
  name="credit_id"
  {...register('credit_id', { required: true })}
  className="mt-1 p-2 w-full border rounded-md"
  required
>
<option value="">Select Customer</option>
  {
    creditsCustomer?.map((el, i)=>{
      return <option key={i} value={`${el.id}`}>{el.name}</option>

    })
  } 
</select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="amount_paid" className="block text-sm font-medium text-black">
                      amount paid
                    </label>
                    <input
                      type="text"
                      id="amount_paid"
                      name="amount_paid"
                      {...register('amount_paid', { required: true })}
                      className="mt-1 p-2 w-full border rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="credit_due" className="block text-sm font-medium text-black">
                      Due
                    </label>
                    <input
                      type="text"
                      id="credit_due"
                      name="credit_due"
                      {...register('credit_due', { required: true })}
                      className="mt-1 p-2 w-full border rounded-md"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-black py-2 px-4 rounded-md hover:bg-blue-600"
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
  
  // asdasd

  const columns = [
    {
        accessorKey: "phone_model",
        header: "Products",
        cell: ({ row }) => {

          const {customer_name } = row.original

          return <div  onClick={() => handleRowClick(row)} className="capitalize hover:cursor-pointer"> {row.getValue("phone_model")} by {customer_name} </div>
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
        accessorKey: "customer_phone_number",
        header: "Phone",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("customer_phone_number")}</div>
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
    accessorKey: "amount_paid",
    header: () => <div className="text-right">Paid Amount</div>,
    cell: ({ row, table }) => {
      const value = row.getValue('amount_paid');
      return <AmountPaidCell value={value} row={row} table={table} getCreditsCustomer={getCreditsCustomer} />;
    
    },
  }
  
  
]


async function getCreditsCustomer() {
  try {
    const response = await getCreditsCustomerApi();
    console.log("Asdasd", response);
    setCreditsCustomer(response.credits);
  } catch (error) {
    console.error("Error fetching credits customer:", error);
  }
}



const handleCompleted = async (repairId,amountPaid, e) => {
  e.stopPropagation()
  console.log("clicked the button");
  try {
    console.log("here again")
    // Perform your PATCH request here
    console.log("******8",repairId)
    console.log("amt",amountPaid)
    const response = await patchProductsApiCompleted(repairId, amountPaid)
    const result = await response
    console.log("patched", result)   
    setIsCompleted(true)     
    console.log(isCompleted)

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
    console.log("deleted", result)   
    setIsDelete(true)     

  } 
  catch (error) {
    console.error('Error updating data:', error);
  }

}

  const someFunction = async () => {

  try{

    const products = await productsApi("Repaired");
    
    console.log(products)
    // const filteredData = products.filter((el)=> el.repair_status === "Repaired" )
    const filteredProducts = products.results;
        setMetadata({

          "next" : products.next,
          "previous" : products.previous,
          "count" : products.count
        })
    setData(filteredProducts)
    console.log(metadata)
  }
  catch(error) {
    console.error("error",error)
  }
  }
 
  useEffect(() => { 
    someFunction();
    getCreditsCustomer()
    setIsCompleted(false);
    setIsDelete(false);
    setIsCredited(false)
    console.log("*********************this")
    }, [isCompleted, isDelete, isCredited]); 

  return (
    <div className="container bg-white  mx-auto  rounded-2xl drop-shadow-xl h-[480px] w-11/12">
      <DataTable columns={columns} initialData={data} initialMetadata={metadata}  />
    </div>
  );
}
