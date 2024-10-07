"use client"
import {  deleteProductsApi, getCreditsCustomerApi, getSingleCreditsCustomerApi, patchCreditsCustomerApi, patchProductsApiCompleted, productsApi } from "@/api/GetRepairProducts";
import { useEffect, useState  } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { useAppSelector } from "@/lib/hooks";
import { FaWallet } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
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
import { DataTable } from "../data-table";


export default  function DemoPage() {
  const userData = useAppSelector((state)=> state.user.value)
  const [isDelete, setIsDelete] = useState(false)
  const [creditsCustomer, setCreditsCustomer] = useState([])
  const [metadata,setMetadata] = useState({})


  const [isFocused, setIsFocused] = useState(false); // Correctly initialize state
const [isSearched, setIsSearched] = useState(false);
  

  
  const router = useRouter()
  
  function handleRowClick (rowData){
    console.log('Clicked row:', rowData);
    const repairId = rowData.original.repair_id
    router.push(`/repair/productDetails/${repairId}`)
}

  const [data, setData] = useState([])  
  const [isCompleted, setIsCompleted] = useState(false)
  const [isCredited, setIsCredited] = useState(false)


  const AmountPaidCell = ({ value, row, table }) => {
    const [amountPaid, setAmountPaid] = useState(value);
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


  
    return (
      <>
      
      <div className="text-right font-medium flex justify-end gap-4 items-center">
        <input
          type="number"
          onChange={handleInputChange}
          onClick={(e) => e.stopPropagation()}
          placeholder="0"

          className="text-right p-1 border bg-gray-50 placeholder:text-black"
          style={{ width: "100px" }}
        />
        <Button         
onClick={(e)=>handleCompleted(row.original.repair_id, amountPaid)}>Ok</Button>
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


      </div>
     
   
      </>
    );
  }
  

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
      return <AmountPaidCell value={value} row={row} table={table}  />;
    
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

const handleCompleted = async (repairId,amountPaid) => {
    const credits_data = {repairId, amountPaid, repair_status:"Completed"}
    const response = await patchCreditsCustomerApi(credits_data)
    console.log(response)
    setIsCredited(true)
}

const handleDelete = async (repair_id) => {

  try {
    // Perform your PATCH request here
    const response = await deleteProductsApi(repair_id)
    const result =  response
    console.log("deleted", result)   
    setIsDelete(true)     

  } 
  catch (error) {
    console.error('Error updating data:', error);
  }

}

  const someFunction = async () => {

  try{
    const products = await productsApi();
    console.log(products)
    const filteredData = products.results.filter((el)=> el.repair_status === "Credited" )
    !isSearched && setData(filteredData)  
      !isSearched &&  setMetadata({
        "next" : products.next,
        "previous" : products.previous,
        "count" : products.count
      })  
  }
  catch(error) {
    console.error("error",error)
  }
  }
 
useEffect(() => { 
  if(!isSearched){

    someFunction();
  }
getCreditsCustomer();
setIsCompleted(false);
setIsDelete(false);
setIsCredited(false)
console.log("*********************this")
}, [isCompleted, isDelete, isCredited, isSearched]); 

console.log("searched",isSearched)

const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    setIsSearched(true)
    // Automatically "submit" when an option is selected
    handleSubmit(value);
  };

  const handleSubmit = async (value) => {
    // This is where you'd handle the POST request
    const response = await getSingleCreditsCustomerApi(value)
    console.log("Da",response)
    setData(response.credits.repair)
    setMetadata({

      "next" : "asd",
      "previous" : "asd",
      "count" : "asd"
    })

  };

  console.log("data",data)
  return (
    <div className="container bg-white  mx-auto  rounded-2xl drop-shadow-xl h-[500px] w-11/12 pt-3">
        <div className="w-fit">
        <label htmlFor="options" className="block text-sm font-medium text-gray-700 mb-1">
Select to choose Credited Customers      </label>
      <select
        id="options"
        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={selectedOption}
        onChange={handleSelectChange}
      >
        <option value="">--Click to open dropdown--</option>
        {
    creditsCustomer?.map((el, i)=>{
      return <option key={i} value={`${el.id}`}>{el.name}</option>

    })
  } 
      </select>
</div>
       
<DataTable columns={columns} initialData={data} initialMetadata={metadata}  />
</div>

  );
}
