"use client"
import {  deleteProductsApi, getCreditsCustomerApi, patchCreditsCustomerApi, patchProductsApiCompleted, postCreditsCustomerApi, productsApi } from "@/api/GetRepairProducts";
import { DataTable } from "../data-table";
import { useEffect, useRef, useState  } from "react";
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
  const [isloading, setIsLoading] = useState(false)
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
          const dueOriginal = parseFloat(row.getValue("due"))
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


  const originalDueRef = useRef(0); // to store base due value

    const {
      register,
      handleSubmit,
          watch,
          setValue,
      formState: { errors },
    } = useForm();

const selectedCustomerId = watch('credit_id');
const amtpaid = watch('amount_paid');

     useEffect(() => {
  const selectedCustomer = creditsCustomer.find(
    (c) => c.id.toString() === selectedCustomerId
  );

  const due = selectedCustomer?.due || 0;
  originalDueRef.current = due;

  setValue('credit_due', (due + dueOriginal - parseFloat(amtpaid || '0').toString()));
  }, [selectedCustomerId, creditsCustomer, setValue, amtpaid]);



   async function onSubmit(data){
    setIsLoading(true)
      console.log("datacredits",data)
      const credits_data = {...data, repair_id:row.original.repair_id, repair_status:"Credited"}
      const response = await patchCreditsCustomerApi(credits_data)
      console.log(response)
      setIsCredited(true)
    }


     const [customerName, setCustomerName] = useState('');
  const [due, setDue] = useState('');
  const router = useRouter()

  const handleSubmit0 = async (e) => {
    e.preventDefault();
    const data = {'name': customerName, 'due': due};
    const response = await postCreditsCustomerApi(data);
    console.log("data", response);
    if (response != null) {
      router.push('/repair/call-to-customer');
    }
  };

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
        <button className="p-2 text-white bg-sky-600 rounded-full"          
onClick={(e)=>handleCompleted(row.original.repair_id, amountPaid, e)}>Ok</button >
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
          <button className='flex justify-end items-center p-2 bg-slate-300 rounded-full'>
            <FaWallet size={18} />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-between mt-3 items-center">

            <DialogTitle>Credit details Form</DialogTitle>
            <div>
              <Dialog>
  <DialogTrigger>
     <button className="px-3 py-1 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white">Add</button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create a creditor</DialogTitle>
      <DialogDescription>
         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Enter Customer Name</h1>
          <form onSubmit={handleSubmit0} className="space-y-4">
            <input
              type="text"
              value={customerName} // Add value here
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={due} // Add value here
              onChange={(e) => setDue(e.target.value)}
              placeholder="Due"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
             
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
                      defaultValue="0"
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
                      defaultValue="0"
                      className="mt-1 p-2 w-full border rounded-md"
                      required
                    />
                  </div>
                  <button
                    disabled={isloading}
                    type="submit"
                    className="bg-blue-500 text-black py-2 px-4 rounded-md hover:bg-blue-600 disabled:cursor-not-allowed"
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
    <div className="container bg-white  mx-auto  rounded-2xl drop-shadow-xl h-[80vh] w-11/12">
      <DataTable columns={columns} initialData={data} initialMetadata={metadata}  />
    </div>
  );
}
